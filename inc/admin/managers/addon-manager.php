<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder_Pro\Inc\Admin\Managers\Freemius_Manager;

// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Addon_Manager.
 *
 * Addon manager with various helpful functions to maintain/check plugin addons.
 * @package WP_Table_Builder\Inc\Admin\Managers
 */
class Addon_Manager {
	/**
	 * Check status of pro version.
	 * This check will return true only if a valid license is activated for pro version.
	 * @return bool pro enabled or not
	 */
	public static function check_pro_status() {
		return class_exists( '\WP_Table_Builder_Pro\Inc\Admin\Managers\Freemius_Manager' ) && filter_var( Freemius_Manager::is_premium_activated(), FILTER_VALIDATE_BOOLEAN );
	}
}
