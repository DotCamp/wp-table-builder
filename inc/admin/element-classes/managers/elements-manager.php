<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Managers;

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
class Elements_Manager {
    /**
	 * Elements objects.
	 *
	 * Holds the list of all the element objects.
	 *
	 * @since 1.1.2
	 * @access private
	 *
	 * @var WPTB_Element_Base_Object[]
	 */
	private $_element_objects = null;

	/**
	 * Init Elements.
	 *
	 * Initialize WP Table Builder Elements manager. Include all the the elements files.
	 *
	 * @since 1.1.2
	 * @access private
	*/
	private function element_elements() {
		$build_elements_filename = [
			'text',
            'button',
            'image'
		];

		$this->_element_objects = [];

		foreach ( $build_elements_filename as $element_filename ) {
			$class_name = ucfirst( $element_filename ) . '_Element';

			$class_name = '\WP_Table_Builder\Inc\Admin\Element_Classes\Elements\\' . $class_name;
            
            $object = new $class_name();

			$this->register_element_object( $object );
            
            $object->init_controls();
		}
	}
    
    /**
	 * Register element object.
	 *
	 * Add a new element object to the list of registered element objects.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @param WPTB_Element_Base_Object $element WP Table Builder element.
	 *
	 * @return true True if the element was registered.
	*/
	public function register_element_object( $element ) {
		$this->_element_objects[ $element->get_name() ] = $element;

		return true;
	}
    
    /**
	 * Get element objects.
	 *
	 * Returns the registered element objects list.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @param string $element_name Optional. Element name. Default is null.
	 *
	 * @return WPTB_Element_Base_Object|WPTB_Element_Base_Object[]|null Registered element objects.
	*/
	public function get_element_objects( $element_name = null ) {
		if ( is_null( $this->_element_objects ) ) {
			$this->element_elements();
		}

		if ( null !== $element_name ) {
			return isset( $this->_element_objects[ $element_name ] ) ? $this->_element_objects[ $element_name ] : null;
		}
		return $this->_element_objects;
	}
    
    /**
	 * Render Elements content.
	 *
	 * @since 1.1.2
	 * @access public
	*/
	public function output_elements_templates() {
		foreach ( $this->get_element_objects() as $element ) {
			$element->output_template();
		}
	}
}