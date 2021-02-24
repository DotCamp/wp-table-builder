<?php

namespace WP_Table_Builder\Inc\Admin\Base;

// if called directly, abort
use Plugin_Upgrader;
use WP_Error;
use WP_Table_Builder\Inc\Admin\Managers\Version_Control_Upgrader_Skin;
use WP_Table_Builder\Inc\Admin\Managers\Version_Sync_Manager;
use function add_filter;

if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Version_Sync_Base.
 *
 * Abstract class for version sync operations for base plugin and its addons.
 * @package WP_Table_Builder\Inc\Admin\Base
 */
abstract class Version_Sync_Base {

	/**
	 * Check availability of version sync manager.
	 * @return bool status
	 */
	private final function check_version_sync_manager_availability() {
		return class_exists( '\WP_Table_Builder\Inc\Admin\Managers\Version_Sync_Manager' );
	}

	/**
	 * Get slug of plugin/addon used in its distribution API.
	 * @return string slug
	 */
	abstract public function get_version_slug();

	/**
	 * Parse version number from package url.
	 *
	 * @param string $package package url
	 *
	 * @return string|null version number
	 */
	abstract public function parse_version_from_package( $package );

	/**
	 * Callback hook for version sync manager when a subscriber attempted an install operation.
	 *
	 * @param string $slug subscriber slug
	 * @param string $version version to install
	 *
	 * @return false|WP_Error false to permit install(i know, but it is what it is) or WP_Error to cancel it
	 */
	abstract public function version_sync_logic( $slug, $version );

	/**
	 * Subscribe to version events of version sync manager.
	 */
	public final function subscribe_to_version_sync() {
		if ( $this->check_version_sync_manager_availability() ) {
			Version_Sync_Manager::subscribe( $this->get_version_slug(), $this );
		}
	}

	/**
	 * Install version of plugin.
	 *
	 * @param string $relative_path relative path of entry file of plugin to plugin directory
	 * @param string $package_url package url
	 * @param bool $trigger_sync_manager whether this install process should also trigger version sync manager
	 *
	 * @return bool|WP_Error true on success, false or WP_Error on failure
	 */
	protected final function install_version( $relative_path, $package_url, $trigger_sync_manager = false ) {
		// instantiate plugin upgrader with a custom upgrader skin
		$upgrader = new Plugin_Upgrader( new Version_Control_Upgrader_Skin() );

		add_filter( 'upgrader_package_options', function ( $options ) use ( $relative_path, $trigger_sync_manager ) {
			$options['abort_if_destination_exists'] = false;
			$options['hook_extra']                  = array_merge( $options['hook_extra'], [
				'plugin'                    => $relative_path,
				'wptb-version-sync-trigger' => $trigger_sync_manager
			] );

			return $options;
		} );

		return $upgrader->install( $package_url, [ 'overwrite_package' => true ] );
	}
}
