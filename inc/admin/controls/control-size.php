<?php
namespace WP_Table_Builder\Inc\Admin\Controls;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder size control.
 *
 * A control class for creating size control objects 
 * for showing size field on the left panel. This fiels set css value for html tag.
 * When this control adds for element, there is opportunity to point css type (width or fontSize ...)
 * and also to point dimension of value
 *
 * @since 1.1.2
 */
class Control_Size extends Base_Control {
    /**
	 * Get size control type.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'size';
	}

	/**
	 * Enqueue size control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles used by the size
	 * control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {
        
	}

	/**
	 * Render size control output in the editor.
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
                cssSetting,
                label,
                max,
                min,
                defaultValue,
                dimension;
            
            if( data.selectors && typeof data.selectors === 'object' ) {
                for ( let prop in data.selectors ) {
                    selector = prop;
                    cssSetting = data.selectors[prop];
                }
            }
            
            if( data.label ) {
                label = data.label;
            }
            if( data.max ) {
                max = data.max;
            } else {
                max = 100;
            }
            if( data.min ) {
                min = data.min;
            } else {
                min = 10;
            }
            if( data.defaultValue ) {
                defaultValue = data.defaultValue;
            } else {
                defaultValue = 15;
            }
            if( data.dimension ) {
                dimension = data.dimension;
            } else {
                dimension = 'px';
            }
            
            targetInputAddClass = data.elementControlTargetUnicClass;
        #>
        
        <div class='wptb-settings-item-header' >
            <p class="wptb-settings-item-title">{{{label}}}</p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 12px; padding-top: 23px;">
            <div class="wptb-settings-col-xs-8">
                <input data-type="size" class="wptb-element-property wptb-size-slider {{{targetInputAddClass}}}" 
                    type="range" min="{{{min}}}" max="{{{max}}}" step="1" value="{{{defaultValue}}}"> 
            </div>
            <div class="wptb-settings-col-xs-4">
                <input id="wptb-size-number" data-type="size" 
                    class="wptb-size-number wptb-number-input wptb-element-property {{{targetInputAddClass}}}" 
                    type="number" min="{{{min}}}" max="{{{max}}}" step="1" placeholder="{{{defaultValue}}}" pattern="[0-9]*">
                <span class="wptb-input-px">{{{dimension}}}</span>
            </div>
        </div>
        
        <wptb-template-script>
            ( function() {
                if( '{{{selector}}}' ) {
                    let selectorElement = document.querySelector( '{{{selector}}}' );
                    let targetInputs = document.getElementsByClassName( '{{{targetInputAddClass}}}' );

                    for( let i = 0; i < targetInputs.length; i++ ) {
                        let cssSetting = '{{{cssSetting}}}';
                        let cssSettingArr = cssSetting.split( ',' );

                        let targetInputsCss = selectorElement.style[cssSettingArr[0]];
                        if( targetInputsCss ) {
                            targetInputs[i].value = parseInt( targetInputsCss );
                        }
                        if( targetInputs[i].classList.contains( 'wptb-size-slider' ) ) {
                            targetInputs[i].oninput = function ( event ) {
                                if( event.target == this ) {
                                    this.parentNode.parentNode.getElementsByClassName('wptb-size-number')[0].value = this.value;
                                }

                                let selectorElements = document.querySelectorAll( '{{{selector}}}' );
                                if( selectorElements.length > 0 ) {
                                    for( let i = 0; i < selectorElements.length; i++ ) {
                                        for( let j = 0; j < cssSettingArr.length; j++ ) {
                                            selectorElements[i].style[cssSettingArr[j]] = this.value + '{{{dimension}}}';
                                        }
                                    }
                                };

                                event.target.onmouseup = function() {
                                    let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                                    wptbTableStateSaveManager.tableStateSet();
                                }
                            };
                        } else if( targetInputs[i].classList.contains( 'wptb-number-input' ) ) {
                            WPTB_Helper.numberImputSize( targetInputs[i], '{{{max}}}'.length - 1, '{{{max}}}' );
                            targetInputs[i].oninput = function( event ) {
                                this.parentNode.parentNode.getElementsByClassName('wptb-size-slider')[0].value = this.value;
                                this.parentNode.parentNode.getElementsByClassName('wptb-size-slider')[0].oninput( event );
                            }
                        }
                    } 
                }
            } )();
        </wptb-template-script>
        
		<?php
	}
}