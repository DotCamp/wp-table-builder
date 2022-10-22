<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use DOMDocument;
use DOMXPath;
use WP_Table_Builder\Inc\Common\Factory\Dom_Document_Factory;
use WP_Table_Builder\Inc\Common\Traits\Init_Once;
use WP_Table_Builder\Inc\Common\Traits\Singleton_Trait;
use WP_Table_Builder\Inc\Core\Init;
use function add_action;
use function add_filter;
use function esc_html__;
use function get_post_type;
use function get_queried_object;
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
	private $emoji_status_option_id = 'emoji_image_conversion_disabled_status';

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
			'add_table_html_related_logic'
		], 11, 0 );

		add_action( 'wp_head', [ $instance, 'selective_functionality' ], 1 );
	}

	/**
	 * Enable this managers functionality on client side if there is a plugin table on the page.
	 * @return void
	 */
	public function selective_functionality() {
		$target_obj = get_queried_object();

		if ( ! is_null( $target_obj ) && get_post_type( $target_obj ) === 'post' && isset( $target_obj->post_content ) ) {
			$content = $target_obj->post_content;
			$match   = preg_match( '/(\[wptb id=[0-9]+\])/', $content );
			if ( $match ) {
				$this->main_logic();
			}
		}
	}

	/**
	 * Check table for any kind of emoji to image transformations and convert them to codepoint versions.
	 *
	 * @param string $table_html target table html
	 *
	 * @return string table html
	 */
	public function remove_conversions( $table_html ) {
		$dom_handler = Dom_Document_Factory::make( $table_html );

		if ( ! is_null( $dom_handler ) ) {
			$dom_query = new DOMXPath( $dom_handler );

			// query for converted emoji images, they are under p element with emoji class
			$converted_emoji_images = $dom_query->query( '//p/img[contains(@class, emoji)]' );

			if ( $converted_emoji_images->length > 0 ) {
				$images_to_remove = [];

				foreach ( $converted_emoji_images as $converted_emoji ) {
					$parent_node        = $converted_emoji->parentNode;
					$images_to_remove[] = $converted_emoji;
				}

				foreach ( $images_to_remove as $converted_image ) {
					$parent_node = $converted_image->parentNode;
					$parent_node->removeChild( $converted_image );

					$src_url   = $converted_image->getAttribute( 'src' );
					$codepoint = pathinfo( $src_url )['filename'];
					$emoji     = html_entity_decode( '&#x' . $codepoint . ';' );

					$parent_node->textContent = $emoji . $parent_node->textContent;
					$parent_node->setAttribute( 'class', trim( join( ' ', [
						'wp-exclude-emoji',
						$parent_node->getAttribute( 'class' )
					] ) ) );
				}
			}

			$table_html = $dom_handler->saveHTML();
		}

		return $table_html;
	}

	/**
	 * Restore conversion related functionality to table.
	 *
	 * @param string $table_html table html
	 *
	 * @return string table html
	 */
	public function add_conversions( $table_html ) {
		$dom_handler = Dom_Document_Factory::make( $table_html );

		if ( ! is_null( $dom_handler ) ) {
			$dom_query = new DOMXPath( $dom_handler );

			$disabled_p_elements = $dom_query->query( '//p[contains(@class, wp-exclude-emoji)]' );

			if ( $disabled_p_elements->length > 0 ) {
				foreach ( $disabled_p_elements as $p_element ) {
					$class_list = $p_element->getAttribute( 'class' );
					$class_list = str_replace( 'wp-exclude-emoji', '', $class_list );

					if ( empty( $class_list ) ) {
						$p_element->removeAttribute( 'class' );
					} else {
						$p_element->setAttribute( 'class', trim( ltrim( $class_list ) ) );
					}
				}

				$table_html = $dom_handler->saveHTML();
			}
		}

		return $table_html;
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
	 * Get plugin setting related to enabled status of emoji manager.
	 * @return boolean status
	 */
	private function get_emoji_conversion_status() {
		return Init::instance()->settings_manager->get_option_value( $this->emoji_status_option_id );
	}

	/**
	 * Main logic for emoji manager functionality.
	 * This hook is used to make sure we still use plugin's own setting resolve functionality.
	 *
	 * @return void
	 */
	public function main_logic() {
		if ( $this->get_emoji_conversion_status() ) {
			remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
			remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
			remove_action( 'wp_print_styles', 'print_emoji_styles' );
			remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
			remove_action( 'admin_print_styles', 'print_emoji_styles' );
		}
	}

	/**
	 * Logic related to table html string.
	 * @return void
	 */
	public function add_table_html_related_logic() {
		if ( $this->get_emoji_conversion_status() ) {
			add_filter( 'wp-table-builder/filter/get_table', [ $this, 'remove_conversions' ], 10, 1 );
			add_filter( 'wp-table-builder/filter/table_html_shortcode', [ $this, 'remove_conversions' ], 10, 1 );
		} else {
			add_filter( 'wp-table-builder/filter/get_table', [ $this, 'add_conversions' ], 10, 1 );
			add_filter( 'wp-table-builder/filter/table_html_shortcode', [ $this, 'add_conversions' ], 10, 1 );
		}

		$this->add_builder_data();
	}

	/**
	 * Add builder related data to frontend.
	 * @return void
	 */
	private function add_builder_data() {
		Frontend_Data_Manager::add_plugin_setting( 'emojiConversionDisablerStatus', filter_var( $this->get_emoji_conversion_status(), FILTER_VALIDATE_BOOLEAN ) );
	}
}
