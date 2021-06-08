<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Common\Helpers;
use WP_Table_Builder\Inc\Core\Init;
use function add_filter;
use function esc_html__;
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
			'image' => trailingslashit( NS\WP_TABLE_BUILDER_URL ) . 'assets/images/what-is-new/' . $image,
			'isPro' => $isPro
		];
	}

	/**
	 * Get notes for versions.
	 *
	 * Add version notes here for upcoming versions.
	 *
	 * @return array notes array
	 */
	private static function get_notes() {
		return [
			'1.3.4' => [
				static::prepare_what_is_new_note( 'New background menu and improved color logic for better table colors.', 'background_menu.png' ),
				static::prepare_what_is_new_note( 'Extra styles controls and settings menu to improve control over your styles.', 'extra_styles.png' ),
				static::prepare_what_is_new_note( 'Upgraded color picker, now alpha channel can be used for background color values which enables transparency.', 'new_color_picker.png' ),
				static::prepare_what_is_new_note( 'A global wrapper function for rendering tables inside theme and plugin files.', 'theme_inline_render_function.png' ),
				static::prepare_what_is_new_note( 'Version sync capability to keep both base and pro versions of plugin in sync with each other at update and downgrade operations.', 'version_sync.png', true ),
			],
			'1.3.5' => [
				static::prepare_what_is_new_note( 'Dynamic asset loading for frontend to improve page performance and load times.', 'selective_asset_loading.png' ),
				static::prepare_what_is_new_note( 'Gutenberg block will now correctly display any extra styles added for tables.', 'block_extra_styles.png' ),
			]
		];
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
	 * Get latest release what is new notes.
	 *
	 * @return array release notes array
	 */
	private static function what_is_new_notes() {
		$notes = static::get_notes();

		// sort versions from high to low
		uksort( $notes, function ( $a, $b ) {
			return version_compare( $a, $b ) * - 1;
		} );

		$latest_version = array_keys( $notes )[0];

		return [ $latest_version => static::add_changelog_link_to_notes( $notes[ $latest_version ] ) ];
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

		// only send frontend data if latest release note version is more newer
		if ( version_compare( $latest_release_notes_version, $previously_displayed_notes_version, '>' ) ) {
			$admin_data['whatIsNew'] = $latest_release_notes;

			// update latest displayed version number option at database
			update_option( static::$previously_displayed_version_number_option_name, $latest_release_notes_version );
		}

		return $admin_data;
	}
}
