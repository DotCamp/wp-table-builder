<?php
namespace WP_Table_Builder\Inc\Admin\Controls;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder "textarea" control.
 *
 * A control class for creating "textarea" control.
 *
 * @since 1.1.2
 */
class Control_Textarea extends Base_Control {
    /**
	 * Get textarea control type.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'textarea';
	}

	/**
	 * Enqueue textarea control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles used by the textarea
	 * control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {

	}

	/**
	 * Render textarea control output in the editor.
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
                rows,
                cols,
                defaultValue,
                elemContainer,
                allowHTML= true,
                targetTextareaAddClass = '';

            if( data.label ) {
                label = data.label;
            }

            let i = 0;
            for ( let prop in data.selectors ) {
                selectors[i] = [];
                if( Number.isInteger( parseInt( prop ) ) ) {
                    selectors[i][1] = '';
                    if( data.selectors[prop] && ! Number.isInteger( parseInt ( data.selectors[prop] ) ) ) {
                        selectors[i][0] = data.selectors[prop];
                    } else {
                        selectors[i][0] = '';
                    }
                    continue;
                }

                selectors[i][0] = prop;
                selectors[i][1] = data.selectors[prop];
                i++;
            }

            if( selectors && Array.isArray( selectors ) ) {
                selectorsJson = JSON.stringify( selectors );
            }

            if( data.rows ) {
                rows = data.rows;
            }

            if( data.cols ) {
                cols = data.cols;
            }

            if( data.defaultValue ) {
                defaultValue = data.defaultValue;
            }

            if( data.placeholder ) {
                placeholder = data.placeholder;
            }

            if( data.elemContainer ) {
                elemContainer = data.elemContainer;
            }

            if(data.allowHTML !== undefined){
                allowHTML = data.allowHTML;
            }

            targetTextareaAddClass = data.elementControlTargetUnicClass;

            const targetElementValueSource = allowHTML ? 'innerHTML':'textContent';
        #>

        <div class='wptb-settings-item-header' >
            <p class="wptb-settings-item-title">{{{label}}}</p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 12px; padding-top: 23px;">
            <div class="wptb-settings-col-xs-12">
                <textarea class="wptb-number wptb-element-property {{{targetTextareaAddClass}}}"
                          rows="{{{rows}}}" cols="{{{cols}}}" placeholder="{{{placeholder}}}" data-element="{{{elemContainer}}}" style="width: 100%">{{{defaultValue}}}</textarea>
            </div>
        </div>

        <wptb-template-script>
            ( function() {
                const targetElementValueSource = '{{{targetElementValueSource}}}';
                let targetTextarea = document.getElementsByClassName( '{{{targetTextareaAddClass}}}' );
                if( targetTextarea.length > 0 && targetTextarea[0].dataset.element ) {
                    targetTextarea = targetTextarea[0];
                    let selectorElement = document.querySelector( '.' + targetTextarea.dataset.element );
                    if( selectorElement ) {
                        function getSetElementValue( selectors, value ) {
                            if( selectors && Array.isArray( selectors ) ) {
                                for( let i = 0; i < selectors.length; i++ ) {
                                    if( selectors[i] && Array.isArray( selectors[i] ) && typeof selectors[i][0] != 'undefined' && selectors[i][1] != 'undefined' ) {
                                        let selectorElements = document.querySelectorAll( selectors[i][0] );
                                        if( selectorElements.length > 0 ) {
                                            for( let j = 0; j < selectorElements.length; j++ ) {
                                                if( selectors[i][1] && Array.isArray( selectors[i][1] ) ) {
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
                                                                selectorElements[j][targetElementValueSource]= value;
                                                            } else if( selectorElements[j][targetElementValueSource] ) {
                                                                return selectorElements[j][targetElementValueSource];
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
                                                            selectorElements[j][targetElementValueSource] = value;
                                                        } else if( selectorElements[j][targetElementValueSource]) {
                                                            return selectorElements[j][targetElementValueSource];
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

                        if( '{{{selectorsJson}}}' ) {
                            let selectors = JSON.parse( '{{{selectorsJson}}}' );
                            targetTextarea.value = getSetElementValue( selectors );
                        }

                        targetTextarea.oninput = function( event ) {
                            let details = {value: this.value};
                            WPTB_Helper.wptbDocumentEventGenerate( 'wptb-control:{{{targetTextareaAddClass}}}', selectorElement, details );

                            WPTB_Helper.wptbDocumentEventGenerate('wptb-element-control:update', document, {
                                elementId: '{{{elemContainer}}}',
                                controlId: '{{{data.controlKey}}}',
                                value: this.value,
                            });

                            if( '{{{selectorsJson}}}' ) {
                                let selectors = JSON.parse( '{{{selectorsJson}}}' );

                                getSetElementValue( selectors, details.value );
                            }
                        };

                        targetTextarea.onchange = function( event ) {
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
