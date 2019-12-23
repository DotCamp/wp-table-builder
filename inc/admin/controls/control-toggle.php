<?php
namespace WP_Table_Builder\Inc\Admin\Controls;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder "Toggle" control.
 *
 * A control class for creating "enable-disable" control object
 *
 * @since 1.1.2
 */
class Control_Toggle extends Base_Control {
    /**
	 * Get "Toggle" control type.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'toggle';
	}

	/**
	 * Enqueue "toggle" control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles used by the control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {
        
	}

	/**
	 * Render "toggle" control output in the editor.
	 *
	 * Used to generate the control HTML in the editor wp js template
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function content_template() {
		?>
        <#
            let selector,
                cssSetting,
                elemContainer,
                label,
                selectors = [],
                selectorsJson;
            
            if( data.elemContainer ) {
                elemContainer = data.elemContainer;
            }
            
            if( data.label ) {
                label = data.label;
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
            
            targetInputAddClass = data.elementControlTargetUnicClass;
        #>
        
        <div class="wptb-settings-row wptb-settings-middle-xs">
            <label class="wptb-toggle">
                <span style="font-size: 16px">{{{label}}}</span>
                <input class="wptb-element-property {{{targetInputAddClass}}}" type="checkbox" data-element="{{{elemContainer}}}">
                <i></i>
            </label>  
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
                            targetInput.onchange = function( event ) {
                                let details;
                                
                                if( targetInput.checked == true ) {
                                    details = {value: 'checked'};
                                } else {
                                    details = {value: 'unchecked'};
                                }
                                
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