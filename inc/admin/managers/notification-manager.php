<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Common\Traits\Icon_Manager_Trait;
use function add_action;
use function trailingslashit;

// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Notification_Manager.
 *
 * Notification manager for builder ui.
 *
 * @package WP_Table_Builder\Inc\Admin\Managers
 */
class Notification_Manager {
	// use icon manager trait
	use Icon_Manager_Trait;

	/**
	 * Manager id;
	 */
	const FRONTEND_ELEMENT_ID = 'notificationManager';

	/**
	 * Initialize and setup notification manager.
	 */
	public static function init() {
		add_action( 'wp-table-builder/action/wptb-builder-view', [ __CLASS__, 'notification_builder_view' ] );

		Frontend_Data_Manager::add_builder_data( [ __CLASS__, 'add_manager_data' ], 'notificationManager' );
	}

	/**
	 * Add notification manager frontend script data.
	 *
	 * @return array builder script data
	 */
	public static function add_manager_data() {
		return [
			'id'      => static::FRONTEND_ELEMENT_ID,
			'icons'   => [
				'ok'    => static::icon_manager_instance()->get_icon( 'check', false ),
				'error' => static::icon_manager_instance()->get_icon( 'times', false ),
				'info'  => static::icon_manager_instance()->get_icon( 'info', false ),
				'pro'   => NS\WP_TABLE_BUILDER_URL . 'assets/images/wptb-logo.png'
			],
			'sounds'  => [
				'ding' => NS\WP_TABLE_BUILDER_URL . 'assets/sounds/ding.mp3'
			],
			'options' => [
				// enable/disable sound with notification manager
				'soundEnabled' => false
			]
		];
	}

	/**
	 * Add frontend HTML component.
	 */
	public static function notification_builder_view() {
		require_once( trailingslashit( NS\WP_TABLE_BUILDER_DIR ) . 'inc/admin/views/builder/wptb-builder-notifications.php' );
	}
}
