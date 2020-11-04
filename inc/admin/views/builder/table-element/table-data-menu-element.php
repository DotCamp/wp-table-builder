<?php

namespace WP_Table_Builder\Inc\Admin\Views\Builder\Table_Element;

use WP_Table_Builder\Inc\Admin\Base\Element_Base_Object;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager;
use WP_Table_Builder as NS;

// If called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Table_Data_Menu_Element.
 *
 * Menu element for data tables.
 * @package WP_Table_Builder\Inc\Admin\Views\Builder\Table_Element
 */
class Table_Data_Menu_Element extends Element_Base_Object {

	/**
	 * Get element name.
	 *
	 * Retrieve the element name.
	 *
	 * @return string The name.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	public function get_name() {
		return 'data_table_menu';
	}

	/**
	 * Register controls.
	 *
	 * Used to add new controls group to stack
	 *
	 * @since 1.1.2
	 * @access protected
	 */
	protected function _register_controls() {
		$this->setDefaultControlArg( 'elementOptionsGroupId', 'table-datatable-group' );
		$this->setDefaultControlArg( 'elementOptionClass', 'wptb-element-option' );

		$this->add_control( 'serverDataTableData', [
			'type'    => Controls_Manager::DATA_MULE,
			'dataId'  => 'serverDataTableData',
			'dataObj' => [
				'test' => 'test'
			]
		] );
	}

	/**
	 * Include file with js script for element
	 *
	 * @since 1.1.2
	 * @access protected
	 */
	public function element_script() {
		return wp_normalize_path( NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/table-element-scripts/table-responsive-menu.js' );
	}

}