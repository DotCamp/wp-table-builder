<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

use WP_Table_Builder as NS;

// if called directly, abort;
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Control_Icon_Select
 *
 * Icon selection for elements
 *
 * Accepted options
 *  label => label for control element
 *  selectors => selector array to get/set certain values to html elements
 *  icons => an array of key(icon name) => value(icon url) pairs
 *  perPage => number of icons to be displayed at every lazy-load sessions of scroll event
 *
 * @package WP_Table_Builder\Inc\Admin\Controls
 */
class Control_Icon_Select extends Base_Control {
	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'icon_select';
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

      WPTB_ControlsManager.setControlData(uniqueItemClass , data);
      #>
      <div id="{{{uniqueItemClass}}}">
        <icon-select-control :label="label" :icons="icons" :per-page="perPage"
                             :selectors="selectors" :default-value="defaultValue"></icon-select-control>
      </div>
      <wptb-template-script>
        WPTB_ControlsManager.callControlScript('ControlIconSelect','{{{uniqueItemClass}}}');
      </wptb-template-script>
		<?php
	}
}

