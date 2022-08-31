<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Common\Helpers;
use WP_Table_Builder\Inc\Core\Init;
use function add_filter;
use function esc_html__;
use function get_option;
use function get_plugin_data;
use function trailingslashit;
use function WP_Filesystem;

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
	 * Image folder path relative to plugin root.
	 * @var string
	 */
	private static $image_relative_folder_path = 'assets/images/what-is-new/';

	/**
	 * Initialize what is new manager.
	 *
	 * Initialization process will only take place once. Any further attempt to initialize the manager will be ignored.
	 */
	public static function init() {
		// only start initialization process if manager is not initialized before
		if ( static::$initialized === false ) {
			static::$initialized = true;

			Frontend_Data_Manager::add_builder_data( [ __CLASS__, 'add_frontend_script_data' ], 'whatIsNew' );

//			add_filter( 'plugin_row_meta', [ __CLASS__, 'add_win_plugin_row' ], 10, 3 );
		}
	}

	/**
	 * Add what is new link to plugin row.
	 *
	 * @param array $row_data plugin row data
	 * @param string $plugin_file plugin file
	 * @param array $plugin_data plugin data
	 *
	 * @return array filtered plugin row
	 */
	public static function add_win_plugin_row( $row_data, $plugin_file, $plugin_data ) {
		$allowed_slugs = [ 'wp-table-builder' ];

		if ( isset( $plugin_data['slug'] ) && in_array( $plugin_data['slug'], $allowed_slugs ) && in_array( $plugin_file, get_option( 'active_plugins', [] ) ) ) {
			$row_data[] = '<a id="wptb-what-is-new" target="_self" href="#">' . esc_html__( 'What is new?', 'wp-table-builder' ) . '</a>';

			Helpers::enqueue_file( 'inc/admin/css/admin.css', [], false, 'wp-table-builder-admin-css' );

			Init::instance()->get_icon_manager()->enqueue_icon_manager_assets();

			Helpers::enqueue_file( 'inc/admin/js/WPTB_PluginsWhatIsNew.js', [], true, 'wp-table-builder-win-js' );

			wp_localize_script( 'wp-table-builder-win-js', 'wptbPluginsWin', [
				'notes' => static::what_is_new_notes()
			] );
		}

		return $row_data;
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
		$is_pro_enabled = Addon_Manager::check_pro_status();

		// show an upsell at pro enabled notes if no valid pro license is currently installed
		$format = '<div>%s</div>' . ( $isPro && ! $is_pro_enabled ? '<a target="_blank" class="wptb-upsells-pro-label" href="%s"><div >%s</div></a>' : '' );

		$prepared_text = sprintf( $format, $text, 'https://wptablebuilder.com/pricing/', esc_html__( 'Get PRO' ) );

		return [
			'text'  => $prepared_text,
			'image' => static::get_image_url( $image ),
			'isPro' => $isPro
		];
	}

	/**
	 * Get url for given what is new note image.
	 * This function will provide a default image if supplied file doesn't exist.
	 *
	 * @param string $image image filename
	 *
	 * @return string image url
	 */
	private static function get_image_url( $image ) {
		require_once ABSPATH . 'wp-admin/includes/file.php';

		WP_Filesystem( true );
		global $wp_filesystem;

		$image_exists = $wp_filesystem->exists( path_join( NS\WP_TABLE_BUILDER_DIR, trailingslashit( static::$image_relative_folder_path ) . $image ) );

		return trailingslashit( NS\WP_TABLE_BUILDER_URL ) . static::$image_relative_folder_path . ( $image_exists === true ? $image : 'wptb-logo-new.png' );
	}

	/**
	 * Read data file related to this component.
	 * @return array data array
	 */
	private static function read_data_file() {
		ob_start();
		require( trailingslashit( NS\WP_TABLE_BUILDER_DIR ) . 'inc/admin/data/what-is-new.json' );
		$contents = ob_get_contents();
		ob_end_clean();

		return json_decode( $contents, true );
	}

	/**
	 * Get notes for versions.
	 *
	 * Add version notes here for upcoming versions.
	 *
	 * @return array notes array
	 */
	private static function get_notes() {
		$component_data = static::read_data_file();

		return array_reduce( array_keys( $component_data ), function ( $carry, $version_tag ) use ( $component_data ) {
			$version_data = $component_data[ $version_tag ];

			foreach ( $version_data as $note_args ) {
				$carry[ $version_tag ][] = call_user_func_array( '\WP_Table_Builder\Inc\Admin\Managers\What_Is_New_Manager::prepare_what_is_new_note', $note_args );
			}

			return $carry;
		}, [] );
	}

	/**
	 * Add changelog page to supplied what is new notes.
	 *
	 * @param array $notes notes array
	 *
	 * @return array notes array with added changelog section
	 */
	private static function add_changelog_link_to_notes( $notes ) {
		$patch_notes    = esc_html__( 'Patch notes' );
		$patch_note_url = 'https://wordpress.org/plugins/wp-table-builder/#developers';
		$notes[]        = static::prepare_what_is_new_note( "<a href='$patch_note_url' target='_blank'>$patch_notes</a>", 'wptb-logo-new.png' );

		return $notes;
	}

	/**
	 * Get the latest release what is new notes.
	 *
	 * @return array release notes array
	 */
	private static function what_is_new_notes() {
		$notes = static::get_notes();

		// sort versions from high to low
		uksort( $notes, function ( $a, $b ) {
			return version_compare( $a, $b ) * - 1;
		} );

		$current_version = static::current_version();

		$current_version_notes = isset( $notes[ $current_version ] ) ? $notes[ $current_version ] : [];

		return [ $current_version => static::add_changelog_link_to_notes( $current_version_notes ) ];
	}

	/**
	 * Get current version number of plugin.
	 *
	 * @return string version number
	 */
	private static function current_version() {
		return get_plugin_data( NS\PLUGIN__FILE__ )['Version'];
	}

	/**
	 * Add manager related data to frontend components.
	 *
	 * Frontend data will only be added if a what-is-new dialog for current version is not showed yet, so checking availability of this data property will give clue to front-end component to load itself or not.
	 *
	 * @return array modified admin data array
	 */
	public static function add_frontend_script_data() {
		$latest_release_notes               = static::what_is_new_notes();
		$latest_release_notes_version       = static::current_version();
		$previously_displayed_notes_version = get_option( static::$previously_displayed_version_number_option_name, '1.0.0' );

		$admin_data = [];

		// only send frontend data if latest release note version is newer
		if ( version_compare( $latest_release_notes_version, $previously_displayed_notes_version, '>' ) ) {
			$admin_data = $latest_release_notes;

			// update the latest displayed version number option at database
			update_option( static::$previously_displayed_version_number_option_name, $latest_release_notes_version );
		}

		return $admin_data;
	}
}
