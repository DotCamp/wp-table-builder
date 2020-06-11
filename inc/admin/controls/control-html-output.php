<?php
namespace WP_Table_Builder\Inc\Admin\Controls;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Control_Html_Output extends Base_Control {
	/**
	 * Get size control type.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'html_output';
	}

	/**
	 * Enqueue size control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles used by the size
	 * control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {

	}

	/**
	 * Render size control output in the editor.
	 *
	 * Used to generate the control HTML in the editor wp js template
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function content_template() {
		?>
        <#
        const {html} = data;
        #>
		<div class="wptb-settings-row wptb-html-control-wrapper">
            {{{html}}}
        </div>
<?php
	}
}
