<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

// if called directly, abort;
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Control_Section_Group_Tabbed_Start extends Base_Control {

	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'section_group_tabbed_start';
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
        const tabs = data.tabs;

        #>
        <div class="wptb-section-group-tabbed wptb-plugin-box-shadow-md" id="{{{sectionId}}}">
            <div class="wptb-panel-toggle wptb-section-group-tabbed-header">
                <div class="header">{{{label}}}</div>
            </div>
            <div class="wptb-section-group-tabbed-tabs-buttons">
                <#
                tabs.map((t,i) => {
                const activeClass = i === 0 ? 'active' : 'disabled';
                #>
                <div class="wptb-settings-section-item static-active {{{activeClass}}}"
                     data-wptb-tabbed-button="{{{t}}}">{{{t}}}
                </div>
                <#
                })
                #>
            </div>
            <#
            tabs.map((t,i)=>{
            const visibleClass = i === 0 ? '' : 'wptb-plugin-non-visible';
            #>
            <div class="wptb-section-group-tab-content {{{visibleClass}}}" data-wptb-tab-group-id="{{{t}}}">

            </div>
            <#
            });
            #>
        </div>

        <wptb-template-script>
            (function noConflict($){
            const base = $('#{{{sectionId}}}');
            const parent = base.parent();

            base.detach().insertBefore(parent);
            parent.remove();

            const tabButtons = $('[data-wptb-tabbed-button]');

            tabButtons.each(function () {
            $(this).click(function (e) {
            const datasetContent = this.dataset.wptbTabbedButton;

            const tabEvent = new CustomEvent('{{{sectionId}}}', {detail: datasetContent});

            document.dispatchEvent(tabEvent);
            })
            });

            function handleButtonActiveState(event) {
            const tabButtons = $('#{{{sectionId}}} [data-wptb-tabbed-button]');

            tabButtons.each(function () {
            const dataContent = this.dataset.wptbTabbedButton;
            const isActive = dataContent === event.detail;

            this.classList.add(isActive ? 'active' : 'disabled');
            this.classList.remove(isActive ? 'disabled' : 'active');
            })
            }

            function handleControlVisibility(e){
            const tabContents = $('#{{{sectionId}}} [data-wptb-tab-group-id]');

            tabContents.each(function () {
            const dataContent = this.dataset.wptbTabGroupId;
            const isActive = dataContent === e.detail;

            if (isActive) {
            this.classList.remove('wptb-plugin-non-visible');
            } else {
            this.classList.add('wptb-plugin-non-visible');
            }
            })
            }

            document.addEventListener('{{{sectionId}}}', (e) => {
            handleButtonActiveState(e);
            handleControlVisibility(e);
            });

            })(jQuery);
        </wptb-template-script>
		<?php
	}
}
