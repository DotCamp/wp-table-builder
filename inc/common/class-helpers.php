<?php

namespace WP_Table_Builder\Inc\Common;

use WP_Table_Builder as NS;
use function wp_enqueue_script;

/**
 * Contains various functions that will be used throughout the plugin.
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
	 * Check permissions for currently logged-in user.
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
		$dev_mode = getenv('WPTB_DEV');

		return filter_var($dev_mode, FILTER_VALIDATE_BOOLEAN);
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
	 * @param bool $register whether register or enqueue file
	 *
	 * @return string handler name
	 */
	public static function enqueue_file( $path, $deps = [], $footer = false, $handler = null, $register = false ) {
		$path_info = pathinfo( $path );

		$file_path = path_join( NS\WP_TABLE_BUILDER_DIR, $path );
		$file_url  = path_join( NS\WP_TABLE_BUILDER_URL, $path );
		$version   = static::is_development() ? filemtime( $file_path ) : NS\PLUGIN_VERSION;

		if ( $handler === null ) {
			$handler = $path_info['filename'];
		}

		$target_function = $register ? 'wp_register_script' : 'wp_enqueue_script';

		switch ( $path_info['extension'] ) {
			case 'js' :
				call_user_func_array( $target_function, [ $handler, $file_url, $deps, $version, $footer ] );
				break;
			case 'css' :
				wp_enqueue_style( $handler, $file_url, $deps, $version, 'all' );
		}

		return $handler;
	}

	/**
	 * Batch sanitize array with defined sanitization rules.
	 *
	 * This function not only sanitize the options, also will make sure only option fields defined in ruleset are ended up in the final options array.
	 *
	 * @param array $input_object input array
	 * @param array $sanitization_rules sanitization rule array
	 *
	 * @return array sanitized options
	 */
	public static function batch_sanitize( $input_object, $sanitization_rules ) {
		$sanitized_object = [];
		foreach ( $sanitization_rules as $rule_key => $rule_value ) {
			if ( isset( $input_object[ $rule_key ] ) ) {
				$input_value = $input_object[ $rule_key ];
				if ( is_array( $rule_value ) ) {
					$sanitized_object[ $rule_key ] = static::batch_sanitize( $input_value, $rule_value );
				} else {
					if ( is_array( $input_value ) ) {
						$sanitized_object[ $rule_key ] = array_map( $rule_value, $input_value );
					} else {
						$sanitized_object[ $rule_key ] = call_user_func( $rule_value, $input_value );
					}
				}
			}

		}

		return $sanitized_object;
	}
}
