<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder\Inc\Common\Helpers;
use WP_Table_Builder\Inc\Core\Init;
use WP_Table_Builder\Inc\Core\Loader;
use WP_Table_Builder as NS;
use function absint;
use function add_filter;
use function add_submenu_page;
use function apply_filters;
use function do_action;
use function get_admin_url;
use function get_current_user_id;
use function get_option;
use function get_post;
use function json_decode;
use function json_encode;
use function register_setting;
use function wp_create_nonce;
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
	 * Settings menu slug.
	 *
	 * @var string
	 */
	public $settings_menu_slug;

	/**
	 * Plugin text domain.
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
		'allowed_roles'                    => [ 'administrator' ],
		'panel_location'                   => 'left',
		'allow_edit_link_frontend'         => false,
		'give_credits_to_wp_table_builder' => false,
		'restrict_users_to_their_tables'   => false,
		'disable_theme_styles_for_all'     => false,
	];

	/**
	 * Sanitization rules for options.
	 * @var string[]
	 */
	public $sanitization_rules = [
		'allowed_roles'                    => 'sanitize_text_field',
		'panel_location'                   => 'sanitize_text_field',
		'allow_edit_link_frontend'         => 'sanitize_text_field',
		'give_credits_to_wp_table_builder' => 'sanitize_text_field',
		'restrict_users_to_their_tables'   => 'sanitize_text_field',
		'disable_theme_styles_for_all'     => 'sanitize_text_field',
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

		// initialize supplementary classes/managers
		$this->initialize_additional();

		// register plugin settings
		$loader->add_action( 'admin_init', $this, 'register_plugin_settings' );

		// settings submenu page
		// instead of adding to admin_menu, using the custom action hook that is called after parent menu is created
		$loader->add_action( 'wptb_admin_menu', $this, 'add_settings_menu' );
		$loader->add_action( 'admin_enqueue_scripts', $this, 'admin_scripts' );

		$loader->add_action( 'wp_ajax_' . $this->options_root, $this, 'wptb_settings_ajax' );

		$loader->add_filter( 'wptb_manage_cap', $this, 'manage_cap', 99 );

		$loader->add_filter( 'user_has_cap', $this, 'filter_user_caps', 99, 1 );

		add_filter( 'wp-table-builder/filter/panel_location', [ $this, 'panel_location' ], 99, 1 );
	}

	/**
	 * Initialize additional managers/classes for settings manager.
	 */
	protected function initialize_additional() {
		Version_Control_Manager::init();
		Tag_Manager::init();
		General_Styles_Manager::init();
		Lazy_Load_Manager::init();
		Table_Fixer::init();
		Emoji_Manager::init();

		// subscribe to version sync
		Version_Control_Manager::instance()->subscribe_to_version_sync();
	}

	/**
	 * Get default values for settings controls.
	 * @return array setting defaults.
	 */
	private function get_defaults() {
		return apply_filters( 'wp-table-builder/filter/settings_defaults', $this->defaults );
	}

	/**
	 * Get setting sanitization rules.
	 * @return array sanitization rules
	 */
	private function get_sanitization_rules() {
		return apply_filters( 'wp-table-builder/filter/settings_sanitization_rules', $this->sanitization_rules );
	}

	/**
	 * Panel location filter hook callback.
	 *
	 * @param string $location current location
	 *
	 * @return string panel location
	 */
	public function panel_location( $location ) {
		return $this->get_option_value( 'panel_location' );
	}

	/**
	 * Get value of a plugin's option.
	 *
	 * @param string $option_name name of the option
	 *
	 * @return mixed|null option's value
	 */
	public function get_option_value( $option_name ) {
		$current_options = get_option( $this->options_root, $this->get_defaults() );
		$current_value   = null;

		if ( ! isset( $current_options[ $option_name ] ) ) {
			if ( isset( $this->get_defaults()[ $option_name ] ) ) {
				$current_value = $this->get_defaults()[ $option_name ];
			}
		} else {
			$current_value = $current_options[ $option_name ];
		}

		return $current_value;
	}

	/**
	 * WordPress user_has_cap filter callback function.
	 *
	 * We will be using this hook to allow option defined user roles to use table builder at front-end.
	 *
	 * @param array $all_caps current user caps
	 *
	 * @return array user caps
	 */
	public function filter_user_caps( $all_caps ) {
		if ( is_user_logged_in() ) {
			$current_user = wp_get_current_user();

			// provide default value for get_option
			$intersection = array_intersect( $this->get_option_value( 'allowed_roles' ), $current_user->roles );

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
			// encode json data as associated data to be compatible with batch sanitize functionality
			$encoded_data = json_decode( wp_kses_stripslashes( $_POST['options'] ), true );

			// request body validation check
			if ( $encoded_data === null ) {
				$data['error'] = esc_html__( "Invalid Request Body", 'wp-table-builder' );
			} else {
				update_option( $this->options_root, $encoded_data );
				$data['message'] = esc_html__( 'Settings Updated', 'wp-table-builder' );
			}
		} else {
			$data['error'] = esc_html__( "You do not have permission to use this ajax end-point.", 'wp-table-builder' );
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
			$script_path = 'inc/admin/js/WPTB_Admin_Settings.js';
			$style_path  = 'inc/admin/css/admin.css';

			$handler = 'wptb-settings-manager';

			// script and style enqueue
			Init::instance()->get_icon_manager()->enqueue_icon_manager_assets( true );
			Helpers::enqueue_file( $script_path, [], true, $handler );
			Helpers::enqueue_file( $style_path, [], false, 'wptb-settings-manager-style' );

			$ajax_url = get_admin_url( null, 'admin-ajax.php' );
			$nonce    = wp_create_nonce( $this->options_root );

			$plugin_homepage = get_plugin_data( NS\PLUGIN__FILE__ )['PluginURI'];
			$plugin_name     = get_plugin_data( NS\PLUGIN__FILE__ )['Name'];

			$plugin_info = [
				'pluginHomepage' => esc_attr( $plugin_homepage ),
				'pluginName'     => esc_html( $plugin_name ),
				'logo'           => esc_attr( NS\WP_TABLE_BUILDER_URL . 'assets/images/wptb-logo.png' ),
			];

			$strings = [
				'logoAlt'       => esc_attr__( 'WPTB plugin logo', 'wp-table-builder' ),
				'homepage'      => esc_attr__( 'Homepage', 'wp-table-builder' ),
				'revert'        => esc_html__( 'Revert', 'wp-table-builder' ),
				'submit'        => esc_html__( 'Submit', 'wp-table-builder' ),
				'revertMessage' => esc_html__( 'Changes Discarded', 'wp-table-builder' ),
			];

			// merge defaults with applied options to make sure new option groups are reflected to frontend even though they didn't get saved yet
			$merged_options = array_merge( $this->get_defaults(), get_option( $this->options_root ) );

			$frontend_data = [
				'data'         => [
					'mountId' => '#wptb-settings-page',
					'ajaxUrl' => $ajax_url,
					'nonce'   => $nonce,
					'action'  => $this->options_root
				],
				'options'      => $merged_options,
				'sectionsData' => [
					'general' => [
						'label'  => esc_html__( 'general', 'wp-table-builder' ),
						'fields' => [
							'allowed_roles'                    => [
								'type'    => 'multiCheckbox',
								'options' => wp_roles()->role_names,
								'section' => 'general',
								'label'   => esc_html__( 'Allowed User Roles', 'wp-table-builder' )
							],
							'panel_location'                   => [
								'type'    => 'dropdown',
								'options' => [
									[
										'label' => esc_html__( 'left', 'wp-table-builder' ),
										'value' => 'left'
									],
									[
										'label' => esc_html__( 'right', 'wp-table-builder' ),
										'value' => 'right'
									]
								],
								'section' => 'general',
								'label'   => esc_html__( 'Sidebar location', 'wp-table-builder' )
							],
							'allow_edit_link_frontend'         => [
								'type'    => 'checkbox',
								'section' => 'general',
								'label'   => esc_html__( 'Show edit table link on frontend', 'wp-table-builder' )
							],
							'give_credits_to_wp_table_builder' => [
								'type'    => 'checkbox',
								'section' => 'general',
								'label'   => esc_html__( 'Give Credits to WP Table Builder', 'wp-table-builder' )
							],
							'restrict_users_to_their_tables'   => [
								'type'    => 'checkbox',
								'section' => 'general',
								'label'   => esc_html__( 'Restrict Users Access to Their Tables Only', 'wp-table-builder' )
							],
							'disable_theme_styles_for_all'     => [
								'type'    => 'checkbox',
								'section' => 'general',
								'title'   => esc_html__( 'Disable theme styles', 'wp-table-builder' ),
								'label'   => esc_html__( 'Disable theme styles for all tables', 'wp-table-builder' )
							],
						]
					],
				],
				'pluginInfo'   => $plugin_info,
				'strings'      => $strings
			];

			// filter for admin settings frontend data
			$frontend_data = apply_filters( 'wp-table-builder/filter/settings_manager_frontend_data', $frontend_data );

			// front-end data enqueue
			wp_localize_script( $handler, 'wptbAdminSettingsData', $frontend_data );
		}
	}

	/**
	 * Adds settings submenu page for the plugin.
	 */
	public function add_settings_menu() {
		$this->settings_menu_slug = add_submenu_page( 'wptb-overview', esc_html__( 'Settings', 'wp-table-builder' ), esc_html__( 'Settings', 'wp-table-builder' ), 'manage_options', 'wp-table-builder-settings', [
				$this,
				'settings_page'
			]
		);
	}

	/**
	 * Settings page render callback.
	 */
	public function settings_page() {
		require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/wptb-settings-page.php';
	}

	/**
	 * Register plugin settings to options.
	 *
	 * Called from admin_init action hook
	 */
	public function register_plugin_settings() {
		register_setting( $this->options_root, $this->options_root, [
			'type'              => 'array',
			'default'           => $this->get_defaults(),
			'sanitize_callback' => [
				$this,
				'sanitize_options'
			]
		] );

		do_action( 'wp-table-builder/action/settings_registered' );
	}

	/**
	 * Check if current user if allowed for modifications on the given post id.
	 *
	 * @param integer $post_id post id
	 *
	 * @return boolean allowed or not
	 */
	public function current_user_allowed_for_modifications( $post_id ) {
		$settings_control_value = filter_var( $this->get_option_value( 'restrict_users_to_their_tables' ), FILTER_VALIDATE_BOOLEAN );

		$status = ! $settings_control_value;

		if ( $settings_control_value ) {
			$post = get_post( absint( $post_id ) );
			if ( $post ) {
				$original_author = intval( $post->post_author );

				$status = get_current_user_id() === $original_author;
			}
		}

		return $status;
	}

	/**
	 * Sanitize plugin options on update.
	 *
	 * @param array $raw_value input value
	 *
	 * @return array sanitized option value
	 */
	public function sanitize_options( $raw_value ) {
		return array_merge( get_option( $this->options_root ), Helpers::batch_sanitize( $raw_value, $this->get_sanitization_rules() ) );
	}

	/**
	 * Batch sanitize array with defined sanitization rules.
	 *
	 * This function not only sanitize the options, also will make sure only option fields defined in ruleset are ended up in the final options array.
	 *
	 * @param array $input_object input array
	 *
	 * @return array sanitized options
	 * @deprecated
	 */
	private function batch_sanitize( $input_object ) {
		$sanitized_object   = [];
		$sanitization_rules = $this->get_sanitization_rules();
		foreach ( $input_object as $key => $value ) {
			if ( isset( $sanitization_rules[ $key ] ) ) {
				if ( is_array( $value ) ) {
					$sanitized_object[ $key ] = array_map( $sanitization_rules[ $key ], $value );
				} else {
					$sanitized_object[ $key ] = call_user_func( $sanitization_rules[ $key ], $value );
				}
			}
		}

		return $sanitized_object;
	}
}
