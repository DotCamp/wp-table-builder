<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Controls;

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
                placeholder,
                rows,
                cols,
                elemContainer,
                targetTextareaAddClass = '';
                
            if( data.label ) {
                label = data.label;
            }
                
            if( data.rows ) {
                rows = data.rows;
            }
                
            if( data.cols ) {
                cols = data.cols;
            }
            
            if( data.placeholder ) {
                placeholder = data.placeholder;
            }
            
            if( data.elemContainer ) {
                elemContainer = data.elemContainer;
            }
            
            targetTextareaAddClass = data.elementControlTargetUnicClass;
        #>
        
        <div class='wptb-settings-item-header' >
            <p class="wptb-settings-item-title">{{{label}}}</p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 12px; padding-top: 23px;">
            <div class="wptb-settings-col-xs-12">
                <textarea class="wptb-number wptb-element-property {{{targetTextareaAddClass}}}" 
                          rows="{{{rows}}}" cols="{{{cols}}}" placeholder="{{{placeholder}}}" data-element="{{{elemContainer}}}" style="width: 100%"></textarea>
            </div>
        </div>
        
        <wptb-template-script>
            ( function() {
                let targetTextarea = document.getElementsByClassName( '{{{targetTextareaAddClass}}}' );
                if( targetTextarea.length > 0 ) {
                    targetTextarea = targetTextarea[0];
                    let dataSelectorElement = targetTextarea.dataset.element;
                    if( dataSelectorElement ) {
                        let selectorElement = document.querySelector( '.' + dataSelectorElement );
                        if( selectorElement ) {
                            targetTextarea.oninput = function( event ) {
                                let details = {value: this.value};
                                WPTB_Helper.wptbDocumentEventGenerate( 'wptb-control:{{{targetTextareaAddClass}}}', selectorElement, details );

                                WPTB_Helper.controlsStateManager( '{{{targetTextareaAddClass}}}', true );
                            };
                            
                            targetTextarea.onchange = function( event ) {
                                let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                                wptbTableStateSaveManager.tableStateSet();
                            };
                            
                            WPTB_Helper.controlsStateManager( '{{{targetTextareaAddClass}}}' );
                        }
                    }
                }
            } )();
        </wptb-template-script>
        
		<?php
	}
}