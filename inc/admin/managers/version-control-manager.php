<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use Plugin_Upgrader;
use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Common\Traits\Ajax_Response;
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
class Version_Control_Manager {
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
		if ( current_user_can( 'manage_options' ) && check_ajax_referer( static::get_class_name(), 'nonce', false ) && isset( $_POST['version'] ) ) {
			$version_to_install = $_POST['version'];

			// require for plugins_api function
			require_once( ABSPATH . 'wp-admin/includes/plugin-install.php' );

			$versions = ( plugins_api( 'plugin_information', [ 'slug' => static::PLUGIN_SLUG ] ) )->versions;

			if ( isset( $versions[ $version_to_install ] ) ) {
				require_once( ABSPATH . 'wp-admin/includes/file.php' );
				require_once( ABSPATH . 'wp-admin/includes/misc.php' );
				require_once( ABSPATH . 'wp-admin/includes/class-wp-upgrader.php' );
				require_once( ABSPATH . 'wp-admin/includes/class-plugin-upgrader.php' );

				$download_url   = $versions[ $version_to_install ];
				$upgrader       = new Plugin_Upgrader( new Version_Control_Upgrader_Skin() );

				add_filter('upgrader_package_options', function($options){
					$options['abort_if_destination_exists'] = false;
					return $options;
				});

				$install_result = $upgrader->install( $download_url, [ 'overwrite_package' => true ] );

				// handle install error
				if ( is_wp_error( $install_result ) || $install_result === false ) {
					static::instance()->set_error( esc_html__( 'an error occurred on plugin install, refresh and try again', 'wp-table-builder' ) );
				} else {
					activate_plugin( 'ultimate-blocks/ultimate-blocks.php' );
					static::instance()->set_message( esc_html__( sprintf( 'plugin version %1$s is installed successfully', $version_to_install ), 'wp-table-builder' ) );
				}
			} else {
				// handle no download link error
				static::instance()->set_error( esc_html__( 'no download url address found for the requested version', 'wp-table-builder' ) );
			}
		} else {
			// handle ajax endpoint requirement error
			static::instance()->set_error( esc_html__( 'You do not have authorization to use this ajax endpoint, refresh and try again', 'wp-table-builder' ) );
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
			'installVersion'     => esc_html__( 'install', 'wp-table-builder' ),
			'versionControlInfo' => esc_html__( 'If you are having issues with the current version of the plugin, you can rollback to a previous version.', 'wp-table-builder' ),
			'warning'            => esc_html__( 'warning', 'wp-table-builder' ),
			'warningInfo'        => esc_html__( 'Previous versions may be unstable and unsecure, continue with your own risk and take a backup.', 'wp-table-builder' ),
			'yourVersion'        => esc_html__( 'your version', 'wp-table-builder' ),
			'latestVersion'      => esc_html__( 'latest stable version', 'wp-table-builder' ),
			'updateToLatest'     => esc_html__( 'update to latest version', 'wp-table-builder' ),
			'reload'             => esc_html__( 'reload', 'wp-table-builder' ),
			'rollbackConfirmation'             => esc_html__( 'Rollback to selected version?', 'wp-table-builder' ),
		] );

		$currentVersion = get_plugin_data( NS\PLUGIN__FILE__ )['Version'];

		require_once( ABSPATH . 'wp-admin/includes/plugin-install.php' );

		$plugin_remote_data = plugins_api( 'plugin_information', [ 'slug' => static::PLUGIN_SLUG ] );
		$latestVersion      = $plugin_remote_data->version;
		$allVersions        = array_reverse( $plugin_remote_data->versions, true );
		$changelog          = $plugin_remote_data->sections['changelog'];
		$security           = [
			'action'  => static::get_class_name(),
			'nonce'   => wp_create_nonce( static::get_class_name() ),
			'ajaxUrl' => admin_url( 'admin-ajax.php' )
		];

		// remove trunk from version list
		unset( $allVersions['trunk'] );

		// limit version amount
		$allVersions = array_slice( $allVersions, 0, static::VERSION_N );

		// add version control related data
		$frontend_data['data']['versionControl'] = compact( 'currentVersion', 'latestVersion', 'allVersions', 'changelog', 'security' );

		return $frontend_data;
	}
}