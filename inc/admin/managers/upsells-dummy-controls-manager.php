<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

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
	 * Add dummy controls to elements.
	 *
	 * @param Elements_Manager $elements_manager elements manager instance
	 *
	 * @return void
	 */
	public static function add_dummy_controls( $elements_manager ) {
		$element_controls          = $elements_manager->get_element_objects();
		$registered_dummy_controls = static::get_instance()->get_class_options()['dummy_controls'];
	}
}
