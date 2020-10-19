<?php

namespace WP_Table_Builder\Inc\Admin;

use WP_Table_Builder as NS;
use function add_action;
use function add_filter;
use function esc_html__;

// if called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Header_Toolbox.
 *
 * Component for adding toolbox under header section of table builder.
 * @package WP_Table_Builder\Inc\Admin
 */
class Header_Toolbox {
	/**
	 * Initializer header toolbox component.
	 */
	public static function init() {
		add_action( 'wp-table-builder/action/builder-header-after', [ __CLASS__, 'display_header_toolbox' ], 1 );
		add_filter( 'wp-table-builder/filter/wptb_admin_data', [ __CLASS__, 'add_header_toolbox_data' ], 10, 1 );
	}

	/**
	 * Display header toolbox element at builder ui.
	 */
	public static function display_header_toolbox() {
		require_once( NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-header-toolbox.php' );
	}

	/**
	 * Get default header actions
	 *
	 * For security reasons (mainly to avoid eval), use WPTB_HeaderToolboxActions js object to assign click actions to buttons, use id assigned here to match the buttons with their actions.
	 * @return array default header actions
	 */
	protected static function default_header_actions() {
		return [
			'buttons' => [
				[
					'id'    => 'manageCells',
					'label' => esc_html__( 'manage cells', 'wp-table-builder' ),
				],
				[
					'id'    => 'borders',
					'label' => esc_html__( 'borders', 'wp-table-builder' ),
				],
				[
					'id'    => 'tags',
					'label' => esc_html__( 'table tags', 'wp-table-builder' ),
				]
			]
		];
	}

	/**
	 * Add necessary frontend data for header toolbox.
	 */
	public static function add_header_toolbox_data( $data ) {
		$data['headerToolbox'] = static::default_header_actions();

		return $data;
	}
}