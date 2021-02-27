<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

// if called directly, abort
use WP_Error;
use function add_action;
use function add_filter;
use function is_wp_error;

if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Version_Sync_Manager.
 * @package WP_Table_Builder\Inc\Admin\Managers
 */
class Version_Sync_Manager {

	/**
	 * Subscribers list.
	 *
	 * This array will contain subscriber slug name as keys and instances as values.
	 * @var array
	 */
	private static $subscribers = [];

	/**
	 * Initialization state.
	 * @var bool
	 */
	private static $initialized = false;

	/**
	 * Seconds in an hour
	 */
	const HOUR_IN_SECONDS = 60 * 60;

	/**
	 * Initialize version sync manager.
	 */
	public static function init() {
		if ( ! static::$initialized ) {
			add_filter( 'upgrader_pre_download', [ __CLASS__, 'call_subs' ], 10, 4 );

			// TODO [erdembircan] remove for production
			add_filter( 'plugin_row_meta', [ __CLASS__, 'plugin_row_meta' ], 10, 3 );
			add_action( 'wp_ajax_version_sync_test', [ __CLASS__, 'version_sync_test' ] );

			static::show_error_message();
		}

		static::$initialized = true;
	}

	public static function version_sync_test() {
		static::call_subs( false, 'https://downloads.wordpress.org/plugin/wp-table-builder.1.3.3.zip', null, [ 'plugin' => 'wp-table-builder/wp-table-builder.php' ] );
		echo json_encode( [ 'message' => 'ok' ] );
		die();
	}

// TODO [erdembircan] remove for production
	public static function plugin_row_meta( $plugin_meta, $plugin_file, $plugin_data ) {
		if ( $plugin_data['slug'] === 'wp-table-builder' ) {
			$admin_url                = get_admin_url( null, 'admin-ajax.php' );
			$version_sync_test_button = <<<WSTB
<button id="wptb-version-sync-test">Version Sync Test Button</button>
<script type="application/javascript">
const versionSyncTestButton = document.querySelector('#wptb-version-sync-test');

versionSyncTestButton.addEventListener('click', (e)=>{
    e.preventDefault();
    const url = '$admin_url';
    
    e.target.disabled = true;
    fetch(url + '?action=version_sync_test').then((resp) => {return resp.json()}).then((res) => {
        window.location.reload();
    })
})
</script>
WSTB;


			$plugin_meta[] = $version_sync_test_button;
		}

		return $plugin_meta;
	}

	/**
	 * If supplied id is a subscriber.
	 *
	 * @param string $sub_id subscriber id
	 *
	 * @return bool is subscribed or not
	 */
	private static function is_subscribed( $sub_id ) {
		return isset( static::$subscribers[ $sub_id ] );
	}

	/**
	 * Get a subscriber.
	 *
	 * @param string $sub_id subscriber id
	 *
	 * @return object|null subscriber context or null if no subscriber is found
	 */
	private static function get_subscriber( $sub_id ) {
		$sub = null;

		if ( static::is_subscribed( $sub_id ) ) {
			$sub = static::$subscribers[ $sub_id ];
		}

		return $sub;
	}

	/**
	 * Call subscribers.
	 *
	 * Subscribers will be called at every time an update/downgrade package is started downloading through WordPress upgrader methods. This filter hook will be used as a short circuit to continue/stop current update process depending on values available and responses gathered from subscribers of the manager.
	 *
	 * @param bool $status status of download
	 * @param string $package package url
	 * @param Object $context upgrader class context
	 * @param array $hook_extra extra hook arguments
	 *
	 * @return bool|WP_Error status of download process
	 */
	public static function call_subs( $status, $package, $context, $hook_extra ) {
		$final_status = $status;
		if ( isset( $hook_extra['plugin'] ) ) {
			// short circuit sub calling if current install process marked as not to trigger version sync manager
			if ( isset( $hook_extra['wptb-version-sync-trigger'] ) && $hook_extra['wptb-version-sync-trigger'] === false ) {
				return $final_status;
			}

			$slug = static::parse_slug_from_relative_path( $hook_extra['plugin'] );

			// only continue logic operations if slug of plugin that is currently being on install process is a subscribed one
			if ( static::is_subscribed( $slug ) ) {
				// get subscriber context of the addon currently in install process
				$active_sub = static::get_subscriber( $slug );

				if ( $active_sub !== null ) {
					$version = $active_sub->parse_version_from_package( $package );

					// filter subscriber array to get all subscribers except the one currently target of the install process
					$other_subs = array_filter( static::$subscribers, function ( $sub_id ) use ( $slug ) {
						return $sub_id !== $slug;

					}, ARRAY_FILTER_USE_KEY );

					$final_status = array_reduce( array_keys( $other_subs ), function ( $carry, $sub_id ) use ( $slug, $version, $other_subs ) {
						// TODO [erdembircan] change version to supplied version for production after testing
						$sub_status = $other_subs[ $sub_id ]->version_sync_logic( $slug, '1.3.4' );
						if ( is_wp_error( $sub_status ) ) {
							$carry = $sub_status;
						}

						return $carry;
					}, $final_status );
				}
			}
		}

		// set an admin notification for error display
		if ( is_wp_error( $final_status ) ) {
			static::set_admin_error_notice( $final_status->get_error_message() );
		}

		return $final_status;
	}

	/**
	 * Parse plugin slug from its relative path of entry file to plugin directory.
	 *
	 * @param string $relative_path relative path
	 *
	 * @return null|string slug or null if no slug found from path
	 */
	private static function parse_slug_from_relative_path( $relative_path ) {
		$match = [];
		preg_match( '/^.+\/(.+)\.php$/', $relative_path, $match );

		if ( isset( $match[1] ) ) {
			return $match[1];
		}

		return null;
	}

	/**
	 * Subscribe to version sync manager events.
	 *
	 * @param string $slug slug name
	 * @param Object $instance subscriber class instance
	 */
	public static function subscribe( $slug, $instance ) {
		if ( is_subclass_of( $instance, '\WP_Table_Builder\Inc\Admin\Base\Version_Sync_Base' ) ) {
			static::$subscribers[ $slug ] = $instance;
		}
	}

	/**
	 * Show admin error messages at admin notice board.
	 */
	public static function show_error_message() {
		$error_message = get_transient( 'wptb-version-sync-error-message' );

		if ( $error_message !== false ) {
			Admin_Notices_Manager::show_notice( $error_message, Admin_Notices_Manager::ERROR );
			delete_transient( 'wptb-version-sync-error-message' );
		}
	}

	/**
	 * Set an admin error message.
	 *
	 * @param string $message message
	 */
	private static function set_admin_error_notice( $message ) {
		set_transient( 'wptb-version-sync-error-message', $message, self::HOUR_IN_SECONDS );
	}
}
