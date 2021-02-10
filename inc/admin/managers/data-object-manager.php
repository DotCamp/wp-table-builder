<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder\Inc\Admin\Classes\Data_Object;
use WP_Table_Builder\Inc\Common\Traits\Init_Once;
use function register_post_type;

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

	/**
	 * Initialize data object manger.
	 */
	public static function init() {
		if ( ! self::is_initialized() ) {
			static::register_data_object_post_type();
		}
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
}
