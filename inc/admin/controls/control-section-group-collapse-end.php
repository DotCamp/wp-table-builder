<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

// if called directly, abort the process
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Control_Section_Group_Collapse_End extends Base_Control {
	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'section_group_collapse_end';
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
        <#
        const startId = data.startId;
        const endId = data.endId;
        #>
        <div id="{{{endId}}}"></div>

        <wptb-template-script>
            (function noConflict($) {

            const startElement = $('#{{{startId}}}');
            const toggleTarget = startElement.find('.wptb-panel-section-toggle-target');
            const endElement = $('#{{{endId}}}').parent();

            startElement.nextUntil(endElement).detach().appendTo(toggleTarget);
            endElement.remove();

            })(jQuery)
        </wptb-template-script>
		<?php
	}
}

