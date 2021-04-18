<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Query;
use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Admin\Classes\Data_Object;
use WP_Table_Builder\Inc\Common\Helpers;
use WP_Table_Builder\Inc\Common\Traits\Ajax_Response;
use WP_Table_Builder\Inc\Common\Traits\Init_Once;
use WP_Table_Builder\Inc\Common\Traits\Singleton_Trait;
use function add_action;
use function add_submenu_page;
use function check_ajax_referer;
use function current_user_can;
use function esc_html__;
use function get_admin_url;
use function get_plugin_data;
use function register_post_type;
use function trailingslashit;
use function wp_create_nonce;
use function wp_localize_script;
use function wp_reset_query;

// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Data_Object_Manager.
 *
 * Manager for all data object related operations.
 * @package WP_Table_Builder\Inc\Admin\Managers
 */
class Data_Object_Manager {
	use Init_Once;

	use Ajax_Response;

	use Singleton_Trait;

	/**
	 * Table data admin menu hook id.
	 * @var string
	 */
	public static $table_data_menu_hook;

	/**
	 * Initialize data object manger.
	 */
	public static function init() {
		if ( ! self::is_initialized() ) {
			static::register_data_object_post_type();
			add_action( 'wptb_admin_menu', [ __CLASS__, 'register_table_data_menu' ] );
			add_action( 'admin_enqueue_scripts', [ __CLASS__, 'enqueue_menu_scripts' ] );
			add_action( 'wp_ajax_dataObjectContent', [ __CLASS__, 'ajax_data_object_content' ] );
			add_action( 'wp_ajax_dataObjectUpdate', [ __CLASS__, 'ajax_update_data_object' ] );
			add_action( 'wp_ajax_simpleDataObjects', [ __CLASS__, 'ajax_simple_data_objects' ] );
		}
	}

	/**
	 * Simple data objects ajax hook.
	 */
	public static function ajax_simple_data_objects() {
		if ( current_user_can( Settings_Manager::ALLOWED_ROLE_META_CAP ) && isset( $_GET['nonce'] ) && check_ajax_referer( 'simpleDataObjects', 'nonce', false ) ) {
			static::get_instance()->append_response_data( static::get_simple_data_objects(), 'simpleDataObjects' );
		} else {
			static::get_instance()->set_error( esc_html__( 'invalid request, please check your request and try again', 'wp-table-builder' ) );
		}

		static::get_instance()->send_json();
	}

	/**
	 * Update/create data object ajax hook.
	 */
	public static function ajax_update_data_object() {
		if ( current_user_can( Settings_Manager::ALLOWED_ROLE_META_CAP ) && isset( $_POST['nonce'] ) && check_ajax_referer( 'dataObjectUpdate', 'nonce', false ) && isset( $_POST['dataObject'] ) ) {
			$data_object = json_decode( base64_decode( $_POST['dataObject'] ) );

			$data_object_id = static::update_data_object( $data_object );

			if ( $data_object_id === false ) {
				static::get_instance()->set_error( esc_html__( 'an error ocurred while saving data object, please try again later', 'wp-table-builder' ) );
			} else {
				static::get_instance()->append_response_data( $data_object_id, 'id' );
			}
		} else {
			static::get_instance()->set_error( esc_html__( 'invalid request, please check your request and try again', 'wp-table-builder' ) );
		}

		static::get_instance()->send_json();
	}


	/**
	 * Get content of a data object.
	 */
	public static function ajax_data_object_content() {
		if ( current_user_can( Settings_Manager::ALLOWED_ROLE_META_CAP ) && isset( $_GET['nonce'] ) && check_ajax_referer( 'dataObjectContent', 'nonce', false ) && isset( $_GET['data_object_id'] ) ) {
			$data_object_id = $_GET['data_object_id'];

			if ( get_post_type( $data_object_id ) === Data_Object::WP_POST_TYPE_NAME ) {
				static::get_instance()->append_response_data( static::get_data_object( $data_object_id ), 'dataObject' );
			} else {
				static::get_instance()->set_error( esc_html__( 'invalid data object', 'wp-table-builder' ) );
			}
		} else {
			static::get_instance()->set_error( esc_html__( 'invalid request, please check your request and try again', 'wp-table-builder' ) );
		}

		static::get_instance()->send_json();
	}


	/**
	 * Enqueue admin menu scripts for table data menu.
	 *
	 * @param string $hook current admin menu hook
	 */
	public static function enqueue_menu_scripts( $hook ) {
		if ( $hook === static::$table_data_menu_hook ) {
			$script_path = 'inc/admin/js/WPTB_Table_Data_Menu.js';
			$css_path    = 'inc/admin/css/admin.css';

			// enqueue script
			$handler = Helpers::enqueue_file( $script_path, [], true );

			// enqueue styles
			Helpers::enqueue_file( $css_path );

			$plugin_data = get_plugin_data( NS\PLUGIN__FILE__ );
			$plugin_info = [
				'logo'           => trailingslashit( NS\WP_TABLE_BUILDER_URL ) . 'assets/images/wptb-logo.png',
				'pluginName'     => esc_html( $plugin_data['Name'] ),
				'pluginHomepage' => $plugin_data['PluginURI']
			];

			$strings = [
				'homepage'               => esc_html__( 'Homepage', 'wp-table-builder' ),
				'tableData'              => esc_html__( 'Table data', 'wp-table-builder' ),
				'data'                   => esc_html__( 'table data', 'wp-table-builder' ),
				'editor'                 => esc_html__( 'editor', 'wp-table-builder' ),
				'search'                 => esc_html__( 'search', 'wp-table-builder' ),
				'save'                   => esc_html__( 'save', 'wp-table-builder' ),
				'revert'                 => esc_html__( 'revert', 'wp-table-builder' ),
				'tableDataUpdateMessage' => esc_html__( 'table data updated', 'wp-table-builder' ),
				'new'                    => esc_html__( 'new', 'wp-table-builder' ),
				'yes'                    => esc_html__( 'yes', 'wp-table-builder' ),
				'no'                     => esc_html__( 'no', 'wp-table-builder' ),
				'sectionDirtyError'      => esc_html__( 'There are unsaved changes on your table data, continue and discard changes?', 'wp-table-builder' ),
				'noTableUsage'           => esc_html__( 'No table is using this data.', 'wp-table-builder' ),
				'tables'                 => esc_html__( 'tables', 'wp-table-builder' ),
				'options'                => esc_html__( 'Options', 'wp-table-builder' ),
				'firstRowHeader'         => esc_html__( 'First row as column names', 'wp-table-builder' ),
				'selectRowForNames'      => esc_html__( 'select a row for column names', 'wp-table-builder' ),
				'cancel'                 => esc_html__( 'cancel', 'wp-table-builder' ),
				'resetIndexRow'          => esc_html__( 'new column names row', 'wp-table-builder' ),
				'createNew'              => esc_html__( 'Create New', 'wp-table-builder' ),
				'noDataObjectMessage'    => esc_html__( 'No table data found.', 'wp-table-builder' ),
				'selectDataFromListing'  => esc_html__( 'Select a table data from listing', 'wp-table-builder' ),
				'or'                     => esc_html__( 'or', 'wp-table-builder' ),
			];

			$security = [
				'url'               => get_admin_url( null, 'admin-ajax.php' ),
				'adminUrl'          => get_admin_url( null, 'admin.php' ),
				'dataObjectContent' => static::generate_data_object_content_security_data(),
				'dataObjectUpdate'  => [
					'nonce'  => wp_create_nonce( 'dataObjectUpdate' ),
					'action' => 'dataObjectUpdate'
				],
				'simpleDataObjects' => static::generate_simple_data_object_security_data()
			];

			$client_data = [
				'pluginInfo'        => $plugin_info,
				'strings'           => $strings,
				'dataObjectsSimple' => static::get_simple_data_objects(),
				'security'          => $security
			];

			wp_localize_script( $handler, 'wptbTableDataMenu', $client_data );
		}
	}

	/**
	 * Generate security data related to simple data objects ajax endpoint.
	 * @return array security data
	 */
	public static function generate_simple_data_object_security_data() {
		return [
			'nonce'  => wp_create_nonce( 'simpleDataObjects' ),
			'action' => 'simpleDataObjects'
		];
	}

	/**
	 * Generate security data related to getting properties of a data object.
	 * @return array security data
	 */
	public static function generate_data_object_content_security_data() {
		return [
			'nonce'  => wp_create_nonce( 'dataObjectContent' ),
			'action' => 'dataObjectContent'
		];
	}

	/**
	 * Register admin submenu page for table data.
	 */
	public static function register_table_data_menu() {
		static::$table_data_menu_hook = add_submenu_page( 'wptb-overview', esc_html__( 'Table Data', 'wp-table-builder' ), esc_html__( 'Table Data', 'wp-table-builder' ), Helpers::wptb_get_capability_manage_options(), 'wptb-table-data', [
			__CLASS__,
			'render_table_data_menu'
		] );
	}

	/**
	 * Render table data menu to DOM.
	 */
	public static function render_table_data_menu() {
		echo '<div id="wptbTableDataMenuMount"></div>';
	}

	/**
	 * Register data object custom post type.
	 */
	private static function register_data_object_post_type() {
		$args = [
			'label'              => 'WPTB Data Object',
			'public'             => false,
			'exclude'            => true,
			'publicly_queryable' => false,
			'show_ui'            => false,
			'show_in_menu'       => false,
			'show_in_rest'       => false,
			'can_export'         => false,
			'supports'           => [ 'title', 'custom_fields' ],
			'rewrite'            => false,
		];

		register_post_type( Data_Object::WP_POST_TYPE_NAME, $args );
	}

	/**
	 * Update a data object.
	 *
	 * This function will both handle creation/update of a data object depending on supplied data object options.
	 *
	 * @param array $data_object_args data object options
	 *
	 * @return int id of created data object or 0 if an error occurred
	 */
	public static function update_data_object( $data_object_args ) {
		$data_object = new Data_Object( $data_object_args );

		return $data_object->update_object();
	}

	/**
	 * Get data object properties.
	 *
	 * @param int $id data object id
	 *
	 * @return array data object related properties
	 */
	public static function get_data_object( $id ) {
		$temp_data_object = new Data_Object( [ 'id' => $id ] );

		return $temp_data_object->get_object_data();
	}

	/**
	 * Get data object ids.
	 * @return array object ids.
	 */
	private static function get_simple_data_objects() {
		$query_args = [
			'post_type' => Data_Object::WP_POST_TYPE_NAME,
			'orderby'   => 'ID',
			'order'     => 'DESC'
		];

		$query        = new WP_Query( $query_args );
		$data_objects = $query->get_posts();

		// unset all disallowed properties to keep post object simple
		array_walk( $data_objects, function ( $data_object ) {
			$allowed_properties = [ 'ID', 'post_title', 'tables', 'type' ];


			$associated_tables_query_args = [
				'post_type'   => 'wptb-tables',
				'post_status' => 'draft',
				'meta_query'  => [
					[
						'key'     => Data_Table_Manager::TABLE_OBJECT_ID_META,
						'value'   => $data_object->ID,
						'compare' => 'EQUAL'
					]
				]
			];

			// get tables that are using this data object
			$associated_tables_query = new WP_Query( $associated_tables_query_args );
			$associated_tables       = array_reduce( $associated_tables_query->get_posts(), function ( $carry, $post ) {
				$formed_assoc_array = [
					'id'    => $post->ID,
					'title' => $post->post_title === '' ? sprintf( '%s #%s', esc_html__( 'Table', 'wp-table-builder' ), $post->ID ) : $post->post_title,
				];

				$carry[] = $formed_assoc_array;

				return $carry;
			}, [] );
			wp_reset_query();

			// add associated tables to simple data object
			$data_object->tables = $associated_tables;

			// add data object type
			$data_object->type = ( new Data_Object( [ 'id' => $data_object->ID ] ) )->get_object_data()['type'];

			foreach ( $data_object as $key => $value ) {
				if ( ! in_array( $key, $allowed_properties ) ) {
					unset( $data_object->$key );
				}

				// reform post title if empty
				if ( $key === 'post_title' ) {
					if ( empty( $value ) ) {
						$data_object->$key = sprintf( '%s #%s', esc_html__( 'Data', 'wp-table-builder' ), $data_object->ID );
					}
				}
			}
		} );

		wp_reset_query();

		return $data_objects;
	}
}
