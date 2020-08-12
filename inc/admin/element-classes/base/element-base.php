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

	/**
	 * Get a list of available icons through icon manager.
	 *
	 * @param string $extension file extension to filter out results
	 *
	 * @return array associated array of icon list, keys for icon names and values for icon urls
	 */
	protected function read_icons( $extension = 'svg' ) {
		return Init::instance()->get_icon_manager()->get_icon_list( $extension );

	}

	/**
	 * Get an icon through icon manager.
	 *
	 * @param string $name icon name
	 * @param boolean $echo echo to output buffer
	 * @param string $extension extra filename info for icon
	 *
	 * @return string|void return a string representation of the icon of void depending on to chose to output to buffer
	 */
	protected function get_icon( $name, $echo = false, $extension = 'svg' ) {
		return Init::instance()->get_icon_manager()->get_icon( $name, $echo, $extension );
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


	/**
	 * Get relative of element
	 * This function will be used to determine the positioning of elements on drop events
	 *
	 * @return string position relative
	 */
	public function position_relative() {
		return Elements_Manager::ELEMENT_RELATIVE;
	}
}