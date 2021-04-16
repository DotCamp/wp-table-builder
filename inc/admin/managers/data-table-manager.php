<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use DOMDocument;
use WP_Table_Builder\Inc\Admin\Classes\Data_Object;
use WP_Table_Builder\Inc\Common\Traits\Init_Once;
use WP_Table_Builder\Inc\Core\Init;
use function add_action;
use function add_filter;
use function add_post_meta;
use function esc_html__;
use function get_admin_url;
use function get_post_meta;
use function update_post_meta;
use WP_Table_Builder\Inc\Admin\Managers\Data_Object_Manager;

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
class Data_Table_Manager {
	use Init_Once;

	/**
	 * Table data custom WP post type name.
	 */
	const TABLE_DATA_POST_TYPE = 'wptb-table-data';

	/**
	 * Meta key of tables for table data post ids.
	 */
	const TABLE_OBJECT_ID_META = 'wptb_table_object_id';

	/**
	 * Initialize static class.
	 */
	public static function init() {
		if ( ! static::is_initialized() ) {
			// initialize data object manager
			Data_Object_Manager::init();

			add_filter( 'wp-table-builder/filter/admin_data', [ __CLASS__, 'add_admin_data' ] );
			add_action( 'wp-table-builder/new_table_saved', [ __CLASS__, 'table_saved' ], 10, 2 );
			add_action( 'wp-table-builder/table_edited', [ __CLASS__, 'table_saved' ], 10, 2 );
			add_filter( 'wp-table-builder/title_listing', [ __CLASS__, 'title_listing' ], 10, 2 );
			add_filter( 'wp-table-builder/filter/shortcode_table', [ __CLASS__, 'shortcode_table' ], 10, 2 );
		}
	}

	/**
	 * Html representation of table prepared for shortcode.
	 *
	 * Specific data object properties will be added to table data sets for front end use.
	 *
	 * @param string $table_html table html
	 * @param array $shortcode_args shortcode arguments
	 *
	 * @return false|string
	 */
	public static function shortcode_table( $table_html, $shortcode_args ) {
		$table_id = $shortcode_args['id'];

		// only start dom document modification if data table is enabled
		if ( static::is_data_table_enabled( $table_id ) ) {
			$dom_document = new DOMDocument();
			$dom_document->loadHTML( $table_html, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_NOWARNING | LIBXML_NOERROR );

			$table = $dom_document->getElementsByTagName( 'table' )->item( 0 );

			// get saved data table options on table
			$data_table_options_base_64 = $table->getAttribute( 'data-wptb-data-table-options' );
			$data_table_options         = json_decode( base64_decode( $data_table_options_base_64 ), true );

			// data object related to data table
			$data_object = static::get_table_data_object( $table_id );

			$content = static::generate_data( (array) $data_object['content'], $data_table_options['dataManager']['bindings'] );

			// add content to dataset
			$data_table_options['dataManager']['tempData'] = $content;
			$data_table_options['dataManager']['tempData'] = $content;

			/**
			 * Clear out unnecessary data for frontend.
			 */
			$data_table_options['dataManager']['tempData']['values']     = [];
			$data_table_options['dataManager']['tempData']['parsedData'] = [];

			$table->setAttribute( 'data-wptb-data-table-options', base64_encode( json_encode( $data_table_options ) ) );

			return $dom_document->saveHTML();
		}

		return $table_html;
	}

	/**
	 * Filter and manipulate data array according to supplied data table bindings.
	 *
	 * @param array $data data array
	 * @param array $bindings bindings array
	 *
	 * @return array filtered data array
	 */
	private static function generate_data( $data, $bindings ) {
		return Data_Table_Binding_Manager::generate_data( $data, $bindings );
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
		if ( property_exists( $params, 'wptbDataTable' ) ) {
			add_post_meta( $id, '_wptb_data_table_', 'true' );

			if ( property_exists( $params, 'wptbDataObject' ) ) {
				$parsed_data_object_args = json_decode( base64_decode( $params->wptbDataObject ) );

				// update/create data object related to data table with received options
				$update_status = Data_Object_Manager::update_data_object( $parsed_data_object_args );

				// return data table related response data to frontend
				add_filter( 'wp-table-builder/filter/saved_table_response_data', function ( $response_data ) use ( $update_status, $id ) {
					$data_table_response_data = [];
					if ( ! $update_status ) {
						$data_table_response_data['error'] = esc_html__( 'an error occurred while creating table data object, please try again later' );
					} else {
						// fill data table response data array with specific values helpful for frontend components
						$data_object                            = Data_Object_Manager::get_data_object( $update_status );
						$data_table_response_data['dataObject'] = $data_object;

						update_post_meta( $id, self::TABLE_OBJECT_ID_META, $data_object['id'] );
					}

					$response_data['dataTable'] = $data_table_response_data;

					return $response_data;
				} );
			}
		}
	}

	/**
	 * Get data object related to supplied table id.
	 *
	 * @param int $table_id table id
	 *
	 * @return array data object
	 */
	public static function get_table_data_object( $table_id ) {
		$data_object_id = get_post_meta( $table_id, self::TABLE_OBJECT_ID_META, true );

		return ( new Data_Object( [ 'id' => $data_object_id ] ) )->get_object_data();
	}

	/**
	 * Add data table related data to builder.
	 *
	 * @param array $admin_data admin data
	 *
	 * @return array admin data array
	 */
	public static function add_admin_data( $admin_data ) {
		$data_object = [];

		// if data table is enabled and editing a table, get data table related data object
		if ( isset( $_GET['table'] ) && static::is_data_table_enabled( $_GET['table'] ) ) {
			$table_id = $_GET['table'];

			// @deprecated
//			$data_object_id = get_post_meta( $table_id, self::TABLE_OBJECT_ID_META, true );
//			$data_object    = ( new Data_Object( [ 'id' => $data_object_id ] ) )->get_object_data();

			$data_object = static::get_table_data_object( $table_id );
		}

		$security = [
			'ajaxUrl'          => get_admin_url(null, 'admin-ajax.php'),
			'simpleDataObjects' => Data_Object_Manager::generate_simple_data_object_security_data()
		];

		$icon_manager = Init::instance()->get_icon_manager();
		$data_table   = [
			'iconList'   => $icon_manager->get_icon_list(),
			'icons'      => [
				'csv'                 => $icon_manager->get_icon( 'file-csv' ),
				'database'            => $icon_manager->get_icon( 'database' ),
				'wordpressPost'       => $icon_manager->get_icon( 'wordpress-simple' ),
				'server'              => $icon_manager->get_icon( 'server' ),
				'chevronRight'        => $icon_manager->get_icon( 'chevron-right' ),
				'exclamationTriangle' => $icon_manager->get_icon( 'exclamation-triangle' ),
				'handPointer'         => $icon_manager->get_icon( 'hand-pointer' ),
				'sortUp'              => $icon_manager->get_icon( 'sort-alpha-up' ),
				'cog'                 => $icon_manager->get_icon( 'cog' ),
				'existing'            => $icon_manager->get_icon( 'folder-open' ),
			],
			'proUrl'     => 'https://wptablebuilder.com/',
			'dataObject' => $data_object,
			'security'   => $security
		];

		$admin_data['dataTable'] = $data_table;

		return $admin_data;
	}
}
