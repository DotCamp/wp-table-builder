<?php

namespace WP_Table_Builder\Inc\Admin\Element_Classes\Base;

use WP_Table_Builder\Inc\Admin\Base\Element_Base_Object;
use WP_Table_Builder\Inc\Admin\Managers\Elements_Manager;
use WP_Table_Builder\Inc\Core\Init as Init;
use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}


/**
 * WP Table Builder element base.
 *
 * An abstract class to register new WP Table Builder elements.
 *
 * This abstract class must be extended in order to register new elements.
 *
 * @since 1.1.2
 * @abstract
 */
abstract class Element_Base extends Element_Base_Object {
	/**
	 * Get directory icon.
	 *
	 * Retrieve directory item icon.
	 *
	 * @return string Directory Item icon.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	abstract public function get_directory_icon();

	/**
	 * Get url icon.
	 *
	 * Return url icon.
	 *
	 * @return string Url Item icon.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	abstract public function get_url_icon();

	/**
	 * Render element output in the editor.
	 *
	 * Used to generate the live preview, using a wp js template
	 *
	 * @since 1.1.2
	 * @access protected
	 */
	protected function _content_template() {
	}

    protected function readIcons( $extension, $icon_dir, $icon_url ) {
        $creds = request_filesystem_credentials( site_url() . '/wp-admin/', '', true, null );
        if ( ! WP_Filesystem( $creds ) ) {
            return;
        }

        global $wp_filesystem;

        $filtered_files = [];
        if ( $wp_filesystem->is_dir( $icon_dir ) ) {
            $icons = $wp_filesystem->dirlist( $icon_dir );
            foreach ( $icons as $name => $info ) {
                $current_file_path = path_join( $icon_dir, $name );
                $file_info         = pathinfo( $current_file_path );
                if ( $file_info['extension'] === $extension ) {
                    $current_file_url                         = join( '', [ trailingslashit( $icon_url ), $name ] );
                    $filtered_files[ $file_info['filename'] ] = $current_file_url;
                }
            }
        }

        return $filtered_files;
    }

	/**
	 * Output element template and script.
	 *
	 * Used to generate the element template on the editor.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function output_template() {
		ob_start();

		$this->_content_template();

		$template_content = ob_get_clean();

		if ( empty( $template_content ) ) {
			return;
		}

		?>
        <script type="text/html" id="tmpl-wptb-<?php echo esc_attr( $this->get_name() ); ?>-content">
			<?php echo $template_content; ?>
        </script>

		<?php
	}

	/**
	 * Get type of element.
	 *
	 * This type changes according to which version (basic,pro) of the plugin this element belongs to. While basic elements are available in both versions, pro elements are only limited to pro version of the plugin.
	 * By default, if not overridden, element will be classified as basic.
	 *
	 * @return string type of element
	 */
	public function get_type() {
		return Elements_Manager::BASIC;
	}
}