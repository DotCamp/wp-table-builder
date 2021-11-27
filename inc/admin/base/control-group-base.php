<?php

namespace WP_Table_Builder\Inc\Admin\Base;

// if called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Base class for control grouping.
 */
abstract class Control_Group_Base {

	/**
	 * Add controls in batch.
	 *
	 * @param array $controls controls to add
	 * @param callable $control_call callable to add controls
	 * @param integer $control_pos position to add controls
	 */
	protected static function control_batch_add( $controls, $control_call, $control_pos = 0 ) {
		foreach ( $controls as $control_id => $control_args ) {
			if ( is_array( $control_args ) ) {
				if ( array_key_exists( 'control_pos', $control_args ) ) {
					$control_pos = $control_args['control_pos'];
				}
				if ( array_key_exists( 'control_args', $control_args ) ) {
					$control_args = $control_args['control_args'];
				}
			}
			call_user_func( $control_call, $control_id, $control_args, $control_pos );
		}
	}

}
