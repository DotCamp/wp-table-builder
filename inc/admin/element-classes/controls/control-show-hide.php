<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Controls;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder "show-hide" control.
 *
 * A control class for creating "enable-disable" control object for show or hide any elements of table
 * and also other elements (for example the elements of left panel).
 * When this controll adds for element there is an opportunity for point several elements, 
 * which are necessary to show or to hide. The main element is necessary to point first
 *
 * @since 1.1.2
 */
class Control_Show_Hide extends Base_Control {
    /**
	 * Get "show-hide" control type.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'show_hide';
	}

	/**
	 * Enqueue "show-hide" control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles used by the control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {
        
	}

	/**
	 * Render "show-hide" control output in the editor.
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
                elemContainer,
                label,
                selectors = [],
                selectorsJson;
            
            if( data.elemContainer ) {
                elemContainer = data.elemContainer;
            }
            
            if( data.label ) {
                label = data.label;
            }
            
            let i = 0;
            for ( let prop in data.selectors ) {
                selectors[i] = [];
                selectors[i][0] = prop;
                selectors[i][1] = data.selectors[prop];
                i++;
            }
            
            if( selectors && Array.isArray( selectors ) ) {
                selectorsJson = JSON.stringify( selectors );
            }
            
            targetInputAddClass = data.elementControlTargetUnicClass;
        #>
        
        <div class="wptb-settings-row wptb-settings-middle-xs">
            <label class="wptb-checkbox-button">
                <span style="font-size: 16px">{{{label}}}</span>
                <input id="wptb-show-number-rating" data-type="show-number-rating" 
                       class="wptb-element-property {{{targetInputAddClass}}}" type="checkbox" data-element="{{{elemContainer}}}">
                <i></i>
            </label>  
        </div>
        
        <wptb-template-script>
            ( function() {
                let targetInputs = document.querySelector( '.{{{targetInputAddClass}}}' );
                if( targetInputs && '{{{selectorsJson}}}' ) {
                    if( '{{{selectorsJson}}}' ) {
                        let selectors = JSON.parse( '{{{selectorsJson}}}' );
                        
                        function checkedValueGet( styleName ) {
                            let checkedValue,
                                uncheckedValue;
                            if( styleName == 'display' ) {
                                return ['block', 'none'];
                            } else if( styleName == 'visibility' ) {
                                return ['visible', 'hidden'];
                            } else {
                                return false;
                            }
                        }
                        
                        let targetInputCheckedIndic = false;
                        for( let i = 0; i < selectors.length; i++ ) {
                            let selector = selectors[i][0];
                            let styleName = selectors[i][1];
                            
                            let checkUnCheckValues = checkedValueGet( styleName );
                            if( ! checkUnCheckValues ) return;
                            let checkedValue = checkUnCheckValues[0],
                                unCheckedValue = checkUnCheckValues[1];
                                
                            if( selector ) {
                                let selectorElement = document.querySelectorAll( selector );
                                if( selectorElement.length > 0 ) {
                                    for( let j = 0; j < selectorElement.length; j++ ) {
                                        if( ! targetInputCheckedIndic ) {
                                            if( selectorElement[j].style[styleName] && selectorElement[j].style[styleName] == checkedValue ) {
                                                targetInputs.checked = true;
                                                targetInputCheckedIndic = true;
                                                break;
                                            } else if( ! selectorElement[j].style[styleName] ||
                                                ( selectorElement[j].style[styleName] && selectorElement[j].style[styleName] == unCheckedValue ) ) {
                                                targetInputs.checked = false;
                                                targetInputCheckedIndic = true;
                                                break;
                                            }
                                        } else {
                                            if( targetInputs.checked == true ) {
                                                selectorElement[j].style[styleName] = checkedValue;
                                            } else {
                                                selectorElement[j].style[styleName] = unCheckedValue;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        
                        if( selectors && Array.isArray( selectors ) ) {
                            targetInputs.onchange = function() {
                                for( let i = 0; i < selectors.length; i++ ) {
                                    let selector = selectors[i][0];
                                    let styleName = selectors[i][1];
                                    
                                    let checkUnCheckValues = checkedValueGet( styleName );
                                    if( ! checkUnCheckValues ) return;
                                    let checkedValue = checkUnCheckValues[0],
                                        unCheckedValue = checkUnCheckValues[1];
                                    
                                    if( selector ) {
                                        let selectorElement = document.querySelectorAll( selector );
                                        if( selectorElement.length > 0 ) {
                                            for( let j = 0; j < selectorElement.length; j++ ) {
                                                if( this.checked ) {
                                                    selectorElement[j].style[styleName] = checkedValue;
                                                } else {
                                                    selectorElement[j].style[styleName] = unCheckedValue;
                                                }
                                            }
                                        }
                                    }
                                }
                                
                                let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                                wptbTableStateSaveManager.tableStateSet();
                            }
                        }
                    }
                }
            
            } )();
        </wptb-template-script>
        
		<?php
	}
}