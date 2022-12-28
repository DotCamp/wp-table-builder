<?php

namespace WP_Table_Builder\Inc\Admin;

use WP_Table_Builder\Inc\Admin\Controls\Control_Section_Group_Collapse;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager;
use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Admin\Views\Builder\Table_Element\Table_Setting_Element;
use WP_Table_Builder\Inc\Common\Traits\Ajax_Response;
use WP_Table_Builder\Inc\Common\Traits\Singleton_Trait;
use WP_Table_Builder\Inc\Core\Init;
use function add_action;
use function add_filter;
use function add_query_arg;
use function apply_filters;
use function check_admin_referer;
use function current_user_can;
use function esc_html__;
use function get_admin_url;
use function get_option;
use function trailingslashit;
use function update_option;
use function wp_create_nonce;

// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Style_Pass.
 *
 * Class responsible for extra styles and interaction with styles outside the context of table builder.
 * @package WP_Table_Builder\Inc\Admin
 */
class Style_Pass {
	// using singleton trait to get benefits of ajax response trait
	use Singleton_Trait;
	use Ajax_Response;

	/**
	 * Option name constant to store table general styles.
	 */
	const GENERAL_STYLES_OPTION_NAME = 'wptb-general-styles';

	/**
	 * Initialize style pass.
	 */
	public static function init() {
		add_filter( 'wp-table-builder/filter/wptb_frontend_data', [ __CLASS__, 'frontend_data' ], 99, 1 );
		add_filter( 'wp-table-builder/filter/settings_manager_frontend_data', [ __CLASS__, 'settings_menu_data' ] );

		add_action( 'wp_ajax_' . static::GENERAL_STYLES_OPTION_NAME, [ __CLASS__, 'update_general_styles' ] );

		static::add_setting_controls();
	}

	/**
	 * Ajax callback for updating saved general styles.
	 */
	public static function update_general_styles() {
		$instance = static::get_instance();
		if ( current_user_can( 'manage_options' ) && check_admin_referer( static::GENERAL_STYLES_OPTION_NAME, 'nonce' ) && isset( $_POST['styles'] ) ) {
			$instance->set_message( esc_html__( 'General styles updated.' ) );
			update_option( static::GENERAL_STYLES_OPTION_NAME, $_POST['styles'] );
		} else {
			$instance->set_error( esc_html__( 'You are not authorized to use this ajax endpoint.' ) );
		}

		$instance->send_json();
	}

	/**
	 * Filter hook for admin settings menu frontend data.
	 *
	 * @param array $settings_data data array
	 *
	 * @return array filtered data array
	 */
	public static function settings_menu_data( $settings_data ) {
		$extra_style_strings = [
			'headerText'    => esc_html__( 'Add style rules that will be available for all your tables.' ),
			'subHeaderText' => esc_html__( '!important directive will be added automatically to your style rules.' ),
		];

		// add translation strings to script
		$settings_data['strings'] = array_merge( $settings_data['strings'], $extra_style_strings );

		// get saved general styles from option
		$general_styles = get_option( static::GENERAL_STYLES_OPTION_NAME, '/*' . esc_html__( 'Enter your custom CSS rules here...' . '*/' ) );

		// security related data for general styles
		$security = [
			'ajaxUrl' => get_admin_url( null, 'admin-ajax.php' ),
			'nonce'   => wp_create_nonce( static::GENERAL_STYLES_OPTION_NAME ),
			'action'  => static::GENERAL_STYLES_OPTION_NAME,
		];

		// add general styles related data to admin settings menu frontend
		$settings_data['data']['generalStyles'] = [ 'savedStyles' => $general_styles, 'security' => $security ];

		return $settings_data;
	}

	/**
	 * Add style pass related data to frontend scripts.
	 *
	 * @param array $data frontend data array
	 *
	 * @return array frontend data
	 */
	public static function frontend_data( $data ) {
		$version = NS\PLUGIN_VERSION;

		$style_pass_data = [
			'stylesheets' => [
				'create' => [
					'wp-table-builder-css' => static::prepare_stylesheet_url( 'inc/frontend/css/wp-table-builder-frontend.css', $version ),
				],
				'copy'   => []
			],
			'settings'    => [
				'disableThemeStylesForAll' => filter_var( Init::instance()->settings_manager->get_option_value( 'disable_theme_styles_for_all' ), FILTER_VALIDATE_BOOLEAN )
			]
		];

		// style pass frontend data filter
		$style_pass_data   = apply_filters( 'wp-table-builder/filter/style-pass-frontend-data', $style_pass_data );
		$data['stylePass'] = $style_pass_data;

		$generalStylesCode = static::get_general_styles();

		if ( ! empty( $generalStylesCode ) ) { // general styles frontend data
			$data['generalStyles'] = $generalStylesCode;
		}

		return $data;
	}

	/**
	 * Get general styles.
	 * @return array general styles
	 */
	public static function get_general_styles() {
		$general_style_rules = get_option( static::GENERAL_STYLES_OPTION_NAME, '' );

		if ( ! empty( $general_style_rules ) ) { // general styles frontend data
			return [
				'styles'       => $general_style_rules,
				'parentPrefix' => '.wptb-table-container'
			];
		}

		return null;
	}

	/**
	 * Prepare url for the given stylesheet.
	 *
	 * @param string $relative_url path to css file relative to plugin base
	 * @param int $version file version
	 * @param null $plugin_root root url for plugin, if no value is supplied normal version root url will be used
	 *
	 * @return string formed stylesheet url
	 */
	public static function prepare_stylesheet_url( $relative_url, $version, $plugin_root = null ) {
		$base_url = trailingslashit( $plugin_root === null ? NS\WP_TABLE_BUILDER_URL : $plugin_root ) . $relative_url;

		return add_query_arg( [ 'version' => $version ], $base_url );
	}

	/**
	 * Add style pass controls to table settings menu.
	 *
	 */
	public static function add_setting_controls() {
		$style_pass_controls = [
			'disableThemeStyles' => [
				'label'     => esc_html__( 'Disable Theme Styles For Table', 'wp-table-builder' ),
				'type'      => Controls_Manager::TOGGLE,
				'selectors' => [
					'{{{data.container}}}' => [ 'data-disable-theme-styles', '1', null ]
				]
			],
			'extraTableStyles'   => [
				'label'        => esc_html__( 'Extra styles', 'wp-table-builder' ),
				'type'         => Controls_Manager::EXTRA_STYLES,
				'selectors'    => [
					[
						'query' => '{{{data.container}}}',
						'type'  => Controls_Manager::DATASET,
						'key'   => 'wptbExtraStyles'
					]
				],
				// send default value as base64 encoded string
				"defaultValue" => base64_encode( ( '/* Enter your custom CSS rules here */' ) )
			]
		];

//		// remove disable theme styles control if site wide option is enabled
//		$disableThemeStylesForAll = Init::instance()->settings_manager->get_option_value( 'disable_theme_styles_for_all' );
//		if ( filter_var( $disableThemeStylesForAll, FILTER_VALIDATE_BOOLEAN ) ) {
//			unset( $style_pass_controls['disableThemeStyles'] );
//		}

		// add builder settings section
		Table_Setting_Element::add_settings_section( 'style_pass_settings', esc_html__( 'styles', 'wp-table-builder' ), $style_pass_controls, 'paint-brush' );
	}
}
