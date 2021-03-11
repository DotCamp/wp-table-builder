<?php

namespace WP_Table_Builder\Inc\Common;

use WP_Table_Builder as NS;
use function apply_filters;
use function wp_enqueue_script;
use function wp_enqueue_style;

/**
 * Contains various functions that will used throughout the plugin.
 *
 * @link       http://wptablebuilder.com/
 * @since      1.0.0
 *
 * @author    Imtiaz Rayhan
 */
class Helpers {

	/**
	 * Get the default capability to manage everything for WPTB.
	 *
	 * @return string
	 * @since 1.0.0
	 *
	 */
	static function wptb_get_capability_manage_options() {
		return apply_filters( 'wptb_manage_cap', 'manage_options' );
	}

	/**
	 * Check permissions for currently logged in user.
	 *
	 * @return bool
	 * @since 1.0.0
	 *
	 */
	static function wptb_current_user_can() {
		$capability = self::wptb_get_capability_manage_options();

		return apply_filters( 'wptb_current_user_can', current_user_can( $capability ), $capability );
	}

	/**
	 * Return URL to form preview page.
	 *
	 * @param int $table_id Table ID.
	 *
	 * @return string
	 * @since 1.0.2
	 *
	 */
	static function wptb_get_table_preview_url( $table_id ) {


		$url = add_query_arg(
			array(
				'post_type' => 'wptb-tables',
				'p'         => absint( $table_id )
			),
			home_url()
		);

		return $url;
	}

	/**
	 * Get if development mode is active.
	 * @return bool is development mode active
	 */
	public static function is_development() {
		$dev_mode = defined( 'WPTB_DEV_MODE' );

		return $dev_mode ? constant( 'WPTB_DEV_MODE' ) : false;
	}

	/**
	 * Enqueue a file for frontend.
	 *
	 * This function will also use dev mode to decide whether to use a dynamic file version or static one for better development environment.
	 *
	 * @param string $path path to file
	 * @param array $deps file dependencies
	 * @param bool $footer enqueue file to footer
	 * @param string $handler handler name for script, if null, will use file name as handler
	 *
	 * @return string handler name
	 */
	public static function enqueue_file( $path, $deps = [], $footer = false, $handler = null ) {
		$path_info = pathinfo( $path );

		$file_path = NS\WP_TABLE_BUILDER_DIR . $path;
		$file_url  = NS\WP_TABLE_BUILDER_URL . $path;
		$version   = static::is_development() ? filemtime( $file_path ) : NS\PLUGIN_VERSION;

		if ( $handler === null ) {
			$handler = $path_info['filename'];
		}

		switch ( $path_info['extension'] ) {
			case 'js' :
				wp_enqueue_script( $handler, $file_url, $deps, $version, $footer );
				break;
			case 'css' :
				wp_enqueue_style( $handler, $file_url, $deps, $version );
		}

		return $handler;
	}
}
