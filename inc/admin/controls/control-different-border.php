<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

use function esc_html__;
use function json_encode;

// if called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die();
}


/**
 * Class Control_Different_Border.
 *
 * Control for different border color functionality
 *
 * Accepted options
 *  label => label for control element
 *  dependOnControl => change visibility of control depending on other control's values
 *
 * @package WP_Table_Builder\Inc\Admin\Controls
 */
class Control_Different_Border extends Base_Control {

	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'different_border';
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
			'borderWidth' => esc_html__( 'border width', 'wp-table-builder' ),
			'borderColor' => esc_html__( 'border color', 'wp-table-builder' ),
		];

		$json_strings = json_encode( $strings );
		?>
        <#
        const uniqueItemClass = data.elementControlTargetUnicClass;
        WPTB_ControlsManager.setControlData(uniqueItemClass, data);
        data.strings = JSON.parse('<?php echo $json_strings; ?>');

        if(!data.appearDependOnControl){
        data.appearDependOnControl = {};
        }

        #>
        <div id="{{{uniqueItemClass}}}">
            <different-border-control :appear-depend-on-control="appearDependOnControl"
                                      :strings="strings"></different-border-control>
        </div>
        <wptb-template-script>
            WPTB_ControlsManager.callControlScript('ControlDifferentBorder', '{{{uniqueItemClass}}}');
        </wptb-template-script>
		<?php

	}
}
