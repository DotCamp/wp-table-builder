<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

// if called directly, abort
use WP_Table_Builder\Inc\Admin\Base\Static_Singleton_Base;
use WP_Table_Builder\Inc\Core\Init;
use function add_filter;

if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Data_Table_Manager.
 *
 * Manager for handling functionality related to data tables.
 *
 * @package WP_Table_Builder\Inc\Admin\Managers
 */
class Data_Table_Manager extends Static_Singleton_Base {
	/**
	 * Initialize static class.
	 */
	public static function init() {
		parent::init();

		// add data table data
		add_filter( 'wp-table-builder/filter/admin_data', [ __CLASS__, 'add_admin_data' ] );
	}

	/**
	 * Add data table related data to frontend script.
	 *
	 * @param array $admin_data admin data
	 *
	 * @return array admin data array
	 */
	public static function add_admin_data( $admin_data ) {
		$icon_manager = Init::instance()->get_icon_manager();
		$data_table   = [
			'icons' => [
				'csv'           => $icon_manager->get_icon( 'file-csv' ),
				'database'      => $icon_manager->get_icon( 'database' ),
				'wordpressPost' => $icon_manager->get_icon( 'wordpress-simple' ),
				'server' => $icon_manager->get_icon( 'server' ),
				'chevronRight' => $icon_manager->get_icon( 'chevron-right' ),
			],
			'proUrl' => 'https://wptablebuilder.com/'
		];

		$admin_data['dataTable'] = $data_table;

		return $admin_data;
	}
}
