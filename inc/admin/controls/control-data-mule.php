<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Control_Data_Mule
 *
 * Data mule to carry backend data to front end
 *
 * Accepted options
 *  dataId => id for data
 *  dataObj => main data object
 *
 * @package WP_Table_Builder\Inc\Admin\Controls
 */
class Control_Data_Mule extends Base_Control {
	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'data_mule';
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
        const dataId = data.dataId;
        const dataObj = data.dataObj;

        WPTB_ControlsManager.setControlData(dataId , dataObj);
        #>
        <div style="display: none">
        </div>
		<?php
	}
}
