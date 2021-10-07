<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

/**
 * Class Control_Image_Size
 * @package WP_Table_Builder\Inc\Admin\Controls
 */
class Control_Image_Size extends Base_Control {

	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'image_size';
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
		$strings = [
			'relativeLabel' => esc_html__( 'relative to', 'wp-table-builder' )
		];

		$json_strings = json_encode( $strings );
		?>
        <#
        const uniqueItemClass = data.elementControlTargetUnicClass;
        data.strings = JSON.parse('<?php echo $json_strings ?>');
        WPTB_ControlsManager.setControlData(uniqueItemClass, data);
        #>
        <div id="{{{uniqueItemClass}}}">
            <image-size-control :strings='strings'></image-size-control>
        </div>
        <wptb-template-script>
            WPTB_ControlsManager.callControlScript('ImageSize', '{{{uniqueItemClass}}}');
        </wptb-template-script>
		<?php
	}
}
