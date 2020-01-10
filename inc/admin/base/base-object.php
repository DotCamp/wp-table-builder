<?php
namespace WP_Table_Builder\Inc\Admin\Base;
use WP_Table_Builder\Inc\Core\Init as Init;
use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}


/**
 * WP Table Builder Base Object.
 *
 * @since 1.1.2
 * @abstract
 */
abstract class Base_Object {
    
    /**
	 * Get element name.
	 *
	 * Retrieve the element name.
	 *
	 * @since 1.1.2
	 * @access public
	 * @abstract
	 *
	 * @return string The name.
	 */
	abstract public function get_name();
    
    /**
	 * Get unique name.
	 *
	 * Some classes need to use unique names, this method allows you to create
	 * them. By default it returns the regular name.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Unique name.
	 */
	public function get_unique_name() {
		return $this->get_name();
	}
    
    /**
	 * Get element title.
	 *
	 * Retrieve the element title.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string element title.
	 */
	public function get_title() {
		return '';
	}
}