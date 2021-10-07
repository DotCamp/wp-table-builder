<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

use WP_Table_Builder as NS;

// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Control_Sides.
 *
 * Side value assign control with value type selection.
 *
 * Accepted options
 *  label => label for control element
 *  selectors => selector array to get/set certain values to html elements
 *  defaultValue => default value of the slider. use full default value for all sides, don't use shorthand definitions. e.g use '10 10 10 10' instead of '10 10'
 *
 * @package WP_Table_Builder\Inc\Admin\Controls
 */
class Control_Sides extends Base_Control {

	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'sides';
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
			'top'    => esc_html__( 'top', 'wp-table-builder' ),
			'right'  => esc_html__( 'right', 'wp-table-builder' ),
			'bottom' => esc_html__( 'bottom', 'wp-table-builder' ),
			'left'   => esc_html__( 'left', 'wp-table-builder' ),
			'link'   => esc_html__( 'link values', 'wp-table-builder' ),
			'unlink' => esc_html__( 'unlink values', 'wp-table-builder' ),
		];

		$control_icons = [
			'link'   => trailingslashit( NS\WP_TABLE_BUILDER_URL ) . 'inc/frontend/views/icons/link.svg',
			'unlink' => trailingslashit( NS\WP_TABLE_BUILDER_URL ) . 'inc/frontend/views/icons/unlink.svg',
		];

		$json_strings = json_encode( $strings );
		$json_icons   = json_encode( $control_icons );
		?>
      <#
      const uniqueItemClass = data.elementControlTargetUnicClass;
      WPTB_ControlsManager.setControlData(uniqueItemClass, data);
      data.strings = JSON.parse('<?php echo $json_strings; ?>');
      data.icons = JSON.parse('<?php echo $json_icons; ?>');
      #>
      <div id="{{{uniqueItemClass}}}">
        <sides-control :label="label" :link-icon="icons.link" :unlink-icon="icons.unlink" :strings="strings"
                       :default-value="defaultValue" :selectors="selectors"
                       :allow-negative="allowNegative"></sides-control>
      </div>
      <wptb-template-script>
        WPTB_ControlsManager.callControlScript('ControlSides', '{{{uniqueItemClass}}}');
      </wptb-template-script>
		<?php
	}
}
