<?php
/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://wptablebuilder.com/
 * @since             1.0.0
 * @package           WP_Table_Builder
 *
 * @wordpress-plugin
 * Plugin Name:       WP Table Builder
 * Plugin URI:        https://wptablebuilder.com/
 * Description:       Drag and Drop Table Builder Plugin for WordPress.
 * Version:           1.0.9
 * Author:            WP Table Builder
 * Author URI:        https://imtiazrayhan.com//
 * License:           GPL-3.0+
 * License URI:       http://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain:       wp-table-builder
 * Domain Path:       /languages
 */

namespace WP_Table_Builder;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Define Constants
 */

define( __NAMESPACE__ . '\NS', __NAMESPACE__ . '\\' );

define( NS . 'WP_TABLE_BUILDER', 'wp-table-builder' );

define( NS . 'PLUGIN_VERSION', '1.0.9' );

define( NS . 'WP_TABLE_BUILDER_DIR', plugin_dir_path( __FILE__ ) );

define( NS . 'WP_TABLE_BUILDER_URL', plugin_dir_url( __FILE__ ) );

define( NS . 'PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

define( NS . 'PLUGIN_TEXT_DOMAIN', 'wp-table-builder' );


/**
 * Autoload Classes
 */

require_once( WP_TABLE_BUILDER_DIR . 'inc/libraries/autoloader.php' );

/**
 * Helper Functions 
 */

/**
 * Register Activation and Deactivation Hooks
 * This action is documented in inc/core/class-activator.php
 */

register_activation_hook( __FILE__, array( NS . 'Inc\Core\Activator', 'activate' ) );

/**
 * The code that runs during plugin deactivation.
 * This action is documented inc/core/class-deactivator.php
 */

register_deactivation_hook( __FILE__, array( NS . 'Inc\Core\Deactivator', 'deactivate' ) );


/**
 * Plugin Singleton Container
 *
 * Maintains a single copy of the plugin app object
 *
 * @since    1.0.0
 */
class WP_Table_Builder {

	/**
	 * The instance of the plugin.
	 *
	 * @since    1.0.0
	 * @var      Init $init Instance of the plugin.
	 */
	private static $init;
	/**
	 * Loads the plugin
	 *
	 * @access    public
	 */
	public static function init() {

		if ( null === self::$init ) {
			self::$init = new Inc\Core\Init();
			self::$init->run();
		}

		return self::$init;
	}

}

/**
 * Begins execution of the plugin
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * Also returns copy of the app object so 3rd party developers
 * can interact with the plugin's hooks contained within.
 **/
function wp_table_builder_init() {
	return WP_Table_Builder::init();
}

$min_php = '5.6.0';

// Check the minimum required PHP version and run the plugin.
if ( version_compare( PHP_VERSION, $min_php, '>=' ) ) {
	wp_table_builder_init();
}
