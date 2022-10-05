<?php

namespace WP_Table_Builder\Inc\Common\Factory;

use WP_Table_Builder\Inc\Admin\Base\Fix_Mode_Base;
use WP_Table_Builder\Inc\Common\Interfaces\Factory;

// if called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Factory for generating fix mode instances.
 */
class Fix_Factory implements Factory {

	/**
	 * Available fix methods.
	 * @var string[]
	 */
	public static $available_fixes = [ 'pwa-container', 'lt-highlighter', 'corrupted-anchor' ];

	/**
	 * Available legacy table support modes.
	 * @var string[]
	 */
	public static $legacy_support = [ 'legacy-tooltip' ];

	/**
	 * Dictionary for mode type and class mappings.
	 * @var string[]
	 */
	private static $make_dictionary = [
		'pwa-container'    => 'WP_Table_Builder\Inc\Admin\Managers\Fix_Modes\Pwa_Container',
		'lt-highlighter'   => 'WP_Table_Builder\Inc\Admin\Managers\Fix_Modes\Lt_Highlighter',
		'corrupted-anchor' => 'WP_Table_Builder\Inc\Admin\Managers\Fix_Modes\Corrupted_Anchor',
		'legacy-tooltip'   => 'WP_Table_Builder\Inc\Admin\Managers\Fix_Modes\Legacy_Tooltip',
	];

	/**
	 * Make a fix mode instance depending on supplied mode type.
	 *
	 * @param string $fix_mode fix mode to create
	 *
	 * @return null | Fix_Mode_Base null for invalid fix mode or fix mode base implemented object instance
	 */
	public static function make( $fix_mode ) {
		$mode_instance = null;

		if ( isset( static::$make_dictionary[ $fix_mode ] ) ) {
			return new static::$make_dictionary[ $fix_mode ];
		}

		return $mode_instance;
	}
}
