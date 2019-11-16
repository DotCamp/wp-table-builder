<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Controls;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder href control.
 *
 * A control class for creating href control for to add href attribute to tag
 * and also to set attributes target and rel="nofollow".
 *
 * @since 1.1.2
 */
class Control_Select extends Base_Control {
    /**
	 * Get control type.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'select';
	}

	/**
	 * Enqueue href control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles used by the href
	 * control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {
        
	}

	/**
	 * Render href control output in the editor.
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
                options = [],
                selectedDefault,
                dataElement,
                targetSelectAddClass,
                appearDependOn;
            
            if( data.label ) {
                label = data.label;
            }
            
            if( data.selector ) {
                selector = data.selector;
            }
            
            if( data.options ) {
                options = data.options;
            }
            
            if( data.selectedDefault ) {
                selectedDefault = data.selectedDefault;
            }
            
            if( data.elemContainer ) {
                elemContainer = data.elemContainer;
            }
            
            if( selector ) {
                let selectorArr = selector.replace( '.', '' ).split( ' ' );
                var infArr = selectorArr[0].match(/wptb-element-((.+-)\d+)/i);
                let dataElement = 'wptb-options-' + infArr[1];
            }
            
            targetSelectAddClass = data.elementControlTargetUnicClass;
            
            if( data.appearDependOn ) {
                if( Array.isArray( data.appearDependOn ) ) {
                    appearDependOn = JSON.stringify( data.appearDependOn );
                }
            }
        #>
        
        <div class="wptb-settings-item-header">
            <p class="wptb-settings-item-title">{{{label}}}</p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 15px; padding-top: 25px;">
            <select class="wptb-element-property {{{targetSelectAddClass}}}" data-element="{{{elemContainer}}}"> 
                <#
                if( options && Array.isArray( options ) ) {
                    let name,
                        value,
                        selected;
                    for( let i = 0; i < options.length; i++ ) {
                        if( options[i][0] ) {
                            name = options[i][0];
                        }

                        if( options[i][1] ) {
                            value = options[i][1];
                        } else if( option[i][0] ) {
                            value = options[i][0];
                        }
                        
                        if( selectedDefault && selectedDefault == i ) {
                            selected = 'selected';
                        } else {
                            selected = '';
                        } 
                        #>
                        <option value="{{{value}}}" {{{selected}}}>{{{name}}}</option>
                        <#
                    }
                }
                #>
            </select>              
        </div>
        
        <wptb-template-script>
            ( function() {
                let targetSelects = document.getElementsByClassName( '{{{targetSelectAddClass}}}' );
                if( targetSelects.length > 0 ) {
                    targetSelect = targetSelects[0];
                    let dataSelectorElement = targetSelect.dataset.element;
                    if( dataSelectorElement ) {
                        let selectorElement = document.querySelector( '.' + dataSelectorElement );
                        if( selectorElement ) {
                            targetSelect.onchange = function( event ) {
                                WPTB_Helper.wptbDocumentEventGenerate( 'wptb-control:select:{{{targetSelectAddClass}}}', selectorElement );
                                
                                selectorElement.setAttribute( 'data-{{{targetSelectAddClass}}}', this.value );
                                
                                let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                                wptbTableStateSaveManager.tableStateSet();
                            };
                            
                            if( selectorElement.hasAttribute( 'data-{{{targetSelectAddClass}}}' ) ) {
                                if( selectorElement.getAttribute( 'data-{{{targetSelectAddClass}}}' ) ) {
                                    targetSelect.value = selectorElement.getAttribute( 'data-{{{targetSelectAddClass}}}' );
                                }
                            } else {
                                selectorElement.setAttribute( 'data-{{{targetSelectAddClass}}}', '' );
                            }
                            
                            if( '{{{appearDependOn}}}' ) {
                                let appearDependOn = JSON.parse( '{{{appearDependOn}}}' ); 
                                
                                if( Array.isArray( appearDependOn ) ) {
                                    let dependOnControlName = appearDependOn[0];
                                    let targetSelectAddClassArr = '{{{targetSelectAddClass}}}'.split( '-' );
                                    
                                    let controlName = targetSelectAddClassArr[targetSelectAddClassArr.length -1];
                                    
                                    let dependOnControlElementClass = '{{{targetSelectAddClass}}}'.replace( controlName, dependOnControlName );
                                    
                                    let dependOnControlElement = document.getElementsByClassName( dependOnControlElementClass );
                                    
                                    if( dependOnControlElement.length > 0 ) {
                                        dependOnControlElement = dependOnControlElement[0];
                                        
                                        let controlContainerElem = WPTB_Helper.findAncestor( targetSelect, 'wptb-element-option' );
                                        
                                        if( controlContainerElem ) {
                                            
                                            function showHideDependOnControlElement( dependOnControlElement ) {
                                                if( dependOnControlElement.value ) {
                                                    if( appearDependOn[1] && Array.isArray( appearDependOn[1] ) && 
                                                        ( appearDependOn[1].indexOf( dependOnControlElement.value ) !== -1 ) ) {
                                                        controlContainerElem.style.display = 'block';
                                                    } else if( appearDependOn[2] && Array.isArray( appearDependOn[2] ) && 
                                                        ( appearDependOn[2].indexOf( dependOnControlElement.value ) !== -1 ) ) {
                                                        controlContainerElem.style.display = 'none';
                                                    }
                                                }
                                            }
                                            
                                            showHideDependOnControlElement( dependOnControlElement );
                                            
                                            dependOnControlElement.addEventListener( 'change', function() {
                                                showHideDependOnControlElement( dependOnControlElement );
                                            }, false );
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } )();
        </wptb-template-script>
        
		<?php
	}
}