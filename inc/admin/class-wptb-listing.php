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
		if(isset($_GET['success']))
		{ 
	    ?>
	    <div class="notice notice-success is-dismissible">
	        <p><?php _e( 'Table deleted successfully.', 'wptb-builder' ); ?></p>
	    </div>
	    <?php 
	    unset($_GET['success']);
		} 
		if(isset($_GET['bulksuccess']))
		{ 
	    ?>
	    <div class="notice notice-success is-dismissible">
	        <p><?php _e( 'Bulk delete performed successfully.', 'wptb-builder' ); ?></p>
	    </div>
	    <?php 
	    unset($_GET['bulksuccess']);
		} 

	}
 
	public static function get_tables( $per_page = 5, $page_number = 1 ) {

		global $post;

		$params = array( 'post_type' => 'wptb-tables', 'posts_per_page' => $per_page );

	  	$params['orderby'] = ! empty( $_REQUEST['orderby'] ) ? $_REQUEST['orderby'] : 'date';
	  	$params['order'] = ! empty( $_REQUEST['orderby'] ) ? $_REQUEST['orderby'] : 'DESC';
	  	
	  	$loop = new \WP_Query( $params ); 
		$result=[];
		while ( $loop->have_posts() ) { $loop->the_post(); $result[] = $post; } 
	  	
		return $result;
		 
	}

	public static function delete_table( $id ) {
	
		global $wpdb;

	  	$wpdb->delete(
	    	"{$wpdb->prefix}posts",
	    	[ 'ID' => $id ],
	    	[ '%d' ]
	  	);
	
	}

	public static function record_count() {
		
		global $wpdb;

	  	$sql = "SELECT COUNT(*) FROM {$wpdb->prefix}posts WHERE post_type='wptb_tables' AND post_status<>'trash'";
		  
		return $wpdb->get_var( $sql );
 
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
		$delete_nonce = wp_create_nonce( 'wptb_delete_table' );
		  
		$table_title = $item->post_title;

		$title = ! empty( $table_title ) ? $table_title : __( '(no title)', 'wp-table-builder' );
		  
		$title = sprintf(
			'<a class="row-title" href="%s" title="%s"><strong>%s</strong></a>',
			add_query_arg(
				array(
					'table' => $item->ID,
				),
				admin_url( 'admin.php?page=wptb-builder' )
			),
			esc_html__( 'Edit This Table', 'wp-table-builder' ),
			$title
		);

	  	$actions = [
	    	'delete' => sprintf( '<a href="?page=%s&action=%s&table_id=%s&_wpnonce=%s">Delete</a>', esc_attr( $_REQUEST['page'] ), 'delete', absint( $item->ID ), $delete_nonce ),
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
	    	'<input type="checkbox" name="bulk-delete[]" value="%s" />', $item->ID
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
	  	$total_items  = self::record_count();

	  	$this->set_pagination_args( [
	    	'total_items' => $total_items, //WE have to calculate the total number of items
	    	'per_page'    => $per_page //WE have to determine how many items to show on a page
	  	] );

	  	$this->items = $this->get_tables( $per_page, $current_page );
	
	}

	public function process_bulk_action() {

		if ( 'delete' === $this->current_action() ) {
 
	    	$nonce = esc_attr( $_REQUEST['_wpnonce'] );

	    	if ( ! wp_verify_nonce( $nonce, 'wptb_delete_table' ) ) {
	      		die( 'Go get a life script kiddies' );
			} else {

	      		$this->delete_table( absint( $_GET['table_id'] ) );
	      	die('<script>window.location=window.location.href.split(\'?\')[0]+"?page=wptb-overview&success=1";</script>');
	      		exit;
	    	}

	  	}

	  	// If the delete bulk action is triggered
	  	if ( ( isset( $_POST['action'] ) && $_POST['action'] == 'bulk-delete' ) || ( isset( $_POST['action2'] ) && $_POST['action2'] == 'bulk-delete' ) ) {

	    	$delete_ids = esc_sql( $_POST['bulk-delete'] );

	    	// loop over the array of record IDs and delete them
	    	foreach ( $delete_ids as $id ) {
	      		$this->delete_table( $id );
	    	}

	      	die('<script>window.location=window.location.href.split(\'?\')[0]+"?page=wptb-overview&bulksuccess=1";</script>');
	    	exit;
	  	}
	}
}

$table = new WPTB_Listing(); 