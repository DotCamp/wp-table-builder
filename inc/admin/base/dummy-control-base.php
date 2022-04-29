<?php

namespace WP_Table_Builder\Inc\Admin\Base;

use WP_Table_Builder\Inc\Admin\Controls\Control_Section_Group_Collapse;
use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Element_Base;

/**
 * Dummy control base.
 */
abstract class Dummy_Control_Base {

	/**
	 * Get control name.
	 * @return string control name
	 */
	abstract public function get_name();

	/**
	 * Control group label
	 * @return string label
	 */
	abstract public function get_label();

	/**
	 * Generate control section id.
	 *
	 * @param string $element_name element name
	 *
	 * @return string control section id
	 */
	protected function generate_control_section_id( $element_name ) {
		return join( '_', [ $element_name, $this->get_name(), 'controls_group' ] );
	}


	/**
	 * Get dummy controls for collapsable control section group.
	 * @return array controls
	 */
	abstract protected function get_section_controls();

	/**
	 * Add controls to target element.
	 *
	 * @param Element_Base $element target element
	 *
	 * @return void
	 */
	public function add_controls( $element ) {
		$section_controls = $this->get_section_controls();

		$this->add_controls_to_section( $section_controls, $element );
	}

	/**
	 * Add dummy controls to target element wrapped inside a collapsable control section group.
	 *
	 * @param array $controls controls array.
	 *
	 * @param Element_Base $element target element
	 *
	 * @return void
	 */
	protected function add_controls_to_section( $controls, $element ) {
		$control_section_id = $this->generate_control_section_id( $element->get_name() );

		Control_Section_Group_Collapse::add_section( $control_section_id, $this->get_label(), $controls, [
			$element,
			'add_control'
		] );
	}
}
