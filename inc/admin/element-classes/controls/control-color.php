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
 * When this control adds to element there is opportunity to point css type (color, backgroundColor ...)
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
            let label,
                selector,
                cssSetting,
                targetInputAddClass;
             
            if( data.label ) {
                label = data.label;
            }
            
            for ( let prop in data.selectors ) {
                selector = prop;
                cssSetting = data.selectors[prop];
            }
            
            targetInputAddClass = data.elementControlTargetUnicClass;
        #>
        <div class='wptb-settings-item-header' >
            <p class="wptb-settings-item-title">{{{label}}}</p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-top: 25px; padding-bottom: 10px;">
            <div class='wptb-settings-col-xs-8'>
                <input type="text" class="wptb-element-property wptb-color-picker {{{targetInputAddClass}}}" data-type="color" value=""/>
            </div>
        </div>
        
        <wptb-template-script>
            ( function() {
                let selectorElement = document.querySelector( '{{{selector}}}' );
                let targetInput = document.querySelector( '.{{{targetInputAddClass}}}' );
                
                if( selectorElement && targetInput ) {
                    let selectorElementCss = selectorElement.style['{{{cssSetting}}}'];
                    if( selectorElementCss ) {
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
                        
                        let selectorElements = document.querySelectorAll( '{{{selector}}}' );
                        if( selectorElements.length > 0 ) {
                            for( let i = 0; i < selectorElements.length; i++ ) {
                                selectorElements[i].style['{{{cssSetting}}}'] = uiColor;
                            }
                        }
                        
                        WPTB_Helper.wpColorPickerCheckChangeForTableStateSaving( event );
                    },
                    clear: function( event ) {
                        let selectorElements = document.querySelectorAll( '{{{selector}}}' );
                        if( selectorElements.length > 0 ) {
                            for( let i = 0; i < selectorElements.length; i++ ) {
                                selectorElements[i].style['{{{cssSetting}}}'] = '';
                            }
                        }
                        
                        WPTB_Helper.wpColorPickerCheckChangeForTableStateSaving( event );
                    }
                });
            } )();
        </wptb-template-script>
		<?php
	}
}