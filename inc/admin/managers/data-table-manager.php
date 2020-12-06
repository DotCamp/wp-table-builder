<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder\Inc\Admin\Base\Static_Singleton_Base;
use WP_Table_Builder\Inc\Core\Init;
use function add_action;
use function add_filter;
use function add_post_meta;
use function get_post_meta;

// if called directly, abort
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

		add_action( 'wp-table-builder/new_table_saved', [ __CLASS__, 'table_saved' ], 10, 2 );
		add_action( 'wp-table-builder/table_edited', [ __CLASS__, 'table_saved' ], 10, 2 );

		add_filter( 'wp-table-builder/title_listing', [ __CLASS__, 'title_listing' ], 10, 2 );
	}

	/**
	 * Filter title of table on table listing menu.
	 *
	 * @param string $title title
	 * @param string $table_id table id
	 *
	 * @return string table title
	 */
	public static function title_listing( $title, $table_id ) {
		if ( static::is_data_table_enabled( $table_id ) ) {
			if ( filter_var( preg_match( '/^Table \(ID #\b.+\)$/', $title ), FILTER_VALIDATE_BOOLEAN ) === true ) {
				$title = preg_replace( '/^(Table)(.+)$/', 'DataTable$2', $title );
			}
			$prefix = '<span class="dashicons dashicons-database"></span>';

			return $prefix . ' ' . $title;
		}

		return $title;
	}

	/**
	 * Check if table is a data table.
	 *
	 * @param string $table_id table id
	 *
	 * @return bool data table or not
	 */
	public static function is_data_table_enabled( $table_id ) {
		$status = get_post_meta( $table_id, '_wptb_data_table_', true );

		return filter_var( $status, FILTER_VALIDATE_BOOLEAN ) === true;
	}

	/**
	 * Table saved/edited action hook callback.
	 *
	 * @param string $id post id
	 * @param object $params parameter object
	 */
	public static function table_saved( $id, $params ) {
		// add data table meta to post to indicate its table type
		if ( property_exists( $params, 'dataTable' ) ) {
			add_post_meta( $id, '_wptb_data_table_', 'true' );
		}

		if ( property_exists( $params, 'dataTableOptions' ) ) {
			add_post_meta( $id, '_wptb_data_table_options_', $params->dataTableOptions );
		}
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
			'icons'  => [
				'csv'                 => $icon_manager->get_icon( 'file-csv' ),
				'database'            => $icon_manager->get_icon( 'database' ),
				'wordpressPost'       => $icon_manager->get_icon( 'wordpress-simple' ),
				'server'              => $icon_manager->get_icon( 'server' ),
				'chevronRight'        => $icon_manager->get_icon( 'chevron-right' ),
				'exclamationTriangle' => $icon_manager->get_icon( 'exclamation-triangle' ),
				'handPointer'         => $icon_manager->get_icon( 'hand-pointer' ),
				'sortUp'              => $icon_manager->get_icon( 'sort-alpha-up' ),
				'cog'              => $icon_manager->get_icon( 'cog' ),
			],
			'proUrl' => 'https://wptablebuilder.com/',
		];

		$admin_data['dataTable'] = $data_table;

		return $admin_data;
	}
}
