<?php

namespace WP_Table_Builder\Inc\Admin;

use DOMDocument;
use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Admin\Managers\Addon_Manager;
use WP_Table_Builder\Inc\Admin\Managers\Frontend_Data_Manager;
use WP_Table_Builder\Inc\Admin\Managers\Settings_Manager;
use WP_Table_Builder\Inc\Common\Factory\Dom_Document_Factory;
use WP_Table_Builder\Inc\Common\Helpers;
use WP_Table_Builder\Inc\Core\Init;
use function add_query_arg;
use function admin_url;
use function apply_filters;
use function get_bloginfo;
use function get_plugins;
use function current_user_can;
use function mb_convert_encoding;
use function wp_create_nonce;
use function wp_localize_script;

/**
 * Register menu elements and do other global tasks.
 *
 * @link       http://wptablebuilder.com/
 * @since      1.0.0
 *
 * @author    Imtiaz Rayhan
 */
class Admin_Menu {

	/**
	 * Script hook name for generate menu.
	 * @var string
	 */
	public static $generate_menu_script_hook = 'wptb-generate-js';

	/**
	 * Primary class constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		// Let's make some menus.
		add_filter( 'set_screen_option_' . 'tables_per_page', function ( $status, $option, $value ) {
			return (int) $value;
		}, 10, 3 );

		add_filter( 'set-screen-option', function ( $status, $option, $value ) {
			return ( $option == 'tables_per_page' ) ? (int) $value : $status;
		}, 10, 3 );
		add_action( 'admin_menu', array( $this, 'register_menus' ), 9 );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'wp_ajax_create_table', array( $this, 'create_table' ) );
		add_action( 'wp_ajax_save_table', array( $this, 'save_table' ) );
		add_action( 'wp_ajax_get_table', array( $this, 'get_table' ) );
		add_action( 'admin_bar_menu', array( $this, 'add_wp_admin_bar_new_table_create_page' ), 500 );

		add_filter( 'wp-table-builder/filter/get_table', [ $this, 'strip_tags' ], 10, 1 );
		add_filter( 'wp-table-builder/filter/table_html_shortcode', [ $this, 'strip_tags' ], 10, 1 );
		add_filter( 'wp-table-builder/table_content', [ $this, 'strip_tags' ], 10, 1 );
	}

	public function create_table() {
		if ( current_user_can( Settings_Manager::ALLOWED_ROLE_META_CAP ) ) {
			$id = wp_insert_post( [
				'post_title'   => '',
				'post_content' => '',
				'post_type'    => 'wptb-tables',
				'post_status'  => 'draft'
			] );
			wp_die( json_encode( [ 'created', $id ] ) );
		}
	}

	public function save_table() {

		$params = json_decode( file_get_contents( 'php://input' ) );

		if ( current_user_can( Settings_Manager::ALLOWED_ROLE_META_CAP ) && wp_verify_nonce( $params->security_code, 'wptb-security-nonce' ) ||
		     wp_verify_nonce( $params->security_code, 'wptb-import-security-nonce' ) ) {

			if ( ! property_exists( $params, 'id' ) || ! absint( $params->id ) || get_post_status( absint( $params->id ) ) != 'draft' ) {
				$id = wp_insert_post( [
					'post_title'   => sanitize_text_field( $params->title ),
					'post_content' => '',
					'post_type'    => 'wptb-tables',
					'post_status'  => 'draft'
				] );

				$table_content = $this->add_table_id_to_dom( $params->content, $id );

				// apply table content filter
				$table_content = apply_filters( 'wp-table-builder/table_content', $table_content, $params );
				add_post_meta( $id, '_wptb_content_', $table_content );

				// new table id filter hook
				$id = apply_filters( 'wp-table-builder/new_table_id', $id, $params );

				// new table saved action hook
				do_action( 'wp-table-builder/new_table_saved', $id, $params );

				wp_die( json_encode( [ 'saved', $id ] ) );
			} else {
				if ( Init::instance()->settings_manager->current_user_allowed_for_modifications( absint( $params->id ) ) ) {
					wp_update_post( [
						'ID'           => absint( $params->id ),
						'post_title'   => sanitize_text_field( $params->title ),
						'post_content' => '',
						'post_type'    => 'wptb-tables',
						'post_status'  => 'draft'
					] );
					if ( isset( $params->preview_saving ) && ! empty( (int) $params->preview_saving ) ) {
						update_post_meta( absint( $params->id ), '_wptb_preview_id_', $params->preview_saving );
						update_post_meta( absint( $params->id ), '_wptb_content_preview_', $params->content );

						wp_die( json_encode( [ 'preview_edited' ] ) );
					} else {
						// apply table content filter
						$table_content = apply_filters( 'wp-table-builder/table_content', $params->content, $params );
						update_post_meta( absint( $params->id ), '_wptb_content_', $table_content );

						// table edited action hook
						do_action( 'wp-table-builder/table_edited', $params->id, $params );

						wp_die( json_encode( [ 'edited', absint( $params->id ) ] ) );
					}
				}
			}
		} else {
			wp_die( json_encode( [ 'security_problem', '' ] ) );
		}
	}

	/**
	 * Add necessary data to table content for getting its id from HTML element properties and classes.
	 *
	 * @param string $table_content content of table
	 * @param string $id table id
	 *
	 * @return string final table content
	 */
	public function add_table_id_to_dom( $table_content, $id ) {
		$final_table_content = $table_content;

		// ext-mbstring check
		if ( function_exists( 'mb_convert_encoding' ) ) {
			$dom_handler = new DOMDocument();

			$charset = get_bloginfo( 'charset' );

			// need to provide a to_encoding value for mb_convert_encoding since that value is nullable only for PHP 8.0+
			$handler_status = @$dom_handler->loadHTML( mb_convert_encoding( $table_content, 'HTML-ENTITIES', $charset ), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_NOWARNING | LIBXML_NOERROR );

			// check dom handler load status
			if ( $handler_status ) {
				$table = $dom_handler->getElementsByTagName( 'table' );
				if ( $table->length !== 0 ) {
					$table_element = $table->item( 0 );
					$class_list    = $table_element->getAttribute( 'class' );

					if ( strpos( $class_list, 'wptb-element-main-table_setting-startedid-0' ) !== false ) {
						$updated_class_list = str_replace( 'wptb-element-main-table_setting-startedid-0', "wptb-element-main-table_setting-{$id}", $class_list );
						$table_element->setAttribute( 'class', $updated_class_list );

						$final_table_content = $dom_handler->saveHTML();
					}
				}
			}
		}

		return $final_table_content;
	}

	public function get_table() {
		if ( current_user_can( Settings_Manager::ALLOWED_ROLE_META_CAP ) && Init::instance()->settings_manager->current_user_allowed_for_modifications( $_REQUEST['id'] ) ) {
			$post = get_post( absint( $_REQUEST['id'] ) );

			$table_html = get_post_meta( absint( $_REQUEST['id'] ), '_wptb_content_', true );
			$table_html = apply_filters( 'wp-table-builder/filter/get_table', $table_html );

			$name = $post->post_title;
			die( json_encode( [ $name, $table_html ] ) );
		}
	}

	/**
	 * Strip unwanted tags from table HTML.
	 *
	 * @param string $table_html table html
	 *
	 * @return string $table_html
	 */
	public function strip_tags( $table_html ) {
		$no_no_no_list = [ 'script' ];

		$dom_handler = Dom_Document_Factory::make( $table_html );
		if ( ! is_null( $dom_handler ) ) {
			$remove_list = [];

			foreach ( $no_no_no_list as $tag ) {
				$target_tags = iterator_to_array( $dom_handler->getElementsByTagName( $tag ) );

				if ( ! empty( $target_tags ) ) {
					$remove_list = array_merge( $remove_list, $target_tags );
				}
			}

			if ( ! empty( $remove_list ) ) {
				foreach ( $remove_list as $index => $remove_tag ) {
					$remove_tag->parentNode->removeChild( $remove_tag );
				}
				$table_html = $dom_handler->saveHTML();
			}
		}

		return $table_html;
	}

	/**
	 * Add "WPTB Add New" sub menu to "New" dropdown menu in the WP Admin Bar.
	 *
	 * @param WP_Admin_Bar $wp_admin_bar object.
	 *
	 * @since 1.1.5
	 *
	 */
	public function add_wp_admin_bar_new_table_create_page( $wp_admin_bar ) {
		if ( current_user_can( 'manage_options' ) ) {
			$wp_admin_bar->add_menu( array(
				'parent' => 'new-content',
				'id'     => 'wptb-add-new',
				'title'  => __( 'Table', 'wp-table-builder' ),
				'href'   => esc_url( admin_url( 'admin.php?page=wptb-builder' ) ),
			) );
		}
	}


	/**
	 * Register our menus.
	 *
	 * @since 1.0.0
	 */
	public function register_menus() {

		global $builder_page, $tables_overview, $table_list, $builder_tool_page;
		$menu_cap = Helpers::wptb_get_capability_manage_options();

		// Default Tables top level menu item.
		$tables_overview = add_menu_page(
			esc_html__( 'WP Table Builder', 'wp-table-builder' ),
			esc_html__( 'WP Table Builder', 'wp-table-builder' ),
			$menu_cap,
			'wptb-overview',
			array( $this, 'tables_list' ),
			'dashicons-editor-table',
			apply_filters( 'wptb_menu_position', '50' )
		);

		// Add Welcome sub menu item.
		$builder_page = add_submenu_page(
			null,
			esc_html__( 'Table Builder', 'wp-table-builder' ),
			esc_html__( 'Welcome Page', 'wp-table-builder' ),
			$menu_cap,
			'wp-table-builder-welcome',
			array( $this, 'welcome' )
		);

		// All Tables sub menu item.
		$table_list = add_submenu_page(
			'wptb-overview',
			esc_html__( 'WP Table Builder', 'wp-table-builder' ),
			esc_html__( 'All Tables', 'wp-table-builder' ),
			$menu_cap,
			'wptb-overview',
			array( $this, 'tables_list' )
		);

		// Add New Table sub menu item.
		$builder_tool_page = add_submenu_page(
			'wptb-overview',
			esc_html__( 'WP Table Builder', 'wp-table-builder' ),
			esc_html__( 'Add New', 'wp-table-builder' ),
			$menu_cap,
			'wptb-builder',
			array( $this, 'table_builder' )
		);

		$builder_page = $builder_tool_page;

		// Add Import sub menu item.
		$builder_page = add_submenu_page(
			'wptb-overview',
			esc_html__( 'Table Builder', 'wp-table-builder' ),
			esc_html__( 'Import/Export', 'wp-table-builder' ),
			$menu_cap,
			'wptb-import',
			array( $this, 'import' )
		);

		add_action( 'load-' . $builder_page, [ $this, 'load_assets' ] );

		// @deprecated
//		add_action( 'load-' . $tables_overview, function () {
//			add_screen_option( 'per_page', array(
//				'label'   => 'Number of items per page:',
//				'default' => 15,
//				'option'  => 'tables_per_page', // название опции, будет записано в метаполе юзера
//			) );
//		} );

		do_action( 'wptb_admin_menu', $this );

	}


	/**
	 * Load assets
	 *
	 * @since 1.1.5
	 */
	public function load_assets() {

		add_action( 'in_admin_header', [ $this, 'remove_admin_notices' ] );

	}

	/**
	 * Remove all kinds of admin notices
	 *
	 * @since 1.1.5
	 */
	public function remove_admin_notices() {

		remove_all_actions( 'network_admin_notices' );
		remove_all_actions( 'user_admin_notices' );
		remove_all_actions( 'admin_notices' );
		remove_all_actions( 'all_admin_notices' );

	}

	public function enqueue_scripts( $hook ) {
		/*
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
		global $builder_page, $tables_overview, $table_list;

		wp_enqueue_media();

		if ( $hook != ( $builder_page || $table_list || $hook != $tables_overview ) ) {
			return;
		}


		if ( isset( $_GET['page'] ) && sanitize_text_field( $_GET['page'] ) == 'wp-table-builder-welcome' ) {

			//wp_enqueue_script( 'wptb-admin-welcome-js', plugin_dir_url( __FILE__ ) . 'js/admin-welcome.js', array( 'jquery' ), NS\PLUGIN_VERSION, true );
			wp_enqueue_style( 'wptb-admin-welcome-css', plugin_dir_url( __FILE__ ) . 'css/admin-welcome.css', array(), NS\PLUGIN_VERSION, 'all' );

		} elseif ( isset( $_GET['page'] ) && sanitize_text_field( $_GET['page'] ) == 'wptb-builder' ) {

			// builder controls
			$builder_path = plugin_dir_path( __FILE__ ) . 'js/WPTB_BuilderControls.js';

			wp_enqueue_script( 'wptb-controls-manager-js', plugin_dir_url( __FILE__ ) . 'js/WPTB_BuilderControls.js', [], filemtime( $builder_path ), false );

			$strings = [
				'dirtyConfirmation' => esc_html__( 'You have unsaved changes, leave?', 'wp-table-builder' ),
				'embedMessage'      => esc_html__( 'To embed this table on your site, please paste the following shortcode inside a post or page.', 'wp-table-builder' ),
				'copyToClipboard'   => esc_html__( 'copy to clipboard', 'wp-table-builder' ),
				'copied'            => esc_html__( 'copied', 'wp-table-builder' ),
			];

			$table_id = isset( $_GET['table'] ) ? $_GET['table'] : null;

			$admin_object = [
				'ajaxurl'       => admin_url( 'admin-ajax.php' ),
				'security_code' => wp_create_nonce( 'wptb-security-nonce' ),
				'strings'       => $strings,
				'store'         => [
					'tableId' => $table_id,
					'pro'     => Addon_Manager::check_pro_status(),
				]
			];

			$admin_translations = [
				'dirtyConfirmation' => esc_html__( 'You have unsaved changes, leave?', 'wp-table-builder' ),
				'embedMessage'      => esc_html__( 'To embed this table on your site, please paste the following shortcode inside a post or page.', 'wp-table-builder' ),
				'copyToClipboard'   => esc_html__( 'copy to clipboard', 'wp-table-builder' ),
				'copied'            => esc_html__( 'copied', 'wp-table-builder' ),
				'shortcode'         => esc_html__( 'shortcode', 'wp-table-builder' ),
			];

			// add translations to builder menu data
			Frontend_Data_Manager::add_builder_translations( $admin_translations );

			Frontend_Data_Manager::localize_builder_data( 'wptb-controls-manager-js', $admin_object );

			// generate controls
			$generate_path = plugin_dir_path( __FILE__ ) . 'js/WPTB_Generate.js';


			// development version to bypass cache issues
			$admin_script_dev_version = filemtime( plugin_dir_path( __FILE__ ) . 'js/admin.js' );

			Helpers::enqueue_file( 'inc/admin/js/admin.js', [
				'jquery',
				'wptb-admin-builder-tinymce-js',
				'wp-color-picker'

			], true, 'wptb-admin-builder-js', true );

			wp_register_script( 'wptb-admin-builder-tinymce-js', plugin_dir_url( __FILE__ ) . 'js/tinymce/tinymce.min.js', array(), NS\PLUGIN_VERSION, false );

			wp_register_script( 'wptb-admin-builder-tinymce-jquery-js', plugin_dir_url( __FILE__ ) . 'js/tinymce/jquery.tinymce.min.js', array(), NS\PLUGIN_VERSION, false );

			wp_enqueue_style( 'wp-color-picker' );

			Helpers::enqueue_file( 'inc/admin/css/admin.css', [], false, 'wptb-builder-css' );

			wp_enqueue_script( 'wptb-admin-builder-tinymce-js' );
			wp_enqueue_script( 'wptb-admin-builder-tinymce-jquery-js' );
			wp_enqueue_script( 'wptb-admin-builder-js' );
			if ( ! isset( $_GET['table'] ) ) { // enqueue file with the same handler name as pro version and with a low priority to load pro version is it is enabled instead of normal version
				wp_enqueue_script( static::$generate_menu_script_hook, plugin_dir_url( __FILE__ ) . 'js/WPTB_Generate.js', [], filemtime( $generate_path ), true );
				$generate_data = [
					'mountId'        => 'wptbGenerate',
					'version'        => 'normal',
					'adLink'         => add_query_arg( [
						'slug' => 'wp-table-builder-pro',
						'page' => 'wptb-overview-addons'
					], admin_url( 'admin.php' ) ),
					'security'       => null,
					'prebuiltTables' => null,
					'strings'        => [
						'blank'              => esc_html__( 'blank', 'wp-table-builder' ),
						'generate'           => esc_html__( 'generate', 'wp-table-builder' ),
						'edit'               => esc_html__( 'edit', 'wp-table-builder' ),
						'searchPlaceholder'  => esc_html__( 'Search (/ to focus)', 'wp-table-builder' ),
						'prebuiltAdPart1'    => esc_html__( 'For prebuilt tables and much more', 'wp-table-builder' ),
						'prebuiltAdPart2'    => esc_html__( 'Go PRO', 'wp-table-builder' ),
						'deleteConfirmation' => esc_html__( 'Delete prebuilt table?', 'wp-table-builder' ),
					]
				];

				// generate data filter
				$generate_data = apply_filters( 'wp-table-builder/filter/generate_data', $generate_data );

				wp_localize_script( static::$generate_menu_script_hook, 'wptbGenerateMenuData', $generate_data );
			}

			// development version to bypass cache issues
			$admin_script_dev_version = filemtime( plugin_dir_path( __FILE__ ) . 'js/admin.js' );

			wp_register_script( 'wptb-admin-builder-js', plugin_dir_url( __FILE__ ) . 'js/admin.js', array(
				'jquery',
				'wptb-admin-builder-tinymce-js',
				'wp-color-picker'
			), NS\PLUGIN_VERSION, true );

			wp_register_script( 'wptb-admin-builder-tinymce-js', plugin_dir_url( __FILE__ ) . 'js/tinymce/tinymce.min.js', array(), NS\PLUGIN_VERSION, false );

			wp_register_script( 'wptb-admin-builder-tinymce-jquery-js', plugin_dir_url( __FILE__ ) . 'js/tinymce/jquery.tinymce.min.js', array(), NS\PLUGIN_VERSION, false );

			wp_enqueue_style( 'wp-color-picker' );

			wp_enqueue_style( 'wptb-builder-css', plugin_dir_url( __FILE__ ) . 'css/admin.css', array(), NS\PLUGIN_VERSION, 'all' );
			wp_enqueue_script( 'wptb-admin-builder-tinymce-js' );
			wp_enqueue_script( 'wptb-admin-builder-tinymce-jquery-js' );
			wp_enqueue_script( 'wptb-admin-builder-js' );
		} elseif ( isset( $_GET['page'] ) && sanitize_text_field( $_GET['page'] ) == 'wptb-overview' ) {

			Helpers::enqueue_file( 'inc/admin/js/wptb-overview.js', [], true, 'wptb-overview-js' );
			Helpers::enqueue_file( 'inc/admin/css/admin-common.css', [], true, 'wptb-admin-common-css' );
			Helpers::enqueue_file( 'inc/admin/css/wptb-overview.css' );

		} else if ( isset( $_GET['page'] ) && sanitize_text_field( $_GET['page'] ) == 'wptb-import' ) {

			$script_url  = NS\WP_TABLE_BUILDER_URL . 'inc/admin/js/WPTB_Import_Menu.js';
			$script_path = NS\WP_TABLE_BUILDER_DIR . 'inc/admin/js/WPTB_Import_Menu.js';

			$style_url = NS\WP_TABLE_BUILDER_URL . 'inc/admin/css/admin.css';

			$handler        = 'wptb-import-menu';
			$plugin_version = NS\PLUGIN_VERSION;

			// script and style enqueue
			wp_enqueue_script( $handler, $script_url, [], $plugin_version, true );
			wp_register_script( 'wptb-admin-builder-js', plugin_dir_url( __FILE__ ) . 'js/admin.js', array( 'jquery' ), $plugin_version, true );
			wp_enqueue_script( 'wptb-admin-builder-js' );
			wp_enqueue_style( 'wptb-settings-manager-style', $style_url, [], $plugin_version );

			$plugin_homepage  = get_plugin_data( NS\PLUGIN__FILE__ )['PluginURI'];
			$plugin_name      = get_plugin_data( NS\PLUGIN__FILE__ )['Name'];

			$plugin_info = [
				'pluginHomepage' => esc_attr( $plugin_homepage ),
				'pluginName'     => esc_html( $plugin_name ),
				'logo'           => esc_attr( NS\WP_TABLE_BUILDER_URL . 'assets/images/wptb-logo.png' ),
				'plainArrow'     => esc_attr( NS\WP_TABLE_BUILDER_URL . 'assets/images/plain_arrow.svg' ),
			];

			$strings = [
				'logoAlt'            => esc_attr__( 'WPTB plugin logo', 'wp-table-builder' ),
				'importSection'      => esc_html__( 'Import', 'wp-table-builder' ),
				'exportSection'      => esc_html__( 'Export', 'wp-table-builder' ),
				'plugins'            => esc_html__( 'Plugins', 'wp-table-builder' ),
				'tableResponsive'    => esc_html__( 'Make Table Responsive', 'wp-table-builder' ),
				'topRowHeader'       => esc_html__( 'Top Row as Header', 'wp-table-builder' ),
				'csvDelimiter'       => esc_html__( 'CSV Delimiter', 'wp-table-builder' ),
				'preserveTitles'     => esc_html__( 'Preserve table titles', 'wp-table-builder' ),
				'fileDropHint'       => esc_html__( 'Drag and Drop Files', 'wp-table-builder' ),
				'browse'             => esc_html__( 'Browse', 'wp-table-builder' ),
				'clear'              => esc_html__( 'Clear', 'wp-table-builder' ),
				'tableImported'      => esc_html__( 'Table Imported', 'wp-table-builder' ),
				'errorOccurred'      => esc_html__( 'An Error Occurred', 'wp-table-builder' ),
				'operationSuccess'   => esc_html__( 'Tables Imported', 'wp-table-builder' ),
				'replacedShortcodes' => esc_html__( 'Shortcodes Replaced', 'wp-table-builder' ),
				'file'               => esc_html__( 'file', 'wp-table-builder' ),
				'search'             => esc_html__( 'search', 'wp-table-builder' ),
			];

			$import_iframe_url = add_query_arg(
				array(
					'post_type' => 'wptb-tables-import'
				),
				home_url()
			);

			// these are the supported plugins for export
			$supported_export_plugins = [ 'TablePress' ];

			$installed_plugins_array = get_plugins();

			// this is a list of plugins that are already installed and supported in export
			$installed_supported_plugin_names = [];

			foreach ( $installed_plugins_array as $key => $value ) {
				$plugin_name = $value['Name'];
				if ( in_array( $plugin_name, $supported_export_plugins ) ) {
					$installed_supported_plugin_names[] = $plugin_name;
				}
			}

			$options = [
				'security_code'             => wp_create_nonce( 'wptb-import-security-nonce' ),
				'ajaxUrl'                   => admin_url( 'admin-ajax.php' ),
				'import_iframe_url'         => $import_iframe_url,
				'textDomain'                => 'wp-table-builder',
				'fetchNonce'                => Export::get_instance()->generate_nonce( 'fetch' ),
				'fetchAjaxAction'           => Export::EXPORT_FETCH_TABLES,
				'exportNonce'               => Export::get_instance()->generate_nonce( 'export' ),
				'exportAjaxAction'          => Export::EXPORT_TABLES,
				'installedSupportedPlugins' => $installed_supported_plugin_names
			];

			$data = [
				'pluginInfo' => $plugin_info,
				'strings'    => $strings,
				'options'    => $options,
			];

			wp_localize_script( $handler, 'wptbImportMenuData', $data );
		}

	}

	/**
	 * Wrapper for the hook to render our tables list.
	 *
	 * @since 1.0.0
	 */
	public function tables_list() {
		$table_list = new WPTB_Listing();
		?>
        <div class="wrap">
            <div style="margin-bottom: 30px;">
                <h1 class="wp-heading-inline">
					<?php esc_html_e( 'All Tables', 'wp-table-builder' ); ?>
                </h1>
                <span class="wptb-split-page-title-action">
						<a href="<?php echo esc_url( admin_url( 'admin.php?page=wptb-builder' ) ); ?>"
                           class="page-title-action">
							<?php esc_html_e( 'Add New', 'wp-table-builder' ); ?>
						</a>
					</span>
            </div>
			<?php
			$table_list->prepare_items();
			$table_list->views();
			?>
            <form method="get">
                <input type="hidden" name="page" value="<?php esc_attr_e( $_REQUEST['page'] ); ?>"/>
				<?php
				$table_list->search_box( 'Search Tables', 'search_tables' );
				$table_list->display(); ?>
            </form>
        </div>
		<?php
	}

	/**
	 * Wrapper for the hook to render our tables builder.
	 *
	 * @since 1.0.0
	 */
	public function table_builder() {
		require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/wptb-builder-ui.php';
	}

	/**
	 * Wrapper for the hook to render our plugin table import page.
	 *
	 * @since 1.1.5
	 */
	public function import() {
		require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/wptb-import.php';
	}

	/**
	 * Wrapper for the hook to render our plugin welcome page.
	 *
	 * @since 1.1.5
	 */
	public function welcome() {
		require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/wptb-welcome.php';
	}

}
