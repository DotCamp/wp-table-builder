<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

// if called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die();
}


/**
 * Class Control_Color_Palette
 *
 * Color control with advanced functionality.
 *
 * Accepted options
 *  label => label for control element
 *  selectors => selector array to get/set certain values to html elements
 *  defaultValue => a default value of the control
 */
class Control_Color_Palette extends Base_Control {

	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'color_palette';
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

        data.defaultValue = data.defaultValue || '#4A5568';
        #>
        <div id="{{{uniqueItemClass}}}">
            <color-palette-control :label="label" :selectors="selectors" :default-value="defaultValue"
                                  elem-container="{{{elemContainer}}}"
                                  unique-id="{{{uniqueItemClass}}}"></color-palette-control>
        </div>
        <wptb-template-script>
            WPTB_ControlsManager.callControlScript('ControlColorPalette', '{{{uniqueItemClass}}}');
        </wptb-template-script>
		<?php
	}
}
