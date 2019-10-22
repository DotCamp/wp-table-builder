<?php
namespace WP_Table_Builder\Inc\Admin\Item_Classes\Controls;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder color control.
 *
 * A Control class for creating color control. Displays a color picker field.
 *
 * @since 1.1.2
 */
class Control_Color extends Base_Control {
    /**
	 * Get control type.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'color';
	}

	/**
	 * Enqueue color control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles used by the color
	 * control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {
            
	}

	/**
	 * Render color control output in the editor.
	 *
	 * Used to generate the control HTML in the editor wp js template
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function content_template() {
		?>
        <#
            let selector,
            cssSetting;
            for ( let prop in data.selectors ) {
                selector = prop;
                cssSetting = data.selectors[prop];
            }
            
            let selectorArr = selector.replace( '.', '' ).split( ' ' );
            var infArr = selectorArr[0].match(/wptb-element-((.+-)\d+)/i);
            let dataElement = 'wptb-options-' + infArr[1];
            
            let targetInputAddClass = selector.replace( '.', '' ).replace( ' ', '-' ).trim() + '-' + cssSetting;
            targetInputAddClass = targetInputAddClass.toLowerCase();
        #>
        <div class='wptb-settings-item-header' >
            <p class="wptb-settings-item-title">{{{data.label}}}</p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-top: 25px; padding-bottom: 10px;">
            <div class='wptb-settings-col-xs-8'>
                <input type="text" class="wptb-element-property 
                       wptb-color-picker {{{targetInputAddClass}}}" data-type="color" data-element="{{{dataElement}}}" value=""/>
            </div>
        </div>
        
        <script>
            ( function() {
                let selectorItem = document.querySelector( '{{{selector}}}' );
                let targetInput = document.querySelector( '.{{{targetInputAddClass}}}' );
                if( selectorItem && targetInput ) {
                    let selectorItemCss = selectorItem.style['{{{cssSetting}}}'];
                    if( selectorItemCss ) {
                        targetInput.value = WPTB_Helper.rgbToHex( selectorItemCss );
                    }
                }

                jQuery( '.{{{targetInputAddClass}}}' ).wpColorPicker({
                    change: function ( event, ui ) {
                        WPTB_Helper.wpColorPickerChange( event, ui );

                        WPTB_Helper.wpColorPickerCheckChangeForTableStateSaving( event );
                    },
                    clear: function( event ) {
                        WPTB_Helper.wpColorPickerChange( event );
                    }
                });
            } )();
        </script>
		<?php
	}
}