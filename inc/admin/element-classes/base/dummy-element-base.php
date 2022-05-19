<?php

namespace WP_Table_Builder\Inc\Admin\Element_Classes\Base;

use WP_Table_Builder\Inc\Admin\Managers\Elements_Manager;

/**
 * Class Dummy_Element_base
 *
 * Dummy table element base.
 * This base can be used to visualize table elements on builder left panel especially for displaying pro version related elements for normal version of the plugin.
 * @package WP_Table_Builder\Inc\Admin\Element_Classes\Base
 */
abstract class Dummy_Element_base extends Element_Base {

	/**
	 * Name for dummy element.
	 * @return string dummy name
	 */
	abstract public function dummy_name();

	/**
	 * Override element base object name function.
	 * @return string element base
	 */
	public function get_name() {
		return $this->dummy_name() . '_dummy';
	}

	/**
	 * Get type of element.
	 *
	 * This type changes according to which version (basic,pro) of the plugin this element belongs to. While basic elements are available in both versions, pro elements are only limited to pro version of the plugin.
	 * By default, if not overridden, element will be classified as basic.
	 *
	 * @return string type of element
	 */
	public function get_type() {
		return Elements_Manager::PRO;
	}
}
