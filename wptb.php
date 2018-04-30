<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://imtiazrayhan.com
 * @since             1.0.0
 * @package           WPTB
 *
 * @wordpress-plugin
 * Plugin Name:       WP Table Builder
 * Plugin URI:        http://wptablebuilder.com
 * Description:       Table Builder for WordPress.
 * Version:           1.0.0
 * Author:            Imtiaz Rayhan
 * Author URI:        http://imtiazrayhan.com
 * License:           GPL-3.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       wptb
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Current Plugin Version
define( 'WPTB_VERSION', '1.0.0' );

// Plugin Folder Path.
if ( ! defined( 'WPTB_PLUGIN_DIR' ) ) {
	define( 'WPTB_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
}

// Plugin Folder URL.
if ( ! defined( 'WPTB_PLUGIN_URL' ) ) {
	define( 'WPTB_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
}

// Plugin Root File.
if ( ! defined( 'WPTB_PLUGIN_FILE' ) ) {
	define( 'WPTB_PLUGIN_FILE', __FILE__ );
}

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-wptb-activator.php
 */
function activate_wptb() {
	require_once WPTB_PLUGIN_DIR . 'includes/class-wptb-activator.php';
	WPTB_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-wptb-deactivator.php
 */
function deactivate_wptb() {
	require_once WPTB_PLUGIN_DIR . 'includes/class-wptb-deactivator.php';
	WPTB_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_wptb' );
register_deactivation_hook( __FILE__, 'deactivate_wptb' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require WPTB_PLUGIN_DIR . 'includes/class-wptb.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_wptb() {

	$plugin = new WPTB();
	$plugin->run();

}
run_wptb();
