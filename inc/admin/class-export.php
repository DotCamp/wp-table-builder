<?php

namespace WP_Table_Builder\Inc\Admin;

use WP_Query;
use WP_Table_Builder\Inc\Admin\Managers\Settings_Manager;
use WP_Table_Builder\Inc\Common\Traits\Ajax_Response;
use WP_Table_Builder as NS;
use function add_action;
use function current_user_can;
use function wp_create_nonce;
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
	 * setting slug for class
	 * also used in ajax action
	 */
	const SETTING_SLUG = 'wptb_table_export';

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
		add_action( 'wp_ajax_' . self::SETTING_SLUG, [ $this, 'wptb_export_fetch_tables' ] );
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
		if ( current_user_can( Settings_Manager::ALLOWED_ROLE_META_CAP ) && check_ajax_referer( self::SETTING_SLUG, 'nonce', false ) ) {
			$this->set_message( esc_html__( 'success', $this->text_domain ) );

			$query_args = [
				'post_type'      => 'wptb-tables',
				'posts_per_page' => - 1,
			];

			$tables = new WP_Query( $query_args );

			$this->append_response_data($tables->get_posts() , 'userTables');

			wp_reset_postdata();

		} else {
			$this->set_error( esc_html__( 'you are not authorized to access this ajax endpoint', $this->text_domain ) );
		}

		$this->send_json();
	}

	/**
	 * Generate nonce for the ajax endpoint
	 * @return string nonce
	 */
	public function generate_nonce() {
		return wp_create_nonce( static::SETTING_SLUG );
	}
}
