<?php

namespace WP_Table_Builder\Inc\Admin;


if ( ! class_exists( 'WP_List_Table' ) ) {
	die('NOT?');
	require_once( ABSPATH . 'wp-admin\includes\class-wp-list-table.php' );
}
/**
 * This allows us to render custom tables in admin view
 *
 * @link       http://wptablebuilder.com/
 * @since      1.0.0
 *
 * @author    Imtiaz Rayhan
 */
class WPTB_Listing  extends \WP_List_Table{

	public function __construct() {

		parent::__construct( [
			'singular' => __( 'WPTB Table', 'wp-table-builder' ), 
			'plural'   => __( 'WPTB Tables', 'wp-table-builder' ), 
			'ajax'     => false 
		] );
	}
 
	public static function get_tables( $per_page = 5, $page_number = 1 ) {

		global $wpdb, $post;

		$params = array( 'post_type' => 'wptb-tables', 'posts_per_page' => $per_page, 'paged' => $page_number );

	  	$params['orderby'] = isset( $_REQUEST['orderby'] ) && ! empty( sanitize_text_field( $_REQUEST['orderby'] ) ) ? sanitize_text_field( $_REQUEST['orderby'] ) : 'date';
	  	$params['order'] = isset( $_REQUEST['order'] ) && ! empty( sanitize_text_field( $_REQUEST['order'] ) ) ? sanitize_text_field( $_REQUEST['order'] ) : 'DESC';
	  	
	  	$loop = new \WP_Query( $params ); 
		$result=[];
		while ( $loop->have_posts() ) { $loop->the_post(); $result[] = $post; } 
	  	
		return $result;
		 
	}

	public static function duplicate_table( $id ) {
	
		global $wpdb;
        
        $post = get_post( $id );
        
        if( $post ) {
            $id_new = wp_insert_post([
                'post_title' => sanitize_text_field( $post->post_title ),
                'post_content' => '',
                'post_type' => 'wptb-tables',
                'post_status' => 'draft'
            ]);
            $table = get_post_meta( absint( $id ) , '_wptb_content_', true );
            $elements_datas = get_post_meta( absint( $id ) , '_wptb_table_elements_datas_', true );
            $elements_styles = get_post_meta( absint( $id ) , '_wptb_table_elements_styles_', true );
            
            $table_new = add_post_meta( $id_new, '_wptb_content_', $table );
            $elements_datas_new = add_post_meta( $id_new , '_wptb_table_elements_datas_', $elements_datas );
            $elements_datas_new = add_post_meta( $id_new , '_wptb_table_elements_styles_', $elements_styles );
            
            if( $id_new && $table_new ) {
                wp_update_post([
                    'ID' => $id_new,
                    'post_title' => str_replace( ' (ID #'.$id.')', '', get_the_title( $id_new )  . ' (ID #' . $id_new . ')' ),
                    'post_content' => '',
                    'post_type' => 'wptb-tables',
                    'post_status' => 'draft'
                ]);
                return true;
            }
        }
        
        return false;
	
	}

	public static function delete_table( $id ) {
	
		global $wpdb;

		delete_post_meta( $id, '_wptb_content_' );

	  	$wpdb->delete(
	    	"{$wpdb->prefix}posts",
	    	[ 'ID' => $id ],
	    	[ '%d' ]
	  	);
	
	}

	public static function record_count( $per_page ) {
		
		global $wpdb, $post;

		$params = array( 'post_type' => 'wptb-tables', 'posts_per_page' => $per_page );
	  	$params['orderby'] = isset( $_REQUEST['orderby'] ) && ! empty( sanitize_text_field( $_REQUEST['orderby'] ) ) ? sanitize_text_field( $_REQUEST['orderby'] ) : 'date';
	  	$params['order'] = isset( $_REQUEST['order'] ) && ! empty( sanitize_text_field( $_REQUEST['order'] ) ) ? sanitize_text_field( $_REQUEST['order'] ) : 'DESC';
	  	
	  	$loop = new \WP_Query( $params ); 
	  	return $loop->found_posts;
 
	}

	public function no_items() {
		  
		printf(
			wp_kses(
				/* translators: %s - admin area page builder page URL. */
				__( 'Whoops, you haven\'t created a table yet. Want to <a href="%s">give it a go</a>?', 'wp-table-builder' ),
				array(
					'a' => array(
						'href' => array(),
					),
				)
			),
			admin_url( 'admin.php?page=wptb-builder' )
		);
	
	}

	function column_name( $item ) {

		// create a nonce
		$nonce = wp_create_nonce( 'wptb_nonce_table' );
		  
		$table_title = $item->post_title;

		$title = ! empty( $table_title ) ? $table_title : __( 'Table (ID #' . absint( $item->ID ) . ')', 'wp-table-builder' );
		  
		$title = sprintf(
			'<a class="row-title" href="%s" title="%s"><strong>%s</strong></a>',
			add_query_arg(
				array(
					'table' => $item->ID,
				),
				esc_url( admin_url( 'admin.php?page=wptb-builder' ) )
			),
			esc_html__( 'Edit This Table', 'wp-table-builder' ),
			$title
		);
        
        $wptb_preview_button_url = add_query_arg(
            array(
                'post_type' => 'wptb-tables',
                'p' => absint( $item->ID ),
            ),
            home_url()
        );
        
	  	$actions = [
	    	'delete' => sprintf( '<a href="?page=%s&action=%s&table_id=%s&_wpnonce=%s">Delete</a>', esc_attr( $_REQUEST['page'] ), 'delete', absint( $item->ID ), $nonce ),
            'duplicate' => sprintf( '<a href="?page=%s&action=%s&table_id=%s&_wpnonce=%s">Duplicate</a>', esc_attr( $_REQUEST['page'] ), 'duplicate', absint( $item->ID ), $nonce ),
            'preview_' => sprintf( '<a href="%s" target="_blank">Preview</a>', $wptb_preview_button_url ),
			'edit' => sprintf( '<a href="?page=wptb-builder&table=%d">Edit</a>',  absint( $item->ID ) )
	  	];

	  	return $title . $this->row_actions( $actions );
	
	}

	public function column_default( $item, $column_name ) {
		
		switch ( $column_name ) { 
			case 'id': 
				return $item->ID;
			case 'shortcode': 
				return '[wptb id='.$item->ID.']';
			case 'created':
				return get_the_date( '', $item->ID );
				break;     
	  	}
	
	}

	function column_cb( $item ) {
		
		return sprintf(
	    	'<input type="checkbox" name="bulk-delete[]" value="%s" />', absint( $item->ID )
	  	);
	
	}

	function get_columns() {

		$columns = [
			'cb' 		 => '<input type="checkbox" />',
			'name'       => esc_html__( 'Title', 'wp-table-builder' ),
			'shortcode'  => esc_html__( 'Shortcode', 'wp-table-builder' ), 
			'created'    => esc_html__( 'Created', 'wp-table-builder' ),
        	'id'         => esc_html__( 'ID', 'wp-table-builder' )
	  	];

	  	return apply_filters( 'wptb_table_list_columns', $columns );
	
	}

	public function get_sortable_columns() {
	  
		$sortable_columns = array(
	    	'title' => array( 'title', true ) 
	  	);

	  	return $sortable_columns;
	
	}

	public function get_bulk_actions() {
		  
		$actions = [
	    	'bulk-delete' => 'Delete'
	  	];

	  	return $actions;
	
	}

	public function prepare_items() {

	  	$columns = $this->get_columns();
	  	$hidden = array();
	  	$sortable = $this->get_sortable_columns();
	  	$this->_column_headers = array($columns, $hidden, $sortable);

	  	/** Process bulk action */
	  	$this->process_bulk_action();

	  	$per_page     = $this->get_items_per_page( 'tables_per_page', 10 );
	  	$current_page = $this->get_pagenum();
	  	$total_items  = self::record_count( $per_page );

	  	$this->set_pagination_args( [
	    	'total_items' => $total_items, //WE have to calculate the total number of items
	    	'per_page'    => $per_page //WE have to determine how many items to show on a page
	  	] );

	  	$this->items = $this->get_tables( $per_page, $current_page );
	
	}

	public function process_bulk_action() {
        
        $nonce = isset( $_REQUEST['_wpnonce'] ) && esc_attr( $_REQUEST['_wpnonce'] ) ? esc_attr( $_REQUEST['_wpnonce'] ) : '';
        
        
		if ( 'duplicate' === $this->current_action() ) {

	    	if ( ! wp_verify_nonce( $nonce, 'wptb_nonce_table' ) ) {
	      		die( 'Go get a life script kiddies' );
			} else {
	      		$duplicate = $this->duplicate_table( absint( $_GET['table_id'] ) );
                ?>
                    <div class="notice notice-success is-dismissible">
                        <p><?php esc_html_e( 'Table duplicate successfully.', 'wp-table-builder' ); ?></p>
                    </div>
                    <script>window.history.pushState( null, null, window.location.href.split('?')[0] + '?page=wptb-overview' );</script>
                <?php
	    	}

	  	}

		if ( 'delete' === $this->current_action() ) {

	    	if ( ! wp_verify_nonce( $nonce, 'wptb_nonce_table' ) ) {
	      		die( 'Go get a life script kiddies' );
			} else {
	      		$this->delete_table( absint( $_GET['table_id'] ) );
                ?>
                    <div class="notice notice-success is-dismissible">
                        <p><?php esc_html_e( 'Table deleted successfully.', 'wp-table-builder' ); ?></p>
                    </div>
                    <script>window.history.pushState( null, null, window.location.href.split('?')[0] + '?page=wptb-overview' );</script>
                <?php
	    	}

	  	}

	  	// If the delete bulk action is triggered
	  	if ( ( isset( $_POST['action'] ) && sanitize_text_field( $_POST['action'] ) == 'bulk-delete' ) ||
                ( isset( $_POST['action2'] ) && sanitize_text_field( $_POST['action2'] ) == 'bulk-delete' ) ) {
            
            if( ! wp_verify_nonce( $nonce, 'bulk-' . $this->_args['plural'] ) ){
                die( 'Go get a life script kiddies' );
            } else {
                $delete_ids = esc_sql( $_POST['bulk-delete'] );

                // loop over the array of record IDs and delete them
                foreach ( $delete_ids as $id ) {
                    $this->delete_table( absint( $id ) );
                }
                
                ?>
                <div class="notice notice-success is-dismissible">
                    <p><?php esc_html_e( 'Bulk Delete Performed Successfully.', 'wp-table-builder' ); ?></p>
                </div>
                <script>window.history.pushState( null, null, window.location.href.split('?')[0] + '?page=wptb-overview' );</script>
                <?php 
            }
	  	}
	}
}

$table = new WPTB_Listing(); 