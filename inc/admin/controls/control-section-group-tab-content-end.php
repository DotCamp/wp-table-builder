<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

// if called directly, abort;
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Control_Section_Group_Tab_Content_End
 *
 * Control class to mark the end of tab group
 */
class Control_Section_Group_Tab_Content_End extends Base_Control {

	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'section_group_tab_content_end';
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
        const sectionId = data.sectionId;
        const groupId = data.groupId;

        const uniqueId = data.elementControlTargetUnicClass;
        #>
        <div id="{{{uniqueId}}}"></div>

        <wptb-template-script>
            (function noConflict($) {
            const tabGroup = $('#{{{sectionId}}}');
            const tab = tabGroup.find('[data-wptb-tab-group-id={{{groupId}}}]');
            const endMark = $('#{{{uniqueId}}}').parent();

            const tabControls = tabGroup.nextUntil(endMark);
            tabControls.detach().appendTo(tab);

            endMark.remove();
            })(jQuery);
        </wptb-template-script>

		<?php

	}
}