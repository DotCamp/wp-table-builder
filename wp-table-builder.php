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
 * @package           WP_Table_Builder
 *
 * @wordpress-plugin
 * Plugin Name:       WP Table Builder
 * Plugin URI:        http://wptablebuilder.com
 * Description:       Table Builder Plugin for WordPress.
 * Version:           1.0.0
 * Author:            Imtiaz Rayhan
 * Author URI:        http://imtiazrayhan.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       wp-table-builder
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'WP_TABLE_BUILDER', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-wp-table-builder-activator.php
 */
function activate_WP_Table_Builder() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-wp-table-builder-activator.php';
	WP_Table_Builder_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-wp-table-builder-deactivator.php
 */
function deactivate_WP_Table_Builder() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-wp-table-builder-deactivator.php';
	WP_Table_Builder_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_WP_Table_Builder' );
register_deactivation_hook( __FILE__, 'deactivate_WP_Table_Builder' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-wp-table-builder.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_WP_Table_Builder() {

	$plugin = new WP_Table_Builder();
	$plugin->run();

}
run_WP_Table_Builder();
