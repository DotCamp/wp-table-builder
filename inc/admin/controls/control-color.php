<?php
namespace WP_Table_Builder\Inc\Admin\Controls;

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
                name,
                selectors = [],
                elemContainer,
                useDataset,
                targetInputAddClass,
                dataSets,
                startupValueSelector;

            if( data.label ) {
                label = data.label;
            }

            useDataset = data.useDataset;

            startupValueSelector = data.startupValueSelector;
            let startupJson = null;
            if(startupValueSelector){
                startupJson = JSON.stringify(startupValueSelector);
            }

            dataSets = data.dataSets;
            let dataSetsJson = null;
            if(dataSets){
                dataSetsJson = JSON.stringify(dataSets);
            }

            if( data.name ) {
                name = data.name;
            }

            let i = 0;
            for ( let prop in data.selectors ) {
                selectors[i] = [];
                selectors[i][0] = prop;
                selectors[i][1] = data.selectors[prop];
                i++;
            }

            if( data.elemContainer ) {
                elemContainer = data.elemContainer;
            }

            targetInputAddClass = data.elementControlTargetUnicClass;
            if(!window[targetInputAddClass]) window[targetInputAddClass] = [];
            if(!window[targetInputAddClass]['control-color']) window[targetInputAddClass]['control-color'] = [];
            window[targetInputAddClass]['control-color']['selectors'] = selectors;
        #>
        <div id="{{{targetInputAddClass}}}">
            <div class='wptb-settings-item-header'>
                <p class="wptb-settings-item-title">{{{label}}}</p>
            </div>
            <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-top: 25px; padding-bottom: 10px;">
                <div class='wptb-settings-col-xs-8'>
                    <input type="text" class="wptb-element-property wptb-color-picker {{{targetInputAddClass}}}"
                           data-element="{{{elemContainer}}}" data-type="color" value=""/>
                </div>
            </div>
        </div>

        <wptb-template-script>
            ( function() {
                let targetInput = document.querySelector( '.{{{targetInputAddClass}}}' );
                let dataSelectorElement = targetInput.dataset.element;
                let selectorElement = document.querySelector( '.' + dataSelectorElement );

                function wpColorPickerCheckChangeForTableStateSaving( event ) {
                    if( event.originalEvent.type == 'external' ||
                        ( event.originalEvent.type == 'click' && event.target.value == 'Clear' ) ) {
                        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                        wptbTableStateSaveManager.tableStateSet();
                    } else {
                        let wpPickerContainer = WPTB_Helper.findAncestor( event.target, 'wp-picker-container' );
                        if( wpPickerContainer ) {
                            if( event.originalEvent.type == 'square' || event.originalEvent.type == 'strip' ) {
                                let body = document.getElementsByTagName( 'body' )[0];
                                body.removeEventListener( 'mouseup', WPTB_Helper.irisStripMouseUpStateSaveManager, false );
                                body.addEventListener( 'mouseup', WPTB_Helper.irisStripMouseUpStateSaveManager, false );
                            }
                        }
                    }
                }

                if( targetInput && selectorElement ) {
                    if( window['{{{targetInputAddClass}}}']['control-color']['selectors'] ) {
                        let selectors = window['{{{targetInputAddClass}}}']['control-color']['selectors'];

                        let thisColorCss, thisColorCssHex;
                        for( let i = 0; i < selectors.length; i++ ) {
                            if( selectors[i] && Array.isArray( selectors[i] ) && selectors[i][0] && selectors[i][1] ) {
                                let selectorElements = document.querySelectorAll( selectors[i][0] );
                                if( selectorElements.length > 0 ) {
                                    let thisColorCssArr = [];
                                    for( let j = 0; j < selectorElements.length; j++ ) {
                                        if( selectors[i][1] ) {
                                            thisColorCss = '';
                                            if( Array.isArray( selectors[i][1] ) ) {
                                                for( let k = 0; k < selectors[i][1].length; k++ ) {
                                                    if( typeof selectorElements[j].style[selectors[i][1][k]] == 'undefined' ) {
                                                        thisColorCss = selectorElements[j].getAttribute(selectors[i][1][k]);
                                                    } else {
                                                        thisColorCss = selectorElements[j].style[selectors[i][1][k]];
                                                    }

                                                    thisColorCssHex = WPTB_Helper.rgbToHex( thisColorCss );
                                                    if( thisColorCssHex ) {
                                                        thisColorCss = thisColorCssHex;
                                                    }
                                                    if( ! WPTB_Helper.isHex( thisColorCss ) ) {
                                                        thisColorCss = '';
                                                    }

                                                    if( typeof selectorElements[j].style[selectors[i][1][k]] == 'undefined' ) {
                                                        selectorElements[j].setAttribute(selectors[i][1][k], thisColorCss);
                                                    } else {
                                                        selectorElements[j].style[selectors[i][1][k]] = thisColorCss;
                                                    }
                                                }
                                            } else {
                                                if( typeof selectorElements[j].style[selectors[i][1]] == 'undefined' ) {
                                                    thisColorCss = selectorElements[j].getAttribute(selectors[i][1]);
                                                } else {
                                                    thisColorCss = selectorElements[j].style[selectors[i][1]];
                                                }

                                                thisColorCssHex = WPTB_Helper.rgbToHex( thisColorCss );
                                                if( thisColorCssHex ) {
                                                    thisColorCss = thisColorCssHex;
                                                }
                                                if( ! WPTB_Helper.isHex( thisColorCss ) ) {
                                                    thisColorCss = '';
                                                }

                                                if( typeof selectorElements[j].style[selectors[i][1]] == 'undefined' ) {
                                                    selectorElements[j].setAttribute(selectors[i][1], thisColorCss);
                                                } else {
                                                    selectorElements[j].style[selectors[i][1]] = thisColorCss;
                                                }
                                            }

                                            thisColorCssArr.push(thisColorCss);
                                        }
                                    }

                                    if( thisColorCssArr.length > 0 ) {
                                        targetInput.value = WPTB_Helper.getValueMaxCountSameElementsInArray(thisColorCssArr);
                                    }
                                }
                            }
                        }

                        function elementColorSet( selectors, color) {
                            const useDataset = 'true' === '{{{useDataset}}}';
                            if(useDataset){
                                addDataSet(selectors, color);
                                return;
                            }

                            if('' !== '{{{dataSetsJson}}}'){
                                addToDataSetSelectors(color);
                            }

                            for( let i = 0; i < selectors.length; i++ ) {
                                if( selectors[i] && Array.isArray( selectors[i] ) && selectors[i][0] && selectors[i][1] ) {
                                    let selectorElements = document.querySelectorAll( selectors[i][0] );
                                    if( selectorElements.length > 0 ) {
                                        for( let j = 0; j < selectorElements.length; j++ ) {
                                            if( selectors[i][1] ) {
                                                if( Array.isArray( selectors[i][1] ) ) {
                                                    for( let k = 0; k < selectors[i][1].length; k++ ) {
                                                        if( typeof selectorElements[j].style[selectors[i][1][k]] == 'undefined' ) {
                                                            selectorElements[j].setAttribute(selectors[i][1][k], color);
                                                        } else {
                                                            selectorElements[j].style[selectors[i][1][k]] = color;
                                                        }
                                                    }
                                                } else {
                                                    if( typeof selectorElements[j].style[selectors[i][1]] == 'undefined' ) {
                                                        selectorElements[j].setAttribute(selectors[i][1], color);
                                                    } else {
                                                        selectorElements[j].style[selectors[i][1]] = color;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        function addToDataSetSelectors(val) {
                            const selectorsObj = JSON.parse('{{{dataSetsJson}}}');

                            Object.keys(selectorsObj).map(s => {
                                if(Object.prototype.hasOwnProperty.call(selectorsObj , s)){
                                    const tempEl = document.querySelector(s);
                                    tempEl.dataset[selectorsObj[s]] = val;
                                }
                            });
                        }

                        function assignDataSetsToPicker(selectors){
                            selectors.map(s => {
                                const el = document.querySelector(s[0]);
                                if(el.dataset[s[1]]){
                                    targetInput.value = el.dataset[s[1]];
                                }
                            })
                        }

                        function assignStartupData(selectors){
                            Object.keys(selectors).map(s => {
                                if(Object.prototype.hasOwnProperty.call(selectors , s) ){
                                    const dataVal = document.querySelector(s).dataset[selectors[s]];
                                    targetInput.value = dataVal;
                                }
                            });
                        }

                        if('true' === '{{{useDataset}}}'){
                            assignDataSetsToPicker(selectors);
                        }

                        if('' !== '{{{startupJson}}}'){
                            const startupSelectorObj = JSON.parse('{{{startupJson}}}');
                            assignStartupData(startupSelectorObj);
                        }

                        function addDataSet(selectors, value){
                            selectors.map(s => {
                                const el = document.querySelector(s[0]);
                                el.dataset[s[1]] = value;
                            });
                        }

                        jQuery( '.{{{targetInputAddClass}}}' ).wpColorPicker({
                            change: function ( event, ui ) {
                                let uiColor;
                                if( ui ) {
                                    uiColor = ui.color.toString();
                                } else {
                                    uiColor = '';
                                }

                                elementColorSet( selectors, uiColor);

                                let targetInput = document.getElementsByClassName( '{{{targetInputAddClass}}}' );
                                if( targetInput.length > 0 ) {
                                    targetInput = targetInput[0];
                                    targetInput.value = uiColor;
                                }

                                WPTB_Helper.wptbDocumentEventGenerate( 'wptb-control:{{{targetInputAddClass}}}', selectorElement );
                                wpColorPickerCheckChangeForTableStateSaving( event );
                            },
                            clear: function( event ) {
                                elementColorSet( selectors, '' );

                                WPTB_Helper.wptbDocumentEventGenerate( 'wptb-control:{{{targetInputAddClass}}}', selectorElement );
                                wpColorPickerCheckChangeForTableStateSaving( event );
                            }
                        });

                        let targetInputAddClass = document.querySelector( '.{{{targetInputAddClass}}}' );
                        if( targetInputAddClass ) {
                            targetInputAddClass.addEventListener( 'controlColor:change', function( e ) {
                                let color = e.detail.value;
                                elementColorSet( selectors, color );
                            } );
                        }
                    }
                }
            } )();
        </wptb-template-script>
		<?php
	}
}
