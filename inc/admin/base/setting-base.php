<?php

namespace WP_Table_Builder\Inc\Admin\Base;

// if called directly, abort process
use WP_Table_Builder\Inc\Common\Helpers;
use function get_option;
use function register_setting;

if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Setting_Base
 *
 * Abstract class for components with individual WordPress options.
 * @package WP_Table_Builder\Inc\Admin\Base
 */
abstract class Setting_Base {

	/**
	 * Get id of settings.
	 *
	 * @return string settings id
	 */
	public abstract function get_settings_id();

	/**
	 * Get default settings.
	 *
	 * @return array default settings array
	 */
	protected abstract function get_default_settings();

	/**
	 * Get sanitization rules for component options.
	 * @return array sanitization rules
	 */
	protected abstract function get_sanitization_rules();

	/**
	 * Get settings defined for this component.
	 *
	 * @return mixed component settings
	 */
	public final function get_settings() {
		return get_option( $this->get_settings_id() );
	}

	/**
	 * Sanitize updated settings.
	 *
	 * @param mixed $settings updated settings
	 *
	 * @return array sanitized updated settings
	 */
	public final function sanitize_settings( $settings ) {
		return array_merge( $this->get_settings(), Helpers::batch_sanitize( $settings, $this->get_sanitization_rules() ) );
	}

	/**
	 * Register component settings to WordPress options api.
	 *
	 * @param string $description setting description
	 * @param string|null $option_group option group name
	 * @param string|null $option_name option name
	 */
	protected final function register_settings( $description, $option_group = null, $option_name = null ) {
		$final_option_group = $option_group === null ? $this->get_settings_id() : $option_group;
		$final_option_name  = $option_name === null ? $final_option_group : $option_name;

		register_setting( $final_option_group, $final_option_name, [
			'type'              => gettype( $this->get_default_settings() ),
			'description'       => $description,
			'default'           => $this->get_default_settings(),
			'sanitize_callback' => [ $this, 'sanitize_settings' ]
		] );
	}
}
