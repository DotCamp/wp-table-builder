<?php

namespace WP_Table_Builder\Inc\Core;

/**
 * Fired during plugin deactivation
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @link       http://wptablebuilder.com/
 * @since      1.0.0
 *
 * @author     Imtiaz Rayhan
 **/
class Deactivator {

	/**
	 * Short Description.
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function deactivate() {
		//delete_option( 'wptb_review_notify', 'no' );
	}

}
