<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

// if called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die();
}


/**
 * Control for adding pro overlay to certain elements of table builder.
 */
class Control_Pro_Overlay extends Base_Control {

	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'pro_overlay';
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
        const elemContainer = data.elemContainer;
        #>
        <div id="{{{uniqueItemClass}}}">
            <pro-overlay></pro-overlay>
        </div>
        <wptb-template-script>
            WPTB_ControlsManager.callControlScript('ProOverlay', '{{{uniqueItemClass}}}');
        </wptb-template-script>
		<?php
	}
}
