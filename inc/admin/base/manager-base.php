<?php

namespace WP_Table_Builder\Inc\Admin\Base;

use WP_Table_Builder\Inc\Common\Traits\Singleton_Trait;

/**
 * if called directly, abort process.
 */
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Manager base.
 */
abstract class Manager_Base {
	use Singleton_Trait;

	/**
	 * Class initialization status.
	 * @var bool
	 */
	protected static $initialized = false;

	/**
	 * Get initialization status of a static class.
	 * @return bool initialization status
	 */
	public static final function is_initialized() {
		if ( ! static::$initialized ) {
			static::$initialized = true;

			return false;
		}

		return true;
	}

	/**
	 * Initialize.
	 */
	public static final function init( $options = [], $class = null ) {
		if ( ! static::is_initialized() ) {
			static::get_instance( $options, $class )->init_process();
		}

		static::$initialized = true;
	}

	/**
	 * Function to be called during initialization process.
	 */
	abstract protected function init_process();
}
