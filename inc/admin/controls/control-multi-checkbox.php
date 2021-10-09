<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

// if called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Control_Multi_Checkbox
 *
 * Multiple checkbox control for elements.
 *
 * Accepted options
 *  label => label for control element
 *  checkboxes => key-value array for checkbox value-labels
 */
class Control_Multi_Checkbox extends Base_Control {

	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'multi_checkbox';
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
        const uniqueItemClass = data.elementControlTargetUnicClass;
        WPTB_ControlsManager.setControlData(uniqueItemClass, data);
        const elemContainer = data.elemContainer;
        #>
        <div id="{{{uniqueItemClass}}}">
            <multi-checkbox-control :checkboxes="checkboxes" :label="label"
                                    :selectors="selectors"
                                    elem-container="{{{elemContainer}}}"
                                    unique-id="{{{uniqueItemClass}}}"
            ></multi-checkbox-control>
        </div>
        <wptb-template-script>
            WPTB_ControlsManager.callControlScript('ControlMultiCheckbox', '{{{uniqueItemClass}}}');
        </wptb-template-script>
		<?php
	}
}
