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
 * for showing size field on the left panel. This fields set css value for html tag.
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
            let label,
                selectors = [],
                selectorsJson,
                max,
                min,
                defaultValue,
                dimension;

            if( data.label ) {
                label = data.label;
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

            if( data.max ) {
                max = data.max;
            } else {
                max = 100;
            }
            if(isNaN(data.min)) {
                min = 10;
            } else {
                min = data.min;
            }
            if( isNaN(data.defaultValue )) {
                defaultValue = 15;
            } else {
                defaultValue = data.defaultValue;
            }
            if( data.dimension ) {
                dimension = data.dimension;
            } else {
                dimension = 'px';
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
                <input data-type="size" class="wptb-element-property wptb-size-slider {{{targetInputAddClass}}}"
                    data-element="{{{elemContainer}}}" type="range" min="{{{min}}}" max="{{{max}}}"
                    step="1" value="{{{defaultValue}}}">
            </div>
            <div class="wptb-settings-col-xs-4">
                <input id="wptb-size-number" data-type="size"
                    class="wptb-size-number wptb-number-input wptb-element-property {{{targetInputAddClass}}}"
                    data-element="{{{elemContainer}}}" type="number" min="{{{min}}}" max="{{{max}}}" step="1" placeholder="{{{defaultValue}}}" pattern="[0-9]*">
                <span class="wptb-input-px">{{{dimension}}}</span>
            </div>
        </div>

        <wptb-template-script>
            ( function() {
                let targetInputs = document.getElementsByClassName( '{{{targetInputAddClass}}}' );
                if( targetInputs.length > 0 && targetInputs[0].dataset.element ) {
                    let selectorElement = document.querySelector( '.' + targetInputs[0].dataset.element );
                    if( selectorElement ) {
                        let selectorElementSettingValue;
                        if( '{{{selectorsJson}}}' ) {
                            let selectors = JSON.parse( '{{{selectorsJson}}}' );

                            selectorElementSettingValue = getSetElementValue( selectors );
                        }

                        for( let i = 0; i < targetInputs.length; i++ ) {
                            if( selectorElementSettingValue ) {
                                targetInputs[i].value = selectorElementSettingValue;
                            } else if( '{{{defaultValue}}}' ) {
                                targetInputs[i].value = '{{{defaultValue}}}';
                            }
                            if( targetInputs[i].classList.contains( 'wptb-size-slider' ) ) {
                                targetInputs[i].oninput = function ( event ) {
                                    if( event.target == this ) {
                                        this.parentNode.parentNode.getElementsByClassName('wptb-size-number')[0].value = this.value;
                                    }

                                    let details = {value: this.value};

                                    if( '{{{selectorsJson}}}' ) {
                                        let selectors = JSON.parse( '{{{selectorsJson}}}' );

                                        getSetElementValue( selectors, details.value );
                                    }

                                    WPTB_Helper.wptbDocumentEventGenerate( 'wptb-control:{{{targetInputAddClass}}}', selectorElement, details );

                                    event.target.onmouseup = function() {
                                        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                                        wptbTableStateSaveManager.tableStateSet();
                                    }
                                };
                            } else if( targetInputs[i].classList.contains( 'wptb-number-input' ) ) {
                                targetInputs[i].oninput = function( event ) {
                                    if( parseInt( this.value ) < parseInt( '{{{min}}}' ) ) {
                                        this.value = parseInt( '{{{min}}}' );
                                    } else if( parseInt( this.value ) > parseInt( '{{{max}}}' ) ) {
                                        this.value = parseInt ( '{{{max}}}' );
                                    }

                                    let sizeSliderInput = this.parentNode.parentNode.querySelector('.wptb-size-slider');
                                    if(sizeSliderInput) {
                                        sizeSliderInput.value = this.value;
                                        sizeSliderInput.oninput( event );
                                        WPTB_Helper.wptbDocumentEventGenerate( 'change', sizeSliderInput );
                                    }
                                }
                            }
                        }
                    }
                }

                function getSetElementValue(selectors, value) {
                    if (selectors && Array.isArray(selectors)) {
                        for (let i = 0; i < selectors.length; i++) {
                            if (selectors[i] && Array.isArray(selectors[i]) && typeof selectors[i][0] != 'undefined' && selectors[i][1] != 'undefined') {
                                let selectorElements = document.querySelectorAll(selectors[i][0]);
                                if (selectorElements.length > 0) {
                                    for (let j = 0; j < selectorElements.length; j++) {
                                        if (selectors[i][1]) {
                                            if (Array.isArray(selectors[i][1])) {
                                                for (let k = 0; k < selectors[i][1].length; k++) {
                                                    if (selectors[i][1][k]) {
                                                        if (typeof selectorElements[j].style[selectors[i][1][k]] == 'undefined') {
                                                            if (value) {
                                                                selectorElements[j].setAttribute(selectors[i][1][k], value);
                                                            } else if (selectorElements[j].getAttribute(selectors[i][1][k])) {
                                                                return selectorElements[j].getAttribute(selectors[i][1][k]);
                                                            }
                                                        } else {
                                                            if (value) {
                                                                selectorElements[j].style[selectors[i][1][k]] = value + '{{{dimension}}}';
                                                            } else if ( typeof parseInt(selectorElements[j].style[selectors[i][1][k]]) != 'undefined' ) {
                                                                let returnValue;
                                                                parseInt( selectorElements[j].style[selectors[i][1][k]] ) === 0 ? returnValue = '0' : returnValue = parseInt( selectorElements[j].style[selectors[i][1][k]] );
                                                                return returnValue;
                                                            }
                                                        }
                                                    }
                                                }
                                            } else {
                                                if (selectors[i][1]) {
                                                    if (typeof selectorElements[j].style[selectors[i][1]] == 'undefined') {
                                                        if (value) {
                                                            selectorElements[j].setAttribute(selectors[i][1], value);
                                                        } else if (selectorElements[j].getAttribute(selectors[i][1])) {
                                                            return selectorElements[j].getAttribute(selectors[i][1]);
                                                        }
                                                    } else {
                                                        if (value) {
                                                            selectorElements[j].style[selectors[i][1]] = value + '{{{dimension}}}';
                                                        } else if ( typeof parseInt(selectorElements[j].style[selectors[i][1]]) != 'undefined' ) {
                                                            let returnValue;
                                                            parseInt( selectorElements[j].style[selectors[i][1]] ) === 0 ? returnValue = '0' : returnValue = parseInt( selectorElements[j].style[selectors[i][1]] );
                                                            return returnValue;
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

                    if (!value) {
                        return false;
                    }
                }
            } )();
        </wptb-template-script>

		<?php
	}
}
