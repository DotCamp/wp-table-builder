<?php

/**
 * Register menu elements and do other global tasks.
 *
 * @package    WPTB
 * @subpackage WPTB/admin-menu
 */
class WPTB_Admin_Menu {

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

		$menu_cap = wptb_get_capability_manage_options();

		// Default Tables top level menu item.
		add_menu_page(
			esc_html__( 'WP Table Builder', 'wptb' ),
			esc_html__( 'Table Builder', 'wptb' ),
			$menu_cap,
			'wptb-overview',
			array( $this, 'tables_list' ),
			'dashicons-editor-table',
			apply_filters( 'wptb_menu_position', '50' )
		);

		// All Tables sub menu item.
		add_submenu_page(
			'wptb-overview',
			esc_html__( 'WP Table Builder', 'wptb' ),
			esc_html__( 'All Tables', 'wptb' ),
			$menu_cap,
			'wptb-overview',
			array( $this, 'tables_list' )
		);

		// Add New Table sub menu item.
		add_submenu_page(
			'wptb-overview',
			esc_html__( 'Table Builder', 'wptb' ),
			esc_html__( 'Add New', 'wptb' ),
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
        echo "<h1>Table List</h1>";
		do_action( 'wptb_tables_list' );
    }
    
    /**
	 * Wrapper for the hook to render our tables builder.
	 *
	 * @since 1.0.0
	 */
	public function table_builder() {
        echo "<h1>Table Builder</h1>";
		do_action( 'wptb_table_builder' );
	}

}
