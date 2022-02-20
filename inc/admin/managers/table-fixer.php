<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder\Inc\Admin\Base\Manager_Base;
use function add_filter;
use function wp_create_nonce;

/**
 * Fixer for various corrupted and erroneous tables.
 */
class Table_Fixer extends Manager_Base {

	/**
	 * Function to be called during initialization process.
	 */
	protected function init_process() {
		add_filter( 'wp-table-builder/filter/settings_manager_frontend_data', [
			$this,
			'settings_manager_frontend_data'
		] );
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
			'fixTable'      => esc_html__( 'fix table', 'wp-table-builder' ),
			'fixTables'     => esc_html__( 'fix tables', 'wp-table-builder' ),
			'tablesFetched' => esc_html__( 'tables fetched', 'wp-table-builder' ),
		];

		$settings_data['strings'] = array_merge( $settings_data['strings'], $table_fixer_strings );

		$table_fixer_data = [
			'restNonce' => wp_create_nonce( 'wp_rest' ),
			'restUrl'   => get_rest_url( null, '/wp/v2/wptb-tables' )
		];

		$settings_data['data']['tableFixer'] = $table_fixer_data;


		return $settings_data;
	}
}

