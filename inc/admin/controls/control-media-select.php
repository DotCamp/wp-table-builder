<?php
namespace WP_Table_Builder\Inc\Admin\Controls;

// if called directly, abort;
if(! defined('WPINC')){
	die;
}

/**
 * Class Control_Media_Select
 *
 * Media selection for elements
 *
 * Accepted options
 *  label => label for control element
 *  selectors => selector array to get/set certain values to html elements
 *
 * @package WP_Table_Builder\Inc\Admin\Controls
 */
class Control_Media_Select extends Base_Control{

	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'media_select';
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
            <media-select-control :label="label" :selectors="selectors"></media-select-control>
        </div>
        <wptb-template-script>
            WPTB_ControlsManager.callControlScript('ControlMediaSelect','{{{uniqueItemClass}}}');
        </wptb-template-script>
<?php
	}
}