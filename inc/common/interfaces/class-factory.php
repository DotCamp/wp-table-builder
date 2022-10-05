<?php

namespace WP_Table_Builder\Inc\Common\Interfaces;

/**
 * Factory interface.
 */
interface Factory {
	/**
	 * Create factory target.
	 *
	 * @param mixed $options make options
	 *
	 * @return mixed
	 */
	public static function make( $options );
}
