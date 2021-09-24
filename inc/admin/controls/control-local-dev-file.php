<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

use WP_table_Builder_Pro as WPTBNS;
use WP_Table_Builder_Pro\Inc\Admin\Managers\Dev_Local_Files_Manager;
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
		$images      = static::get_plugin_images();
		$images_json = json_encode( $images );

		$security      = [
			'nonce'   => wp_create_nonce( Dev_Local_Files_Manager::AJAX_ACTION ),
			'ajaxUrl' => admin_url( 'admin-ajax.php' ),
			'action'  => Dev_Local_Files_Manager::AJAX_ACTION
		];
		$security_json = json_encode( $security );
		?>
      <#
      const uniqueItemClass = data.elementControlTargetUnicClass;
      data.images = JSON.parse('<?php echo $images_json; ?>');
      data.security = JSON.parse('<?php echo $security_json; ?>');
      WPTB_ControlsManager.setControlData(uniqueItemClass, data);
      const elemContainer = data.elemContainer;
      #>
      <div id="{{{uniqueItemClass}}}">
        <local-dev-file-control :label="label" :default-value="defaultValue" unique-id="{{{uniqueItemClass}}}"
                                :security="security"
                                :selectors="selectors"
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
	 * @return array images
	 */
	public static function get_plugin_images() {
		$path               = trailingslashit( WPTBNS\WP_TABLE_BUILDER_PRO_DIR ) . self::RELATIVE_IMAGE_LOCATION;
		$url                = trailingslashit( WPTBNS\WP_TABLE_BUILDER_PRO_URL ) . self::RELATIVE_IMAGE_LOCATION;
		$allowed_extensions = self::SUPPORTED_EXTENSIONS;

		$images = [];

		// @deprecated
//	  $creds              = request_filesystem_credentials( site_url() . '/wp-admin/', '', true, false );
//		if ( ! WP_Filesystem( $creds ) ) {
//			return $images;
//		}

		WP_Filesystem( true );

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

	/**
	 * Final evaluation to make before adding control to registered controls list.
	 * @return bool register or not
	 */
	public static function register_evaluation() {
		return class_exists( 'WP_Table_Builder_Pro\WP_Table_Builder_Pro' );
	}


}
