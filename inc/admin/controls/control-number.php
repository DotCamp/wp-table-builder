<?php
namespace WP_Table_Builder\Inc\Admin\Controls;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder "number" control.
 *
 * A control class for creating "number" control.
 *
 * @since 1.1.2
 */
class Control_Number extends Base_Control {
    /**
	 * Get number control type.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'number';
	}

	/**
	 * Enqueue number control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles used by the number
	 * control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {
        
	}

	/**
	 * Render number control output in the editor.
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
                min,
                max,
                defaultValue,
                dimension,
                elemContainer,
                targetInputAddClass = '';
                
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
            
            if( data.min ) {
                min = data.min;
            }
            
            if( data.max ) {
                max = data.max;
            }
            
            if( data.defaultValue ) {
                defaultValue = data.defaultValue;
            }
            
            if( data.dimension ) {
                dimension = data.dimension;
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
                    type="number" min="{{{min}}}" max="{{{max}}}" 
                    step="1" placeholder="{{{defaultValue}}}" data-element="{{{elemContainer}}}" value="{{{defaultValue}}}">
                <span class="wptb-input-px">{{{dimension}}}</span>
            </div>
        </div>
        
        <wptb-template-script>
            ( function() {
                let targetInputs = document.getElementsByClassName( '{{{targetInputAddClass}}}' );
                if( targetInputs.length > 0 && targetInputs[0].dataset.element ) {
                    let targetInput = targetInputs[0];
                    let selectorElement = document.querySelector( '.' + targetInput.dataset.element );
                    if( selectorElement ) {
                        function getSetElementValue( selectors, value ) {
                            if( selectors && Array.isArray( selectors ) ) {
                                for( let i = 0; i < selectors.length; i++ ) {
                                    if( selectors[i] && Array.isArray( selectors[i] ) && typeof selectors[i][0] != 'undefined' && selectors[i][1] != 'undefined' ) {
                                        let selectorElements = document.querySelectorAll( selectors[i][0] );
                                        if( selectorElements.length > 0 ) {
                                            for( let j = 0; j < selectorElements.length; j++ ) {
                                                if( value ) {
                                                    selectorElements[j].setAttribute( selectors[i][1], value );
                                                } else if( selectorElements[j].getAttribute( selectors[i][1] ) ) {
                                                    return selectorElements[j].getAttribute( selectors[i][1] );
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
                        
                        let selectorElementSettingValue;
                        if( '{{{selectorsJson}}}' ) {
                            let selectors = JSON.parse( '{{{selectorsJson}}}' );

                            selectorElementSettingValue = getSetElementValue( selectors );
                            
                            if( selectorElementSettingValue ) {
                                targetInput.value = selectorElementSettingValue;
                            } else if( '{{{defaultValue}}}' ) {
                                targetInput.value = '{{{defaultValue}}}';
                            }
                        }
                        
                        targetInput.oninput = function( event ) {
                            if( parseInt( this.value ) < parseInt( '{{{min}}}' ) ) {
                                this.value = parseInt( '{{{min}}}' );
                            } else if( parseInt( this.value ) > parseInt( '{{{max}}}' ) ) {
                                this.value = parseInt ( '{{{max}}}' );
                            }

                            let details = {value: this.value};
                            WPTB_Helper.wptbDocumentEventGenerate( 'wptb-control:{{{targetInputAddClass}}}', selectorElement, details );
                            if( '{{{selectorsJson}}}' ) {
                                let selectors = JSON.parse( '{{{selectorsJson}}}' );

                                getSetElementValue( selectors, details.value );
                            }
                            

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