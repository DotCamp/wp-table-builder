<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Control_Select2
 *
 * Selection control for elements
 *
 * Accepted options
 *  label => label for control element
 *  selectors => selector array to get/set certain values to html elements
 *  options => options for the select element, values => translated texts
 *  defaultValue => default value for the select control
 *
 * @package WP_Table_Builder\Inc\Admin\Controls
 */
class Control_Select2 extends Base_Control{

	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'select2';
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
            <select2-control :label="label" :selectors="selectors" :options="options" :default-value="defaultValue" unique-id="{{{uniqueItemClass}}}" elem-container = "{{{elemContainer}}}" ></select2-control>
        </div>
        <wptb-template-script>
            WPTB_ControlsManager.callControlScript('Select2', '{{{uniqueItemClass}}}');
        </wptb-template-script>
<?php
	}
}

