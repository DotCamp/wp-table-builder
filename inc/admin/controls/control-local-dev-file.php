<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die();
}

class Control_Local_Dev_File extends Base_Control {

	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'local_dev_file';
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
        <local-dev-file-control :label="label" :default-value="defaultValue" unique-id="{{{uniqueItemClass}}}"
                                elem-container="{{{elemContainer}}}"></local-dev-file-control>
      </div>
      <wptb-template-script>
        WPTB_ControlsManager.callControlScript('ControlLocalDevFile', '{{{uniqueItemClass}}}');
      </wptb-template-script>
		<?php
	}
}