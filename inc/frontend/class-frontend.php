<?php

namespace WP_Table_Builder\Inc\Frontend;

use WP_Table_Builder as NS;

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

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		add_action( 'wptb_frontend_enqueue_style', array( $this, 'unqueue_styles_start' ) );

	}

	public function unqueue_styles_start() {
		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/wp-table-builder-frontend.css', array(), $this->version, 'all' );
	}

//    /**
//	 * Register the JavaScript for the public-facing side of the site.
//	 *
//	 * @since    1.0.0
//	 */
//	public function enqueue_scripts() {
//
//		/**
//		 * This function is provided for demonstration purposes only.
//		 *
//		 * An instance of this class should be passed to the run() function
//		 * defined in Loader as all of the hooks are defined
//		 * in that particular class.
//		 *
//		 * The Loader will then create the relationship
//		 * between the defined hooks and the functions defined in this
//		 * class.
//		 */
//		add_action( 'wptb_frontend_enqueue_script', array( $this, 'unqueue_script_start' ) );
//
//	}

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
		$relative_path =  'inc/admin/js/WPTB_ResponsiveFrontend.js';
		$responsive_script_url = trailingslashit(NS\WP_TABLE_BUILDER_URL) . $relative_path;

		wp_enqueue_script($this->plugin_name . '_responsive-frontend', $responsive_script_url, [], NS\PLUGIN_VERSION, false);

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/wp-table-builder-frontend.js', array( 'jquery' ), $this->version, false );

	}
}
