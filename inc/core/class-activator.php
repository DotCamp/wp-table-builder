<?php

namespace WP_Table_Builder\Inc\Core;

/**
 * Fired during plugin activation
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @link       http://wptablebuilder.com/
 * @since      1.0.0
 *
 * @author     Imtiaz Rayhan
 **/
class Activator {

	/**
	 * Short Description.
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {

		$min_php = '5.6.0';

		// Check PHP Version and deactivate & die if it doesn't meet minimum requirements.
		if ( version_compare( PHP_VERSION, $min_php, '<' ) ) {
			deactivate_plugins( plugin_basename( __FILE__ ) );
			wp_die( 'WP Table Builder requires a minmum PHP Version of ' . $min_php );
		}

        set_transient( '_welcome_redirect_wptb', true, 60 );

		// Adds the option to check if user is notified for review.
		add_option( 'wptb_review_notify', 'no' );

	}

}
