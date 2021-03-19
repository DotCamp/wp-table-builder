<?php

namespace WP_Table_Builder\Inc\Admin\Classes;

use function get_post_meta;
use function get_the_title;
use function wp_insert_post;

// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Data_Object.
 *
 * Data object class for table data types.
 * @package WP_Table_Builder\Inc\Admin\Classes
 */
class Data_Object {
	/**
	 * WordPress custom post type name for data object.
	 */
	const WP_POST_TYPE_NAME = 'wptb-data-object';

	/**
	 * Data types.
	 */
	const DATA_TYPES = [ 'csv' ];

	/**
	 * Default arguments for data object.
	 * @var array
	 */
	private $default_args = [
		'id'       => null,
		'type'     => null,
		'content'  => [],
		'controls' => [],
		'title'    => '',
	];

	/**
	 * Meta key prefix for data object post type.
	 */
	const META_PREFIX = 'wptb_data_object';

	/**
	 * Arguments that will be used after object instantiation.
	 * @var array
	 */
	private $current_args;

	/**
	 * Data_Object constructor.
	 *
	 * @param array $args options to create data object
	 */
	public function __construct( $args ) {
		// merge supplied arguments with default ones
		$this->current_args = $this->merge_options( $this->default_args, $args );
	}

	/**
	 * Merge options according to the keys defined in base args.
	 *
	 * With this function no key will be merged if they don't have a similar one on base args.
	 *
	 * @param array $base base options
	 * @param array $supplied supplied options
	 *
	 * @return array merged options array
	 */
	private function merge_options( $base, $supplied ) {
		$base_array     = (array) $base;
		$supplied_array = (array) $supplied;

		return array_reduce( array_keys( $base ), function ( $carry, $item ) use ( $base_array, $supplied_array ) {
			$value = $base_array[ $item ];
			if ( isset( $supplied_array[ $item ] ) ) {
				$value = $supplied_array[ $item ];
			}

			$carry[ $item ] = $value;

			return $carry;
		}, [] );
	}

	/**
	 * Filter current data object args for post meta fields.
	 *
	 * @param string $key metal field key
	 *
	 * @return bool
	 */
	protected function filter_args_for_meta_callback( $key ) {
		return $key !== 'id';
	}

	/**
	 * Filter current data object arguments for meta input.
	 * @return array meta array
	 */
	private function filter_args_for_meta() {
		return array_filter( array_keys( $this->current_args ), [
			$this,
			'filter_args_for_meta_callback'
		], ARRAY_FILTER_USE_BOTH );
	}

	/**
	 * Update data object.
	 *
	 * @param array $args arguments array
	 *
	 * @return false|array update process status or false if an error occurred during update process
	 */
	public function update_object( $args = [] ) {
		$this->current_args = $this->merge_options( $this->current_args, $args );

		// if no type is defined for data object, return false
		if ( $this->get_type() === null ) {
			return false;
		}

		// filter out option fields for meta fields
		$meta_keys = $this->filter_args_for_meta();

		$post_args = [
			'post_title' => $this->current_args['title'],
			'post_type'  => self::WP_POST_TYPE_NAME,
			'ID'         => $this->current_args['id'],
			'meta_input' => $this->prepare_meta_input( $meta_keys )
		];

		$process_status = wp_insert_post( $post_args );

		// if status is 0, it means an error occurred, return false
		if ( $process_status === 0 ) {
			return false;
		}

		// update data object id
		$this->current_args['id'] = $process_status;

		return $process_status;
	}

	/**
	 * Reform meta key name.
	 *
	 * @param string $key key name
	 *
	 * @return string prepared meta key
	 */
	public final function get_meta_key( $key ) {
		return self::META_PREFIX . '_' . $key;
	}

	/**
	 * Prepare meta input array for custom post type.
	 *
	 * @param array $meta_keys meta key array
	 *
	 * @return array meta input array
	 */
	private function prepare_meta_input( $meta_keys ) {
		$context = $this;

		return array_reduce( $meta_keys, function ( $carry, $item ) use ( $context ) {
			$carry[ $context->get_meta_key( $item ) ] = $context->current_args[ $item ];

			return $carry;
		}, [] );
	}

	/**
	 * Get data object post id.
	 * @return null|int data object id
	 */
	public final function object_id() {
		return $this->current_args['id'];
	}

	/**
	 * Get data object post id.
	 * @return null|string data object type
	 */
	public final function get_type() {
		return $this->current_args['type'];
	}

	/**
	 * Reload current data object with saved values.
	 */
	private function reload_object_data() {
		$id = $this->object_id();

		if ( $id ) {
			$context                     = $this;
			$this->current_args['title'] = get_the_title( $id );
			$fetched_meta_values         = array_reduce( $this->filter_args_for_meta(), function ( $carry, $key ) use ( $id, $context ) {
				$carry[ $key ] = get_post_meta( $id, $context->get_meta_key( $key ), true );

				return $carry;
			}, [] );
			$this->current_args          = $this->merge_options( $this->current_args, $fetched_meta_values );
		}
	}

	/**
	 * Process object title.
	 */
	 function process_title() {
		if ( $this->current_args['title'] === '' && $this->object_id() !== null ) {
			$this->current_args['title'] = sprintf( '%s #%s', esc_html__( 'Data', 'wp-table-builder' ), $this->object_id() );
		}
	}

	/**
	 * Get data related to created object.
	 *
	 * @return array object data
	 */
	public function get_object_data() {
		$id = $this->object_id();
		if ( $id ) {
			// reload object data with saved ones
			$this->reload_object_data();
		}

		$this->process_title();

		return $this->current_args;
	}
}
