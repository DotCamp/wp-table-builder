<?php

namespace WP_Table_Builder\Inc\Common\Traits;

use WP_Table_Builder\Inc\Core\Init;

/**
 * Trait Icon_Manager.
 *
 * Adds easy access to plugin wide icons with icon manager.
 * @package WP_Table_Builder\Inc\Common\Traits
 */
trait Icon_Manager_Trait {

	/**
	 * Get icon manager instance.
	 * @return object icon manager instance
	 */
	public static function icon_manager_instance() {
		return Init::instance()->get_icon_manager();
	}
}