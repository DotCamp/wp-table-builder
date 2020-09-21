<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

// if called directly, abort
use WP_Table_Builder\Inc\Admin\Admin_Menu;
use WP_Table_Builder\Inc\Common\Helpers;
use WP_Table_Builder as NS;
use function add_action;
use function add_filter;
use function add_submenu_page;
use function register_taxonomy;
use const esc_html__;

if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Tag_Manager
 *
 * Manager responsible for adding tags to tables.
 * @package WP_Table_Builder\Inc\Admin\Managers
 */
class Tag_Manager {

	/**
	 * Constant for custom taxonomy id.
	 */
	const TAX_ID = 'table_tags';

	protected static $menu_slug = '';

	/**
	 * Initialize tag manager.
	 */
	public static function init() {
		add_action( 'init', [ __CLASS__, 'register_custom_taxonomy' ] );
		add_action( 'wptb_admin_menu', [ __CLASS__, 'register_menu' ] );
		add_action( 'admin_enqueue_scripts', [ __CLASS__, 'enqueue_menu_scripts' ] );
	}

	/**
	 * Add menu related scripts/styles.
	 *
	 * @param string $hook current menu hook
	 */
	public static function enqueue_menu_scripts( $hook ) {
		if ( $hook === static::$menu_slug ) {
			$style_url = NS\WP_TABLE_BUILDER_URL . 'inc/admin/css/admin.css';

			wp_enqueue_style( 'table_tags_menu_css', $style_url, [], NS\PLUGIN_VERSION );
		}
	}

	/**
	 * Register table tags sub menu.
	 *
	 * @param Admin_Menu $context admin menu instance
	 */
	public static function register_menu( $context ) {
		static::$menu_slug = add_submenu_page( 'wptb-overview', esc_html__( 'Table Tags', 'wp-table-builder' ), esc_html__( 'Table Tags', 'wp-table-builder' ), Helpers::wptb_get_capability_manage_options(), 'wptb_table_tags', [
			__CLASS__,
			'show_tags_menu'
		] );
	}


	/**
	 * Show tags menu.
	 */
	public static function show_tags_menu() {
		?>
      <iframe src="<?php echo admin_url( 'edit-tags.php?taxonomy=table_tags' ); ?>"
              class="wptb-table-tags-menu-wrapper">
      </iframe>
		<?php
	}

	public static function register_custom_taxonomy() {
		$args = [
			'description'  => 'tags for tables',
			'show_in_menu' => false,
		];


		register_taxonomy( static::TAX_ID, 'post', $args );
	}

	protected static function add_terms() {
	}
}