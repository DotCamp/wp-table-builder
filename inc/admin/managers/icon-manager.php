<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use function path_join;
use function request_filesystem_credentials;
use function WP_Filesystem;

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
	}

	/**
	 * Get complete list of available icons.
	 *
	 * @param string $extension file extension to filter out results
	 *
	 * @return array an associated array of icon list with keys as icon name and values as icon url
	 */
	public function get_icon_list( $extension = 'svg' ) {
		$creds = request_filesystem_credentials( site_url() . '/wp-admin/', '', true, false );

		// return an empty array if filesystem credential check fails
		if ( ! WP_Filesystem( $creds ) ) {
			return [];
		}

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
	public function get_icon( $icon_name, $echo_to_output = false, $extension = 'svg' ) {
		$creds = request_filesystem_credentials( site_url() . '/wp-admin/', '', true, false );

		// check for filesystem credentials
		if ( ! WP_Filesystem( $creds ) ) {
			return;
		}

		global $wp_filesystem;

		$file_path = path_join( $this->icon_dir_path, join( '.', [ $icon_name, $extension ] ) );
		if ( $wp_filesystem->is_file( $file_path ) ) {
			$icon_string = $wp_filesystem->get_contents( $file_path );
			if ( $echo_to_output ) {
				echo $icon_string;
			} else {
				return $icon_string;
			}
		}
	}
}