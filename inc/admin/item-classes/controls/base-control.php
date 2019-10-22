<?php
namespace WP_Table_Builder\Inc\Admin\Item_Classes\Controls;

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
	 * Get control type.
	 *
	 * Retrieve the control type.
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
	public function enqueue() {}
    
    /**
	 * Control content template.
	 *
	 * Used to generate the control HTML in the editor using wp js tempalte
	 *
	 * @since 1.1.2
	 * @access public
	 * @abstract
	 */
	abstract public function content_template();
    
    /**
	 * Output item template.
	 *
	 * Used to generate the item template on the editor.
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
}