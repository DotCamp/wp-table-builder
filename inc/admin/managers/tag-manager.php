<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Query;
use WP_Table_Builder\Inc\Admin\Views\Builder\Table_Element\Table_Setting_Element;
use WP_Table_Builder\Inc\Common\Helpers;
use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Common\Traits\Ajax_Response;
use WP_Table_Builder\Inc\Common\Traits\Singleton_Trait;
use WP_Table_Builder\Inc\Core\Init;
use function absint;
use function add_action;
use function add_submenu_page;
use function current_user_can;
use function esc_html__;
use function get_current_screen;
use function get_terms;
use function is_wp_error;
use function register_rest_field;
use function register_taxonomy;
use function sanitize_text_field;
use function wp_create_nonce;
use function wp_insert_term;
use function wp_reset_query;
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
	use Singleton_Trait;
	use Ajax_Response;

	/**
	 * Constant for custom taxonomy id.
	 */
	const TAX_ID = 'table_tags';

	/**
	 * Menu slug for table tags listing screen.
	 * @var string
	 */
	protected static $menu_slug = '';

	/**
	 * Ajax action for creating a new table term.
	 * @var string
	 */
	const CREATE_TERM_ACTION = 'wptb_create_term';

	/**
	 * Initialize tag manager.
	 */
	public static function init() {
		// use pre action hook instead of directly using static section add function since necessary taxonomy functionality is not available inside this init function
		add_action( 'wp-table-builder/pre_table_settings_registered', [ __CLASS__, 'add_setting_section' ] );

		add_action( 'init', [ __CLASS__, 'register_custom_taxonomy' ] );
		add_action( 'admin_enqueue_scripts', [ __CLASS__, 'enqueue_menu_scripts' ] );

		add_action( 'wptb_admin_menu', [ __CLASS__, 'register_menu' ] );

		add_action( 'wp-table-builder/new_table_saved', [ __CLASS__, 'save_terms' ], 1, 2 );
		add_action( 'wp-table-builder/table_edited', [ __CLASS__, 'save_terms' ], 1, 2 );

		add_filter( 'wptb_table_list_columns', [ __CLASS__, 'tables_list_columns' ], 1, 1 );
		add_filter( 'wp-table-builder/filter/listing_column_value_table_tags', [
			__CLASS__,
			'tag_column_value'
		], 1, 2 );

		add_filter( 'wp-table-builder/get_tables_args', [ __CLASS__, 'table_listing' ] );
		add_filter( 'wp-table-builder/record_count', [ __CLASS__, 'table_listing' ] );

		add_filter( 'get_terms', [ __CLASS__, 'table_tags_count' ], 1, 2 );

		add_action( 'wp_ajax_' . self::CREATE_TERM_ACTION, [ __CLASS__, 'create_new_term' ] );

		add_action( 'rest_api_init', [ __CLASS__, 'add_rest_field' ] );
	}

	/**
	 * Add table tags to REST api.
	 */
	public static function add_rest_field() {
		register_rest_field( 'wptb-tables', 'wptb_table_tags', [
			'get_callback' => function ( $table ) {
				return wp_get_post_terms( $table['id'], static::TAX_ID );
			}
		] );
	}


	/**
	 * Ajax endpoint for creating new table term.
	 */
	public static function create_new_term() {
		$manager_instance = static::get_instance();

		if ( current_user_can( Settings_Manager::ALLOWED_ROLE_META_CAP ) && isset( $_POST['nonce'] ) && isset( $_POST['termData'] ) && wp_verify_nonce( $_POST['nonce'], self::CREATE_TERM_ACTION ) ) {
			$manager_instance->set_message( 'ok' );
			$term_data = (array) json_decode( sanitize_text_field( stripslashes( $_POST['termData'] ) ) );


			if ( isset( $term_data['name'] ) && ! empty( $term_data['name'] ) ) {
				$name             = sanitize_text_field( $term_data['name'] );
				$operation_result = wp_insert_term( $name, static::TAX_ID, [
					'slug'        => ( isset( $term_data['slug'] ) && ! empty( $term_data['slug'] ) ) ? sanitize_text_field( $term_data['slug'] ) : $name,
					'description' => isset( $term_data['description'] ) ? sanitize_text_field( $term_data['description'] ) : ''
				] );

				if ( is_wp_error( $operation_result ) ) {
					$manager_instance->set_error( esc_html__( 'an error while creating term, please refresh and try again', 'wp-table-builder' ) );
				} else {
					$all_table_tags = get_terms( [
						'taxonomy'   => static::TAX_ID,
						'hide_empty' => false
					] );

					$manager_instance->set_message( 'ok' );
					$manager_instance->append_response_data( $all_table_tags, 'tags' );
				}
			} else {
				$manager_instance->set_error( esc_html__( 'you need to give your term a valid name', 'wp-table-builder' ) );
			}
		} else {
			$manager_instance->set_error( esc_html__( 'you are not authorized to use this ajax endpoint, refresh and try again', 'wp-table-builder' ) );
		}

		$manager_instance->send_json( true );
	}


	/**
	 * Update count values of table tags with correct values.
	 *
	 * @param array $terms an array of found terms
	 * @param array $tax taxonomy name array
	 *
	 * @return array terms
	 */
	public static function table_tags_count( $terms, $tax ) {
		if ( is_array( $tax ) && in_array( static::TAX_ID, $tax ) ) {
			array_walk( $terms, function ( $term ) {
				if ( is_object( $term ) ) {
					if ( $term->taxonomy === static::TAX_ID ) {
						$count = ( new WP_Query( [
							'post_type'    => 'wptb-tables',
							'post_status'  => 'draft',
							'tax_query'    => [
								[
									'taxonomy' => static::TAX_ID,
									'field'    => 'slug',
									'terms'    => $term->slug
								]
							],
							'meta_key'     => '_wptb_content_',
							'meta_compare' => 'EXISTS'
						] ) )->found_posts;

						wp_reset_query();
						$term->count = $count;
					}
				}
			} );
		}

		return $terms;
	}

	/**
	 * Filter table listing query at tables overview menu.
	 *
	 * @param array $params table list query
	 *
	 * @return array filtered listing query params
	 */
	public static function table_listing( $params ) {
		global $tables_overview;
		$current_screen = get_current_screen();

		if ( is_object( $current_screen ) && $current_screen->base === $tables_overview ) {
			$screen_options_manager = Init::instance()->screen_options_manager;
			$tag_options            = $screen_options_manager->get_all_options( array_keys( static::screen_options() )[0] );

			if ( $tag_options !== null ) {
				if ( ! isset( $params['tax_query'] ) ) {
					$params['tax_query'] = [];
				}

				$terms = array_reduce( array_keys( $tag_options ), function ( $carry, $item ) use ( $tag_options ) {
					if ( $tag_options[ $item ] === 'on' ) {
						$carry[] = $item;
					}

					return $carry;
				}, [] );

				if ( count( $terms ) > 0 ) {
					$params['tax_query'][] = [
						'taxonomy' => static::TAX_ID,
						'field'    => 'slug',
						'terms'    => $terms
					];
				}
			}
		}

		return $params;
	}

	/**
	 * Screen options data.
	 * @return array screen options data
	 */
	protected static function screen_options() {
		$all_terms = get_terms( [
			'taxonomy'   => static::TAX_ID,
			'hide_empty' => false
		] );

		// prepare terms for settings
		$settings_terms = array_reduce( $all_terms, function ( $carry, $item ) {
			$carry[ $item->slug ] = [
				'title' => $item->name,
				'value' => 'off'
			];

			return $carry;
		}, [] );

		return [
			'table_tag_options' => [
				'label'    => esc_html__( 'Filter Table Tags', 'wp-table-builder' ),
				'settings' => $settings_terms
			]
		];
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
		$columns['table_tags'] = esc_html__( 'Table Tags', 'wp-table-builder' );

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
	 */
	public static function add_setting_section() {
		require_once( ABSPATH . 'wp-includes/pluggable.php' );

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
				'postTags' => $requested_table_tags,
				'security' => [
					'create' => [
						'nonce'   => wp_create_nonce( self::CREATE_TERM_ACTION ),
						'action'  => static::CREATE_TERM_ACTION,
						'ajaxUrl' => admin_url( 'admin-ajax.php' )
					]
				]
			]
		];

		Table_Setting_Element::add_settings_section( 'table_settings_tags', esc_html__( 'Table Tags', 'wp-table-builder' ), $tag_group, 'tags' );
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
			'show_in_ui'   => false,
			'show_in_rest' => true
		];

		register_taxonomy( static::TAX_ID, 'post', $args );

		// setup screen options for table tags
		new Tag_Screen_Options( static::screen_options() );
	}
}
