<?php
namespace WP_Table_Builder\Inc\Admin\Controls;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder "text" control.
 *
 * A control class for creating "text" control.
 *
 * @since 1.1.2
 */
class Control_Text extends Base_Control {
    /**
	 * Get text control type.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'text';
	}

	/**
	 * Enqueue text control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles used by the text
	 * control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {

	}

	/**
	 * Render text control output in the editor.
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
                selectors = [],
                placeholder,
                elemContainer,
                targetInputAddClass = '';

            const {dataSelectors,attributeSelectors} = data;
            let dataSelectorsJson = null;
            let attributeSelectorsJson = null;

            if(dataSelectors){
                dataSelectorsJson = JSON.stringify(dataSelectors);
            }

            if(attributeSelectors){
                attributeSelectorsJson = JSON.stringify(attributeSelectors);
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

            if( data.placeholder ) {
                placeholder = data.placeholder;
            }

            if( data.elemContainer ) {
                elemContainer = data.elemContainer;
            }

            targetInputAddClass = data.elementControlTargetUnicClass;
        #>

        <div class='wptb-settings-item-header' >
            <p class="wptb-settings-item-title">{{{label}}}</p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 12px; padding-top: 23px;">
            <div class="wptb-settings-col-xs-8">
                <input class="wptb-number wptb-element-property {{{targetInputAddClass}}}"
                       type="text" data-element="{{{elemContainer}}}" placeholder="{{{placeholder}}}">
            </div>
        </div>

        <wptb-template-script>
            ( function() {
                let targetInputs = document.getElementsByClassName( '{{{targetInputAddClass}}}' );
                if( targetInputs.length > 0 && targetInputs[0].dataset.element ) {
                    targetInput = targetInputs[0];
                    let selectorElement = document.querySelector( '.' + targetInput.dataset.element );
                    if( selectorElement ) {
                        function getSetElementValue( selectors, value ) {
                            if( selectors && Array.isArray( selectors ) ) {
                                for( let i = 0; i < selectors.length; i++ ) {
                                    if( selectors[i] && Array.isArray( selectors[i] ) && typeof selectors[i][0] != 'undefined' && selectors[i][1] != 'undefined' ) {
                                        let selectorElements = document.querySelectorAll( selectors[i][0] );
                                        if( selectorElements.length > 0 ) {
                                            for( let j = 0; j < selectorElements.length; j++ ) {
                                                if( selectors[i][1] ) {
                                                    if( Array.isArray( selectors[i][1] ) ) {
                                                        for( let k = 0; k < selectors[i][1].length; k++ ) {
                                                            if( selectors[i][1][k] ) {
                                                                if( typeof selectorElements[j].style[selectors[i][1][k]] == 'undefined' ) {
                                                                    if( typeof value != 'undefined' ) {
                                                                        selectorElements[j].setAttribute( selectors[i][1][k], value );
                                                                    } else if( selectorElements[j].getAttribute( selectors[i][1][k] ) ) {
                                                                        return selectorElements[j].getAttribute( selectors[i][1][k] );
                                                                    }
                                                                } else {
                                                                    if( typeof value != 'undefined' ) {
                                                                        selectorElements[j].style[selectors[i][1][k]] = value;
                                                                    } else if( parseInt( selectorElements[j].style[selectors[i][1][k]] ) ) {
                                                                        return parseInt( selectorElements[j].style[selectors[i][1][k]] );
                                                                    }
                                                                }
                                                            } else {
                                                                if( typeof value != 'undefined' ) {
                                                                    selectorElements[j].innerHTML = value;
                                                                } else if( selectorElements[j].innerHTML ) {
                                                                    return selectorElements[j].innerHTML;
                                                                }
                                                            }
                                                        }
                                                    } else {
                                                        if( selectors[i][1] ) {
                                                            if( typeof selectorElements[j].style[selectors[i][1]] == 'undefined' ) {
                                                                if( typeof value != 'undefined' ) {
                                                                    selectorElements[j].setAttribute( selectors[i][1], value );
                                                                } else if( selectorElements[j].getAttribute( selectors[i][1] ) ) {
                                                                    return selectorElements[j].getAttribute( selectors[i][1] );
                                                                }
                                                            } else {
                                                                if( typeof value != 'undefined' ) {
                                                                    selectorElements[j].style[selectors[i][1]] = value;
                                                                } else if( parseInt( selectorElements[j].style[selectors[i][1]] ) ) {
                                                                    return parseInt( selectorElements[j].style[selectors[i][1]] );
                                                                }
                                                            }
                                                        } else {
                                                            if( typeof value != 'undefined' ) {
                                                                selectorElements[j].innerHTML = value;
                                                            } else if( selectorElements[j].innerHTML ) {
                                                                return selectorElements[j].innerHTML;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                return '';
                            }

                            if( ! value ) {
                                return '';
                            }
                        }

                        function setDataSets(selectors, value) {
                            Object.keys(selectors).map(s => {
                            if (Object.prototype.hasOwnProperty.call(selectors, s)) {
                            document.querySelector(s).dataset[selectors[s]] = value;
                            }
                            })
                        }


                        function setAttributes(selectors, value) {
                            Object.keys(selectors).map(s => {
                            if (Object.prototype.hasOwnProperty.call(selectors, s)) {
                            document.querySelector(s).setAttribute(selectors[s], value);
                            }
                            })
                        }

                        if( '{{{selectorsJson}}}' ) {
                            let selectors = JSON.parse( '{{{selectorsJson}}}' );

                            targetInput.value = getSetElementValue( selectors );
                        }

                        targetInput.oninput = function( event ) {
                            let details = {value: this.value};
                            WPTB_Helper.wptbDocumentEventGenerate( 'wptb-control:{{{targetInputAddClass}}}', selectorElement, details );
                            if( '{{{selectorsJson}}}' ) {
                                let selectors = JSON.parse( '{{{selectorsJson}}}' );

                                getSetElementValue( selectors, details.value );
                            }

                            if('{{{dataSelectorsJson}}}'){
                                setDataSets(JSON.parse('{{{dataSelectorsJson}}}'), details.value);
                            }

                            if('{{{attributeSelectorsJson}}}'){
                            setAttributes(JSON.parse('{{{attributeSelectorsJson}}}'), details.value);
                            }
            };

            targetInput.onchange = function( event ) {
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