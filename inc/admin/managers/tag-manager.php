<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder\Inc\Admin\Controls\Control_Section_Group_Collapse;
use WP_Table_Builder\Inc\Admin\Views\Builder\Table_Element\Table_Setting_Element;
use WP_Table_Builder\Inc\Common\Helpers;
use WP_Table_Builder as NS;
use function absint;
use function add_action;
use function add_submenu_page;
use function esc_html__;
use function get_terms;
use function register_taxonomy;
use function wp_set_post_terms;

// if called directly, abort
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
		add_action( 'wp-table-builder/table_settings_registered', [ __CLASS__, 'add_setting_section' ], 1, 1 );
		add_action( 'wp-table-builder/new_table_saved', [ __CLASS__, 'save_terms' ], 1, 2 );
		add_action( 'wp-table-builder/table_edited', [ __CLASS__, 'save_terms' ], 1, 2 );

		add_filter( 'wptb_table_list_columns', [ __CLASS__, 'tables_list_columns' ], 1, 1 );
		add_filter( 'wp-table-builder/filter/listing_column_value_tags', [ __CLASS__, 'tag_column_value' ], 1, 2 );
	}

	/**
	 * Assign value to tag column.
	 *
	 * @param string $current_value current value
	 * @param object $post an object containing properties for the post being used
	 *
	 * @return string tag column value
	 */
	public static function tag_column_value( $current_value, $post ) {
		$post_terms = wp_get_post_terms( $post->ID, static::TAX_ID );

		$parsed_post_terms = array_reduce( $post_terms, function ( $carry, $item ) {
			$carry[] = $item->name;
			return $carry;
		}, [] );

		if ( count( $post_terms ) === 0 ) {
			return '-';
		}

		return join( ',', $parsed_post_terms );
	}


	/**
	 * Add tag to table listing columns.
	 *
	 * @param array $columns columns names
	 *
	 * @return array array of table listing column names
	 */
	public static function tables_list_columns( $columns ) {
		$columns['tags'] = esc_html__( 'Tags', 'wp-table-builder' );

		return $columns;
	}

	/**
	 * Add/remove terms to/from saved post.
	 *
	 * @param int $id post id
	 * @param object $params post body object
	 */
	public static function save_terms( $id, $params ) {
		$post_terms = [];
		if ( property_exists( $params, 'tags' ) ) {
			$post_terms = json_decode( stripslashes( $params->tags ) );
		}

		wp_set_post_terms( absint( $id ), $post_terms, static::TAX_ID );
	}

	/**
	 * Add table tags section to builder settings menu.
	 *
	 * @param Table_Setting_Element $context table setting element instance
	 */
	public static function add_setting_section( $context ) {

		$all_table_tags = get_terms( [
			'taxonomy'   => static::TAX_ID,
			'hide_empty' => false
		] );

		$requested_table_tags = [];
		if ( isset( $_REQUEST['table'] ) ) {
			$requested_table_id   = absint( $_REQUEST['table'] );
			$requested_table_tags = wp_get_post_terms( $requested_table_id, static::TAX_ID );
		}

		$tag_group = [
			'tableTags' => [
				'label'    => esc_html__( 'table tags', 'wp-table-builder' ),
				'type'     => Controls_Manager::TAG_CONTROL,
				'tags'     => $all_table_tags,
				'postTags' => $requested_table_tags
			]
		];

		Control_Section_Group_Collapse::add_section( 'table_settings_tags', esc_html__( 'Table Tags', 'wp-table-builder' ), $tag_group, [
			$context,
			'add_control'
		], false );
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
	 */
	public static function register_menu() {
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

	/**
	 * Register custom taxonomy for tables.
	 */
	public static function register_custom_taxonomy() {
		$args = [
			'labels'       => [
				'name'          => _x( 'Table Tags', 'table tag name', 'wp-table-builder' ),
				'singular_name' => _x( 'Table Tag', 'singular table tag taxonomy name', 'wp-table-builder' ),
				'all_items'     => __( 'All Table Tags', 'wp-table-builder' ),
				'edit_item'     => __( 'Edit Table Tag', 'wp-table-builder' ),
				'add_new_item'  => __( 'Add New Table Tag', 'wp-table-builder' ),
			],
			'description'  => 'tags for wp table builder tables',
			'show_in_menu' => false,
		];

		register_taxonomy( static::TAX_ID, 'post', $args );
	}
}