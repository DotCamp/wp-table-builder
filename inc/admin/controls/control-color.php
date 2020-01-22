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
                    WPTB_Helper.controlsStateManager( '{{{targetInputAddClass}}}' );
                    if( '{{{selectorsJson}}}' ) {
                        let selectors = JSON.parse( '{{{selectorsJson}}}' );
                        
                        let thisColorCss;
                        let targetInputSetColorIndic = false;
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
                                                        console.log(thisColorCss);
                                                        thisColorCssHex = WPTB_Helper.rgbToHex( thisColorCss );
                                                        if( thisColorCssHex ) {
                                                            thisColorCss = thisColorCssHex;

                                                        }
                                                        if( ! WPTB_Helper.isHex( thisColorCss ) ) {
                                                            thisColorCss = '';
                                                        }
                                                        WPTB_Helper.managerExternalCssStyles( dataSelectorElement, selectors[i][0], selectors[i][1][k], thisColorCss );
                                                        selectorElements[j].style[selectors[i][1][k]] = '';
                                                    }
                                                }
                                            } else {
                                                if( selectorElements[j].style[selectors[i][1]] ) {
                                                    thisColorCss = selectorElements[j].style[selectors[i][1]];
                                                    thisColorCssHex = WPTB_Helper.rgbToHex( thisColorCss );
                                                    if( thisColorCssHex ) {
                                                        thisColorCss = thisColorCssHex;
                                                    }
                                                    WPTB_Helper.managerExternalCssStyles( dataSelectorElement, selectors[i][0], selectors[i][1], thisColorCss );
                                                    selectorElements[j].style[selectors[i][1]] = '';
                                                }
                                            }

                                            if( thisColorCss && ! targetInputSetColorIndic ) {
                                                targetInput.value = thisColorCss;
                                                WPTB_Helper.controlsStateManager( '{{{targetInputAddClass}}}', true );
                                                console.log("Hello");
                                                targetInputSetColorIndic = true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        
                        WPTB_Helper.controlsStateManager( '{{{targetInputAddClass}}}' );
                        if( targetInputSetColorIndic ) {
                            let wptbDlementDatas = document.getElementsByClassName( 'wptb-element-datas' );
                            if( wptbDlementDatas.length > 0 ) {
                                wptbDlementDatas = wptbDlementDatas.innerHTML;
                            } else {
                                wptbDlementDatas = '';
                            }
                            if( window.wptbTableStateSaving && Array.isArray( window.wptbTableStateSaving ) ) {
                                let lastElem = window.wptbTableStateSaving[window.wptbTableStateSaving.length - 1];
                                let wptbPreviewTable = document.getElementsByClassName( 'wptb-preview-table' );
                                if( wptbPreviewTable.length > 0 ) {
                                    wptbPreviewTable = wptbPreviewTable[0];
                                    
                                    let wptbNewPreviewTable = wptbPreviewTable.cloneNode( true );
                                    let mceContentBodys = wptbNewPreviewTable.querySelectorAll( '.mce-content-body' );
                                    if( mceContentBodys.length > 0 ) {
                                        for ( let k = 0; k < mceContentBodys.length; k++ ) {
                                            mceContentBodys[k].classList.remove( 'mce-content-body' );
                                        }
                                    }

                                    let dataMceStyle = wptbNewPreviewTable.querySelectorAll( '[data-mce-style]' );
                                    if ( dataMceStyle.length > 0 ) {
                                        for ( let k = 0; k < dataMceStyle.length; k++ ) {
                                            dataMceStyle[k].removeAttribute( 'data-mce-style' );
                                        }
                                    }

                                    let mceIds = wptbNewPreviewTable.querySelectorAll( '[id^=mce_]' );
                                    if ( mceIds.length > 0 ) {
                                        for ( let k = 0; k < mceIds.length; k++ ) {
                                            mceIds[k].removeAttribute( 'id' );
                                        }
                                    }
                                    
                                    lastElem[0] = wptbNewPreviewTable;
                                }
                                
                                lastElem[2] = wptbDlementDatas;
                                let styleObjJson = WPTB_Helper.elementsStylesConvertToObject();
                                lastElem[3] = styleObjJson;
                                window.wptbTableStateSaving[window.wptbTableStateSaving.length - 1] = lastElem;
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

                                for( let i = 0; i < selectors.length; i++ ) {
                                    if( selectors[i] && Array.isArray( selectors[i] ) && selectors[i][0] && selectors[i][1] ) {
                                        let selectorElements = document.querySelectorAll( selectors[i][0] );
                                        if( selectorElements.length > 0 ) {
                                            for( let j = 0; j < selectorElements.length; j++ ) {
                                                if( selectors[i][1] ) {
                                                    if( Array.isArray( selectors[i][1] ) ) {
                                                        for( let k = 0; k < selectors[i][1].length; k++ ) {
                                                            selectorElements[j].style[selectors[i][1][k]] = '';
                                                            WPTB_Helper.managerExternalCssStyles( dataSelectorElement, selectors[i][0], selectors[i][1][k], uiColor );
                                                        }
                                                    } else {
                                                        selectorElements[j].style[selectors[i][1]] = '';
                                                        WPTB_Helper.managerExternalCssStyles( dataSelectorElement, selectors[i][0], selectors[i][1], uiColor );
                                                    }
                                                }
                                            }
                                        } else {
                                            if( selectors[i][0] && selectors[i][1] ) {
                                                if( Array.isArray( selectors[i][1] ) ) {
                                                    for( let k = 0; k < selectors[i][1].length; k++ ) {
                                                        WPTB_Helper.managerExternalCssStyles( dataSelectorElement, selectors[i][0], selectors[i][1][k], uiColor );
                                                    }
                                                } else {
                                                    WPTB_Helper.managerExternalCssStyles( dataSelectorElement, selectors[i][0], selectors[i][1], uiColor );
                                                }
                                            }
                                        }
                                    }
                                }

                                let targetInput = document.getElementsByClassName( '{{{targetInputAddClass}}}' );
                                if( targetInput.length > 0 ) {
                                    targetInput = targetInput[0];
                                    targetInput.value = uiColor;
                                }
                                WPTB_Helper.wptbDocumentEventGenerate( 'wptb-control:{{{targetInputAddClass}}}', selectorElement );
                                WPTB_Helper.controlsStateManager( '{{{targetInputAddClass}}}', true );
                                wpColorPickerCheckChangeForTableStateSaving( event );
                            },
                            clear: function( event ) {
                                for( let i = 0; i < selectors.length; i++ ) {
                                    if( selectors[i] && Array.isArray( selectors[i] ) && selectors[i][0] && selectors[i][1] ) {
                                        let selectorElements = document.querySelectorAll( selectors[i][0] );
                                        if( selectorElements.length > 0 ) {
                                            for( let j = 0; j < selectorElements.length; j++ ) {
                                                if( selectors[i][1] ) {
                                                    if( Array.isArray( selectors[i][1] ) ) {
                                                        for( let k = 0; k < selectors[i][1].length; k++ ) {
                                                            selectorElements[j].style[selectors[i][1][k]] = '';
                                                            WPTB_Helper.managerExternalCssStyles( dataSelectorElement, selectors[i][0], selectors[i][1][k], '' );
                                                        }
                                                    } else {
                                                        selectorElements[j].style[selectors[i][1]] = '';
                                                        WPTB_Helper.managerExternalCssStyles( dataSelectorElement, selectors[i][0], selectors[i][1], '' );
                                                    }
                                                }
                                            }
                                        } else {
                                            if( selectors[i][0] && selectors[i][1] ) {
                                                if( Array.isArray( selectors[i][1] ) ) {
                                                    for( let k = 0; k < selectors[i][1].length; k++ ) {
                                                        WPTB_Helper.managerExternalCssStyles( dataSelectorElement, selectors[i][0], selectors[i][1][k], '' );
                                                    }
                                                } else {
                                                    WPTB_Helper.managerExternalCssStyles( dataSelectorElement, selectors[i][0], selectors[i][1], '' );
                                                }
                                            }
                                        }
                                    }
                                }
                                
                                WPTB_Helper.wptbDocumentEventGenerate( 'wptb-control:{{{targetInputAddClass}}}', selectorElement );
                                WPTB_Helper.controlsStateManager( '{{{targetInputAddClass}}}', true );
                                wpColorPickerCheckChangeForTableStateSaving( event );
                            }
                        });
                    }
                }
            } )();
        </wptb-template-script>
		<?php
	}
}