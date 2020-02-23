<?php
namespace WP_Table_Builder\Inc\Admin\Controls;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder "Checkbox" control.
 *
 * A control class for creating "checkbox" control object
 *
 * @since 1.1.2
 */
class Control_Checkbox extends Base_Control {
    /**
	 * Get "Checkbox" control type.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'checkbox';
	}

	/**
	 * Enqueue "checkbox" control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles used by the control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {
        
	}

	/**
	 * Render "checkbox" control output in the editor.
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
                checkboxes = [],
                selectedDefault,
                targetInputAddClass;
            
            if( data.label ) {
                label = data.label;
            }
            
            if( data.checkboxes ) {
                checkboxes = data.checkboxes;
            }
            
            if( data.selectedDefault ) {
                selectedDefault = data.selectedDefault;
            }
            
            if( data.elemContainer ) {
                elemContainer = data.elemContainer;
            }
            
            targetInputAddClass = data.elementControlTargetUnicClass;
        #>
        
        <div class="wptb-settings-row wptb-settings-middle-xs">
            <span style="font-size: 16px">{{{label}}}</span>
            <div class="wptb-control-checkboxes-{{{targetInputAddClass}}}" style="padding-top: 10px; padding-left: 10px; font-size: 16px; width: 100%;">
            <#
                if( checkboxes && Array.isArray( checkboxes ) ) {
                    let name,
                        nameInput,
                        checked;
                    for( let i = 0; i < checkboxes.length; i++ ) {
                        if( checkboxes[i][0] ) {
                            name = checkboxes[i][0];
                        }

                        if( checkboxes[i][1] ) {
                            nameInput = WPTB_Helper.replaceAll( checkboxes[i][1], ' ', '' );
                        } else if( checkboxes[i][0] ) {
                            nameInput = WPTB_Helper.replaceAll( checkboxes[i][0], ' ', '' );
                        }
                        
                        if( checkboxes[i][2] && checkboxes[i][2] === 'on' ) {
                            checked = 'checked';
                        } else {
                            checked = '';
                        }
                        
                        let targetInputAddClassCheckbox = targetInputAddClass + nameInput;
                        #>
                        <div style="width: 100%">
                            <label class="wptb-checkbox">
                                <span>{{{name}}}</span>
                                <input class="wptb-element-property {{{targetInputAddClass}}}" type="checkbox" name="{{{nameInput}}}" data-element="{{{elemContainer}}}" {{{checked}}}>
                                <span class="wptb-checkbox-checkmark"></span>
                            </label>
                        </div>
                        <#
                    }
                }
                #>
            </div>
        </div>
        
        <wptb-template-script>
            ( function() {
                let control = document.getElementsByClassName( 'wptb-control-checkboxes-{{{targetInputAddClass}}}' );
                if( control.length > 0 ) {
                    control = control[0];
                    let targetInputs = control.getElementsByTagName( 'input' );
                    for( let i = 0; i < targetInputs.length; i++ ) {
                        let dataSelectorElement = targetInputs[i].dataset.element;
                        let targetInputAddClassCheckbox = '{{{targetInputAddClass}}}' + targetInputs[i].name;
                        if( dataSelectorElement ) {
                            let selectorElement = document.querySelector( '.' + dataSelectorElement );
                            if( selectorElement ) {
                                targetInputs[i].onchange = function( event ) {
                                    let details;

                                    if( targetInputs[i].checked == true ) {
                                        details = {value: 'checked'};
                                    } else {
                                        details = {value: 'unchecked'};
                                    }

                                    WPTB_Helper.wptbDocumentEventGenerate( 'wptb-control:{{{targetInputAddClass}}}', selectorElement, details );

                                    let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                                    wptbTableStateSaveManager.tableStateSet();
                                };
                            }
                        }
                    }
                }
            } )();
        </wptb-template-script>
        
		<?php
	}
}