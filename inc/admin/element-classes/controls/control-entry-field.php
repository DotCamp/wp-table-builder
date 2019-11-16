<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Controls;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder "entry-field" control.
 *
 * A control class for creating "entry-field" control for create text or number field for different situation.
 *
 * @since 1.1.2
 */
class Control_Entry_Field extends Base_Control {
    /**
	 * Get entry-field control type.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'entry_field';
	}

	/**
	 * Enqueue entry-field control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles used by the entry-field
	 * control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {
        
	}

	/**
	 * Render entry-field control output in the editor.
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
                inputType,
                min,
                max,
                defaultValue,
                dimension,
                elemContainer,
                targetInputAddClass = '';
                
            if( data.label ) {
                label = data.label;
            }
              
            if( data.inputType ) {
                inputType = data.inputType;
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
                <input id="wptb-size-number" data-type="size" 
                    class="wptb-entry-field wptb-element-property {{{targetInputAddClass}}}" 
                    type="{{{inputType}}}" min="{{{min}}}" max="{{{max}}}" 
                    step="1" placeholder="{{{defaultValue}}}" pattern="[0-9]*" data-element="{{{elemContainer}}}" value="{{{defaultValue}}}">
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
                            WPTB_Helper.numberImputSize( targetInput, '{{{max}}}'.length - 1, '{{{max}}}' );
                            targetInput.oninput = function( event ) {
                                WPTB_Helper.wptbDocumentEventGenerate( 'wptb-entry-field:input:' + dataSelectorElement, selectorElement );
                                
                                selectorElement.dataset.entryFieldValue = this.value;
                            };
                            
                            if( selectorElement.dataset.entryFieldValue ) {
                                targetInput.value = selectorElement.dataset.entryFieldValue;
                            }
                        }
                    }
                }
            } )();
        </wptb-template-script>
        
		<?php
	}
}