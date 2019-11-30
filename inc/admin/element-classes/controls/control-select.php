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
                targetSelectAddClass;
            
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
                var infArr = selectorArr[0].match( /wptb-element-((.+-)\d+)/i );
                let dataElement = 'wptb-options-' + infArr[1];
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
                if( targetSelects.length > 0 ) {
                    targetSelect = targetSelects[0];
                    let dataSelectorElement = targetSelect.dataset.element;
                    if( dataSelectorElement ) {
                        if( targetSelect ) {
                            targetSelect.onchange = function( event ) {
                                let dataSelectorElement = targetSelect.dataset.element;
                                let selectorElement = document.querySelector( '.' + dataSelectorElement );
                                WPTB_Helper.wptbDocumentEventGenerate( 'wptb-control:{{{targetSelectAddClass}}}', selectorElement );
                                
                                WPTB_Helper.controlsStateManager( '{{{targetSelectAddClass}}}', true );
                                
                                let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                                wptbTableStateSaveManager.tableStateSet();
                            };
                            
                            WPTB_Helper.controlsStateManager( '{{{targetSelectAddClass}}}' );
                        }
                    }
                }
            } )();
        </wptb-template-script>
        
		<?php
	}
}