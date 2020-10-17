<?php

namespace WP_Table_Builder\Inc\Admin;

// if called directly, abort
use WP_Table_Builder\Inc\Admin\Controls\Control_Section_Group_Collapse;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager;
use function add_filter;
use const add_action;
use const WP_Table_Builder\NS;

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
	 */
	public static function frontend_data( $data ) {
		$version = NS\PLUGIN_VERSION;


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
			]
		];

		Control_Section_Group_Collapse::add_section( 'style_pass_settings', esc_html__( 'styles', 'wp-table-builder' ), $style_pass_controls, [
			$context,
			'add_control'
		], true );
	}
}