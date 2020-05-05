<?php

namespace WP_Table_Builder\Inc\Admin;

use WP_Query;
use WP_Table_Builder\Inc\Admin\Managers\Settings_Manager;
use WP_Table_Builder\Inc\Common\Traits\Ajax_Response;
use WP_Table_Builder as NS;
use ZipArchive;
use function add_action;
use function current_user_can;
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

	const NONCE_TYPES = [ 'fetch' => self::EXPORT_FETCH_TABLES, 'export' => self::EXPORT_TABLES ];

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
			$this->set_message( esc_html__( 'success', $this->text_domain ) );


			$tables = $this->get_wptb_tables();
			$this->append_response_data( $tables, 'userTables' );

			wp_reset_postdata();

		} else {
			$this->set_error( esc_html__( 'you are not authorized to access this ajax endpoint', $this->text_domain ) );
		}

		$this->send_json();
	}

	public function wptb_export_main_export() {
		if ( current_user_can( Settings_Manager::ALLOWED_ROLE_META_CAP ) && check_ajax_referer( self::EXPORT_TABLES, 'nonce', false ) && isset( $_POST['ids'] ) ) {

			$creds = request_filesystem_credentials( site_url() . '/wp-admin/', '', false, false, null );
			if ( ! WP_Filesystem( $creds ) ) {
				$this->set_error( esc_html__( 'you do not have write access to filesystem', $this->text_domain ) );

				return;
			}

			global $wp_filesystem;

			$table_ids = json_decode( wp_kses_stripslashes( $_POST['ids'] ) );

			$upload_dir = NS\WP_TABLE_BUILDER_DIR . 'uploads';

			// create upload directory if not available
			if ( ! $wp_filesystem->is_dir( $upload_dir ) ) {
				$dir_create_status = $wp_filesystem->mkdir( $upload_dir );
				if ( ! $dir_create_status ) {
					$this->set_error( esc_html__( 'failed in creating temp directory for export zip file', $this->text_domain ) );

					return;
				}
			}

			$file_name = tempnam( $upload_dir, 'zip' );
			if ( ! class_exists( 'ZipArchive' ) ) {
				$this->set_error( esc_html__( 'you server do not support zip archieves', $this->text_domain ) );

				return;
			}

			$zip = new ZipArchive();
			$zip->open( $file_name, ZipArchive::OVERWRITE );

			foreach ( (array) $table_ids as $id ) {
				$meta_value = \get_post_meta( $id, '_wptb_content_', true );
				$zip->addFromString( "table#$id.xml", $meta_value );
			}

			$zip->close();

			$zip_content = $wp_filesystem->get_contents( $file_name );

			// remove temp file
			$wp_filesystem->delete( $file_name );

			header( 'Content-Type: application/octet-stream' );
			echo $zip_content;

			die();
		} else {
			$this->set_error( esc_html__( 'you are not authorized to access this ajax endpoint', $this->text_domain ) );
		}

		$this->send_json();
	}

	private function get_wptb_tables() {
		$query_args = [
			'post_type'      => 'wptb-tables',
			'posts_per_page' => - 1,
		];

		$tables = new WP_Query( $query_args );

		return $tables->get_posts();
	}

	/**
	 * Generate nonce for the ajax endpoint
	 * @return string nonce
	 */
	public function generate_nonce( $type ) {
		$nonce_type = self::NONCE_TYPES[ $type ];

		return wp_create_nonce( $nonce_type );
	}
}
