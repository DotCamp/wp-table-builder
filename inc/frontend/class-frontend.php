<?php

namespace WP_Table_Builder\Inc\Frontend;

use WP_Table_Builder\Inc\Common\Helpers;
use function add_action;
use function apply_filters;
use function wp_localize_script;

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @link       http://wptablebuilder.com/
 * @since      1.0.0
 *
 * @author    Imtiaz Rayhan
 */
class Frontend {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string $plugin_name The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string $version The current version of this plugin.
	 */
	private $version;

	/**
	 * The text domain of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string $plugin_text_domain The text domain of this plugin.
	 */
	private $plugin_text_domain;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param string $plugin_name The name of this plugin.
	 * @param string $version The version of this plugin.
	 * @param string $plugin_text_domain The text domain of this plugin.
	 *
	 * @since       1.0.0
	 */
	public function __construct( $plugin_name, $version, $plugin_text_domain ) {

		$this->plugin_name        = $plugin_name;
		$this->version            = $version;
		$this->plugin_text_domain = $plugin_text_domain;

		add_action( 'pre_do_shortcode_tag', [ $this, 'selective_loading' ], 10, 2 );

		add_action( 'wptb_frontend_enqueue_script', [ $this, 'enqueue_footer_scripts' ] );
		add_action( 'wptb_frontend_enqueue_style', [ $this, 'unqueue_styles_start' ] );
	}

	/**
	 * Selective loading callback for pre shortcode filter.
	 *
	 * @param boolean $return short circuit value
	 * @param string $shortcode_tag shortcode tag
	 */
	public function selective_loading( $return, $shortcode_tag ) {
		if ( $shortcode_tag === 'wptb' ) {
			do_action( 'wptb_frontend_enqueue_style' );
			do_action( 'wptb_frontend_enqueue_script' );
		}

		return $return;
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {
		add_action( 'wptb_frontend_enqueue_style', array( $this, 'unqueue_styles_start' ) );
	}

	public function unqueue_styles_start() {
		Helpers::enqueue_file( 'inc/frontend/css/wp-table-builder-frontend.css', [ 'dashicons' ], true, $this->plugin_name );
	}

	/**
	 * Enqueue header scripts.
	 */
	public function enqueue_header_scripts() {
		// nothing here...
	}

	/**
	 * Enqueue footer scripts.
	 */
	public function enqueue_footer_scripts() {
		Helpers::enqueue_file( 'inc/frontend/js/wp-table-builder-frontend.js', [], true, $this->plugin_name );

		// prepare data for frontend script
		$frontend_data = [];

		// frontend data filter
		$frontend_data = apply_filters( 'wp-table-builder/filter/wptb_frontend_data', $frontend_data );
		wp_localize_script( $this->plugin_name, 'WptbFrontendData', $frontend_data );
	}
}
