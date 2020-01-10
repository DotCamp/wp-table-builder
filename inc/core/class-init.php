<?php

namespace WP_Table_Builder\Inc\Core;
use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Admin as Admin;
use WP_Table_Builder\Inc\Frontend as Frontend;
use WP_Table_Builder\Inc\Core\Preview as Preview;
use WP_Table_Builder\Inc\Admin\Managers\Elements_Manager as Elements_Manager;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager as Controls_Manager;

/**
 * The core plugin class.
 * Defines internationalization, admin-specific hooks, and public-facing site hooks.
 *
 * @link       http://wptablebuilder.com/
 * @since      1.0.0
 *
 * @author     Imtiaz Rayhan
 */
class Init {
    
    /**
     * Instance to instantiate object.
     *
     * @var $instance
     */
    protected static $instance;

    /**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @var      Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_base_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_basename;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * The text domain of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $plugin_text_domain;

	/**
	 * Initialize and define the core functionality of the plugin.
	 */
    
    /**
	 * Items manager.
	 *
	 * Holds the plugin items manager.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @var elements_manager
	 */
    public $elements_manager;
    
    /**
	 * Controls manager.
	 *
	 * Holds the plugin controls manager.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @var Controls_Manager
	 */
    public $controls_manager;
    
    private function __construct() {

		$this->plugin_name = NS\WP_TABLE_BUILDER;
		$this->version = NS\PLUGIN_VERSION;
		$this->plugin_basename = NS\PLUGIN_BASENAME;
		$this->plugin_text_domain = NS\PLUGIN_TEXT_DOMAIN;
        

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();
        $this->table_preview();
        
        if( isset( $_GET['page'] ) && sanitize_text_field( $_GET['page'] ) == 'wptb-builder' ) {
            $this->elements_manager = new Elements_Manager();
            $this->controls_manager = new Controls_Manager();
            add_action( 'admin_footer', [$this, 'wp_footer_js_templates'] );
        }
	}
    
    /**
     * Singleton pattern, making only one instance of the class.
     *
     * @since 1.00
     */
    public static function instance() {
        if ( ! isset( self::$instance ) ) {
            $className      = __CLASS__;
            self::$instance = new $className;
        }

        return self::$instance;
    }

    /**
	 * Loads the following required dependencies for this plugin.
	 *
	 * - Loader - Orchestrates the hooks of the plugin.
	 * - Internationalization_I18n - Defines internationalization functionality.
	 * - Admin - Defines all hooks for the admin area.
	 * - Frontend - Defines all hooks for the public side of the site.
	 *
	 * @access    private
	 */
	private function load_dependencies() {
		$this->loader = new Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Internationalization_I18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @access    private
	 */
	private function set_locale() {

		$plugin_i18n = new Internationalization_I18n( $this->plugin_text_domain );

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @access    private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Admin\Admin( $this->get_plugin_name(), $this->get_version(), $this->get_plugin_text_domain() );

		$tables = new Admin\Tables;
		$menu = new Admin\Admin_Menu;
        
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
		$this->loader->add_action( 'admin_notices', $plugin_admin, 'review_notice' );
		$this->loader->add_action( 'wp_ajax_wptbReviewNoticeHide', $plugin_admin, 'wptb_hide_review_notify' );
        
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @access    private
	 */
	private function define_public_hooks() {

		$plugin_public = new Frontend\Frontend( $this->get_plugin_name(), $this->get_version(), $this->get_plugin_text_domain() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );

	}
    
    /**
	 * Сreates an instance of the class that is intended to display 
     * the table preview
	 *
	 * @access    private
	 */
    private function table_preview() {
        $this->loader->add_action( 'plugins_loaded', 'WP_Table_Builder\Inc\Core\Preview', 'instance' );
    }
    
    /**
	 * Run the loader to execute all of the hooks with WordPress.
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @return    Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

	/**
	 * Retrieve the text domain of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The text domain of the plugin.
	 */
	public function get_plugin_text_domain() {
		return $this->plugin_text_domain;
	}
    
    /**
	 * WP footer.
	 *
	 * Prints Elementor editor with all the editor templates, and render controls,
	 * widgets and content elements.
	 *
	 * Fired by `wp_footer` action.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function wp_footer_js_templates() {
        $this->elements_manager->output_elements_templates();
        $this->elements_manager->output_directories_icons();
        $this->elements_manager->output_elements_scripts();
        $this->controls_manager->output_controls_templates();
        $this->controls_manager->output_control_stacks();
	}
}
