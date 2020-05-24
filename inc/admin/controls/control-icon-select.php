<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

use function add_action;
use function wp_enqueue_script;
use WP_Table_Builder as NS;

// if called directly, abort;
if ( ! defined( 'WPINC' ) ) {
	die;
}

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
	 * Enqueue control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles used by the control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {
		$script_url = NS\WP_TABLE_BUILDER_URL . '/inc/admin/js/WPTB_IconSelectControl.js';
		$script_path = NS\WP_TABLE_BUILDER_DIR . '/inc/admin/js/WPTB_IconSelectControl.js';

		wp_enqueue_script( 'control_icon_select', $script_url, [], filemtime($script_path), true );
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
            <icon-select-control :label="label" :icons="icons" :per-page="perPage" :target-class="elemContainer"></icon-select-control>
        </div>
        <wptb-template-script>
            WPTB_ControlsManager.callControlScript('ControlIconSelect','{{{uniqueItemClass}}}');
        </wptb-template-script>
		<?php
	}
}

