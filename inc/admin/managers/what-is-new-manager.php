<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder as NS;
use function add_filter;
use function get_option;
use function trailingslashit;

// if called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die();
}

class What_Is_New_Manager {
	/**
	 * Initialization status of manager.
	 * @var bool
	 */
	protected static $initialized = false;

	/**
	 * Option name for most previously displayed release note version.
	 * @var string
	 */
	protected static $previously_displayed_version_number_option_name = 'wptb_displayed_win_notes';

	/**
	 * Initialize what is new manager.
	 *
	 * Initialization process will only take place once. Any further attempt to initialize the manager will be ignored.
	 */
	public static function init() {
		// only start initialization process if manager is not initialized before
		if ( static::$initialized === false ) {
			static::$initialized = true;

			add_filter( 'wp-table-builder/filter/builder_script_data', [ __CLASS__, 'add_frontend_script_data' ] );
		}
	}

	/**
	 * Prepare a what is new note object.
	 *
	 * Only supply image file name. This function will look for that file under assets/images/what-is-new folder.
	 *
	 * @param string $text release note text
	 * @param string $image release note image url
	 * @param boolean $isPro is related to pro version
	 *
	 * @return array prepared release note object.
	 */
	private static function prepare_what_is_new_note( $text, $image, $isPro = false ) {
		return [
			'text'  => $text,
			'image' => trailingslashit( NS\WP_TABLE_BUILDER_URL ) . 'assets/images/what-is-new/' . $image,
			'isPro' => $isPro
		];
	}

	/**
	 * Get latest release what is new notes.
	 *
	 * @return array release notes array
	 */
	private static function what_is_new_notes() {
		$notes = [
			'1.3.3' => [
				static::prepare_what_is_new_note( 'older test note1', '1.png' ),
			],
			'1.3.4' => [
				static::prepare_what_is_new_note( 'just a test note1', '1.png' ),
				static::prepare_what_is_new_note( 'just a test note2', '1.png' ),
				static::prepare_what_is_new_note( 'just a test note3', '1.png' ),
				static::prepare_what_is_new_note( 'just a test note4', '1.png' ),
			]
		];

		// sort versions from high to low
		uksort( $notes, function ( $a, $b ) {
			return version_compare( $a, $b ) * - 1;
		} );

		$latest_version = array_keys( $notes )[0];

		return [ $latest_version => $notes[ $latest_version ] ];
	}

	/**
	 * Add manager related data to frontend components.
	 *
	 * Frontend data will only be added if a what-is-new dialog for current version is not showed yet, so checking availability of this data property will give clue to front-end component to load itself or not.
	 *
	 * @param array $admin_data admin data array
	 *
	 * @return array modified admin data array
	 */
	public static function add_frontend_script_data( $admin_data ) {
		$latest_release_notes               = static::what_is_new_notes();
		$latest_release_notes_version       = array_keys( $latest_release_notes )[0];
		$previously_displayed_notes_version = get_option( static::$previously_displayed_version_number_option_name, '1.0.0' );

		// TODO [erdembircan] change compare operator to '>' for production
		// only send frontend data if latest release note version is more newer
		if ( version_compare( $latest_release_notes_version, $previously_displayed_notes_version, '>=' ) ) {
			$admin_data['whatIsNew'] = $latest_release_notes;

			// update latest displayed version number option at database
			update_option( static::$previously_displayed_version_number_option_name, $latest_release_notes_version );
		}

		return $admin_data;
	}
}
