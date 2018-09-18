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
class WPTB_Listing  extends \WP_List_Table {

	public function __construct() {

		parent::__construct( [
			'singular' => __( 'WPTB Table', 'wptb' ), 
			'plural'   => __( 'WPTB Tables', 'wptb' ), 
			'ajax'     => false 

		] );

	}

	public static function get_tables( $per_page = 5, $page_number = 1 ) {

		global $wpdb;

	  $sql = "SELECT * FROM {$wpdb->prefix}posts WHERE post_type='wptb-tables'";


	  	if ( ! empty( $_REQUEST['orderby'] ) ) {
	    	$sql .= ' ORDER BY ' . esc_sql( $_REQUEST['orderby'] );
	    	$sql .= ! empty( $_REQUEST['order'] ) ? ' ' . esc_sql( $_REQUEST['order'] ) : ' ASC';
	  	}

	  	$sql .= " LIMIT $per_page";

	  	$sql .= ' OFFSET ' . ( $page_number - 1 ) * $per_page;

	  	$result = $wpdb->get_results( $sql, 'ARRAY_A' );

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

	  $sql = "SELECT COUNT(*) FROM {$wpdb->prefix}posts WHERE post_type='wptb-tables'";
  	return $wpdb->get_var( $sql );

 
	}

	public function no_items() {
	  _e( 'No tables available.', 'wptb' );
	}

	function column_name( $item ) {

		// create a nonce
	  	$delete_nonce = wp_create_nonce( 'wptb_delete_table' );

	  	$title = '<strong>' . $item['name'] . '</strong>';

	  	$actions = [
	    	'delete' => sprintf( '<a href="?page=%s&action=%s&customer=%s&_wpnonce=%s">Delete</a>', esc_attr( $_REQUEST['page'] ), 'delete', absint( $item['ID'] ), $delete_nonce ),

	    	'edit' => sprintf( '<a href="?page=wptb-builder&id=%d">Edit</a>',  absint( $item['ID'] ) )
	  	];

	  	return $title . $this->row_actions( $actions );
	
	}

	public function column_default( $item, $column_name ) {

	  switch ( $column_name ) {
	    case 'name':
	    case 'title':
	      return $item[ $column_name ];
	    default:
	      return print_r( $item, true ); //Show the whole array for troubleshooting purposes
	  }

	}

	function column_cb( $item ) {
	  	return sprintf(
	    	'<input type="checkbox" name="bulk-delete[]" value="%s" />', $item['ID']
	  	);
	}

	function get_columns() {
	  	$columns = [
	    	'cb'      => '<input type="checkbox" />',
	    	'id'    => __( 'ID', 'sp' ),
	    	'name' => __( 'Name', 'sp' ),
	    	'shortcode'    => __( 'Shortcode', 'sp' )
	  	];

	  	return $columns;
	}

	public function get_sortable_columns() {
	  	$sortable_columns = array(
	    	'Name' => array( 'name', true ),
	    	'ID' => array( 'ID', false )
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

	  	$this->_column_headers = $this->get_column_info();

	  	/** Process bulk action */
	  	$this->process_bulk_action();

	  	$per_page     = $this->get_items_per_page( 'tables_per_page', 10 );
	  	$current_page = $this->get_pagenum();
	  	$total_items  = self::record_count();

	  	$this->set_pagination_args( [
	    	'total_items' => $total_items, //WE have to calculate the total number of items
	    	'per_page'    => $per_page //WE have to determine how many items to show on a page
	  	] );

	  $this->items = self::get_tables( $per_page, $current_page );

	}

	public function process_bulk_action() {

	  	if ( 'delete' === $this->current_action() ) {
 
	    	$nonce = esc_attr( $_REQUEST['_wpnonce'] );

	    	if ( ! wp_verify_nonce( $nonce, 'sp_delete_customer' ) ) {
	      		die( 'Go get a life script kiddies' );
	    	} else {
	      		self::delete_customer( absint( $_GET['customer'] ) );
	      		wp_redirect( esc_url( add_query_arg() ) );
	      		exit;
	    	}

	  	}

	  	// If the delete bulk action is triggered
	  	if ( ( isset( $_POST['action'] ) && $_POST['action'] == 'bulk-delete' )
	       	|| ( isset( $_POST['action2'] ) && $_POST['action2'] == 'bulk-delete' )
	  	) {

	    	$delete_ids = esc_sql( $_POST['bulk-delete'] );

	    	// loop over the array of record IDs and delete them
	    	foreach ( $delete_ids as $id ) {
	      		self::delete_customer( $id );
	    	}

	    	wp_redirect( esc_url( add_query_arg() ) );
	    	exit;
	  	}
	}
}
