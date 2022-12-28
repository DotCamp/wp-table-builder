<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder\Inc\Admin\Views\Builder\Table_Element\Table_Setting_Element;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder Elements manager.
 *
 * WP Table Builder elements manager handler class is responsible for registering and
 * initializing all the supported WP Table Builder elements.
 *
 * @since 1.1.2
 */
class Table_Elements_Manager extends Elements_Manager_Base {
	/**
	 * Elements objects.
	 *
	 * Holds the list of all the element objects.
	 *
	 * @since 1.1.2
	 * @access protected
	 *
	 * @var WPTB_Element_Base_Object[]
	 */
	protected $_element_objects = null;

	/**
	 * Table Elements names array
	 *
	 * Hold the list of setting names which have table element
	 * @since 1.2.1
	 * @access protected
	 *
	 * @var array
	 */
	protected $_build_elements_name = [
		'table_setting',
		'table_cell_setting',
		'table_responsive_menu'
	];

	/**
	 * Element Object Create.
	 *
	 * Return Element Object. Include the necessary element files.
	 *
	 * @param $element_name
	 *
	 * @return mixed
	 * @since 1.1.2
	 * @access protected
	 */
	protected function get_element_object( $element_name ) {
		$class_name = ucfirst( $element_name ) . '_Element';

		$class_name = '\WP_Table_Builder\Inc\Admin\Views\Builder\Table_Element\\' . $class_name;

		return new $class_name();
	}

	/**
	 * Render Table Elements scripts.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function output_elements_scripts() {
		?>
        <script type="text/javascript">
            var WPTB_TableElementScriptsLauncher = {};
        </script>
		<?php
		foreach ( $this->get_element_objects() as $element ) {
			if ( method_exists( $element, 'output_scripts' ) ) {
				$element->output_scripts();
			}
		}
	}
}
