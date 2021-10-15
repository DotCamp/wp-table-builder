<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

use WP_Table_Builder as NS;

// if called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Control_Alignment2
 *
 * Toggle controls with alignment options as visuals.
 *
 * Supported alignment options are left, center and right.
 *
 * Accepted options
 *  label => label for control element
 *  selectors => selector array to get/set certain values to html elements
 *  defaultValue => a default value of the control
 *  keysMaps => change default alignment key values to mapped ones
 */
class Control_Alignment2 extends Base_Control {

	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'alignment2';
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
		$icon_manager = NS\Inc\Core\Init::instance()->get_icon_manager();

		$alignOptions = [
			'left'   => $icon_manager->get_icon( 'align-left', false, 'svg', '<span class="wptb-flex wptb-flex-justify-center wptb-flex-align-center wptb-svg-14px wptb-svg-inherit-color"></span>' ),
			'center' => $icon_manager->get_icon( 'align-center', false, 'svg', '<span class="wptb-flex wptb-flex-justify-center wptb-flex-align-center wptb-svg-14px wptb-svg-inherit-color"></span>' ),
			'right'  => $icon_manager->get_icon( 'align-right', false, 'svg', '<span class="wptb-flex wptb-flex-justify-center wptb-flex-align-center wptb-svg-14px wptb-svg-inherit-color"></span>' )
		];

		$encoded_align_options = str_replace('\u0022', "\'", json_encode($alignOptions, JSON_HEX_QUOT));
		?>
        <#
        const uniqueItemClass = data.elementControlTargetUnicClass;
        WPTB_ControlsManager.setControlData(uniqueItemClass, data);
        const elemContainer = data.elemContainer;
        data.items = JSON.parse('<?php echo $encoded_align_options; ?>');

        if(data.keyMaps){
            data.items = Object.keys(data.items).reduce((carry, defaultKey) => {
                if(Object.prototype.hasOwnProperty.call(data.items, defaultKey)){
                    const finalKey = data.keyMaps[defaultKey] || defaultKey;

                    carry[finalKey] = data.items[defaultKey]
                }

                return carry;
            }, {});
        }

        #>
        <div id="{{{uniqueItemClass}}}">
            <named-toggle-control :label="label" :items="items" :selectors="selectors" :default-value="defaultValue"
                                  elem-container="{{{elemContainer}}}"
                                  unique-id="{{{uniqueItemClass}}}"></named-toggle-control>
        </div>
        <wptb-template-script>
            WPTB_ControlsManager.callControlScript('ControlNamedToggle', '{{{uniqueItemClass}}}');
        </wptb-template-script>
		<?php
	}
}
