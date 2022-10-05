<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder\Inc\Common\Helpers;
use function path_join;
use function WP_Filesystem;
use function wp_localize_script;

// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Icon_Manager
 * @package WP_Table_Builder\Inc\Admin\Managers
 */
class Icon_Manager {
	/**
	 * Icon directory path.
	 *
	 * @private
	 * @var string
	 */
	private $icon_dir_path;

	/**
	 * Icon directory url.
	 *
	 * @private
	 * @var string
	 */
	private $icon_dir_url;

	/**
	 * Icon_Manager constructor.
	 *
	 * @param string $icon_dir_path icon directory path
	 * @param string $icon_dir_url icon directory url
	 */
	public function __construct( $icon_dir_path, $icon_dir_url ) {
		$this->icon_dir_path = $icon_dir_path;
		$this->icon_dir_url  = $icon_dir_url;

		Frontend_Data_Manager::add_builder_data( [ $this, 'icon_manager_frontend_data' ], 'iconManager' );
	}

	/**
	 * Enqueue icon manager related assets to frontend.
	 *
	 * @param boolean $in_footer whether enqueue script files to footer or not
	 */
	public function enqueue_icon_manager_assets( $in_footer = true ) {
		$script_relative_path = 'inc/admin/js/WPTB_IconManager.js';

		Helpers::enqueue_file( $script_relative_path, [], $in_footer, 'wptb-icon-manager-js' );

		wp_localize_script( 'wptb-icon-manager-js', 'wptb_admin_object', [
			'iconManager' => $this->get_icon_list()
		] );
	}

	/**
	 * Add icon manager related data to builder menu.
	 *
	 * @return array admin data with icon manager related data
	 */
	public function icon_manager_frontend_data() {
		return $this->get_icon_list();
	}

	/**
	 * Get complete list of available icons.
	 *
	 * @param string $extension file extension to filter out results
	 *
	 * @return array an associated array of icon list with keys as icon name and values as icon url
	 */
	public function get_icon_list( $extension = 'svg' ) {
		WP_Filesystem( true );

		// continue filesystem read operations from here if credential check passes
		global $wp_filesystem;

		$filtered_files = [];
		if ( $wp_filesystem->is_dir( $this->icon_dir_path ) ) {
			$icons = $wp_filesystem->dirlist( $this->icon_dir_path );
			foreach ( $icons as $name => $info ) {
				$current_file_path = path_join( $this->icon_dir_path, $name );
				$file_info         = pathinfo( $current_file_path );
				if ( $file_info['extension'] === $extension ) {
					$current_file_url                         = join( '', [
						trailingslashit( $this->icon_dir_url ),
						$name
					] );
					$filtered_files[ $file_info['filename'] ] = $current_file_url;
				}
			}
		}

		return $filtered_files;
	}


	/**
	 * Get an icon.
	 *
	 * @param string $icon_name icon name
	 * @param boolean $echo_to_output whether add the icon to output buffer or return as string
	 * @param string $extension extra filename info for icon
	 *
	 * @return string|void return a string representation of the icon or void depending on to chose to output to buffer
	 */
	public function get_icon( $icon_name, $echo_to_output = false, $extension = 'svg', $container = null ) {
		require_once ABSPATH . 'wp-admin/includes/file.php';

		WP_Filesystem( true );

		global $wp_filesystem;

		$file_path = path_join( $this->icon_dir_path, join( '.', [ $icon_name, $extension ] ) );
		if ( $wp_filesystem->is_file( $file_path ) ) {
			$icon_string = $this->add_container( $wp_filesystem->get_contents( $file_path ), $container );
			if ( $echo_to_output ) {
				echo $icon_string;
			} else {
				return $icon_string;
			}
		}
	}

	/**
	 * Surround given icon with supplied container.
	 *
	 * @param string $icon_string icon string
	 * @param string $container container string
	 */
	private function add_container( $icon_string, $container = null ) {
		$final_container = $icon_string;

		$match_array = [];

		$match_status = preg_match( '/^(?<container><(?<tag>\w+).*?>)/', $container, $match_array );

		if ( filter_var( $match_status, FILTER_VALIDATE_BOOLEAN ) ) {
			if ( isset( $match_array['tag'] ) ) {
				$final_container = sprintf( '%1$s%2$s</%3$s>', $match_array['container'], $icon_string, $match_array['tag'] );
			}
		}

		return $final_container;
	}
}
