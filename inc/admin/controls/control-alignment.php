<?php
namespace WP_Table_Builder\Inc\Admin\Controls;
use WP_Table_Builder as NS;
// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder "alignment" control.
 *
 * A control class for creating "alignment" control.
 * When this control adds to element there is opportunity to point css type (for example text-align, float ...)
 * witch will be necessary to use for element alignment.
 *
 * @since 1.1.2
 */
class Control_Alignment extends Base_Control {
    /**
	 * Get control type.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'alignment';
	}

	/**
	 * Enqueue "alignment" control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles 
     * used by the "alignment" control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {
        
	}

	/**
	 * Render "alignment" control output in the editor.
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
                selected0,
                selected1,
                selected2,
                styleAlignment,
                left,
                center,
                right,
                dataElement,
                targetAddClass;
                    
            if( data.label ) {
                label = data.label;
            }
                    
            if( 'selected' in data ) {
                if( data.selected == 0 ) {
                    selected0 = 'selected';
                } else if( data.selected == 1 ) {
                    selected1 = 'selected';
                } else if( data.selected == 2 ) {
                    selected2 = 'selected';
                }
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
            
            targetAddClass = data.elementControlTargetUnicClass;
        #>
        <?php
            ob_start();
            require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/left_align.php';
            $left_align_image_svg = ob_get_clean();

            ob_start();
            require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/center_align.php';
            $center_align_image_svg = ob_get_clean();

            ob_start();
            require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/right_align.php';
            $right_align_image_svg = ob_get_clean();
        ?>
        <div class="wptb-settings-item-header">
            <p class="wptb-settings-item-title">{{{label}}}</p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 0px; padding-top: 23px;">
            <ul>
                <li class="wptb-btn-size-btn wptb-element-property wptb-btn-size-switcher 
                    {{{selected0}}} {{{targetAddClass}}}" data-alignment-value="left" data-element="{{{elemContainer}}}">
                    <?php echo $left_align_image_svg; ?>
                </li>
                <li class="wptb-btn-size-btn wptb-element-property wptb-btn-size-switcher 
                    {{{selected1}}} {{{targetAddClass}}}" data-alignment-value="center" data-element="{{{elemContainer}}}">
                    <?php echo $center_align_image_svg; ?>
                </li>
                <li class="wptb-btn-size-btn wptb-element-property wptb-btn-size-switcher 
                    {{{selected2}}} {{{targetAddClass}}}" data-alignment-value="right" data-element="{{{elemContainer}}}">
                    <?php echo $right_align_image_svg; ?>
                </li>
            </ul>
        </div>

        <wptb-template-script>
            ( function() {
                let buttons = document.getElementsByClassName( '{{{targetAddClass}}}' );
                if( buttons.length > 0 ) {
                    let dataSelectorElement = buttons[0].dataset.element;
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
                                                    if( value ) {
                                                        let convertValue;
                                                        if( selectors[i][1] == 'justify-content' ) {
                                                            if( value == 'left' ) {
                                                                convertValue = 'flex-start';
                                                            } else if( value == 'center' ) {
                                                                convertValue = 'center';
                                                            } else if( value == 'right' ) {
                                                                convertValue = 'flex-end';
                                                            }
                                                        } else if ( selectors[i][1] == 'float' ) {
                                                            if( value == 'left' ) {
                                                                convertValue = 'left';
                                                            } else if( value == 'center' ) {
                                                                convertValue = 'none';
                                                            } else if( value == 'right' ) {
                                                                convertValue = 'right';
                                                            }
                                                        } else {
                                                            if( value == 'left' ) {
                                                                convertValue = 'left';
                                                            } else if( value == 'center' ) {
                                                                convertValue = 'center';
                                                            } else if( value == 'right' ) {
                                                                convertValue = 'right';
                                                            }
                                                        }
                                                    
                                                        if( typeof selectorElements[j].style[selectors[i][1]] != 'undefined' ) {
                                                            selectorElements[j].style[selectors[i][1]] = convertValue;
                                                        } else {
                                                            selectorElements[j].setAttribute( selectors[i][1], convertValue );
                                                        }
                                                    } else {
                                                        let gettingElementValue;
                                                        if( typeof selectorElements[j].style[selectors[i][1]] != 'undefined' ) {
                                                            gettingElementValue = selectorElements[j].style[selectors[i][1]];
                                                        } else {
                                                            gettingElementValue = selectorElements[j].getAttribute( selectors[i][1] );
                                                        }
                                                        
                                                        if( selectors[i][1] == 'justify-content' ) {
                                                            if( gettingElementValue == 'flex-start' ) {
                                                                return 'left';
                                                            } else if( gettingElementValue == 'center' ) {
                                                                return 'center';
                                                            } else if( gettingElementValue == 'flex-end' ) {
                                                                return 'right';
                                                            }
                                                        } else if ( selectors[i][1] == 'float' ) {
                                                            if( gettingElementValue == 'left' ) {
                                                                return 'left';
                                                            } else if( gettingElementValue == 'none' ) {
                                                                return 'center';
                                                            } else if( gettingElementValue == 'right' ) {
                                                                return 'right';
                                                            }
                                                        } else {
                                                            if( gettingElementValue == 'left' ) {
                                                                return 'left';
                                                            } else if( gettingElementValue == 'center' ) {
                                                                return 'center';
                                                            } else if( gettingElementValue == 'right' ) {
                                                                return 'right';
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
                            
                            let valueSetting;
                            if( '{{{selectorsJson}}}' ) {
                                let selectors = JSON.parse( '{{{selectorsJson}}}' );

                                valueSetting = getSetElementValue( selectors );
                            }
                
                            for ( var i = 0; i < buttons.length; i++ ) {
                                buttons[i].classList.remove( 'selected' );
                                
                                if( valueSetting == buttons[i].dataset.alignmentValue ) {
                                    buttons[i].classList.add( 'selected' );
                                }

                                buttons[i].onclick = function () {
                                    var b = this.parentNode.getElementsByClassName( 'wptb-btn-size-btn' );
                                    for ( let i = 0; i < b.length; i++ ) {
                                        b[i].classList.remove( 'selected' );
                                    }
                                    this.classList.add( 'selected' );
                                    
                                    if( this.dataset.alignmentValue && '{{{selectorsJson}}}' ) {
                                        let selectors = JSON.parse( '{{{selectorsJson}}}' );
                                        getSetElementValue( selectors, this.dataset.alignmentValue );
                                        
                                        let details = {value: this.dataset.alignmentValue};
                                        WPTB_Helper.wptbDocumentEventGenerate( 'wptb-control:{{{targetAddClass}}}', selectorElement, details );
                                    }

                                    let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                                    wptbTableStateSaveManager.tableStateSet();
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