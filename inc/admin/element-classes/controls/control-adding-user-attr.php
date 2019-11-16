<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Controls;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder "adding user attr" control.
 *
 * A control class for "adding user attr" control to user can add an attribute for element.
 *
 * @since 1.1.2
 */
class Control_ADDING_USER_ATTR extends Base_Control {
    /**
	 * Get control type.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'adding_user_attr';
	}

	/**
	 * Enqueue "adding user attr" control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles used by "adding user attr"
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {
        
	}

	/**
	 * Render change element attribute control output in the editor.
	 *
	 * Used to generate the control HTML in the editor wp js template
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function content_template() {
		?>
        <#  let label,
                placeholder,
                selector,
                attrName,
                targetInputAddClass;
            
            if( data.label ) {
                label = data.label;
            }
            
            if( data.placeholder ) {
                placeholder = data.placeholder;
            }
            
            if( data.selector ) {
                selector = data.selector;
            }
            
            if( data.attrName ) {
                attrName = data.attrName;
            }
            
            targetInputAddClass = data.elementControlTargetUnicClass;
        #>
        
        <div class="wptb-settings-item-header">
            <p class="wptb-settings-item-title">{{{label}}}</p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 10px">
            <div class="wptb-settings-col-xs-8" style="margin: 15px 0;">
                <input type="text" placeholder="{{{placeholder}}}" 
                       class="wptb-element-property {{{targetInputAddClass}}}">
            </div>
        </div>   

        <wptb-template-script>
            ( function() {
                let targetInput = document.querySelector( '.{{{targetInputAddClass}}}' );
                let selectorElement = document.querySelector( '{{{selector}}}' );
                
                let attr = selectorElement.getAttribute( '{{{attrName}}}' );
                targetInput.value = attr;
                
                targetInput.onchange = function() {
                    if( selectorElement ) {
                        if( this.value ) {
                            selectorElement.setAttribute( '{{{attrName}}}', this.value );
                        } else {
                            selectorElement.removeAttribute( '{{{attrName}}}' );
                        }
                        
                        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                        wptbTableStateSaveManager.tableStateSet();
                    }
                }
            } )();
        </wptb-template-script>
		<?php
	}
}