<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

// if called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Control class to mark the start of tab group content.
 */
class Control_Section_Group_Tab_Content_Start extends Base_Control {

	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'section_group_tab_content_start';
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
		?>
		<?php
	}
}
