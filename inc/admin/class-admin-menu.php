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
		add_action( 'wp_ajax_create_table', array( $this, 'create_table' ) );
		add_action( 'wp_ajax_save_table', array( $this, 'save_table' ) );
		add_action( 'wp_ajax_nopriv_save_table', array( $this, 'save_table' ) );
		add_action( 'wp_ajax_get_table', array( $this, 'get_table' ) );
		add_action( 'wp_ajax_nopriv_get_table', array( $this, 'get_table' ) );
	}
    
    public function create_table() {
        $id = wp_insert_post([
            'post_title' => '',
            'post_content' => '',
            'post_type' => 'wptb-tables',
            'post_status' => 'draft'
        ]);
        wp_die( json_encode( ['created',$id] ) );
    }

	public function save_table() {
        
        $params = json_decode( file_get_contents( 'php://input' ) );
        
        if( wp_verify_nonce( $params->security_code, 'wptb-security-nonce' ) ) {
            
            if( ! property_exists( $params, 'id') || ! absint( $params->id ) || get_post_status( absint( $params->id ) ) != 'draft' ) {
                $id = wp_insert_post([
                    'post_title' => sanitize_text_field( $params->title ),
                    'post_content' => '',
                    'post_type' => 'wptb-tables',
                    'post_status' => 'draft'
                ]);
                
                add_post_meta( $id, '_wptb_content_', $params->content );
                
                wp_die( json_encode( ['saved', $id] ) );
            } else {
                wp_update_post([
                    'ID' => absint( $params->id ),
                    'post_title' => sanitize_text_field( $params->title ),
                    'post_content' => '',
                    'post_type' => 'wptb-tables',
                    'post_status' => 'draft'
                ]);
                
                if( isset( $params->preview_saving ) && ! empty( (int)$params->preview_saving ) ) {
                    update_post_meta( absint( $params->id ), '_wptb_preview_id_', $params->preview_saving );
                    update_post_meta( absint( $params->id ), '_wptb_content_preview_', $params->content );
                    
                    wp_die( json_encode( ['preview_edited'] ) );
                } else {
                    update_post_meta( absint( $params->id ), '_wptb_content_', $params->content );
                
                    wp_die( json_encode( ['edited', absint( $params->id )] ) );
                }
            }
        } else {
            wp_die( json_encode( ['security_problem', ''] ) );
        }
	}

	public function get_table() {  
		$post = get_post( absint( $_REQUEST['id'] ) );
		$table_html = get_post_meta( absint( $_REQUEST['id'] ) , '_wptb_content_', true );
		$name = $post->post_title;
        //$html = json_decode( $html );
		die( json_encode( [$name, $table_html] ) );
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

		
		if( isset( $_GET['page'] ) && sanitize_text_field( $_GET['page'] ) == 'wptb-builder' ) {
            wp_register_script( 'wptb-admin-builder-js', plugin_dir_url( __FILE__ ) . 'js/admin.js', array( 'jquery', 'wptb-admin-builder-tinymce-js', 'wp-color-picker' ), NS\PLUGIN_VERSION, true );
            wp_register_script( 'wptb-admin-builder-tinymce-js', plugin_dir_url( __FILE__ ) . 'js/tinymce/tinymce.min.js', array(), NS\PLUGIN_VERSION, false );
            wp_register_script( 'wptb-admin-builder-tinymce-jquery-js', plugin_dir_url( __FILE__ ) . 'js/tinymce/jquery.tinymce.min.js', array(), NS\PLUGIN_VERSION, false );

            wp_enqueue_style( 'wp-color-picker' );
            
            wp_enqueue_style( 'wptb-builder-css', plugin_dir_url( __FILE__ ) . 'css/admin.css', array(), NS\PLUGIN_VERSION, 'all' );
            wp_enqueue_script( 'wptb-admin-builder-tinymce-js' );
            wp_enqueue_script( 'wptb-admin-builder-tinymce-jquery-js' );
            wp_enqueue_script( 'wptb-admin-builder-js' );
            
            wp_localize_script( 
                'wptb-admin-builder-js', 
                'wptb_admin_object', 
                [
                    'ajaxurl'  => admin_url( 'admin-ajax.php' ),
                    'security_code'  => wp_create_nonce( 'wptb-security-nonce' ),
                ] 
            );
		} elseif( isset( $_GET['page'] ) && sanitize_text_field( $_GET['page'] ) == 'wptb-overview' ) {
            wp_enqueue_script( 'wptb-overview-js', plugin_dir_url( __FILE__ ) . 'js/wptb-overview.js', array( 'jquery' ), NS\PLUGIN_VERSION, true );
            wp_enqueue_style( 'wptb-admin-common-css', plugin_dir_url( __FILE__ ) . 'css/admin-common.css', array(), NS\PLUGIN_VERSION, 'all' );
        }
	
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
					<span class="wptb-split-page-title-action">
						<a href="<?php echo esc_url( admin_url( 'admin.php?page=wptb-builder' ) ); ?>" class="page-title-action">
							<?php esc_html_e( 'Add New', 'wp-table-builder' ); ?>
						</a>
					</span>
				</div>
			</div>
			
		<?php
		$table_list->prepare_items();
		?>
		<form method="post"><?php
		$table_list->display();?>
		</form><?php
    }
    
    /**
	 * Wrapper for the hook to render our tables builder.
	 *
	 * @since 1.0.0
	 */
	public function table_builder() {
        require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/wptb-builder-ui.php';
	}

}; 