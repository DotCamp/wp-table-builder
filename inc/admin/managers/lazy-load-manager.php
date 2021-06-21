<?php

namespace WP_Table_Builder\Inc\Admin\Managers;


use DOMDocument;
use DOMXPath;
use WP_Table_Builder\Inc\Common\Helpers;
use WP_Table_Builder\Inc\Common\Traits\Ajax_Response;
use WP_Table_Builder\Inc\Common\Traits\Init_Once;
use WP_Table_Builder\Inc\Common\Traits\Singleton_Trait;
use function add_action;
use function add_filter;
use function admin_url;
use function apply_filters;
use function check_ajax_referer;
use function current_user_can;
use function esc_html__;
use function get_option;
use function register_setting;
use function update_option;
use function wp_create_nonce;
use function wp_kses_stripslashes;

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
	use Init_Once;

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
		'enabled' => false,
	];

	/**
	 * Options and settings required for lazy load to work at frontend.
	 * @var array
	 */
	private static $frontend_options = [
		'visibilityPercentage' => 10,
		'backgroundColor'      => '#FFFFFF',
		'animation'            => 'none',
		'loadIndicator'        => 'none',
	];

	/**
	 * Sanitization rules for lazy load options.
	 * @var string[]
	 */
	private static $sanitization_rules = [
		'enabled' => 'rest_sanitize_boolean'
	];

	/**
	 * Initialize lazy load manager.
	 */
	public static function init_process() {
		add_filter( 'wp-table-builder/filter/settings_manager_frontend_data', [
			__CLASS__,
			'add_settings_menu_data'
		] );
		add_action( 'wp_ajax_' . static::$settings_update_action, [ __CLASS__, 'update_settings' ] );
		add_filter( 'wp-table-builder/filter/wptb_frontend_data', [ __CLASS__, 'prepare_frontend_data' ] );
		add_filter( 'wp-table-builder/filter/table_html_shortcode', [ __CLASS__, 'table_html_shortcode' ] );
		static::register_settings();
	}

	/**
	 * Callback for generating table html at shortcode.
	 *
	 * @param string $html table html
	 *
	 * @return string table shortcode html
	 */
	public static function table_html_shortcode( $html ) {
		$is_lazy_load_enabled = get_option( static::$settings_update_action )['enabled'];

		if ( $is_lazy_load_enabled ) {
			$dom_handler   = new DOMDocument();
			$handle_status = @$dom_handler->loadHTML( $html, LIBXML_HTML_NOIMPLIED || LIBXML_HTML_NODEFDTD || LIBXML_NOWARNING || LIBXML_NOERROR );

			if ( $handle_status ) {
				$dom_query      = new DOMXPath( $dom_handler );
				$image_elements = $dom_query->query( '//div[@class="wptb-image-wrapper"]//img' );
				foreach ( $image_elements as $img ) {
					$target_url = $img->getAttribute( 'src' );

					$img->setAttribute( 'data-wptb-lazy-load-target', $target_url );
					$img->setAttribute( 'src', '' );
					$img->setAttribute( 'class', join( ' ', [ $img->getAttribute( 'class' ), 'wptb-lazy-load-img' ] ) );
					$img->setAttribute( 'data-wptb-lazy-load-status', 'false' );
				}
				$html = $dom_handler->saveHTML();
			}
		}

		return $html;
	}

	/**
	 * Prepare frontend data for lazy load.
	 *
	 * @param array $data frontend data
	 *
	 * @return array frontend data
	 */
	public static function prepare_frontend_data( $data ) {
		$data['lazyLoad'] = array_merge( get_option( static::$settings_update_action ), static::$frontend_options );

		return $data;
	}

	/**
	 * Get sanitization rules for lazy load options.
	 *
	 * @return array sanitization rules
	 */
	private static function get_sanitization_rules() {
		return apply_filters( 'wp-table-builder/filter/lazy_load_sanitization_rules', static::$sanitization_rules );
	}

	/**
	 * Get default settings for lazy load.
	 * @return array default lazy load settings
	 */
	private static function get_default_settings() {
		return apply_filters( 'wp-table-builder/filter/lazy_load_default_settings', static::$default_settings );
	}

	/**
	 * Register lazy load related settings.
	 */
	private static function register_settings() {
		$settings = static::get_default_settings();

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
	 *
	 * @return array sanitized lazy load options
	 */
	public static function sanitize_settings( $settings ) {
		return array_merge( get_option( static::$settings_update_action ), Helpers::batch_sanitize( $settings, static::get_sanitization_rules() ) );
	}

	/**
	 * Update settings through ajax endpoint.
	 */
	public static function update_settings() {
		$instance = static::get_instance();
		if ( current_user_can( Settings_Manager::ALLOWED_ROLE_META_CAP ) && check_ajax_referer( static::$settings_update_action, 'nonce', false ) && isset( $_POST['settings'] ) ) {
			$updated_settings = json_decode( wp_kses_stripslashes( $_POST['settings'] ), true );
			update_option( static::$settings_update_action, $updated_settings );
			$instance->set_message( esc_html__( 'Lazy load options updated.', 'wp-table-builder' ) );
		} else {
			$instance->set_error( esc_html__( 'An error occurred with your request, try again later.', 'wp-table-builder' ) );
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
