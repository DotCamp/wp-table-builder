<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

use WP_table_Builder_Pro as WPTBNS;
use function path_join;
use function request_filesystem_credentials;
use function trailingslashit;
use function WP_Filesystem;
use const pathinfo;

// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die();
}

class Control_Local_Dev_File extends Base_Control {

	const RELATIVE_IMAGE_LOCATION = 'assets/images';
	const SUPPORTED_EXTENSIONS = [ 'jpeg', 'jpg', 'gif', 'bmp', 'svg' ];

	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'local_dev_file';
	}

	/**
	 * Control content template.
	 *
	 * Used to generate the control HTML in the editor using wp js template
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function content_template() {
		$images = $this->get_plugin_images( trailingslashit( WPTBNS\WP_TABLE_BUILDER_PRO_DIR ) . self::RELATIVE_IMAGE_LOCATION, trailingslashit( WPTBNS\WP_TABLE_BUILDER_PRO_URL ) . self::RELATIVE_IMAGE_LOCATION, self::SUPPORTED_EXTENSIONS );

		$images_json = json_encode( $images );
		?>
      <#
      const uniqueItemClass = data.elementControlTargetUnicClass;
      data.images = JSON.parse('<?php echo $images_json; ?>');
      WPTB_ControlsManager.setControlData(uniqueItemClass, data);
      const elemContainer = data.elemContainer;
      #>
      <div id="{{{uniqueItemClass}}}">
        <local-dev-file-control :label="label" :default-value="defaultValue" unique-id="{{{uniqueItemClass}}}" :selectors="selectors"
                                :images="images"
                                elem-container="{{{elemContainer}}}"></local-dev-file-control>
      </div>
      <wptb-template-script>
        WPTB_ControlsManager.callControlScript('ControlLocalDevFile', '{{{uniqueItemClass}}}');
      </wptb-template-script>
		<?php
	}

	/**
	 * Get images at defined plugin directory.
	 *
	 * @param string $path path to images dir
	 * @param string $url url to images dir
	 * @param array $allowed_extensions an array of supported extensions
	 *
	 * @return array images
	 */
	protected function get_plugin_images( $path, $url, $allowed_extensions ) {
		$creds = request_filesystem_credentials( site_url() . '/wp-admin/', '', true, false );

		$images = [];
		if ( ! WP_Filesystem( $creds ) ) {
			return $images;
		}

		global $wp_filesystem;

		$image_location = $path;
		if ( $wp_filesystem->is_dir( $image_location ) ) {
			$files_at_location = $wp_filesystem->dirList( $image_location );
			foreach ( $files_at_location as $name => $info ) {
				$current_file_path = path_join( $image_location, $name );
				$file_info         = pathinfo( $current_file_path );

				// only add files matching with supported extension
				if ( in_array( $file_info['extension'], $allowed_extensions ) ) {
					$images[ $name ] = trailingslashit( $url ) . $name;
				}
			}
		}
		return $images;
	}
}