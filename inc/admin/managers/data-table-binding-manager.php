<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

// if called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Data_Table_Binding_Manager.
 *
 * This class will be responsible for preparing data tables according to their binding relations.
 *
 * @package WP_Table_Builder\Inc\Admin\Managers
 */
class Data_Table_Binding_Manager {

	/**
	 * Class mappings for binding mode.
	 * @var array
	 */
	private static $binding_mode_class_mappings = [
		'none'     => '\WP_Table_Builder\Inc\Admin\Classes\Data_Table_Auto_Binding',
		'auto'     => '\WP_Table_Builder\Inc\Admin\Classes\Data_Table_Auto_Binding',
		'operator' => '\WP_Table_Builder\Inc\Admin\Classes\Data_Table_Operator_Binding',
	];

	/**
	 * Get binding mode of row binding.
	 *
	 * @param array $row_binding row binding
	 *
	 * @return string row binding mode
	 */
	private static function get_binding_mode( $row_binding ) {
		return $row_binding['mode'];
	}

	/**
	 * Get associated mode class.
	 *
	 * This function will return 'auto' mode class as default if supplied mode is not valid.
	 *
	 * @param string $mode mode name
	 *
	 * @return string mode class name
	 */
	private static function get_mode_class( $mode ) {
		$final_mode = 'auto';

		if ( in_array( $mode, array_keys( static::$binding_mode_class_mappings ) ) ) {
			$final_mode = $mode;
		}

		return static::$binding_mode_class_mappings[ $final_mode ];
	}

	/**
	 * Generate minimal amount of table data according to its bindings.
	 *
	 * @param array $data table data
	 * @param array $bindings table bindings
	 *
	 * @return array generated data
	 */
	public static function generate_data( $data, $bindings ) {
		$row_bindings = $bindings['row'];

		$generated_data = array_reduce( array_keys( $row_bindings ), function ( $carry, $key ) use ( $row_bindings, $data ) {
			$binding_options = (array) $row_bindings[ $key ];
			$mode_class      = static::get_mode_class( $binding_options['mode'] );

			$mode_instance = new $mode_class( ( (array) $data['parsedData'] )['values'], $binding_options );

			$generated_row_data = $mode_instance->generate_data();

			// filter generated array so that already included row values will not end up on final result
			$filtered_generated_data = array_filter( $generated_row_data, function ( $row_data ) use ( $carry ) {
				return ! in_array( $row_data, $carry );
			} );

			return array_merge( $carry, $filtered_generated_data );
		}, [] );

		$data['parsedData']->values = $generated_data;

		return $data;
	}
}
