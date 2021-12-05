<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder collapsible section group start section.
 *
 * This is the start section of the section group that adds header and collapse mechanics with wrapper element for inner controls.
 */
class Control_Section_Group_Collapse_Start extends Base_Control {

	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'section_group_collapse_start';
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
        const label = data.label;
        const sectionId = data.sectionId;
        const openState = data.openState;
        const labelIcon = data.labelIcon? data.labelIcon : '';

        #>
        <div class="wptb-panel-toggle-group" id="{{{sectionId}}}">
            <div class="wptb-panel-toggle">
                <div class="header"><div class="wptb-panel-toggle-group-header-icon">{{{labelIcon}}}</div><div class="wptb-panel-toggle-group-header-label">{{{label}}}</div></div>
                <span class="dashicons toggle-icon"></span>
            </div>
            <div class="wptb-panel-section-toggle-target">

            </div>
        </div>

        <wptb-template-script>
            (function noConflict($) {
            const sectionId = '{{{sectionId}}}';
            const [,groupName] = sectionId.match(/(.+)_.+/);
            const togglePanelWrapper = $(`#${sectionId}`);
            const elementSettingWrapper = togglePanelWrapper.parent();
            const toggleTarget = togglePanelWrapper.find('.wptb-panel-section-toggle-target');
            const panelToggleHeader = togglePanelWrapper.find('.wptb-panel-toggle');

            togglePanelWrapper.detach().insertBefore(elementSettingWrapper);
            elementSettingWrapper.remove();

            function handleToggle(e){
            if(e){
            e.stopPropagation();
            }

            togglePanelWrapper.toggleClass('wptb-panel-toggle-content');

            toggleTarget.slideToggle(() => {
            if(!togglePanelWrapper.attr('class').includes('wptb-panel-toggle-content')){
            WPTB_Helper.wptbDocumentEventGenerate('wptb:section-group:visible', document , groupName);
            }
            }
            );
            }

            if({{{openState}}} === false){
            handleToggle();
            }

            togglePanelWrapper.find('.toggle-icon').click(handleToggle);
            panelToggleHeader.click(handleToggle);

            })(jQuery)
        </wptb-template-script>
		<?php
	}
}
