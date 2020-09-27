<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder as NS;
use function add_action;
use function register_block_type;
use function wp_register_script;
use function wp_register_style;

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
	 * Register editor block.
	 */
	public function register_block() {
		// check user cap before registering block
		if ( current_user_can( Settings_Manager::ALLOWED_ROLE_META_CAP ) ) {
			wp_register_script( 'wptb_block_editor_script', NS\WP_TABLE_BUILDER_URL . 'inc/admin/js/gutenberg-build/wptb-block.js', $this->assets['dependencies'], $this->assets['version'] );

			wp_register_style( 'wptb_block_editor_style', NS\WP_TABLE_BUILDER_URL . 'inc/admin/js/gutenberg-build/wptb-block.css', [], $this->assets['version'] );

			$block_data = [
				'blockName' => $this->block_name,
				'icon'      => NS\Inc\Core\Init::instance()->get_icon_manager()->get_icon( 'table' )
			];

			wp_localize_script( 'wptb_block_editor_script', 'wptbBlockData', $block_data );

			register_block_type( $this->block_name, [
				'editor_script' => 'wptb_block_editor_script',
				'editor_style' => 'wptb_block_editor_style',
			] );
		}
	}
}