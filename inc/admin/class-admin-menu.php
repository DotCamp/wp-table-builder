<?php

namespace WP_Table_Builder\Inc\Admin;

use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Admin\Managers\Settings_Manager;
use WP_Table_Builder\Inc\Common\Helpers;
use function admin_url;
use function get_plugins;
use function current_user_can;
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
	 * Primary class constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		// Let's make some menus.
        add_filter( 'set_screen_option_'.'tables_per_page', function( $status, $option, $value ){
            return (int) $value;
        }, 10, 3 );

        add_filter( 'set-screen-option', function( $status, $option, $value ){
            return ( $option == 'tables_per_page' ) ? (int) $value : $status;
        }, 10, 3 );
		add_action( 'admin_menu', array( $this, 'register_menus' ), 9 );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'wp_ajax_create_table', array( $this, 'create_table' ) );
		add_action( 'wp_ajax_save_table', array( $this, 'save_table' ) );
		add_action( 'wp_ajax_get_table', array( $this, 'get_table' ) );
		add_action( 'admin_bar_menu', array( $this, 'add_wp_admin_bar_new_table_create_page' ), 500 );
	}

	public function create_table() {
		if (current_user_can(Settings_Manager::ALLOWED_ROLE_META_CAP)) {
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

		if ( current_user_can( Settings_Manager::ALLOWED_ROLE_META_CAP) && wp_verify_nonce( $params->security_code, 'wptb-security-nonce' ) ||
		     wp_verify_nonce( $params->security_code, 'wptb-import-security-nonce' ) ) {

			if ( ! property_exists( $params, 'id' ) || ! absint( $params->id ) || get_post_status( absint( $params->id ) ) != 'draft' ) {
				$id = wp_insert_post( [
					'post_title'   => sanitize_text_field( $params->title ),
					'post_content' => '',
					'post_type'    => 'wptb-tables',
					'post_status'  => 'draft'
				] );

				add_post_meta( $id, '_wptb_content_', $params->content );

				wp_die( json_encode( [ 'saved', $id ] ) );
			} else {
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
					update_post_meta( absint( $params->id ), '_wptb_content_', $params->content );

					wp_die( json_encode( [ 'edited', absint( $params->id ) ] ) );
				}
			}
		} else {
			wp_die( json_encode( [ 'security_problem', '' ] ) );
		}
	}

	public function get_table() {
		if ( current_user_can(Settings_Manager::ALLOWED_ROLE_META_CAP)) {
			$post       = get_post( absint( $_REQUEST['id'] ) );
			$table_html = get_post_meta( absint( $_REQUEST['id'] ), '_wptb_content_', true );
			$name       = $post->post_title;//$html = json_decode( $html );
			die( json_encode( [ $name, $table_html ] ) );
		}
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
				'title'  => __( 'Table', 'wp_table_builder' ),
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

		global $builder_page, $tables_overview, $table_list;
		$menu_cap = Helpers::wptb_get_capability_manage_options();

		// Default Tables top level menu item.
		$tables_overview = add_menu_page(
			esc_html__( 'WP Table Builder', 'wp-table-builder' ),
			esc_html__( 'Table Builder', 'wp-table-builder' ),
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
		$builder_page = add_submenu_page(
			'wptb-overview',
			esc_html__( 'WP Table Builder', 'wp-table-builder' ),
			esc_html__( 'Add New', 'wp-table-builder' ),
			$menu_cap,
			'wptb-builder',
			array( $this, 'table_builder' )
		);

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

		add_action(  'load-' . $tables_overview, function () {
            add_screen_option( 'per_page', array(
                'label' => 'Number of items per page:',
                'default' => 15,
                'option' => 'tables_per_page', // название опции, будет записано в метаполе юзера
            ) );
        } );

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
            $builder_path = plugin_dir_path(__FILE__) . 'js/WPTB_BuilderControls.js';

			wp_enqueue_script('wptb-controls-manager-js', plugin_dir_url(__FILE__) . 'js/WPTB_BuilderControls.js' , [], filemtime($builder_path), false);

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

			wp_localize_script(
				'wptb-admin-builder-js',
				'wptb_admin_object',
				[
					'ajaxurl'       => admin_url( 'admin-ajax.php' ),
					'security_code' => wp_create_nonce( 'wptb-security-nonce' ),
				]
			);

		} elseif ( isset( $_GET['page'] ) && sanitize_text_field( $_GET['page'] ) == 'wptb-overview' ) {

			wp_enqueue_script( 'wptb-overview-js', plugin_dir_url( __FILE__ ) . 'js/wptb-overview.js', array( 'jquery' ), NS\PLUGIN_VERSION, true );
			wp_enqueue_style( 'wptb-admin-common-css', plugin_dir_url( __FILE__ ) . 'css/admin-common.css', array(), NS\PLUGIN_VERSION, 'all' );

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

			$wptb_text_domain = NS\PLUGIN_TEXT_DOMAIN;
			$plugin_homepage  = get_plugin_data( NS\PLUGIN__FILE__ )['PluginURI'];
			$plugin_name      = get_plugin_data( NS\PLUGIN__FILE__ )['Name'];

			$plugin_info = [
				'pluginHomepage' => esc_attr( $plugin_homepage ),
				'pluginName'     => esc_html( $plugin_name ),
				'logo'           => esc_attr( NS\WP_TABLE_BUILDER_URL . 'assets/images/wptb-logo.png' ),
				'plainArrow'     => esc_attr( NS\WP_TABLE_BUILDER_URL . 'assets/images/plain_arrow.svg' ),
			];

			$strings = [
				'logoAlt'            => esc_attr__( 'WPTB plugin logo', $wptb_text_domain ),
				'importSection'      => esc_html__( 'Import', $wptb_text_domain ),
				'exportSection'      => esc_html__( 'Export', $wptb_text_domain ),
				'plugins'            => esc_html__( 'Plugins', $wptb_text_domain ),
				'tableResponsive'    => esc_html__( 'Make Table Responsive', $wptb_text_domain ),
				'topRowHeader'       => esc_html__( 'Top Row as Header', $wptb_text_domain ),
				'csvDelimiter'       => esc_html__( 'CSV Delimiter', $wptb_text_domain ),
				'fileDropHint'       => esc_html__( 'Drag and Drop Files', $wptb_text_domain ),
				'browse'             => esc_html__( 'Browse', $wptb_text_domain ),
				'clear'              => esc_html__( 'Clear', $wptb_text_domain ),
				'tableImported'      => esc_html__( 'Table Imported', $wptb_text_domain ),
				'errorOccured'       => esc_html__( 'An Error Occured', $wptb_text_domain ),
				'operationSuccess'   => esc_html__( 'Tables Imported', $wptb_text_domain ),
				'replacedShortcodes' => esc_html__( 'Shortcodes Replaced', $wptb_text_domain ),
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
				'textDomain'                => $wptb_text_domain,
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
            <input type="hidden" name="page" value="<?php echo $_REQUEST['page'] ?>" />
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

;