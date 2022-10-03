<?php

namespace WP_Table_Builder\Inc\Common\Traits;

use Exception;

/**
 * Trait Init_Once.
 *
 * Provide only one time initialization to static classes.
 * @package WP_Table_Builder\Inc\Common\Traits
 */
trait Init_Once {
	/**
	 * Class initialization status.
	 * @var bool
	 */
	private static $initialized = false;

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
	public static final function init( ...$args ) {
		if ( ! static::is_initialized() ) {
			static::init_process( ...$args );
		}
	}

	/**
	 * Function to be called during initialization process.
	 */
	public static function init_process() {
		throw new Exception( esc_html__( 'init_process function is not implemented', 'wp-table-builder' ) );
	}
}
