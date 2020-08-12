<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Control_Named_Toggle
 *
 * Toggle control with names as visuals
 *
 * Accepted options
 *  label => label for control element
 *  selectors => selector array to get/set certain values to html elements
 *  items => a key/value array container toggle item id as keys and its translated title as value
 *  defaultValue => a default value of the control
 *
 * @package WP_Table_Builder\Inc\Admin\Controls
 */
class Control_Named_Toggle extends Base_Control {

	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'named_toggle';
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
        <named-toggle-control :label="label" :items="items" :selectors="selectors" :default-value="defaultValue"
                              elem-container="{{{elemContainer}}}"
                              unique-id="{{{uniqueItemClass}}}"></named-toggle-control>
      </div>
      <wptb-template-script>
        WPTB_ControlsManager.callControlScript('ControlNamedToggle', '{{{uniqueItemClass}}}');
      </wptb-template-script>
		<?php
	}
}
