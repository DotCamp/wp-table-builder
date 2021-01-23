<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Control_Extra_Styles
 *
 * Extra style properties control.
 *
 * Accepted options
 *  label => label for control element
 *
 * @package WP_Table_Builder\Inc\Admin\Controls
 */
class Control_Extra_Styles extends Base_Control {

	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'extra_styles';
	}

	/**
	 * Control content template.
	 *
	 * Used to generate the control HTML in the editor using wp js template.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function content_template() {
		?>
        <#
        const uniqueItemClass = data.elementControlTargetUnicClass;
        WPTB_ControlsManager.setControlData( uniqueItemClass, data );
        #>
        <div id="{{{uniqueItemClass}}}">
            <extra-styles-control unique-id="{{{uniqueItemClass}}}" :selectors="selectors"
                                  :default-value="defaultValue" :label="label"></extra-styles-control>
        </div>
        <wptb-template-script>
            WPTB_ControlsManager.callControlScript('ControlExtraStyles', '{{{uniqueItemClass}}}');
        </wptb-template-script>
		<?php
	}
}
