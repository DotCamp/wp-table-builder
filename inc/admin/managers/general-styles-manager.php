<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

// if called directly, abort process
use function add_filter;

if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class General_Styles_Manager
 *
 * Manager for maintaining general styles for all tables.
 * @package WP_Table_Builder\Inc\Admin\Managers
 */
class General_Styles_Manager {

	/**
	 * Initialize general styles manager.
	 */
	public static function init() {
		add_filter( 'wp-table-builder/filter/settings_manager_frontend_data', [ __CLASS__, 'add_settings_menu_data' ] );
	}

	/**
	 * Add general styles related data to settings menu.
	 *
	 * @param array $settings_data settings data
	 *
	 * @return array settings data with general styles data
	 */
	public static function add_settings_menu_data( $settings_data ) {
		$settings_data['sectionsData']['generalStyles'] = [ 'label'    => esc_html__( 'general styles', 'wp-table-builder' ),
		                                                    'priority' => 10
		];

		return $settings_data;
	}


}
