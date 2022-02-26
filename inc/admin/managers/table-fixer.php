<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_Table_Builder\Inc\Admin\Base\Manager_Base;
use WP_Table_Builder\Inc\Common\Factory\Fix_Factory;
use WP_Table_Builder\Inc\Common\Factory\Rest_Response_Factory;
use function add_action;
use function add_filter;
use function check_admin_referer;
use function current_user_can;
use function register_rest_route;
use function rest_ensure_response;
use function wp_create_nonce;

/**
 * Fixer for various corrupted and erroneous tables.
 */
class Table_Fixer extends Manager_Base {
	private $rest_namespace = 'wptb/v1';

	private $rest_route = 'table-fixer/fix';

	/**
	 * Function to be called during initialization process.
	 */
	protected function init_process() {
		add_filter( 'wp-table-builder/filter/settings_manager_frontend_data', [
			$this,
			'settings_manager_frontend_data'
		] );

		add_action( 'rest_api_init', [ $this, 'table_fixer_rest_init' ] );
	}

	/**
	 * Check and fix tables for corruption.
	 *
	 * @param array $table_ids table ids
	 *
	 * @return array array of table ids with fix status
	 */
	private function fix_tables( $table_ids ) {
		$status_report = [];

		foreach ( $table_ids as $id ) {
			array_map( function ( $fix_type ) use ( $id, &$status_report ) {
				$fix_status = Fix_Factory::make( $fix_type )->fix( $id );

				if ( !isset( $status_report[ $id ] ) ) {
					$status_report[ $id ] = false;
				}

				if ( $status_report[ $id ] === false ) {
					$status_report[ $id ] = $fix_status;
				}

			}, Fix_Factory::$available_fixes );
		}

		return $status_report;
	}

	/**
	 * Callback for rest fix operation.
	 *
	 * @param WP_REST_Request $request request object
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function rest_fix_callback( $request ) {
		$request_body = $request->get_json_params();

		if ( isset( $request_body['tableIds'] ) ) {
			$table_ids = $request_body['tableIds'];
			if ( ! empty( $table_ids ) ) {
				$fix_summary = $this->fix_tables( $table_ids );

				return rest_ensure_response( Rest_Response_Factory::generate_response( $fix_summary ) );
			}

			return rest_ensure_response( Rest_Response_Factory::generate_response( null, 401, 'invalid_post_body', esc_html__( 'no table ids found to operate on' ) ) );
		}

		return rest_ensure_response( Rest_Response_Factory::generate_response( null, 401, 'invalid_post_body', esc_html__( 'invalid post request body' ) ) );
	}

	/**
	 * Initialize rest endpoint for table fixer operations.
	 */
	public function table_fixer_rest_init() {
		register_rest_route( $this->rest_namespace, '/' . $this->rest_route, [
			'methods'             => 'POST',
			'callback'            => [ $this, 'rest_fix_callback' ],
			'permission_callback' => [ $this, 'rest_fix_permission_check' ]
		] );
	}

	/**
	 * Permission check for rest fix operations.
	 *
	 * @return bool permission status
	 */
	public function rest_fix_permission_check() {
		return current_user_can( Settings_Manager::ALLOWED_ROLE_META_CAP ) && check_admin_referer( $this->rest_route, 'nonce' );
	}

	/**
	 * Callback function for settings menu frontend data.
	 *
	 * @param array $settings_data settings menu frontend data
	 *
	 * @return array modified settings menu frontend data
	 */
	public function settings_manager_frontend_data( $settings_data ) {
		$settings_data['sectionsData']['tableFixer'] = [
			'label' => esc_html__( 'table fixer', 'wp-table-builder' )
		];

		$table_fixer_strings = [
			'fixTable'          => esc_html__( 'fix table', 'wp-table-builder' ),
			'fixTables'         => esc_html__( 'fix tables', 'wp-table-builder' ),
			'tablesFetched'     => esc_html__( 'tables fetched', 'wp-table-builder' ),
			'title'             => esc_html__( 'title', 'wp-table-builder' ),
			'modified'          => esc_html__( 'modified', 'wp-table-builder' ),
			'search'            => esc_html__( 'search', 'wp-table-builder' ),
			'disclaimerTitle'   => esc_html__( 'when to use', 'wp-table-builder' ),
			'disclaimerMessage' => esc_html__( 'Your tables might get corrupted by your browser addons. If you have any table with unexpected behaviour (cell edit disabled, etc) use this tool. If problem still persists, contact our support forums.', 'wp-table-builder' ),
		];

		$settings_data['strings'] = array_merge( $settings_data['strings'], $table_fixer_strings );

		$table_fixer_data = [
			'rest'     => [
				'restNonce' => wp_create_nonce( 'wp_rest' ),

			],
			'tableGet' => [
				'getUrl' => get_rest_url( null, '/wp/v2/wptb-tables' )
			],
			'fixPost'  => [
				'fixAction' => $this->rest_route,
				'fixNonce'  => wp_create_nonce( $this->rest_route ),
				'fixUrl'    => get_rest_url( null, $this->rest_namespace . '/' . $this->rest_route )
			]
		];

		$settings_data['data']['tableFixer'] = $table_fixer_data;

		return $settings_data;
	}
}

