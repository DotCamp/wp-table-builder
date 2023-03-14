<?php

namespace WP_Table_Builder\Inc\Admin;

use DOMDocument;
use DOMXPath;
use WP_Table_Builder\Inc\Admin\Managers\Settings_Manager;
use WP_Table_Builder\Inc\Common\Traits\Ajax_Response;
use WP_Table_Builder as NS;
use ZipArchive;
use function add_action;
use function current_user_can;
use function get_bloginfo;
use function get_plugin_data;
use function get_post;
use function get_post_meta;
use function get_the_title;
use function mb_convert_encoding;
use function request_filesystem_credentials;
use function wp_create_nonce;
use function wp_kses_stripslashes;
use function wp_reset_postdata;

if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Export
 *
 * Class for maintaining export functionality
 *
 * @package WP_Table_Builder\Inc\Admin
 */
class Export {

	// ajax response trait
	use Ajax_Response;

	/**
	 * singleton instance of the class
	 *
	 * @var null
	 */
	protected static $instance;

	/**
	 * table fetch ajax constant
	 */
	const EXPORT_FETCH_TABLES = 'wptb_table_export_fetch_tables';

	/**
	 * table export ajax constant
	 */
	const EXPORT_TABLES = 'wptb_table_export_main_export';

	/**
	 * nonce types
	 */
	const NONCE_TYPES = [ 'fetch' => self::EXPORT_FETCH_TABLES, 'export' => self::EXPORT_TABLES ];

	/**
	 * supported export types
	 *
	 * @var string[]
	 */
	protected $supported_export_types = [ 'XML' => 'xml', 'CSV' => 'csv' ];

	/**
	 * plugin text domain
	 * @var string
	 */
	private $text_domain = NS\PLUGIN_TEXT_DOMAIN;

	/**
	 * Export constructor.
	 *
	 * Private constructor for singleton nature of the class
	 *
	 */
	private function __construct() {
		add_action( 'wp_ajax_' . self::EXPORT_FETCH_TABLES, [ $this, 'wptb_export_fetch_tables' ] );
		add_action( 'wp_ajax_' . self::EXPORT_TABLES, [ $this, 'wptb_export_main_export' ] );
	}

	/**
	 * Get instanced singleton version of the export class
	 *
	 * @return Export instance of class
	 */
	public static function get_instance() {
		if ( ! isset( static::$instance ) ) {
			static::$instance = new Export();
		}

		return static::$instance;
	}

	/**
	 * Fetch user tables
	 */
	public function wptb_export_fetch_tables() {
		if ( current_user_can( Settings_Manager::ALLOWED_ROLE_META_CAP ) && check_ajax_referer( self::EXPORT_FETCH_TABLES, 'nonce', false ) ) {
			$this->set_message( esc_html__( 'success', 'wp-table-builder' ) );

			$tables = $this->get_wptb_tables( 'ID', 'post_title', 'post_date' );

			$this->append_response_data( $tables, 'userTables' );

		} else {
			$this->set_error( esc_html__( 'you are not authorized to access this ajax endpoint', 'wp-table-builder' ) );
		}

		$this->send_json();
	}

	/**
	 * Convert specific date fields in a post table to ISO8601 format
	 *
	 * @param array $post_object WordPress post table array
	 */
	private function date_to_iso8601( &$post_object ) {
		$date_fields = [ 'post_date', 'post_modified', 'post_date_gmt' ];

		foreach ( $date_fields as $field ) {
			if ( isset( $post_object[ $field ] ) ) {
				$post_object[ $field ] = date( 'c', strtotime( $post_object[ $field ] ) );
			}
		}
	}

	/**
	 * Export tables to frontend with a ajax response
	 */
	public function wptb_export_main_export() {
		if ( current_user_can( Settings_Manager::ALLOWED_ROLE_META_CAP ) && check_ajax_referer( self::EXPORT_TABLES, 'nonce', false ) && isset( $_POST['ids'] ) && isset( $_POST['export_type'] ) ) {
			$export_type = $_POST['export_type'];

			if ( ! in_array( $export_type, array_keys( $this->supported_export_types ) ) ) {
				$this->set_error( __( 'invalid export type', 'wp-table-builder' ) );

				return;
			}

			$table_ids = json_decode( wp_kses_stripslashes( $_POST['ids'] ) );

			// table id check to determine whether a zip or a single file will be sent
			if ( sizeof( $table_ids ) > 1 ) {
				$this->zip_archive_creation( $table_ids, $export_type );
			} else {
				$this->single_file_serve( $table_ids[0], $export_type );
			}

			// exit ajax output
			die();
		} else {
			$this->set_error( esc_html__( 'you are not authorized to access this ajax endpoint', 'wp-table-builder' ) );
		}

		$this->send_json();
	}

	/**
	 * Create and send a single file
	 *
	 * @param int $table_id table id
	 * @param string $export_type file type
	 */
	protected function single_file_serve( $table_id, $export_type ) {
		$file_extension = $this->supported_export_types[ $export_type ];

		$meta_value = call_user_func( [
			$this,
			"prepare_{$file_extension}_table"
		], $table_id );

		$filename = $this->prepare_file_name( $file_extension, $table_id );

		$this->shared_headers( $filename );

		echo $meta_value;
	}

	/**
	 * Create and send a zip archive with requested tables
	 *
	 * @param int[] $table_ids an array of table ids
	 * @param string $export_type file type for zipped files inside archive
	 */
	protected function zip_archive_creation( $table_ids, $export_type ) {

		// @deprecated
		// get WordPress filesystem credentials
		// using WordPress related filesystem methods to minimize the bugs I/O operations can cause on various server/hosting setups
//		$creds = request_filesystem_credentials( site_url() . '/wp-admin/', '', false, false, null );
//		if ( ! WP_Filesystem( $creds ) ) {
//			$this->set_error( esc_html__( 'you do not have write access to filesystem', 'wp-table-builder' ) );
//
//			return;
//		}

		WP_Filesystem( true );

		global $wp_filesystem;


		$upload_dir = NS\WP_TABLE_BUILDER_DIR . 'uploads';

		// create upload directory if not available
		if ( ! $wp_filesystem->is_dir( $upload_dir ) ) {
			$dir_create_status = $wp_filesystem->mkdir( $upload_dir );
			if ( ! $dir_create_status ) {
				$this->set_error( esc_html__( 'failed in creating temp directory for export zip file', 'wp-table-builder' ) );

				return;
			}
		}

		$temp_file_name = tempnam( $upload_dir, 'zip' );
		if ( ! class_exists( 'ZipArchive' ) ) {
			$this->set_error( esc_html__( 'your server do not support zip archives', 'wp-table-builder' ) );

			return;
		}

		// zip archive creation
		// creating the archive in memory may cause performance issues at some server/hosting setups, creating/deleting as a temp file seems like the best option
		$zip = new ZipArchive();
		$zip->open( $temp_file_name, ZipArchive::OVERWRITE );

		$file_extension = $this->supported_export_types[ $export_type ];
		foreach ( (array) $table_ids as $id ) {
			// calling this class's related function according to requested file type defined in the POST request
			$meta_value = call_user_func( [
				$this,
				"prepare_{$file_extension}_table"
			], $id );
			$zip->addFromString( $this->prepare_file_name( $file_extension, $id ), $meta_value );
		}

		$zip->close();

		$zip_content = $wp_filesystem->get_contents( $temp_file_name );

		// remove temp file
		$wp_filesystem->delete( $temp_file_name );

		$file_name = $this->prepare_file_name( 'zip' );

		// this header will be used in front-end to differentiate to parse the data as a glob or json
		$this->shared_headers( $file_name );

		echo $zip_content;
	}

	/**
	 * Shared html headers for octet-stream ajax response
	 *
	 * @param string $file_name filename to be added to the content-disposition header
	 */
	protected function shared_headers( $file_name ) {
		header( 'Content-Type: application/octet-stream' );
		header( "Content-Disposition: attachment; filename=\"{$file_name}\"" );
	}

	/**
	 * Prepare filename with its extension
	 *
	 * @param string $extension file extension
	 *
	 * @param int $id post id to get title of the post, if a negative integer is supplied, a unix timestamp value will be used
	 *
	 * @return string filename
	 */
	public function prepare_file_name( $extension, $id = - 1 ) {
		$file_base = '';
		if ( $id < 0 ) {
			$file_base = time();
		} else {
			$title     = get_the_title( $id );
			$file_base = $title === "" ? "Table{$id}" : $title;
		}

		return "{$file_base}.{$extension}";
	}

	/**
	 * Prepare individual table data as xml format.
	 *
	 * @param int $id post id
	 *
	 * @return string table content
	 */
	private function prepare_xml_table( $id ) {
		$content = get_post_meta( $id, '_wptb_content_', true );

		$content_to_return = '';

		$dom_handler = new DOMDocument();
		$status      = @$dom_handler->loadHTML( mb_convert_encoding( $content, 'HTML-ENTITIES', get_bloginfo( 'charset' ) ), LIBXML_NOERROR | LIBXML_NOWARNING | LIBXML_HTML_NODEFDTD | LIBXML_HTML_NOIMPLIED );

		if ( $status ) {
			$table = $dom_handler->documentElement;
			if ( $table->tagName === 'table' ) {
				$table->setAttribute( 'data-wptb-table-title', get_post( $id )->post_title );
				$table->setAttribute( 'data-wptb-export-version', get_plugin_data( NS\PLUGIN__FILE__ )['Version'] );
				$content_to_return = $dom_handler->saveHTML();
			}
		}

		return $content_to_return;
	}

	/**
	 * Prepare individual table data as csv format
	 *
	 * @param int $id post id
	 *
	 * @return mixed table data
	 */
	private function prepare_csv_table( $id ) {
		$table_html_content = get_post_meta( $id, '_wptb_content_', true );

		if ( function_exists( 'mb_convert_encoding' ) ) {
			$charset = get_bloginfo( 'charset' );

			$table_html_content = mb_convert_encoding( $table_html_content, 'HTML-ENTITIES', $charset );
		}

		$dom_table = new DOMDocument( '1.0', 'UTF-8' );
		@$dom_table->loadHTML( $table_html_content );

		$table_body     = $dom_table->getElementsByTagName( 'tbody' )[0];
		$top_level_rows = $table_body->getElementsByTagName( 'tr' );

		$row_text_content = [];

		for ( $i = 0; $i < sizeof( $top_level_rows ); $i ++ ) {
			$data_nodes = $top_level_rows[ $i ]->getElementsByTagName( 'td' );

			foreach ( $data_nodes as $node ) {
				$row_text_content[ $i ][] = $node->nodeValue;
			}
		}

		$row_parsed_text = '';

		foreach ( $row_text_content as $key => $values ) {
			if ( $key !== 0 ) {
				$row_parsed_text .= PHP_EOL;
			}

			$row_parsed_text .= implode( ',', $values );
		}

		return $row_parsed_text;
	}

	/**
	 * Get tables from database
	 *
	 * @param array $fields an array of post fields to be returned
	 *
	 * @return array post array
	 */
	private function get_wptb_tables( ...$fields ) {
		global $wpdb;

		$parsed_fields = implode( ',', $fields );

		$query = $wpdb->prepare( "SELECT {$parsed_fields} FROM {$wpdb->posts} WHERE post_type = %s", 'wptb-tables' );

		$tables = $wpdb->get_results( $query, ARRAY_A );

		array_walk( $tables, [ $this, 'date_to_iso8601' ] );

		return $tables;
	}

	/**
	 * Generate nonce for the ajax endpoint
	 *
	 * @param string $type nonce type, use this classes's available nonce enum property to avoid errors for invalid type arguments
	 *
	 * @return string nonce
	 */
	public function generate_nonce( $type ) {
		$nonce_type = self::NONCE_TYPES[ $type ];

		return wp_create_nonce( $nonce_type );
	}
}
