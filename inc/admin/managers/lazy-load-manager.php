<?php

namespace WP_Table_Builder\Inc\Admin\Managers;


use WP_Table_Builder\Inc\Common\Traits\Ajax_Response;
use WP_Table_Builder\Inc\Common\Traits\Singleton_Trait;
use function add_action;
use function add_filter;
use function admin_url;
use function apply_filters;
use function esc_html__;
use function register_setting;
use function wp_create_nonce;

// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Lazy_Load_Manager
 *
 * Class for maintaining lazy load functionality on client side tables.
 * @package WP_Table_Builder\Inc\Admin\Managers
 */
class Lazy_Load_Manager {
	use Singleton_Trait;
	use Ajax_Response;

	/**
	 * Update action name.
	 * @var string
	 */
	private static $settings_update_action = 'wptb_lazy_load';

	/**
	 * Default values for lazy load options.
	 * @var array
	 */
	private static $default_settings = [
		'enabled' => false
	];

	/**
	 * Options and settings required for lazy load to work at frontend.
	 * @var array
	 */
	private static $frontend_options = [

	];

	/**
	 * Initialize lazy load manager.
	 */
	public static function init() {
		add_filter( 'wp-table-builder/filter/settings_manager_frontend_data', [ __CLASS__, 'add_settings_menu_data' ] );
		add_action( 'wp_ajax_' . static::$settings_update_action, [ __CLASS__, 'update_settings' ] );

		static::register_settings();
	}

	/**
	 * Register lazy load related settings.
	 */
	private static function register_settings() {
		$settings = apply_filters( 'wp-table-builder/filter/lazy_load_default_settings', static::$default_settings );

		register_setting( static::$settings_update_action, static::$settings_update_action, [
			'type'              => 'array',
			'description'       => esc_html__( 'lazy load settings', 'wp-table-builder' ),
			'default'           => $settings,
			'sanitize_callback' => [ __CLASS__, 'sanitize_settings' ],
		] );
	}

	/**
	 * Sanitize lazy load settings on update.
	 *
	 * @param array $settings settings array
	 */
	public static function sanitize_settings( $settings ) {

	}

	/**
	 * Update settings through ajax endpoint.
	 */
	public static function update_settings() {
		$instance = static::get_instance();
		if ( current_user_can( Settings_Manager::ALLOWED_ROLE_META_CAP ) && check_ajax_referer( static::$settings_update_action, 'nonce', false ) && isset( $_POST['settings'] ) ) {

		} else {
			$instance->set_error( esc_html__( 'You are not authorized to use this endpoint.', 'wp-table-builder' ) );
		}

		$instance->send_json( true );
	}

	/**
	 * Add settings menu header data for lazy load.
	 *
	 * @param array $settings_data settings data
	 *
	 * @return array modified settings menu data with lazy load header info
	 */
	public static function add_settings_menu_data( $settings_data ) {
		$settings_data['sectionsData']['lazyLoad'] = [
			'label'    => esc_html__( 'lazy load', 'wp-table-builder' ),
			'priority' => - 1,
		];

		$settings_data['strings'] = array_merge( $settings_data['strings'], [
			'enableLazyLoad' => esc_html__( 'Enable lazy load for images in tables', 'wp-table-builder' ),
			'submit'         => esc_html__( 'submit', 'wp-table-builder' ),
		] );

		$settings_data['data']['lazyLoad'] = [
			'settings' => get_option( static::$settings_update_action ),
			'security' => [
				'action'  => static::$settings_update_action,
				'nonce'   => wp_create_nonce( static::$settings_update_action ),
				'ajaxUrl' => admin_url( 'admin-ajax.php' )
			]
		];

		return $settings_data;
	}
}
