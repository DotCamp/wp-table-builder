<?php

namespace WP_Table_Builder\Inc\Admin\Base;

// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Static_Singleton_Base.
 *
 * Abstract base class for static uses where classes should be initialized only once.
 * @package WP_Table_Builder\Inc\Admin\Base
 */
abstract class Static_Singleton_Base {
	/**
	 * Is static class initialized or not
	 * @var bool
	 */
	protected static $initialized = false;

	/**
	 * Initialize static class.
	 */
	public static function init() {
		if ( ! static::$initialized ) {
			static::$initialized = true;
		} else {
			exit( 'static class already initialized' );
		}
	}
}