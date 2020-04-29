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
                selectorsJson,
                targetInputAddClass;
             
            if( data.label ) {
                label = data.label;
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
            
            if( selectors && Array.isArray( selectors ) ) {
                selectorsJson = JSON.stringify( selectors );
            }
            
            if( data.elemContainer ) {
                elemContainer = data.elemContainer;
            }
            
            targetInputAddClass = data.elementControlTargetUnicClass;
            let dataJson = JSON.stringify( data );
        #>
        <div class='wptb-settings-item-header' >
            <p class="wptb-settings-item-title">{{{label}}}</p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-top: 25px; padding-bottom: 10px;">
            <div class='wptb-settings-col-xs-8'>
                <input type="text" class="wptb-element-property wptb-color-picker {{{targetInputAddClass}}}" 
                       data-element="{{{elemContainer}}}" data-type="color" value=""/>
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
                    if( '{{{selectorsJson}}}' ) {
                        let selectors = JSON.parse( '{{{selectorsJson}}}' );
                        
                        let thisColorCss, thisColorCssHex;
                        for( let i = 0; i < selectors.length; i++ ) {
                            if( selectors[i] && Array.isArray( selectors[i] ) && selectors[i][0] && selectors[i][1] ) {
                                let selectorElements = document.querySelectorAll( selectors[i][0] );
                                if( selectorElements.length > 0 ) {
                                    for( let j = 0; j < selectorElements.length; j++ ) {
                                        if( selectors[i][1] ) {
                                            if( Array.isArray( selectors[i][1] ) ) {
                                                for( let k = 0; k < selectors[i][1].length; k++ ) {
                                                    if( selectorElements[j].style[selectors[i][1][k]] ) {
                                                        thisColorCss = selectorElements[j].style[selectors[i][1][k]];
                                                        thisColorCssHex = WPTB_Helper.rgbToHex( thisColorCss );
                                                        if( thisColorCssHex ) {
                                                            thisColorCss = thisColorCssHex;
                                                        }
                                                        if( ! WPTB_Helper.isHex( thisColorCss ) ) {
                                                            thisColorCss = '';
                                                        }

                                                        selectorElements[j].style[selectors[i][1][k]] = thisColorCss;
                                                    }
                                                }
                                            } else {
                                                if( selectorElements[j].style[selectors[i][1]] ) {
                                                    thisColorCss = selectorElements[j].style[selectors[i][1]];
                                                    thisColorCssHex = WPTB_Helper.rgbToHex( thisColorCss );
                                                    if( thisColorCssHex ) {
                                                        thisColorCss = thisColorCssHex;
                                                    }
                                                    if( ! WPTB_Helper.isHex( thisColorCss ) ) {
                                                        thisColorCss = '';
                                                    }
                                                    selectorElements[j].style[selectors[i][1]] = thisColorCss;
                                                }
                                            }

                                            if( thisColorCss ) {
                                                targetInput.value = thisColorCss;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        function elementColorSet( selectors, color ) {
                            for( let i = 0; i < selectors.length; i++ ) {
                                if( selectors[i] && Array.isArray( selectors[i] ) && selectors[i][0] && selectors[i][1] ) {
                                    let selectorElements = document.querySelectorAll( selectors[i][0] );
                                    if( selectorElements.length > 0 ) {
                                        for( let j = 0; j < selectorElements.length; j++ ) {
                                            if( selectors[i][1] ) {
                                                if( Array.isArray( selectors[i][1] ) ) {
                                                    for( let k = 0; k < selectors[i][1].length; k++ ) {
                                                        selectorElements[j].style[selectors[i][1][k]] = color;
                                                    }
                                                } else {
                                                    selectorElements[j].style[selectors[i][1]] = color;
                                                }
                                            }
                                        }
                                    }
                                }
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

                                elementColorSet( selectors, uiColor );

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