<?php

namespace WP_Table_Builder\Inc\Common\Traits;

/**
 * Trait Singleton_Trait
 *
 * PHP trait that will make any class singleton in functionality.
 * @package WP_Table_Builder\Inc\Common\Traits
 */
trait Singleton_Trait {

	/**
	 * Instance options
	 * @var mixed
	 */
	protected $class_options;

	/**
	 * Protected class instance
	 * @var
	 */
	protected static $instance = null;

	/**
	 * Singleton_Trait constructor.
	 */
	protected function __construct( $options ) {
		$this->class_options = $options;
	}

	/**
	 * Get defined class options.
	 * @return mixed class options
	 */
	public function get_class_options() {
		return $this->class_options;
	}

	/**
	 * Get class instance.
	 *
	 * @param array $options class options
	 *
	 * @return Object class instance
	 */
	public static function get_instance( $options = [], $class = null ) {
		if ( static::$instance === null ) {
			$class            = $class ? $class : __CLASS__;
			static::$instance = new $class( $options );
		}

		return static::$instance;
	}
}
