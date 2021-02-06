<?php

namespace WP_Table_Builder\Inc\Common\Traits;

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
	public static function is_initialized() {
		if ( ! static::$initialized ) {
			static::$initialized = true;

			return false;
		}

		return true;
	}
}
