<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder\Inc\Common\Traits\Init_Once;
use WP_Table_Builder\Inc\Common\Traits\Singleton_Trait;
use WP_Table_Builder\Inc\Core\Init;
use function add_action;
use function add_filter;
use function esc_html__;
use function remove_action;

/**
 * Emoji manager.
 */
class Emoji_Manager {
	use Singleton_Trait;
	use Init_Once;

	/**
	 * Option key name for emoji to image conversion setting.
	 * @var string
	 */
	private $emoji_status_option_id = 'emoji_image_conversion_status';

	/**
	 * Function to be called during initialization process.
	 */
	public static function init_process() {
		$instance = static::get_instance();

		// register value to plugin settings
		add_filter( 'wp-table-builder/filter/settings_defaults', [ $instance, 'add_emoji_default_option' ], 10, 1 );
		add_filter( 'wp-table-builder/filter/settings_sanitization_rules', [
			$instance,
			'add_emoji_option_sanitization_rule'
		], 10, 1 );

		// add control to settings menu
		add_filter( 'wp-table-builder/filter/settings_manager_frontend_data', [
			$instance,
			'add_to_settings_menu'
		], 10, 1 );

		add_action( 'init', [
			$instance,
			'main_logic'
		], 10, 0 );
	}

	/**
	 * Add controls to settings menu.
	 *
	 * @param array $frontend_data frontend data
	 *
	 * @return array filtered frontend data
	 */
	public function add_to_settings_menu( $frontend_data ) {
		$frontend_data['sectionsData']['general']['fields'][ $this->emoji_status_option_id ] = [
			'type'    => 'checkbox',
			'section' => 'general',
			'title'   => esc_html__( 'Disable emoji to image conversion', 'wp-table-builder' ),
			'label'   => esc_html__( 'Disable emoji to image conversion', 'wp-table-builder' )
		];


		return $frontend_data;
	}

	/**
	 * Add option sanitization rules.
	 *
	 * @param array $sanitization_rules sanitization rules
	 *
	 * @return array sanitization rule
	 */
	public function add_emoji_option_sanitization_rule( $sanitization_rules ) {
		$sanitization_rules[ $this->emoji_status_option_id ] = 'sanitize_text_field';

		return $sanitization_rules;

	}

	/**
	 * Add emoji default option value to plugin settings.
	 *
	 * @param array $defaults default values for plugin options.
	 *
	 * @return array filtered defaults.
	 */
	public function add_emoji_default_option( $defaults ) {
		$defaults[ $this->emoji_status_option_id ] = false;

		return $defaults;
	}

	/**
	 * Main logic for emoji manager functionality.
	 * This hook is used to make sure we still use plugin's own setting resolve functionality.
	 *
	 * @return void
	 */
	public function main_logic() {
		if ( Init::instance()->settings_manager->get_option_value( $this->emoji_status_option_id ) ) {
			remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
			remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
			remove_action( 'wp_print_styles', 'print_emoji_styles' );
			remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
			remove_action( 'admin_print_styles', 'print_emoji_styles' );
		}
	}
}
