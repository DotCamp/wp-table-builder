<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder\Inc\Common\Traits\Init_Once;
use WP_Table_Builder\Inc\Common\Traits\Singleton_Trait;
use function add_filter;
use function apply_filters;
use function wp_localize_script;

/**
 * Manager responsible for frontend data for both server and client side.
 */
class Frontend_Data_Manager {
	use Singleton_Trait;
	use Init_Once;

	/**
	 * Object name for builder data.
	 */
	const BUILDER_DATA_OBJECT_NAME = 'wptb_admin_object';

	/**
	 * Process given data.
	 *
	 * This function will be used for in situations where supplied data is a callable where returns that data.
	 *
	 * @param callable | array $data data
	 *
	 * @return array processed data
	 */
	private static function process_data( $data ) {
		return is_callable( $data ) ? call_user_func( $data ) : $data;
	}

	/**
	 * Add data to builder.
	 *
	 * @param array | callable $data data, or a callback function which returns data
	 * @param String $id data id, access to data in frontend will be provided with that id
	 * @param bool $store whether store data under store or not
	 *
	 * @return void
	 */
	public static function add_builder_data( $data, $id = null, $store = false ) {
		add_filter( 'wp-table-builder/filter/builder_script_data', function ( $builder_data ) use ( $data, $id, $store ) {
			$final_data = static::process_data( $data );

			if ( empty( $final_data ) ) {
				return $builder_data;
			}

			// if no data id is supplied, merge with current builder data on top level
			if ( is_null( $id ) ) {
				$builder_data = array_merge( $builder_data, $final_data );
			} else {
				if ( $store ) {
					if ( ! isset( $builder_data['store'] ) ) {
						$builder_data['store'] = [];
					}
					if ( ! isset( $builder_data['store'][ $id ] ) ) {
						$builder_data['store'][ $id ] = $final_data;
					} else {
						// if there is already a store option defined with same id, merge all together
						$builder_data['store'][ $id ] = array_merge( $builder_data['store'][ $id ], $final_data );
					}
				} else {
					$builder_data[ $id ] = $final_data;
				}
			}

			return $builder_data;
		}, 10, 1 );
	}

	/**
	 * Add plugin setting to builder.
	 * With this function, plugin settings will be saved to builder store for easy and universal access for all builder elements. It will also remove the necessity to add plugin settings to relevant store modules one by one.
	 *
	 * @param array | string $setting_name setting name, if an array with setting_name=>value supplied, that array values will be used as second function argument.
	 * @param mixed $setting_value setting value, if an array is supplied with first argument, this one will be ignored
	 *
	 * @return void
	 */
	public static function add_plugin_setting( $setting_name, $setting_value = null ) {
		$final_settings = $setting_name;

		if ( ! is_array( $setting_name ) ) {
			$final_settings = [ $setting_name => $setting_value ];
		}

		static::add_builder_data($final_settings, 'settings', true);
	}

	/**
	 * Add translations for builder menu.
	 *
	 * @param array $data translation array, with keys for translation id and values as translations
	 *
	 * @return void
	 */
	public static function add_builder_translations( $data ) {
		$static_context = __CLASS__;
		add_filter( 'wp-table-builder/filter/builder_script_data', function ( $builder_data ) use ( $data, $static_context ) {
			// if no translations are found, create container array
			if ( ! isset( $builder_data['store']['translations'] ) ) {
				$builder_data['store']['translations'] = [];
			}

			$builder_data['store']['translations'] = array_merge( $builder_data['store']['translations'], $static_context::process_data( $data ) );

			return $builder_data;
		}, 10, 1 );
	}

	/**
	 * Localize builder data.
	 *
	 * @param string $script_id script id that data will be attached
	 * @param array $data data
	 *
	 * @return void
	 */
	public static function localize_builder_data( $script_id, $data, $object_name = null ) {
		$builder_data = apply_filters( 'wp-table-builder/filter/builder_script_data', $data );

		wp_localize_script( $script_id, is_null( $object_name ) ? static::BUILDER_DATA_OBJECT_NAME : $object_name, $builder_data );
	}
}
