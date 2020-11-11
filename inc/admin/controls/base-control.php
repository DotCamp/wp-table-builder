<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder base control.
 *
 * An abstract class for creating new controls in the panel.
 *
 * @since 1.1.2
 * @abstract
 */
abstract class Base_Control {
	/**
	 * Base_Control constructor.
	 */
	public function __construct() {
		$this->enqueue();
	}


	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 * @abstract
	 */
	abstract public function get_type();

	/**
	 * Enqueue control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles used by the control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {
	}

	/**
	 * Control content template.
	 *
	 * Used to generate the control HTML in the editor using wp js template
	 *
	 * @since 1.1.2
	 * @access public
	 * @abstract
	 */
	abstract public function content_template();

	/**
	 * Output element template.
	 *
	 * Used to generate the element template on the editor.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function output_template() {
		ob_start();

		$this->content_template();

		$template_content = ob_get_clean();

		if ( empty( $template_content ) ) {
			return;
		}

		?>
      <script type="text/html" id="tmpl-wptb-<?php echo esc_attr( $this->get_type() ); ?>-control">
		  <?php echo $template_content; ?>
      </script>
		<?php
	}

	/**
	 * Final evaluation to make before adding control to registered controls list.
   *
	 * @return bool register or not
	 */
	public static function register_evaluation() {
		return true;

	}
}