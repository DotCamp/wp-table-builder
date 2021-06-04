<?php

namespace WP_Table_Builder\Inc\Admin\Controls;


// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Control_Range
 *
 * Range slider control for elements
 *
 * Accepted options
 *  label => label for control element
 *  selectors => selector array to get/set certain values to html elements
 *  min => minimum value of the slider
 *  max => maximum value of the slider
 *  step => step value of the slider
 *  defaultValue => default value of the slider
 *  postFix => suffix to be added to the end of value
 *
 * @package WP_Table_Builder\Inc\Admin\Controls
 */
class Control_Range extends Base_Control {

	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'range';
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

        if(!data.postFix){
        data.postFix='';
        }
        if(!data.step){
        data.step=1;
        }
        #>
        <div id="{{{uniqueItemClass}}}">
            <range-control :label="label" :selectors="selectors" :min="min" :max="max" :step="step"
                           :default-value="defaultValue" unique-id="{{{uniqueItemClass}}}"
                           elem-container="{{{elemContainer}}}" :post-fix="postFix"></range-control>
        </div>
        <wptb-template-script>
            WPTB_ControlsManager.callControlScript('ControlRange', '{{{uniqueItemClass}}}');
        </wptb-template-script>
		<?php
	}
}
