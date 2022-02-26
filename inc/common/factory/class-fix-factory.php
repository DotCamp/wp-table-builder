<?php

namespace WP_Table_Builder\Inc\Common\Factory;


use WP_Table_Builder\Inc\Admin\Base\Fix_Mode_Base;

// if called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Factory for generating fix mode instances.
 */
class Fix_Factory {

	/**
	 * Available fix methods.
	 * @var string[]
	 */
	public static $available_fixes = [ 'pwa-container', 'lt-highlighter', 'corrupted-anchor' ];

	/**
	 * Dictionary for mode type and class mappings.
	 * @var string[]
	 */
	private static $make_dictionary = [
		'pwa-container'    => 'WP_Table_Builder\Inc\Admin\Managers\Fix_Modes\Pwa_Container',
		'lt-highlighter'   => 'WP_Table_Builder\Inc\Admin\Managers\Fix_Modes\Lt_Highlighter',
		'corrupted-anchor' => 'WP_Table_Builder\Inc\Admin\Managers\Fix_Modes\Corrupted_Anchor',
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
