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
                min,
                max,
                defaultValue,
                dimension,
                elemContainer,
                targetInputAddClass = '';
                
            if( data.label ) {
                label = data.label;
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
                if( targetInputs.length > 0 ) {
                    targetInput = targetInputs[0];
                    let dataSelectorElement = targetInput.dataset.element;
                    if( dataSelectorElement ) {
                        let selectorElement = document.querySelector( '.' + dataSelectorElement );
                        if( selectorElement ) {
                            targetInput.oninput = function( event ) {
                                if( parseInt( this.value ) < parseInt( '{{{min}}}' ) ) {
                                    this.value = parseInt( '{{{min}}}' );
                                } else if( parseInt( this.value ) > parseInt( '{{{max}}}' ) ) {
                                    this.value = parseInt ( '{{{max}}}' );
                                }
                                
                                let details = {value: this.value};
                                WPTB_Helper.wptbDocumentEventGenerate( 'wptb-control:{{{targetInputAddClass}}}', selectorElement, details );

                                WPTB_Helper.controlsStateManager( '{{{targetInputAddClass}}}', true );
                                
                                let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                                wptbTableStateSaveManager.tableStateSet();
                            };
                            
                            WPTB_Helper.controlsStateManager( '{{{targetInputAddClass}}}' );
                        }
                    }
                }
            } )();
        </wptb-template-script>
		<?php
	}
}