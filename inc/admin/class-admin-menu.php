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
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) ); 
		add_action( 'wp_ajax_save_table', array( $this, 'save_table' ) );
		add_action( 'wp_ajax_nopriv_save_table', array( $this, 'save_table' ) );
		add_action( 'wp_ajax_get_table', array( $this, 'get_table' ) );
		add_action( 'wp_ajax_nopriv_get_table', array( $this, 'get_table' ) );
	}

	public function save_table(){
		$id = wp_insert_post([
			'post_title' => $_POST['title'],
			'post_content' => $_POST['content'],
			'post_type' => 'wptb-tables'
		]); 
		wp_die('Holi'.$id);
	}

	public function get_table(){  
		$html = get_post($_REQUEST['id'] , ARRAY_A);
		die($html['post_content']);
	}


	/**
	 * Register our menus.
	 *
	 * @since 1.0.0
	 */
	public function register_menus() {

		global $builder_page, $tables_overview, $table_list;  
		$menu_cap = Helpers::wptb_get_capability_manage_options();

		// Default Tables top level menu item.
		$tables_overview = add_menu_page(
			esc_html__( 'WP Table Builder', 'wp-table-builder' ),
			esc_html__( 'Table Builder', 'wp-table-builder' ),
			$menu_cap,
			'wptb-overview',
			array( $this, 'tables_list' ),
			'dashicons-editor-table',
			apply_filters( 'wptb_menu_position', '50' )
		);

		// All Tables sub menu item.
		$table_list = add_submenu_page(
			'wptb-overview',
			esc_html__( 'WP Table Builder', 'wp-table-builder' ),
			esc_html__( 'All Tables', 'wp-table-builder' ),
			$menu_cap,
			'wptb-overview',
			array( $this, 'tables_list' )
		);

		// Add New Table sub menu item.
		$builder_page = add_submenu_page(
			'wptb-overview',
			esc_html__( 'Table Builder', 'wp-table-builder' ),
			esc_html__( 'Add New', 'wp-table-builder' ),
			$menu_cap,
			'wptb-builder',
			array( $this, 'table_builder' )
		);
 
		do_action( 'wptb_admin_menu', $this );

	}

	public function enqueue_scripts( $hook ) {
		/*
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */ 
		global $builder_page, $tables_overview, $table_list; 

		wp_enqueue_media();

		if ( $hook != ( $builder_page || $table_list || $hook != $tables_overview ) ) {
			return;
		}

		wp_register_script( 'wptb-admin-builder-js', plugin_dir_url( __FILE__ ) . 'js/admin.js', array( 'jquery', 'wptb-admin-builder-tinymce-js', 'wp-color-picker' ), NS\PLUGIN_VERSION, true );
		wp_register_script( 'wptb-admin-builder-tinymce-js', plugin_dir_url( __FILE__ ) . 'js/tinymce/tinymce.min.js', array(), NS\PLUGIN_VERSION, false );
		wp_register_script( 'wptb-admin-builder-tinymce-jquery-js', plugin_dir_url( __FILE__ ) . 'js/tinymce/jquery.tinymce.min.js', array(), NS\PLUGIN_VERSION, false );

		wp_enqueue_style( 'wptb-builder-css', plugin_dir_url( __FILE__ ) . 'css/wp-table-builder-admin.css', array(), NS\PLUGIN_VERSION, 'all' );

		wp_enqueue_style( 'wp-color-picker' );
		wp_enqueue_script( 'wptb-admin-builder-tinymce-js' );
		wp_enqueue_script( 'wptb-admin-builder-tinymce-jquery-js' );
		wp_enqueue_script( 'wptb-admin-builder-js' );
	
	}

	/**
	 * Wrapper for the hook to render our tables list.
	 *
	 * @since 1.0.0
	 */
	public function tables_list() { 
		$table_list = new WPTB_Listing();
		?>
			<div class="wrap">
				<div style="margin-bottom: 30px;">
					<h1 class="wp-heading-inline">
						<?php esc_html_e( 'All Tables', 'wp-table-builder' ); ?>
					</h1>
					<a href="<?php echo admin_url( 'admin.php?page=wptb-builder' ); ?>" class="wptb-button-add-new">
						<?php esc_html_e( 'Add New Table', 'wp-table-builder' ); ?>
					</a>
				</div>
			</div>
			
		<?
		$table_list->prepare_items();
		$table_list->display();
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
