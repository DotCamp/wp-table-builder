<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use Plugin_Upgrader;
use WP_Error;
use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Admin\Base\Version_Sync_Base;
use WP_Table_Builder\Inc\Common\Traits\Ajax_Response;
use WP_Table_Builder_Pro\Inc\Admin\Managers\Version_Control_Manager as Version_Control_Manager_Pro;
use function activate_plugin;
use function add_action;
use function add_filter;
use function admin_url;
use function current_user_can;
use function is_wp_error;
use function plugins_api;
use function wp_create_nonce;

// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Version_Control_Manager
 *
 * Class responsible for version rollback operations.
 *
 * Manager for plugin version rollback operations.
 * @package WP_Table_Builder\Inc\Admin\Managers
 */
class Version_Control_Manager extends Version_Sync_Base {
	use Ajax_Response;

	/**
	 * Number of latest versions that will be available for rollback.
	 */
	const VERSION_N = 5;

	/**
	 * Plugin slug
	 */
	const PLUGIN_SLUG = 'wp-table-builder';

	/**
	 * Singleton class instance
	 * @var null
	 */
	protected static $instance_prop = null;

	/**
	 * Version_Control_Manager constructor.
	 */
	protected function __construct() {
		// now you see me, now you don't
	}

	/**
	 * Get singleton instance of class.
	 * @return Version_Control_Manager instance
	 */
	public static function instance() {
		if ( static::$instance_prop === null ) {
			static::$instance_prop = new Version_Control_Manager();
		}

		return static::$instance_prop;
	}

	/**
	 * Initialize version control manager.
	 */
	public static function init() {
		add_filter( 'wp-table-builder/filter/settings_manager_frontend_data', [
			__CLASS__,
			'settings_manager_frontend_data'
		] );

		add_action( 'wp_ajax_' . static::get_class_name(), [ __CLASS__, 'rollback_ajax' ] );
	}

	/**
	 * Rollback ajax endpoint.
	 */
	public static function rollback_ajax() {
		if ( current_user_can( 'manage_options' ) && check_ajax_referer( static::get_class_name(), 'nonce',
				false ) && isset( $_POST['version'] ) ) {
			$version_to_install = $_POST['version'];

			// require for plugins_api function
			require_once( ABSPATH . 'wp-admin/includes/plugin-install.php' );

			$versions_object = plugins_api( 'plugin_information', [ 'slug' => static::PLUGIN_SLUG ] );

			if ( is_wp_error( $versions_object ) ) {
				static::instance()->set_error( esc_html__( 'an error occurred on plugin install, refresh and try again',
					'wp-table-builder' ) );
			} elseif ( is_object( $versions_object ) ) {
				require_once( ABSPATH . 'wp-admin/includes/file.php' );
				require_once( ABSPATH . 'wp-admin/includes/misc.php' );
				require_once( ABSPATH . 'wp-admin/includes/class-wp-upgrader.php' );
				require_once( ABSPATH . 'wp-admin/includes/class-plugin-upgrader.php' );

				$versions = $versions_object->versions;

				$download_url = $versions[ $version_to_install ];
				$upgrader     = new Plugin_Upgrader( new Version_Control_Upgrader_Skin( [], $versions_object ) );

				add_filter( 'upgrader_package_options', function ( $options ) use ( $version_to_install ) {
					$options['abort_if_destination_exists'] = false;
					$options['hook_extra']                  = array_merge( $options['hook_extra'], [
						'plugin'  => 'wp-table-builder/wp-table-builder.php',
						'version' => $version_to_install
					] );

					return $options;
				} );

				$install_result = $upgrader->install( $download_url, [ 'overwrite_package' => true ] );

				// handle install error
				if ( is_wp_error( $install_result ) || $install_result === false ) {
					static::instance()->set_error( esc_html__( 'an error occurred on plugin install, refresh and try again',
						'wp-table-builder' ) );
				} else {
					activate_plugin( 'ultimate-blocks/ultimate-blocks.php' );
					static::instance()->set_message( esc_html__( sprintf( 'plugin version %1$s is installed successfully',
						$version_to_install ), 'wp-table-builder' ) );
				}
			} else {
				// handle no download link error
				static::instance()->set_error( esc_html__( 'no download url address found for the requested version',
					'wp-table-builder' ) );
			}
		} else {
			// handle ajax endpoint requirement error
			static::instance()->set_error( esc_html__( 'You do not have authorization to use this ajax endpoint, refresh and try again',
				'wp-table-builder' ) );
		}

		static::instance()->send_json( true );
	}

	/**
	 * Get classname without namespace.
	 *
	 * @return string classname
	 */
	private static function get_class_name() {
		$split_name = explode( '\\', __CLASS__ );

		return strtolower( array_pop( $split_name ) );
	}

	/**
	 * Callback function for frontend data filter.
	 *
	 * @param array $frontend_data frontend data
	 *
	 * @return array frontend data
	 */
	public static function settings_manager_frontend_data( $frontend_data ) {
		// add section data
		$frontend_data['sectionsData']['versionControl'] =
			[ 'label' => esc_html__( 'version control', 'wp-table-builder' ) ];

		// add translations
		$frontend_data['strings'] = array_merge( $frontend_data['strings'], [
			'installVersion'       => esc_html__( 'install', 'wp-table-builder' ),
			'versionControlInfo'   => esc_html__( 'If you are having issues with the current version of the plugin, you can rollback to a previous version.',
				'wp-table-builder' ),
			'warning'              => esc_html__( 'warning', 'wp-table-builder' ),
			'warningInfo'          => esc_html__( 'Previous versions may be unstable and unsecure, continue with your own risk and take a backup.',
				'wp-table-builder' ),
			'yourVersion'          => esc_html__( 'your version', 'wp-table-builder' ),
			'latestVersion'        => esc_html__( 'latest stable version', 'wp-table-builder' ),
			'updateToLatest'       => esc_html__( 'update to latest version', 'wp-table-builder' ),
			'reload'               => esc_html__( 'reload', 'wp-table-builder' ),
			'rollbackConfirmation' => esc_html__( 'Rollback to selected version?', 'wp-table-builder' ),
		] );

		$currentVersion = get_plugin_data( NS\PLUGIN__FILE__ )['Version'];

		require_once( ABSPATH . 'wp-admin/includes/plugin-install.php' );

		$plugin_remote_data = plugins_api( 'plugin_information', [ 'slug' => static::PLUGIN_SLUG ] );
		$latestVersion      = $plugin_remote_data->version;
		$allVersions        = $plugin_remote_data->versions;
		$changelog          = $plugin_remote_data->sections['changelog'];
		$security           = [
			'action'  => static::get_class_name(),
			'nonce'   => wp_create_nonce( static::get_class_name() ),
			'ajaxUrl' => admin_url( 'admin-ajax.php' )
		];

		// remove trunk from version list
		unset( $allVersions['trunk'] );

		ksort( $allVersions, SORT_NATURAL );

		// limit version amount
		$allVersions = array_slice( array_reverse( $allVersions, true ), 0, static::VERSION_N );


		// if pro version is enabled, limit oldest version to rollback to pro oldest version to avoid version mismatch issues for older version of the base plugin
		if ( Addon_Manager::check_pro_status() ) {
			if ( class_exists( '\WP_Table_Builder_Pro\Inc\Admin\Managers\Version_Control_Manager', false ) ) {
				$oldest_pro_version = Version_Control_Manager_Pro::get_instance()->highest_lowest_version_available();
				$allVersions        = array_filter( $allVersions, function ( $version ) use ( $oldest_pro_version ) {

					return version_compare( $version, $oldest_pro_version, '>=' );
				}, ARRAY_FILTER_USE_KEY );
			}
		}

		// add version control related data
		$frontend_data['data']['versionControl'] = compact( 'currentVersion', 'latestVersion', 'allVersions',
			'changelog', 'security' );

		return $frontend_data;
	}

	/**
	 * Get slug of plugin/addon used in its distribution API.
	 * @return string slug
	 */
	public function get_version_slug() {
		return 'wp-table-builder';
	}

	/**
	 * Parse version number from package url.
	 *
	 * @param string $package package url
	 *
	 * @return string|null version number
	 */
	public function parse_version_from_package( $package ) {
		$parsed_version = null;
		$match          = [];

		preg_match( '/^.+(?:wp-table-builder)\.(.+)(?:\..+)$/', $package, $match );

		if ( $match[1] ) {
			$parsed_version = $match[1];
		}

		return $parsed_version;
	}

	/**
	 * Callback hook for version sync manager when a subscriber attempted an install operation.
	 *
	 * @param string $slug subscriber slug
	 * @param string $version version to install
	 *
	 * @return false|WP_Error false to permit install(i know, but it is what it is) or WP_Error to cancel it
	 */
	public function version_sync_logic( $slug, $version ) {
		$final_status = false;

		if ( $slug === 'wp-table-builder-pro' ) {
			$final_status = $this->generic_sync_logic( $slug, $version );
		}

		return $final_status;
	}

	/**
	 * Plugin __FILE__
	 * @return string plugin file
	 */
	public function plugin_file() {
		return NS\PLUGIN__FILE__;
	}

	/**
	 * Plugin specific logic for fetching versions and their info.
	 *
	 * Use plugin version for keys and info for their values. Use 'url' property key for download link.
	 * @return array|WP_Error versions array
	 */
	protected function get_plugin_versions() {
		require_once( ABSPATH . 'wp-admin/includes/plugin-install.php' );

		$versions = new WP_Error( 501, esc_html__( 'An error occurred while fetching wp-table-builder versions, please try again later', 'wp-table-builder' ) );

		$info = (array) plugins_api( 'plugin_information', [ 'slug' => $this->get_version_slug() ] );

		if ( isset( $info['versions'] ) ) {
			$versions = array_reduce( array_keys( $info['versions'] ), function ( $carry, $key ) use ( $info ) {
				$carry[ $key ] = [ 'url' => $info['versions'] [ $key ] ];

				return $carry;
			}, [] );
		}

		return $versions;
	}

	/**
	 * Get text domain of the plugin.
	 *
	 * It will be used for ajax upgraders to identify our plugin since slug is not supplied in plugin info property of that upgrader skin.
	 * @return string
	 */
	public function get_text_domain() {
		return 'wp-table-builder';
	}
}
