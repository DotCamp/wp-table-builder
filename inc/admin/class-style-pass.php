<?php

namespace WP_Table_Builder\Inc\Admin;

// if called directly, abort
use WP_Table_Builder\Inc\Admin\Controls\Control_Section_Group_Collapse;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager;
use WP_Table_Builder as NS;
use function add_filter;
use function trailingslashit;
use const add_action;

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

	/**
	 * Initialize style pass.
	 */
	public static function init() {
		add_action( 'wp-table-builder/table_settings_registered', [ __CLASS__, 'add_setting_controls' ] );
		add_filter( 'wp-table-builder/filter/wptb_frontend_data', [ __CLASS__, 'frontend_data' ], 99, 1 );
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
				'wp-table-builder-css' => static::prepare_stylesheet_url( 'inc/frontend/css/wp-table-builder-frontend.css', $version ),

			]
		];

		// style pass frontend data filter
		$style_pass_data   = apply_filters( 'wp-table-builder/filter/style-pass-frontend-data', $style_pass_data );
		$data['stylePass'] = $style_pass_data;

		return $data;
	}

	/**
	 * Prepare url for the given stylesheet
	 *
	 * @param string $relative_url path to css file relative to plugin base
	 * @param int $version file version
	 *
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
	 * @param Object $context table settings context
	 */
	public static function add_setting_controls( $context ) {
		$style_pass_controls = [
			'disableThemeStyles' => [
				'label'     => esc_html__( 'Disable Theme Styles For Table', 'wp-table-builder' ),
				'type'      => Controls_Manager::TOGGLE,
				'selectors' => [
					'{{{data.container}}}' => [ 'data-disable-theme-styles', '1', null ]
				]
			],
			'extraTableStyles'   => [
				'type' => Controls_Manager::EXTRA_STYLES
			]
		];

		Control_Section_Group_Collapse::add_section( 'style_pass_settings', esc_html__( 'styles', 'wp-table-builder' ), $style_pass_controls, [
			$context,
			'add_control'
		], false );
	}
}
