<?php
namespace WP_Table_Builder\Inc\Admin\Controls;

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
                options = [],
                selectors = [],
                selectedDefault,
                targetSelectAddClass;
            
            if( data.label ) {
                label = data.label;
            }
            
            if( data.options ) {
                options = data.options;
            }
            
            if( options && Array.isArray( options ) ) {
                optionsJson = JSON.stringify( options );
            }
            
            if( data.selectors && typeof data.selectors === 'object' ) {
                let i = 0;
                for ( let prop in data.selectors ) {
                    selectors[i] = [];
                    selectors[i][0] = prop;
                    selectors[i][1] = data.selectors[prop];
                    i++;
                }
            }
            
            if( selectors && Array.isArray( selectors ) ) {
                selectorsJson = JSON.stringify( selectors );
            }
            
            if( data.selectedDefault ) {
                selectedDefault = data.selectedDefault;
            }
            
            if( data.elemContainer ) {
                elemContainer = data.elemContainer;
            }
            
            targetSelectAddClass = data.elementControlTargetUnicClass;
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
                if( targetSelects.length > 0 && targetSelects[0].dataset.element ) {
                    let targetSelect = targetSelects[0];
                    let selectorElement = document.querySelector( '.' + targetSelect.dataset.element );
                    if( selectorElement ) {
                        function getSetElementValue( options, selectors, value ) {
                            if( typeof selectors != 'undefined' && Array.isArray( selectors ) && typeof options != 'undefined' && Array.isArray( options ) ) {
                                let optionsElementAttr = [];
                                for( let i = 0; i < options.length; i++ ) {
                                    if( typeof options[i] != 'undefined' && typeof options[i][2] != 'undefined' ) {
                                        optionsElementAttr[i] = options[i][2];
                                    }
                                }
                                
                                for( let i = 0; i < selectors.length; i++ ) {
                                    if( selectors[i] && Array.isArray( selectors[i] ) && typeof selectors[i][0] != 'undefined' ) {
                                        let selectorElements = document.querySelectorAll( selectors[i][0] );
                                        if( selectorElements.length > 0 && optionsElementAttr.length > 0 ) {
                                            for( let j = 0; j < selectorElements.length; j++ ) {
                                                if( typeof selectors[i][1] != 'undefined' && selectors[i][1] == 'class' ) {
                                                    if( value ) {
                                                        let valueSet;
                                                        for( let k = 0; k < optionsElementAttr.length; k++ ) {
                                                            if( optionsElementAttr[k] && Array.isArray( optionsElementAttr[k] ) ) {
                                                                for( let n = 0; n < optionsElementAttr[k].length; n++ ) {
                                                                    if( optionsElementAttr[k][n] ) {
                                                                        selectorElements[j].classList.remove( optionsElementAttr[k][n] );
                                                                    }
                                                                }
                                                                
                                                                if( options[k][1] == value ) {
                                                                    for( let n = 0; n < options[k][2].length; n++ ) {
                                                                        if( options[k][2][n] ) {
                                                                            valueSet = options[k][2][n];
                                                                            break;
                                                                        }
                                                                    }
                                                                }
                                                            } else {
                                                                if( optionsElementAttr[k] ) {
                                                                    selectorElements[j].classList.remove( optionsElementAttr[k] );
                                                                }
                                                            
                                                                if( options[k][1] == value && options[k][2] ) {
                                                                    valueSet = options[k][2];
                                                                }
                                                            }
                                                        }
                                                        
                                                        if( valueSet ) {
                                                            selectorElements[j].classList.add( valueSet );
                                                        }
                                                    } else {
                                                        for( let k = 0; k < optionsElementAttr.length; k++ ) {
                                                            if( optionsElementAttr[k] && Array.isArray( optionsElementAttr[k] ) ) {
                                                                for( let n = 0; n < optionsElementAttr[k].length; n++ ) {
                                                                    if( selectorElements[j].classList.contains( optionsElementAttr[k][n] ) ) {
                                                                        if( typeof options[k][1] != 'undefined' ) {
                                                                            return options[k][1];
                                                                        }
                                                                    }
                                                                }
                                                            } else {
                                                                if( selectorElements[j].classList.contains( optionsElementAttr[k] ) ) {
                                                                    if( typeof options[k][1] != 'undefined' ) {
                                                                        return options[k][1];
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                } else if( typeof selectors[i][1] != 'undefined' && Array.isArray( selectors[i][1] ) ) {
                                                    if( typeof selectors[i][1][0] != 'undefined' && typeof selectors[i][1][1] != 'undefined' ) {
                                                    
                                                    }
                                                } else if( typeof selectors[i][1] != 'undefined' && selectors[i][1] ){
                                                    if( value ) {
                                                        let valueSet;
                                                        for( let k = 0; k < optionsElementAttr.length; k++ ) {
                                                            if( optionsElementAttr[k] && Array.isArray( optionsElementAttr[k] ) ) {
                                                                selectorElements[j].removeAttribute( selectors[i][1] );
                                                                
                                                                if( options[k][1] == value ) {
                                                                    for( let n = 0; n < options[k][2].length; n++ ) {
                                                                        if( options[k][2][n] ) {
                                                                            valueSet = options[k][2][n];
                                                                            break;
                                                                        }
                                                                    }
                                                                }
                                                            } else {
                                                                selectorElements[j].removeAttribute( selectors[i][1] );
                                                            
                                                                if( options[k][1] == value && options[k][2] ) {
                                                                    valueSet = options[k][2];
                                                                }
                                                            }
                                                        }
                                                        
                                                        if( valueSet ) {
                                                            selectorElements[j].setAttribute( selectors[i][1], valueSet );
                                                        }
                                                    } else {
                                                        for( let k = 0; k < optionsElementAttr.length; k++ ) {
                                                            if( optionsElementAttr[k] && Array.isArray( optionsElementAttr[k] ) ) {
                                                                for( let n = 0; n < optionsElementAttr[k].length; n++ ) {
                                                                    if( selectorElements[j].getAttribute( selectors[i][1] ) == optionsElementAttr[k][n] ) {
                                                                        if( typeof options[k][1] != 'undefined' ) {
                                                                            return options[k][1];
                                                                        }
                                                                    }
                                                                }
                                                            } else {
                                                                if( selectorElements[j].getAttribute( selectors[i][1] ) == optionsElementAttr[k] ) {
                                                                    if( typeof options[k][1] != 'undefined' ) {
                                                                        return options[k][1];
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                return false;
                            }

                            if( ! value ) {
                                return false;
                            }
                        }
                        
                        let options,
                            selectors;
                        if( '{{{optionsJson}}}' && '{{{selectorsJson}}}' ) {
                            options = JSON.parse( '{{{optionsJson}}}' );
                            selectors = JSON.parse( '{{{selectorsJson}}}' );

                            let selectValue = getSetElementValue( options, selectors );
                            
                            if( selectValue ) {
                                for( let i = 0; i < targetSelect.options.length; i++ ) {
                                    targetSelect.options[i].removeAttribute( 'selected' );
                                    
                                    if( targetSelect.options[i].value == selectValue ) {
                                        targetSelect.options[i].setAttribute( 'selected', 'selected' );
                                    }
                                }
                            }
                        }
                        
                        targetSelect.onchange = function( event ) {
                            let details = {value: this.value};
                            WPTB_Helper.wptbDocumentEventGenerate( 'wptb-control:{{{targetSelectAddClass}}}', selectorElement, details );
                            getSetElementValue( options, selectors, this.value );
                            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                            wptbTableStateSaveManager.tableStateSet();
                        };
                    }
                }
            } )();
        </wptb-template-script>
        
		<?php
	}
}