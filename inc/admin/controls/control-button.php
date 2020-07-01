<?php
namespace WP_Table_Builder\Inc\Admin\Controls;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder "Button" control.
 *
 * A control class for creating "button" control object
 *
 * @since 1.1.2
 */
class Control_Button extends Base_Control {
    /**
	 * Get "Button" control type.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'button';
	}

	/**
	 * Enqueue "button" control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles used by the control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {
        
	}

	/**
	 * Render "button" control output in the editor.
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
                style,
                elemContainer;
            
            if( data.label ) {
                label = data.label;
            }

            if(data.style) {
                style = 'style="' + data.style + '"';
            }
            
            if( data.elemContainer ) {
                elemContainer = data.elemContainer;
            }
            
            targetInputAddClass = data.elementControlTargetUnicClass;
        #>
        
        <div class="wptb-settings-row wptb-settings-middle-xs">
            <div class="wptb-settings-col-xs-12" style="margin: auto; text-align: center;">
                <input type="button" {{{style}}} class="wptb-element-property wptb-button {{{targetInputAddClass}}}" data-element="{{{elemContainer}}}" value="{{{label}}}" title="{{{label}}}">
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
                            targetInput.onclick = function( event ) {
                                WPTB_Helper.wptbDocumentEventGenerate( 'wptb-control:{{{targetInputAddClass}}}', selectorElement );
                            };
                        }
                    }
                }
            } )();
        </wptb-template-script>
        
		<?php
	}
}