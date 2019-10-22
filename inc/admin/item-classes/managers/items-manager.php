<?php
namespace WP_Table_Builder\Inc\Admin\Item_Classes\Managers;
use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder items manager.
 *
 * WP Table Builder items manager handler class is responsible for registering and
 * initializing all the supported WP Table Builder items.
 *
 * @since 1.1.2
 */
class Items_Manager {
    /**
	 * Item objects.
	 *
	 * Holds the list of all the item objects.
	 *
	 * @since 1.1.2
	 * @access private
	 *
	 * @var WPTB_Item_Base_Object[]
	 */
	private $_item_objects = null;

	/**
	 * Init Items.
	 *
	 * Initialize WP Table Builder Items manager. Include all the the items files.
	 *
	 * @since 1.1.2
	 * @access private
	*/
	private function init_items() {
		$build_items_filename = [
			'text'
		];

		$this->_item_objects = [];

		foreach ( $build_items_filename as $item_filename ) {
			include( NS\WP_TABLE_BUILDER_DIR . 'inc/admin/item-classes/items/' . $item_filename . '-item.php' );

			$class_name = ucfirst( $item_filename ) . '_Item';

			$class_name = '\WP_Table_Builder\Inc\Admin\Item_Classes\Items\\' . $class_name;
            
            $object = new $class_name();

			$this->register_item_object( $object );
            
            $object->init_controls();
		}
	}
    
    /**
	 * Register item object.
	 *
	 * Add a new item object to the list of registered item objects.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @param WPTB_Item_Base_Object $item WP Table Builder item.
	 *
	 * @return true True if the item was registered.
	*/
	public function register_item_object( $item ) {
		$this->_item_objects[ $item->get_name() ] = $item;

		return true;
	}
    
    /**
	 * Get item objects.
	 *
	 * Retrieve the registered item objects list.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @param string $item_name Optional. Item name. Default is null.
	 *
	 * @return WPTB_Item_Base_Object|WPTB_Item_Base_Object[]|null Registered item objects.
	*/
	public function get_item_objects( $item_name = null ) {
		if ( is_null( $this->_item_objects ) ) {
			$this->init_items();
		}

		if ( null !== $item_name ) {
			return isset( $this->_item_objects[ $item_name ] ) ? $this->_item_objects[ $item_name ] : null;
		}
		return $this->_item_objects;
	}
    
    /**
	 * Render items content.
	 *
	 * @since 1.1.2
	 * @access public
	*/
	public function output_items_templates() {
		foreach ( $this->get_item_objects() as $item ) {
			$item->output_template();
		}
	}
}