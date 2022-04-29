<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder\Inc\Admin\Base\Dummy_Control_Base;
use WP_Table_Builder\Inc\Admin\Base\Manager_Base;

/**
 * Manager responsible for dummy control operations.
 */
class Upsells_Dummy_Controls_Manager extends Manager_Base {

	/**
	 * Function to be called during initialization process.
	 */
	protected function init_process() {
		add_action( 'wp-table-builder/elements_registered', [ __CLASS__, 'add_dummy_controls' ], 10, 1 );
	}

	/**
	 * Get dummy control instance.
	 *
	 * @param string $name control name
	 *
	 * @return Dummy_Control_Base control instance
	 */
	private static function get_dummy_control_instance( $name ) {
		$compatible_dummy_control_class_name = implode( '_', array_map( 'ucfirst', explode( '_', $name ) ) );

		$class_namespace = '\WP_Table_Builder\Inc\Admin\Controls\Dummy_Controls\\' . $compatible_dummy_control_class_name;

		return new $class_namespace();
	}

	/**
	 * Add dummy controls to elements.
	 *
	 * @param Elements_Manager $elements_manager elements manager instance
	 *
	 * @return void
	 */
	public static function add_dummy_controls( $elements_manager ) {
		$element_controls          = $elements_manager->get_element_objects();
		$registered_dummy_controls = static::get_instance()->get_class_options()['dummy_controls'];

		foreach ( $element_controls as $element ) {
			foreach ( $registered_dummy_controls as $control_name ) {
				$control_instance = static::get_dummy_control_instance($control_name);

				if ( $control_instance instanceof Dummy_Control_Base ) {
					$control_instance->add_controls( $element );
				}
			}

		}
	}
}
