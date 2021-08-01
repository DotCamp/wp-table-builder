<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

/**
 * Upgraded size control.
 */
class Control_Size2 extends Base_Control {

	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'size2';
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
	    $strings = [
	            'width' => esc_html__('width', 'wp-table-builder'),
	            'height' => esc_html__('height', 'wp-table-builder'),
	            'aspectLocked' => esc_html__('aspect ratio locked', 'wp-table-builder'),
	            'aspectUnlocked' => esc_html__('aspect ratio unlocked', 'wp-table-builder'),
        ];

	    $json_strings = json_encode($strings);
		?>
        <#
        const uniqueItemClass = data.elementControlTargetUnicClass;
        WPTB_ControlsManager.setControlData(uniqueItemClass, data);
        const elemContainer = data.elemContainer;

        data.strings = JSON.parse('<?php echo $json_strings; ?>');
        #>
        <div id="{{{uniqueItemClass}}}">
            <size2-control :selectors="selectors" :label="label" elem-container="{{{elemContainer}}}" unique-id="{{{uniqueItemClass}}}" :strings="strings"></size2-control>
        </div>
        <wptb-template-script>
            WPTB_ControlsManager.callControlScript('ControlSize2', '{{{uniqueItemClass}}}');
        </wptb-template-script>
		<?php
	}
}
