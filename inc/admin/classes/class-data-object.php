<?php

namespace WP_Table_Builder\Inc\Admin\Classes;

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
		'id'      => null,
		'type'    => 'csv',
		'content' => null,
		'options' => []
	];

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
		$merged_options = array_reduce( array_keys( $base ), function ( $carry, $item ) use ( $base, $supplied ) {
			$value = $base[ $item ];
			if ( isset( $supplied[ $item ] ) ) {
				$value = $supplied[ $item ];
			}

			$carry[ $item ] = $value;

			return $carry;
		}, [] );

		// change type to csv for invalid data types
		if ( ! in_array( $merged_options['type'], self::DATA_TYPES ) ) {
			$merged_options['type'] = 'csv';
		}

		return $merged_options;
	}

	/**
	 * Update data object.
	 *
	 * @param array $args arguments array.
	 */
	public function update_object( $args = [] ) {
		$this->current_args = $this->merge_options($this->current_args, $args);
	}
}
