<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Query;
use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Core\Init;
use function add_action;
use function add_query_arg;
use function admin_url;
use function apply_filters;
use function get_current_screen;
use function get_post_meta;
use function is_gutenberg_page;
use function register_block_type;
use function wp_localize_script;
use function wp_register_script;
use function wp_register_style;
use function wp_reset_query;

// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Gutenberg_Block_Manager.
 * Class for handling gutenberg block editor related functionality.
 * @package WP_Table_Builder\Inc\Admin\Managers
 */
class Gutenberg_Block_Manager {
	/**
	 * Assets array for generated block files.
	 * @var array
	 */
	protected $assets;

	/**
	 * Name of the block element.
	 * @var string
	 */
	protected $block_name;

	/**
	 * Gutenberg_Block_Manager constructor.
	 *
	 * @param string $block_name block name
	 */
	public function __construct( $block_name ) {
		$this->block_name = $block_name;
		$this->assets     = require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/js/gutenberg-build/wptb-block.asset.php';

		add_action( 'init', [ $this, 'register_block' ] );
	}

	/**
	 * Check current WP version for gutenberg compatibility.
	 * @return bool wp version ok or not
	 */
	protected function check_wp_compatibility() {
		if ( function_exists( 'is_gutenberg_page' ) && is_gutenberg_page() ) {
			return true;
		}

		if ( ! function_exists( 'get_current_screen' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/screen.php' );
		}

		$current_screen = get_current_screen();
		if ( method_exists( $current_screen, 'is_block_editor' ) && $current_screen->is_block_editor() ) {
			return true;
		}

		return false;
	}

	/**
	 * Register editor block.
	 */
	public function register_block() {
		// check user cap before registering block
		// extra Gutenberg check for WordPress versions <= 4.9
		if ( current_user_can( Settings_Manager::ALLOWED_ROLE_META_CAP ) && function_exists( 'register_block_type' ) ) {
			wp_register_script( 'wptb_block_editor_script', NS\WP_TABLE_BUILDER_URL . 'inc/admin/js/gutenberg-build/wptb-block.js', $this->assets['dependencies'], $this->assets['version'] );

			wp_register_style( 'wptb_block_editor_style', NS\WP_TABLE_BUILDER_URL . 'inc/admin/js/gutenberg-build/wptb-block.css', [], $this->assets['version'] );

			//@deprecated
//			wp_register_style( 'wptb_block_editor_admin_style', NS\WP_TABLE_BUILDER_URL . 'inc/admin/css/admin.css', [], NS\PLUGIN_VERSION );

			$block_data = $this->prepare_block_data();

			wp_localize_script( 'wptb_block_editor_script', 'wptbBlockData', $block_data );

			register_block_type( $this->block_name, [
				'editor_script' => 'wptb_block_editor_script',
				'editor_style'  => 'wptb_block_editor_style'
			] );
		}
	}

	/**
	 * Prepare data to be used at frontend block.
	 * @return array block data
	 */
	protected function prepare_block_data() {
		// @deprecated
//		$table_query = new WP_Query( [
//			'post_type'  => 'wptb-tables',
//			'meta_query' => [
//				'key'     => '_wptb_prebuilt_',
//				'compare' => 'NOT EXISTS'
//			]
//		] );
//
//		$tables = array_reduce( $table_query->posts, function ( $carry, $table ) {
//			$current_table = [
//				'id'      => $table->ID,
//				'title'   => empty( $table->post_title ) ? esc_html__( 'Table', 'wp-table-builder' ) . ' #' . $table->ID : $table->post_title,
//				'content' => get_post_meta( $table->ID, '_wptb_content_', true )
//			];
//
//			$carry[] = $current_table;
//
//			return $carry;
//		}, [] );
//
//		wp_reset_query();

		$admin_page       = admin_url( 'admin.php' );
		$builder_url      = add_query_arg( [ 'page' => 'wptb-builder' ], $admin_page );
		$normal_table_css = add_query_arg( [ 'ver' => NS\PLUGIN_VERSION ], NS\WP_TABLE_BUILDER_URL . 'inc/admin/css/admin.css' );

		$table_css_url = [
			'normal' => $normal_table_css
		];

		$table_css_url = apply_filters( 'wp-table-builder/filter/wptb_gutenberg_preview_css_url', $table_css_url );

		$table_scripts = [
			'extra-styles' => add_query_arg( [ 'ver' => NS\PLUGIN_VERSION ], NS\WP_TABLE_BUILDER_URL . 'inc/admin/js/WPTB_Block_ExtraStyles.js' )
		];

		$general_styles = NS\Inc\Admin\Style_Pass::get_general_styles();

		if ( ! empty( $general_styles ) ) {
			// override default parent prefix value for gutenberg block table preview
			$general_styles['parentPrefix'] = '.wptb-block-table-setup';
		}


		return [
			'blockName'     => $this->block_name,
			'icon'          => Init::instance()->get_icon_manager()->get_icon( 'table' ),
			'tables'        => [],
			'builderUrl'    => $builder_url,
			'tableCssUrl'   => $table_css_url,
			'tableScripts'  => $table_scripts,
			'generalStyles' => $general_styles,

		];
	}
}
