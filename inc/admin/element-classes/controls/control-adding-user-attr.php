<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Controls;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder add element id control.
 *
 * A control class for adding element id control.
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
	 * Enqueue change element attribute control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles used by the adding user-id
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
        <#
            let selectorArr = data.selector.replace( '.', '' ).split( ' ' );
            var infArr = selectorArr[0].match(/wptb-element-((.+-)\d+)/i);
            let dataElement = 'wptb-options-' + infArr[1];
            
            let targetInputAddClass = data.selector.trim();
            targetInputAddClass = WPTB_Helper.replaceAll( targetInputAddClass, '.', '' ).trim();
            targetInputAddClass = WPTB_Helper.replaceAll( targetInputAddClass, ' ', '-' ).trim();
            targetInputAddClass += '-id';
            targetInputAddClass = targetInputAddClass.toLowerCase();
        #>
        
        <div class="wptb-settings-item-header">
            <p class="wptb-settings-item-title">{{{data.label}}}</p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 10px">
            <div class="wptb-settings-col-xs-8" style="margin: 15px 0;">
                <input type="text" placeholder="{{{data.placeholder}}}" 
                       class="wptb-element-property {{{targetInputAddClass}}}" data-element="{{{dataElement}}}">
            </div>
        </div>   

        <wptb-template-script>
            ( function() {
                let targetInput = document.querySelector( '.{{{targetInputAddClass}}}' );
                let selectorElement = document.querySelector( '{{{data.selector}}}' );
                
                let attr = selectorElement.getAttribute( '{{{data.attrName}}}' );
                console.log( attr );
                targetInput.value = attr;
                console.log( targetInput );
                
                targetInput.onchange = function() {
                    if( selectorElement ) {
                        if( this.value ) {
                            selectorElement.setAttribute( '{{{data.attrName}}}', this.value );
                        } else {
                            selectorElement.removeAttribute( '{{{data.attrName}}}' );
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