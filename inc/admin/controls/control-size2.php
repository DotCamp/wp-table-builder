<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

/**
 * Class Control_Size2
 *
 * Size control for table elements.
 *
 * Accepted options
 *  label => label for control element
 *  selectors => selector array to get/set certain values to html elements
 *  dependsOnElementControl => array of control values that will affect visibility of that control
 *  target => target HTML element query relative to element container whose size will be used for internal control operations and calculations (default img)
 *
 * @package WP_Table_Builder\Inc\Admin\Controls
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
			'width'               => esc_html__( 'width', 'wp-table-builder' ),
			'height'              => esc_html__( 'height', 'wp-table-builder' ),
			'aspectLocked'        => esc_html__( 'aspect ratio locked', 'wp-table-builder' ),
			'aspectUnlocked'      => esc_html__( 'aspect ratio unlocked', 'wp-table-builder' ),
			'originalAspectRatio' => esc_html__( 'aspect ratio', 'wp-table-builder' ),
			'resetToOriginal'     => esc_html__( 'reset to original size', 'wp-table-builder' ),
		];

		$json_strings = json_encode( $strings );
		?>
        <#
        const uniqueItemClass = data.elementControlTargetUnicClass;
        WPTB_ControlsManager.setControlData(uniqueItemClass, data);
        const elemContainer = data.elemContainer;

        data.target = data.target? data.target : 'img';

        data.strings = JSON.parse('<?php echo $json_strings; ?>');
        #>
        <div id="{{{uniqueItemClass}}}">
            <size2-control :target="target" :selectors="selectors" :label="label" elem-container="{{{elemContainer}}}"
                           unique-id="{{{uniqueItemClass}}}" :strings="strings"></size2-control>
        </div>
        <wptb-template-script>
            WPTB_ControlsManager.callControlScript('ControlSize2', '{{{uniqueItemClass}}}');
        </wptb-template-script>
		<?php
	}
}
