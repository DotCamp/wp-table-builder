<?php
namespace WP_Table_Builder\Inc\Admin\Controls;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder "Toggle" control.
 *
 * A control class for creating "enable-disable" control object
 *
 * @since 1.1.2
 */
class Control_Toggle extends Base_Control {
    /**
	 * Get "Toggle" control type.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'toggle';
	}

	/**
	 * Enqueue "toggle" control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles used by the control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {

	}

	/**
	 * Render "toggle" control output in the editor.
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
                selectors = [],
                elemContainer,
                selectorsJson,
                targetInputAddClass,
                checked = false;
            
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

            if( data.elemContainer ) {
                elemContainer = data.elemContainer;
            }

            if( data.checked ) {
                checked = true
            }
            
            targetInputAddClass = data.elementControlTargetUnicClass;
        #>

        <div id="{{{targetInputAddClass}}}" class="wptb-settings-row wptb-settings-middle-xs">
            <label class="wptb-toggle">
                <span style="font-size: 16px">{{{label}}}</span>
                <input class="wptb-element-property {{{targetInputAddClass}}}" type="checkbox" data-element="{{{elemContainer}}}">
                <i></i>
            </label>
        </div>

        <wptb-template-script>
            ( function() {
                let targetInputs = document.getElementsByClassName( '{{{targetInputAddClass}}}' );
                if( targetInputs.length > 0 ) {
                    targetInput = targetInputs[0];
                    let dataSelectorElement = targetInput.dataset.element;
                    if( dataSelectorElement ) {
                        let selectorElement = document.querySelector( '.' + dataSelectorElement );
                        if( selectorElement ) {
                            function getSetElementValue( selectors, value ) {
                                if( selectors && Array.isArray( selectors ) ) {
                                    for( let i = 0; i < selectors.length; i++ ) {
                                        if( selectors[i] && Array.isArray( selectors[i] ) && typeof selectors[i][0] != 'undefined' && typeof selectors[i][1] != 'undefined' ) {
                                            let selectorElements = document.querySelectorAll( selectors[i][0] );
                                            if( selectorElements.length > 0 ) {
                                                for( let j = 0; j < selectorElements.length; j++ ) {
                                                    if( selectors[i][1] && Array.isArray( selectors[i][1] ) && typeof selectors[i][1][0] != 'undefined' ) {
                                                        if( Array.isArray( selectors[i][1][0] ) ) {
                                                            for( let k = 0; k < selectors[i][1].length; k++ ) {
                                                                if( typeof selectors[i][1][k] != 'undefined' && Array.isArray( selectors[i][1][k] ) ) {
                                                                    if( selectors[i][1][k][0] ) {
                                                                        let styleValue;

                                                                        if( value ) {
                                                                            if( value == 'checked' ) {
                                                                                styleValue = typeof selectors[i][1][k][1] != 'undefined' ? selectors[i][1][k][1] : '';
                                                                            } else {
                                                                                styleValue = typeof selectors[i][1][k][2] != 'undefined' ? selectors[i][1][k][2] : '';
                                                                            }
                                                                        }

                                                                        if( selectors[i][1][k][0] == 'class' ) {
                                                                            if( value ) {
                                                                                if( styleValue ) {
                                                                                    selectorElements[j].classList.add( styleValue );
                                                                                } else {
                                                                                    styleValue = typeof selectors[i][1][1] != 'undefined' ? selectors[i][1][k][1] : '';
                                                                                    selectorElements[j].classList.remove( styleValue );
                                                                                }
                                                                            } else {
                                                                                if( typeof selectors[i][1][k][1] != 'undefined' && selectorElements[j].classList.contains( selectors[i][1][k][1] ) ) {
                                                                                    return true;
                                                                                } else {
                                                                                    return false;
                                                                                }
                                                                            }
                                                                        } else if( typeof selectorElements[j].style[selectors[i][1][k][0]] == 'undefined' ) {
                                                                            if( value ) {
                                                                                if( styleValue ) {
                                                                                    selectorElements[j].setAttribute( selectors[i][1][k][0], styleValue );
                                                                                } else {
                                                                                    selectorElements[j].removeAttribute( selectors[i][1][k][0] );
                                                                                }
                                                                            } else {
                                                                                if( typeof selectors[i][1][k][1] != 'undefined' && selectorElements[j].getAttribute( selectors[i][1][k][0] ) == selectors[i][1][k][1] ) {
                                                                                    return true;
                                                                                } else {
                                                                                    return false;
                                                                                }
                                                                            }
                                                                        } else {
                                                                            if( value ) {
                                                                                if( styleValue ) {
                                                                                    selectorElements[j].style[selectors[i][1][k][0]] = styleValue;
                                                                                } else {
                                                                                    selectorElements[j].style[selectors[i][1][k][0]] = '';
                                                                                }
                                                                            } else {
                                                                                if( typeof selectors[i][1][k][1] != 'undefined' && selectorElements[j].style[selectors[i][1][k][0]] == selectors[i][1][k][1] ) {
                                                                                    return true;
                                                                                } else {
                                                                                    return false;
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        } else {
                                                            let styleValue;
                                                            if( value ) {
                                                                if( value == 'checked' ) {
                                                                    styleValue = typeof selectors[i][1][1] != 'undefined' ? selectors[i][1][1] : '';
                                                                } else {
                                                                    styleValue = typeof selectors[i][1][2] != 'undefined' ? selectors[i][1][2] : '';
                                                                }
                                                            }

                                                            if( selectors[i][1][0] == 'class' ) {
                                                                if( value ) {
                                                                    if( styleValue ) {
                                                                        selectorElements[j].classList.add( styleValue );
                                                                    } else {
                                                                        styleValue = typeof selectors[i][1][1] != 'undefined' ? selectors[i][1][1] : '';
                                                                        selectorElements[j].classList.remove( styleValue );
                                                                    }
                                                                } else {
                                                                    if( typeof selectors[i][1][1] != 'undefined' && selectorElements[j].classList.contains( selectors[i][1][1] ) ) {
                                                                        return true;
                                                                    } else {
                                                                        return false;
                                                                    }
                                                                }
                                                            } else if( typeof selectorElements[j].style[selectors[i][1][0]] == 'undefined' ) {
                                                                if( value ) {
                                                                    if( styleValue ) {
                                                                        selectorElements[j].setAttribute( selectors[i][1][0], styleValue );
                                                                    } else {
                                                                        selectorElements[j].removeAttribute( selectors[i][1][0] );
                                                                    }
                                                                } else {
                                                                    if( typeof selectors[i][1][1] != 'undefined' && selectorElements[j].getAttribute( selectors[i][1][0] ) == selectors[i][1][1] ) {
                                                                        return true;
                                                                    } else if( typeof selectors[i][1][2] != 'undefined' && selectorElements[j].getAttribute( selectors[i][1][0] ) == selectors[i][1][2] ) {
                                                                        return false;
                                                                    }
                                                                }
                                                            } else {
                                                                if( value ) {
                                                                    if( styleValue ) {
                                                                        selectorElements[j].style[selectors[i][1][0]] = styleValue;
                                                                    } else {
                                                                        selectorElements[j].style[selectors[i][1][0]] = '';
                                                                    }
                                                                } else {
                                                                    if( typeof selectors[i][1][1] != 'undefined' && selectorElements[j].style[selectors[i][1][0]] == selectors[i][1][1] ) {
                                                                        return true;
                                                                    } else if( typeof selectors[i][1][2] != 'undefined' && selectorElements[j].style[selectors[i][1][0]] == selectors[i][1][2] ) {
                                                                        return false;
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

                            if( '{{{selectorsJson}}}' ) {
                                let selectors = JSON.parse( '{{{selectorsJson}}}' );

                                targetInput.checked = getSetElementValue( selectors ) || {{{checked}}};
                            }

                            targetInput.onchange = function( event ) {
                                let details;

                                if( event.target.checked == true ) {
                                    details = {value: 'checked'};
                                } else {
                                    details = {value: 'unchecked'};
                                }

                                if( '{{{selectorsJson}}}' ) {
                                    let selectors = JSON.parse( '{{{selectorsJson}}}' );

                                    getSetElementValue( selectors, details.value );
                                }
                                WPTB_Helper.wptbDocumentEventGenerate( 'wptb-control:{{{targetInputAddClass}}}', selectorElement, details );

                                let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                                wptbTableStateSaveManager.tableStateSet();
                            };

                        }
                    }
                }
            } )();
        </wptb-template-script>

		<?php
	}
}
