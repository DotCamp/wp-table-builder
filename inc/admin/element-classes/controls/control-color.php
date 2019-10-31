<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Controls;

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
            
            let targetInputAddClass = selector.trim();
            targetInputAddClass = WPTB_Helper.replaceAll( targetInputAddClass, '.', '' ).trim();
            targetInputAddClass = WPTB_Helper.replaceAll( targetInputAddClass, ' ', '-' ).trim();
            targetInputAddClass += '-' + cssSetting;
            targetInputAddClass = targetInputAddClass.toLowerCase();
        #>
        <div class='wptb-settings-item-header' >
            <p class="wptb-settings-item-title">{{{data.label}}}</p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-top: 25px; padding-bottom: 10px;">
            <div class='wptb-settings-col-xs-8'>
                <input type="text" class="wptb-element-property wptb-color-picker {{{targetInputAddClass}}}" data-type="color" data-element="{{{dataElement}}}" value=""/>
            </div>
        </div>
        
        <wptb-template-script>
            ( function() {
                let selectorElement = document.querySelector( '{{{selector}}}' );
                let targetInput = document.querySelector( '.{{{targetInputAddClass}}}' );
                if( selectorElement && targetInput ) {
                    let selectorElementCss = selectorElement.style['{{{cssSetting}}}'];
                    if( selectorElementCss ) {
                        targetInput.classList.add('testCom');
                        targetInput.value = WPTB_Helper.rgbToHex( selectorElementCss );
                        
                    }
                }

                jQuery( '.{{{targetInputAddClass}}}' ).wpColorPicker({
                    change: function ( event, ui ) {
                        let uiColor;
                        if( ui ) {
                            uiColor = ui.color.toString();
                        } else {
                            uiColor = '';
                        }
                        let selectorElement = document.querySelector( '{{{selector}}}' );
                        selectorElement.style['{{{cssSetting}}}'] = uiColor;
                        
                        WPTB_Helper.wpColorPickerCheckChangeForTableStateSaving( event );
                    },
                    clear: function( event ) {
                        let selectorElement = document.querySelector( '{{{selector}}}' );
                        selectorElement.style['{{{cssSetting}}}'] = '';
                        
                        WPTB_Helper.wpColorPickerCheckChangeForTableStateSaving( event );
                    }
                });
            } )();
        </wptb-template-script>
		<?php
	}
}