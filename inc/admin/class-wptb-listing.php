<?php

namespace WP_Table_Builder\Inc\Admin;


use WP_List_Table;
use WP_Query;
use WP_Table_Builder\Inc\Core\Init;
use function apply_filters;
use function wp_reset_postdata;

if ( ! class_exists( 'WP_List_Table' ) ) {
	die( 'NOT?' );
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
class WPTB_Listing extends WP_List_Table {

	public function __construct() {

		parent::__construct( [
			'singular' => __( 'WPTB Table', 'wp-table-builder' ),
			'plural'   => __( 'WPTB Tables', 'wp-table-builder' ),
			'ajax'     => false
		] );
	}

	protected function get_views() {
		$count        = self::record_count( 10, '' );
		$status_links = array(
			"all" => __( '<a href="' . esc_url( admin_url( 'admin.php?page=wptb-overview' ) ) . '">' .
			             'All ' .
			             '<span class="count">(' . $count . ')</span></a>', 'wp-table-builde' )
		);

		return $status_links;
	}

	public static function get_tables( $search_text, $per_page = 5, $page_number = 1, $current_user = false ) {

		global $wpdb, $post;

		$params = array( 'post_type' => 'wptb-tables', 'posts_per_page' => $per_page, 'paged' => $page_number );

		if ( $search_text ) {
			$params['s'] = $search_text;
		}

		$params['orderby'] = isset( $_REQUEST['orderby'] ) && ! empty( sanitize_text_field( $_REQUEST['orderby'] ) ) ? sanitize_text_field( $_REQUEST['orderby'] ) : 'date';
		$params['order']   = isset( $_REQUEST['order'] ) && ! empty( sanitize_text_field( $_REQUEST['order'] ) ) ? sanitize_text_field( $_REQUEST['order'] ) : 'DESC';

		if ( $current_user ) {
			$params['author'] = get_current_user_id();
		}

		$params = apply_filters( 'wp-table-builder/get_tables_args', $params );

		$loop   = new WP_Query( $params );
		$result = [];
		while ( $loop->have_posts() ) {
			$loop->the_post();
			$result[] = $post;
		}

		if ( ! empty( $result ) ) {
			wp_reset_postdata();
		}

		return $result;
	}

	public static function duplicate_table( $id ) {

		global $wpdb;

		$post = get_post( $id );

		if ( $post ) {
			$id_new = wp_insert_post( [
				'post_title'   => sanitize_text_field( $post->post_title ),
				'post_content' => '',
				'post_type'    => 'wptb-tables',
				'post_status'  => 'draft'
			] );
			$table  = get_post_meta( absint( $id ), '_wptb_content_', true );

			$table_new = add_post_meta( $id_new, '_wptb_content_', $table );

			if ( $id_new && $table_new ) {
				wp_update_post( [
					'ID'           => $id_new,
					'post_title'   => str_replace( ' (ID #' . $id . ')', '', get_the_title( $id_new ) . ' (ID #' . $id_new . ')' ),
					'post_content' => '',
					'post_type'    => 'wptb-tables',
					'post_status'  => 'draft'
				] );

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

	public static function record_count( $per_page, $search_text, $current_user = false ) {

		global $wpdb, $post;

		$params = array( 'post_type' => 'wptb-tables', 'posts_per_page' => $per_page );

		$params = apply_filters( 'wp-table-builder/record_count', $params );

		if ( $search_text ) {
			$params['s'] = $search_text;
		}

		if ( $current_user ) {
			$params['author'] = get_current_user_id();
		}

		$params['orderby'] = isset( $_REQUEST['orderby'] ) && ! empty( sanitize_text_field( $_REQUEST['orderby'] ) ) ? sanitize_text_field( $_REQUEST['orderby'] ) : 'date';
		$params['order']   = isset( $_REQUEST['order'] ) && ! empty( sanitize_text_field( $_REQUEST['order'] ) ) ? sanitize_text_field( $_REQUEST['order'] ) : 'DESC';

		$loop = new WP_Query( $params );

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

		// title listing filter hook
		$title = apply_filters( 'wp-table-builder/title_listing', $title, $item->ID );

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
				'p'         => absint( $item->ID ),
				'_wpnonce'  => $nonce,
			),
			home_url()
		);

		$server_request_url = remove_query_arg( '_wp_http_referer', $_SERVER['REQUEST_URI'] );
		$server_request_url = remove_query_arg( '_wpnonce', $server_request_url );
		$server_request_url = remove_query_arg( 'action', $server_request_url );
		$server_request_url = remove_query_arg( 'table_id', $server_request_url );
		$query              = parse_url( $server_request_url, PHP_URL_QUERY );

		$actions = [
			'edit'      => sprintf( '<a href="?page=wptb-builder&table=%d">Edit</a>', absint( $item->ID ) ),
			'duplicate' => '<a href="?' . $query . sprintf( '&action=%s&table_id=%s&_wpnonce=%s', 'duplicate', absint( $item->ID ), $nonce ) . '">Duplicate</a>',
			'preview_'  => sprintf( '<a href="%s" target="_blank">Preview</a>', $wptb_preview_button_url ),
			'delete'    => '<a href="?' . $query . sprintf( '&action=%s&table_id=%s&_wpnonce=%s', 'delete', absint( $item->ID ), $nonce ) . '">Delete</a>'
		];

		return $title . $this->row_actions( $actions );

	}

	/**
	 * Get html representation of shortcode column item.
	 *
	 * @param integer $item_id table id
	 *
	 * @return string shortcode listing html
	 */
	private function get_shortcode_listing_html( $item_id ) {
		ob_start();

		?>
        <div class="wptb-main-shortcode-div">
            <div class="wptb-listing-shortcode-inner-wrap">
                <div class="wptb-listing-shortcode-raw">[wptb id=<?php echo esc_html( $item_id ); ?>]
                </div>
                <div data-wptb-copy-status="false" class="wptb-listing-shortcode-icon-wrapper"
                     title="<?php esc_attr_e( 'copy', 'wp-table-builder' ); ?>">
                    <div class="wptb-listing-shortcode-copy-icon">
						<?php
						Init::instance()->get_icon_manager()->get_icon( 'clipboard', true );
						?>
                    </div>
                    <div class="wptb-listing-shortcode-success-icon"
                         title="<?php esc_attr_e( 'copied', 'wp-table-builder' ); ?>">
						<?php
						Init::instance()->get_icon_manager()->get_icon( 'clipboard-check', true );
						?>
                    </div>
                </div>
            </div>
        </div>
		<?php

		return ob_get_clean();
	}

	public function column_default( $item, $column_name ) {

		switch ( $column_name ) {
			case 'id':
				return $item->ID;
			case 'shortcode':
				$shortcode = $this->get_shortcode_listing_html( $item->ID );

				return apply_filters( 'wp-table-builder/shortcode_listing', $shortcode, $item->ID );
			case 'created':
				return get_the_date( '', $item->ID );
			default:
				return apply_filters( 'wp-table-builder/filter/listing_column_value_' . $column_name, '', $item );
		}

	}

	function column_cb( $item ) {

		return sprintf(
			'<input type="checkbox" name="bulk-delete[]" value="%s" />', absint( $item->ID )
		);

	}

	function get_columns() {

		$columns = [
			'cb'        => '<input type="checkbox" />',
			'name'      => esc_html__( 'Title', 'wp-table-builder' ),
			'shortcode' => esc_html__( 'Shortcode', 'wp-table-builder' ),
			'created'   => esc_html__( 'Created', 'wp-table-builder' ),
			'id'        => esc_html__( 'ID', 'wp-table-builder' )
		];

		return apply_filters( 'wptb_table_list_columns', $columns );

	}

	public function get_sortable_columns() {
		return [
			'name'    => [ 'title', 'asc' ],
			'id'      => [ 'ID', 'asc' ],
			'created' => [ 'post_date', 'asc' ],
		];
	}

	public function get_bulk_actions() {

		$actions = [
			'bulk-delete' => 'Delete'
		];

		return $actions;

	}

	public function prepare_items() {

		$columns               = $this->get_columns();
		$hidden                = array();
		$sortable              = $this->get_sortable_columns();
		$this->_column_headers = array( $columns, $hidden, $sortable );

		/** Process bulk action */
		$this->process_bulk_action();

		$per_page     = $this->get_items_per_page( 'tables_per_page', 10 );
		$current_page = $this->get_pagenum();

		// option check to limit users to their own tables
		$current_user = filter_var( Init::instance()->settings_manager->get_option_value( 'restrict_users_to_their_tables' ), FILTER_VALIDATE_BOOLEAN );

		$search_text = '';
		if ( isset( $_REQUEST['s'] ) && ! empty( $_REQUEST['s'] ) ) {
			$search_text = sanitize_text_field( $_REQUEST['s'] );
		}
		$total_items = self::record_count( $per_page, $search_text, $current_user );

		$this->set_pagination_args( [
			'total_items' => $total_items, //WE have to calculate the total number of items
			'per_page'    => $per_page //WE have to determine how many items to show on a page
		] );
		$this->items = $this->get_tables( $search_text, $per_page, $current_page, $current_user );
	}

	public function request_url_clear() {
		$_SERVER['REQUEST_URI'] = remove_query_arg( '_wp_http_referer', $_SERVER['REQUEST_URI'] );
		$_SERVER['REQUEST_URI'] = remove_query_arg( 'action', $_SERVER['REQUEST_URI'] );
		$_SERVER['REQUEST_URI'] = remove_query_arg( 'action2', $_SERVER['REQUEST_URI'] );
		$_SERVER['REQUEST_URI'] = remove_query_arg( 'table_id', $_SERVER['REQUEST_URI'] );
		$_SERVER['REQUEST_URI'] = remove_query_arg( 'bulk-delete', $_SERVER['REQUEST_URI'] );
	}

	public function process_bulk_action() {

		$nonce = isset( $_REQUEST['_wpnonce'] ) && esc_attr( $_REQUEST['_wpnonce'] ) ? esc_attr( $_REQUEST['_wpnonce'] ) : '';


		if ( 'duplicate' === $this->current_action() ) {

			if ( ! wp_verify_nonce( $nonce, 'wptb_nonce_table' ) ) {
				die( 'Go get a life script kiddies' );
			} else {
				$this->duplicate_table( absint( $_GET['table_id'] ) );
				?>
                <div class="notice notice-success is-dismissible">
                    <p><?php esc_html_e( 'Table duplicate successfully.', 'wp-table-builder' ); ?></p>
                </div>
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
				<?php
			}

		}

		// If the delete bulk action is triggered
		if ( ( isset( $_REQUEST['action'] ) && sanitize_text_field( $_REQUEST['action'] ) == 'bulk-delete' ) ||
		     ( isset( $_REQUEST['action2'] ) && sanitize_text_field( $_REQUEST['action2'] ) == 'bulk-delete' ) ) {

			if ( ! wp_verify_nonce( $nonce, 'bulk-' . $this->_args['plural'] ) ) {
				die( 'Go get a life script kiddies' );
			} else {
				$delete_ids = esc_sql( $_REQUEST['bulk-delete'] );

				// loop over the array of record IDs and delete them
				foreach ( $delete_ids as $id ) {
					$this->delete_table( absint( $id ) );
				}

				?>
                <div class="notice notice-success is-dismissible">
                    <p><?php esc_html_e( 'Bulk Delete Performed Successfully.', 'wp-table-builder' ); ?></p>
                </div>
				<?php
			}
		}
		$this->request_url_clear();
		?>
        <script>
            // with sub-folder WordPress installations, this function adding extra invalid url paths to browser history, thus changing all the links that formats themselves according to current url. since the url it created is invalid, most of the links on the page become invalid and broken too.
            // @deprecated
            //window.history.pushState( null, null, "<?php //echo home_url() . $_SERVER['REQUEST_URI']; ?>//" );
        </script>
		<?php
	}
}

$table = new WPTB_Listing();
