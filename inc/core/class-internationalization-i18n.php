<?php

namespace WP_Table_Builder\Inc\Core;

use WP_Table_Builder as NS;

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       http://wptablebuilder.com/
 * @since      1.0.0
 *
 * @author     Imtiaz Rayhan
 */
class Internationalization_I18n {

	/**
	 * The text domain of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string $text_domain The text domain of the plugin.
	 */
	private $text_domain;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param string $plugin_text_domain The text domain of this plugin.
	 *
	 * @since    1.0.0
	 */
	public function __construct( $plugin_text_domain ) {

		$this->text_domain = $plugin_text_domain;

	}

	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {
		// relative path of languages folder to the base of WordPress plugin folder
		$rel_path = dirname( plugin_basename( NS\PLUGIN__FILE__ ) ) . '/languages/';

		load_plugin_textdomain(
			$this->text_domain,
			false,
			$rel_path
		);
	}

}
