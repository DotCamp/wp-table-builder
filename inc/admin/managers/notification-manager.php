<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder as NS;

// if called directly, abort
use function add_action;
use function trailingslashit;

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
	/**
	 * Manager id;
	 */
	const FRONTEND_ELEMENT_ID = 'notificationManager';

	/**
	 * Initialize and setup notification manager.
	 */
	public static function init() {
		add_action( 'wp-table-builder/action/wptb-builder-view', [ __CLASS__, 'notification_builder_view' ] );
		add_filter( 'wp-table-builder/filter/builder_script_data', [ __CLASS__, 'add_manager_data' ], 10, 1 );
	}

	/**
	 * Add notification manager frontend script data.
	 *
	 * @param array $data current script data
	 *
	 * @return array builder script data
	 */
	public static function add_manager_data( $data ) {
		$manager_data                = [
			'id' => static::FRONTEND_ELEMENT_ID
		];
		$data['notificationManager'] = $manager_data;

		return $data;
	}

	/**
	 * Add frontend HTML component.
	 */
	public static function notification_builder_view() {
		require_once( trailingslashit( NS\WP_TABLE_BUILDER_DIR ) . 'inc/admin/views/builder/wptb-builder-notifications.php' );
	}
}