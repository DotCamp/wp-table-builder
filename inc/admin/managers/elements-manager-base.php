<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder as NS;

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
abstract class Elements_Manager_Base {
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
    protected $_build_elements_name = [];

    /**
     * Init Elements.
     *
     * Initialize WP Table Builder Elements manager.
     *
     * @since 1.1.2
     * @access private
     */
    public function element_elements() {
        $this->_element_objects = [];


        foreach ( $this->_build_elements_name as $element_name ) {
            $object = $this->get_element_object( $element_name );

            $this->register_element_object( $object );

            $object->init_controls();
        }
    }

    /**
     * Element Object Create.
     *
     * Return Element Object. Include the necessary element files.
     *
     * @since 1.1.2
     * @access private
     */
    abstract protected function get_element_object( $element_name );

    /**
     * Register element object.
     *
     * Add a new element object to the list of registered element objects.
     *
     * @param WPTB_Element_Base_Object $element WP Table Builder element.
     *
     * @return true True if the element was registered.
     * @since 1.1.2
     * @access public
     *
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
     * @param string $element_name Optional. Element name. Default is null.
     *
     * @return WPTB_Element_Base_Object|WPTB_Element_Base_Object[]|null Registered element objects.
     * @since 1.1.2
     * @access public
     *
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
     * Render Elements scripts.
     *
     * @since 1.1.2
     * @access public
     */
    public function output_elements_scripts() {
        ?>
        <script type="text/javascript">
            var WPTB_ElementsScriptsLauncher = {};
        </script>
        <?php
        foreach ( $this->get_element_objects() as $element ) {
            if ( method_exists( $element, 'output_scripts' ) ) {
                $element->output_scripts();
            }
        }
    }
}