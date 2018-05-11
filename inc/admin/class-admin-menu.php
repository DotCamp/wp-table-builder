<?php

namespace WP_Table_Builder\Inc\Admin;
use WP_Table_Builder as NS;
Use WP_Table_Builder\Inc\Common\Helpers;

/**
 * Register menu elements and do other global tasks.
 *
 * @link       http://wptablebuilder.com/
 * @since      1.0.0
 *
 * @author    Imtiaz Rayhan
 */
class Admin_Menu {

	/**
	 * Primary class constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {

		// Let's make some menus.
		add_action( 'admin_menu', array( $this, 'register_menus' ), 9 );
        
	}

	/**
	 * Register our menus.
	 *
	 * @since 1.0.0
	 */
	public function register_menus() {

		$menu_cap = Helpers::wptb_get_capability_manage_options();

		// Default Tables top level menu item.
		add_menu_page(
			esc_html__( 'WP Table Builder', 'wp-table-builder' ),
			esc_html__( 'Table Builder', 'wp-table-builder' ),
			$menu_cap,
			'wptb-overview',
			array( $this, 'tables_list' ),
			'dashicons-editor-table',
			apply_filters( 'wptb_menu_position', '50' )
		);

		// All Tables sub menu item.
		add_submenu_page(
			'wptb-overview',
			esc_html__( 'WP Table Builder', 'wp-table-builder' ),
			esc_html__( 'All Tables', 'wp-table-builder' ),
			$menu_cap,
			'wptb-overview',
			array( $this, 'tables_list' )
		);

		// Add New Table sub menu item.
		add_submenu_page(
			'wptb-overview',
			esc_html__( 'Table Builder', 'wp-table-builder' ),
			esc_html__( 'Add New', 'wp-table-builder' ),
			$menu_cap,
			'wptb-builder',
			array( $this, 'table_builder' )
		);

		do_action( 'wptb_admin_menu', $this );

        
	}

	/**
	 * Wrapper for the hook to render our tables list.
	 *
	 * @since 1.0.0
	 */
	public function tables_list() {
        echo "<h1>New Table List</h1>";
		do_action( 'wptb_tables_list' );
    }
    
    /**
	 * Wrapper for the hook to render our tables builder.
	 *
	 * @since 1.0.0
	 */
	public function table_builder() {
        require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/wptb-builder-ui.php';
	}

}
