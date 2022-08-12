<?php

namespace WP_Table_Builder\Inc\Core;

use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Admin as Admin;
use WP_Table_Builder\Inc\Admin\Accessibility;
use WP_Table_Builder\Inc\Admin\Managers\Gutenberg_Block_Manager;
use WP_Table_Builder\Inc\Admin\Managers\Icon_Manager;
use WP_Table_Builder\Inc\Admin\Managers\Notification_Manager;
use WP_Table_Builder\Inc\Admin\Managers\Screen_Options_Manager;
use WP_Table_Builder\Inc\Admin\Managers\Scroll_Manager;
use WP_Table_Builder\Inc\Admin\Managers\Template_Manager;
use WP_Table_Builder\Inc\Admin\Managers\Upsells_Manager;
use WP_Table_Builder\Inc\Admin\Managers\Version_Sync_Manager;
use WP_Table_Builder\Inc\Admin\Managers\What_Is_New_Manager;
use WP_Table_Builder\Inc\Admin\Style_Pass;
use WP_Table_Builder\Inc\Frontend as Frontend;
use WP_Table_Builder\Inc\Admin\Managers\Elements_Manager as Elements_Manager;
use WP_Table_Builder\Inc\Admin\Managers\Table_Elements_Manager as Table_Elements_Manager;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder\Inc\Admin\Managers\Settings_Manager as Settings_Manager;
use function add_action;
use function trailingslashit;

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
	 * @var      Loader $loader Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The name of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string $plugin_name The name of the plugin.
	 */
	protected $plugin_name;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string $plugin_basename The string used to uniquely identify this plugin.
	 */
	protected $plugin_basename;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string $version The current version of the plugin.
	 */
	protected $version;

	/**
	 * The text domain of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string $plugin_text_domain The text domain of the plugin.
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
	 * Table elements manager.
	 *
	 * Holds the plugin Table Elements manager.
	 *
	 * @since 1.2.1
	 * @access public
	 *
	 * @var elements_manager
	 */
	public $table_elements_manager;

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


	/**
	 * Settings manager.
	 *
	 * Holds the plugin settings manager
	 *
	 * @access public
	 *
	 * @var Settings_Manager
	 */
	public $settings_manager;

	/**
	 * Admin menu handler.
	 * @var object
	 */
	public $admin_menu;

	/**
	 * Icon manager instance
	 *
	 * @private
	 * @var Icon_Manager
	 */
	private $icon_manager;

	/**
	 * Screen options manager instance.
	 *
	 * @var Screen_Options_Manager
	 */
	public $screen_options_manager;

	private function __construct() {

		$this->plugin_name        = NS\WP_TABLE_BUILDER;
		$this->version            = NS\PLUGIN_VERSION;
		$this->plugin_basename    = NS\PLUGIN_BASENAME;
		$this->plugin_text_domain = NS\PLUGIN_TEXT_DOMAIN;

		$this->load_dependencies();
		$this->set_locale();
		$this->table_export();
		$this->define_admin_hooks();
		$this->define_public_hooks();
		$this->table_import();
		$this->table_preview();

		if ( isset( $_GET['page'] ) && sanitize_text_field( $_GET['page'] ) == 'wptb-builder' ) {
			$this->elements_resources();
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
	 * - Settings - Setup setting manager for menus and plugin wide settings handling
	 *
	 * @access    private
	 */
	private function load_dependencies() {
		$this->loader = new Loader();

		// initialize version sync manager
		Version_Sync_Manager::init();

		// initialize settings manager
		$this->settings_manager = new Settings_Manager( 'wp_table_builder_settings', $this->loader );

		// initialize screen options manager
		$this->screen_options_manager = new Screen_Options_Manager();

		// initialize icon manager instance
		$icon_dir_path = trailingslashit( NS\WP_TABLE_BUILDER_DIR ) . 'inc/frontend/views/icons';
		$icon_dir_url  = trailingslashit( NS\WP_TABLE_BUILDER_URL ) . 'inc/frontend/views/icons';

		$this->icon_manager = new Icon_Manager( $icon_dir_path, $icon_dir_url );

		// initialize gutenberg block manager
		new Gutenberg_Block_Manager( 'wptb/table-block' );


		// wait plugins loaded action hook to check availability of pro version
		add_action( 'plugins_loaded', function () {
			Upsells_Manager::independent_init();

			// initialize upsells manager
			Upsells_Manager::init();
		}, 99 );

		// initialize notification manager
		Notification_Manager::init();

		// initialize what is new manager
		What_Is_New_Manager::init();

		// initialize scroll manager
		Scroll_Manager::init();

		$template_file = trailingslashit( NS\WP_TABLE_BUILDER_DIR ) . 'assets/templates/templates.csv';
		// initialize template manager
		Template_Manager::init( [ 'template_file_path' => $template_file ] );
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
	 * Register all the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @access    private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Admin\Admin( $this->get_plugin_name(), $this->get_version(), $this->get_plugin_text_domain() );

		$tables           = new Admin\Tables;
		$this->admin_menu = new Admin\Admin_Menu;
		//$import = new Admin\Import;

		// accessibility initialization
		new Accessibility();

		// style pass initialization
		Style_Pass::init();

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
		$this->loader->add_action( 'admin_notices', $plugin_admin, 'review_notice' );
		$this->loader->add_action( 'wp_ajax_wptbReviewNoticeHide', $plugin_admin, 'wptb_hide_review_notify' );

//		add_action( 'admin_head', [ $this, 'content_width_header' ] );
	}

	/**
	 * Get icon manager instance.
	 *
	 * @return Icon_Manager
	 */
	public function get_icon_manager() {
		return $this->icon_manager;
	}

	/**
	 * Sets table max-width property.
	 *
	 * Width will be set according to global content_width variable that is set by user's current theme.If not found, a default value of 850px will be used.
	 */
	public function content_width_header() {
		// global variable set by themes
		global $content_width;

		// only change the content width if it is set, else use default css value
		if ( isset( $content_width ) ) {
			// currently table element wrappers have different class names for admin and front-end areas, here deciding which one to use depending on the current called action hook
			$class_name = current_filter() === 'admin_head' ? 'wptb-table-setup' : 'wptb-table-container';

			$style_tag = <<<STYLE
<style>
	.${class_name} {
		max-width: ${content_width}px;
	}
</style>
STYLE;
			echo $style_tag;
		}
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @access    private
	 */
	private function define_public_hooks() {

		$plugin_public = new Frontend\Frontend( $this->get_plugin_name(), $this->get_version(), $this->get_plugin_text_domain() );

		// @deprecated
//		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );

//		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_footer_scripts' );

//		add_action( 'wp_head', [ $this, 'content_width_header' ] );
	}

	/**
	 * Сreates an instance of the class that is intended to display
	 * the table preview
	 *
	 * @access    private
	 */
	private function table_preview() {
		$this->loader->add_action( 'plugins_loaded', 'WP_Table_Builder\Inc\Admin\Preview', 'instance' );
	}

	/**
	 * Сreates an instance of the class that is intended to display
	 * the import
	 *
	 * @access    private
	 */
	private function table_import() {
		$this->loader->add_action( 'plugins_loaded', 'WP_Table_Builder\Inc\Admin\Import', 'instance' );
	}

	private function table_export() {
		$this->loader->add_action( 'plugins_loaded', 'WP_Table_Builder\Inc\Admin\Export', 'get_instance' );
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
	 * @return    string    The version number of the plugin.
	 * @since     1.0.0
	 */
	public function get_version() {
		return $this->version;
	}

	/**
	 * Retrieve the text domain of the plugin.
	 *
	 * @return    string    The text domain of the plugin.
	 * @since     1.0.0
	 */
	public function get_plugin_text_domain() {
		return $this->plugin_text_domain;
	}

	/**
	 * Run all the necessary resources for Elements and Controls
	 *
	 * @since   1.1.5
	 */
	public function elements_resources() {
		$this->elements_manager       = new Elements_Manager();
		$this->table_elements_manager = new Table_Elements_Manager();
		$this->controls_manager       = new Controls_Manager();

		add_action( 'admin_footer', function () {
			$this->elements_manager->output_elements_templates();
			$this->elements_manager->output_directories_icons();
			$this->elements_manager->output_elements_scripts();
			$this->table_elements_manager->output_elements_scripts();
			$this->controls_manager->output_controls_templates();
			$this->controls_manager->output_control_stacks();
		} );
	}
}
