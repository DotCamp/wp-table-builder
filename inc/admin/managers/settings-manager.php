<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder\Inc\Core\Loader;
use WP_Table_Builder as NS;
use function add_submenu_page;
use function get_option;
use function register_setting;
use function wp_enqueue_script;
use function wp_get_current_user;
use function wp_localize_script;
use function wp_roles;

/**
 * Class Settings_Manager
 *
 * Settings manager for everything related to displaying/modifying plugin related options
 *
 * @package WP_Table_Builder\Inc\Admin\Managers
 */
class Settings_Manager {
	/**
	 * Main options root name
	 *
	 * @var string
	 */
	public $options_root;

	/**
	 * Settings menu slug
	 *
	 * @var string
	 */
	public $settings_menu_slug;

	/**
	 * Plugin text domain
	 *
	 * @var string
	 */
	private $text_domain = NS\PLUGIN_TEXT_DOMAIN;

	/**
	 * Plugin options' defaults
	 *
	 * @var array
	 */
	public $defaults = [
		'allowed_roles' => [ 'administrator' ]
	];

	public $sanitization_rules = [
		'allowed_roles' => 'sanitize_text_field'
	];

	const ALLOWED_ROLE_META_CAP = "wptb_allowed_cap";

	/**
	 * Settings_Manager constructor.
	 *
	 * Main class for settings menu and all plugin settings related functionality
	 *
	 * @param string $options_root main options object name
	 * @param Loader $loader plugin load manager for WordPress hooks
	 */
	public function __construct( $options_root, $loader ) {
		$this->options_root = $options_root;

		// register plugin settings
		$loader->add_action( 'admin_init', $this, 'register_plugin_settings' );

		// settings submenu page
		// instead of adding to admin_menu, using the custom action hook that is called after parent menu is created
		$loader->add_action( 'wptb_admin_menu', $this, 'add_settings_menu' );
		$loader->add_action( 'admin_enqueue_scripts', $this, 'admin_scripts' );

		$loader->add_action( 'wp_ajax_' . $this->options_root, $this, 'wptb_settings_ajax' );

		$loader->add_filter( 'wptb_manage_cap', $this, 'manage_cap', 99 );

		$loader->add_filter( 'user_has_cap', $this, 'filter_user_caps', 99, 1 );
	}

	/**
	 * WordPress user_has_cap filter callback function
	 *
	 * We will be using this hook to allow option defined user roles to use table builder at front-end
	 *
	 * @param array $all_caps current user caps
	 *
	 * @return array user caps
	 */
	public function filter_user_caps( $all_caps ) {
		if ( is_user_logged_in() ) {
			$current_user = wp_get_current_user();

			// provide default value for get_option
			$intersection = array_intersect( get_option( $this->options_root, $this->defaults )['allowed_roles'], $current_user->roles );

			if ( sizeof( $intersection ) > 0 ) {
				if ( ! isset( $all_caps[ self::ALLOWED_ROLE_META_CAP ] ) ) {
					$all_caps[ self::ALLOWED_ROLE_META_CAP ] = true;
				}
			}

		}

		return $all_caps;
	}


	/**
	 * Filter plugin user cap
	 *
	 * @param string $current current user cap in filter
	 *
	 * @return string filtered user cap
	 */
	public function manage_cap( $current ) {
		return self::ALLOWED_ROLE_META_CAP;
	}

	/**
	 * WordPress custom ajax hook for settings page
	 */
	public function wptb_settings_ajax() {
		// data array for response
		$data = [];

		// check for user capabilities and nonce value for security
		if ( current_user_can( 'manage_options' ) && check_ajax_referer( $this->options_root, 'nonce', false ) && isset( $_POST['options'] ) ) {
			$encoded_data = json_decode( wp_kses_stripslashes( $_POST['options'] ) );

			// request body validation check
			if ( $encoded_data === null ) {
				$data['error'] = esc_html__( "Invalid Request Body", $this->text_domain );
			} else {
				update_option( $this->options_root, $encoded_data );
				$data['message'] = esc_html__( 'Settings Updated', $this->text_domain );
			}
		} else {
			$data['error'] = esc_html__( "You do not have permission to use this ajax end-point.", $this->text_domain );
		}

		echo json_encode( $data );

		die();
	}

	/**
	 * Enqueues settings related scripts
	 *
	 * @param string $hook current page hook name
	 */
	public function admin_scripts( $hook ) {
		if ( $hook === $this->settings_menu_slug ) {
			$script_url = NS\WP_TABLE_BUILDER_URL . 'inc/admin/js/WPTB_Admin_Settings.js';

			$style_url = NS\WP_TABLE_BUILDER_URL . 'inc/admin/css/admin.css';


			$handler        = 'wptb-settings-manager';
			$plugin_version = NS\PLUGIN_VERSION;

			// script and style enqueue
			wp_enqueue_script( $handler, $script_url, [], $plugin_version, true );
			wp_enqueue_style( 'wptb-settings-manager-style', $style_url, [], $plugin_version );

			$ajax_url = get_admin_url( null, 'admin-ajax.php' );
			$nonce    = wp_create_nonce( $this->options_root );

			$wptb_text_domain = NS\PLUGIN_TEXT_DOMAIN;
			$plugin_homepage  = get_plugin_data( NS\PLUGIN__FILE__ )['PluginURI'];
			$plugin_name      = get_plugin_data( NS\PLUGIN__FILE__ )['Name'];

			$plugin_info = [
				'pluginHomepage' => esc_attr( $plugin_homepage ),
				'pluginName'     => esc_html( $plugin_name ),
				'logo'           => esc_attr( NS\WP_TABLE_BUILDER_URL . 'assets/images/wptb-logo.png' ),
			];

			$strings = [
				'logoAlt'       => esc_attr__( 'WPTB plugin logo', $wptb_text_domain ),
				'homepage'      => esc_attr__( 'Homepage', $wptb_text_domain ),
				'revert'        => esc_html__( 'Revert', $wptb_text_domain ),
				'submit'        => esc_html__( 'Submit', $wptb_text_domain ),
				'revertMessage' => esc_html__( 'Changes Discarded', $wptb_text_domain ),
			];

			$frontend_data = [
				'data'       => [
					'mountId' => '#wptb-settings-page',
					'ajaxUrl' => $ajax_url,
					'nonce'   => $nonce,
					'action'  => $this->options_root
				],
				'options'    => get_option( $this->options_root ),
				'fields'     => [
					'allowed_roles' => [
						'type'    => 'multiCheckbox',
						'options' => wp_roles()->role_names,
						'section' => 'general',
						'label'   => esc_html__( 'Allowed User Roles', $this->text_domain )
					],
				],
				'pluginInfo' => $plugin_info,
				'strings'    => $strings
			];

			// front-end data enqueue
			wp_localize_script( $handler, 'wptbAdminSettingsData', $frontend_data );
		}
	}

	/**
	 * Adds settings submenu page for the plugin
	 */
	public function add_settings_menu() {
		$this->settings_menu_slug = add_submenu_page( 'wptb-overview', esc_html__( 'Settings', 'wp-table-builder' ), esc_html__( 'Settings', 'wp-table-builder' ), 'manage_options', 'wp-table-builder-settings', [
				$this,
				'settings_page'
			]
		);
	}

	/**
	 * Settings page render callback
	 */
	public function settings_page() {
		require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/wptb-settings-page.php';
	}

	/**
	 * Register plugin settings to options
	 *
	 * Called from admin_init action hook
	 */
	public function register_plugin_settings() {
		register_setting( $this->options_root, $this->options_root, [
			'type'              => 'array',
			'default'           => $this->defaults,
			'sanitize_callback' => [
				$this,
				'sanitize_options'
			]
		] );
	}

	/**
	 * Sanitize plugin options on update
	 *
	 * @param array $raw_value input value
	 *
	 * @return array sanitized option value
	 */
	public function sanitize_options( $raw_value ) {
		return array_merge( get_option( $this->options_root ), $this->batch_sanitize( $raw_value ) );
	}


	/**
	 * Batch sanitize array with defined sanitization rules
	 *
	 * This function not only sanitize the options, also will make sure only option fields defined in ruleset are ended up in the final options array
	 *
	 * @param array $input_object input array
	 *
	 * @return array sanitized options
	 */
	private function batch_sanitize( $input_object ) {
		$sanitized_object = [];
		foreach ( $input_object as $key => $value ) {
			if ( isset( $this->sanitization_rules[ $key ] ) ) {
				if ( is_array( $value ) ) {
					$sanitized_object[ $key ] = array_map( $this->sanitization_rules[ $key ], $value );
				} else {
					$sanitized_object[ $key ] = call_user_func( $this->sanitization_rules[ $key ], $value );
				}
			}
		}

		return $sanitized_object;
	}
}