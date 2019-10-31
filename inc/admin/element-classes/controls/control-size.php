<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Controls;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder size control.
 *
 * A control class for creating size control.
 *
 * @since 1.1.2
 */
class Control_Size extends Base_Control {
    /**
	 * Get size control type.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'size';
	}

	/**
	 * Enqueue size control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles used by the size
	 * control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {
        
	}

	/**
	 * Render size control output in the editor.
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
            cssSetting;
            for ( let prop in data.selectors ) {
                selector = prop;
                cssSetting = data.selectors[prop];
            }
            
            let selectorArr = selector.replace( '.', '' ).split( ' ' );
            var infArr = selectorArr[0].match(/wptb-element-((.+-)\d+)/i);
            let dataElement = 'wptb-options-' + infArr[1];
            
            let targetInputAddClass = selector.trim();
            targetInputAddClass = WPTB_Helper.replaceAll( targetInputAddClass, '.', '' ).trim();
            targetInputAddClass = WPTB_Helper.replaceAll( targetInputAddClass, ' ', '-' ).trim();
            targetInputAddClass += '-' + cssSetting;
            targetInputAddClass = targetInputAddClass.toLowerCase();
        #>
        
        <div class='wptb-settings-item-header' >
            <p class="wptb-settings-item-title">{{{data.label}}}</p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 12px; padding-top: 23px;">
            <div class="wptb-settings-col-xs-8">
                <input data-type="size" class="wptb-element-property wptb-size-slider {{{targetInputAddClass}}}" 
                    type="range" min="{{{data.min}}}" max="{{{data.max}}}" step="1" value="{{{data.defaultValue}}}"> 
            </div>
            <div class="wptb-settings-col-xs-4">
                <input id="wptb-size-number" data-type="size" 
                    class="wptb-size-number wptb-number-input wptb-element-property {{{targetInputAddClass}}}" 
                    type="number" min="{{{data.min}}}" max="{{{data.max}}}" step="1" placeholder="{{{data.defaultValue}}}" pattern="[0-9]*">
                <span class="wptb-input-px">{{{data.dimension}}}</span>
            </div>
        </div>
        
        <wptb-template-script>
            ( function() {
                let selectorElement = document.querySelector( '{{{selector}}}' );
                let targetInputs = document.getElementsByClassName( '{{{targetInputAddClass}}}' );
                for( let i = 0; i < targetInputs.length; i++ ) {
                    let targetInputsCss = selectorElement.style['{{{cssSetting}}}'];
                    if( targetInputsCss ) {
                        targetInputs[i].value = parseInt( targetInputsCss );
                    }
                    if( targetInputs[i].classList.contains( 'wptb-size-slider' ) ) {
                        targetInputs[i].oninput = function ( event ) {
                            if( event.target == this ) {
                                this.parentNode.parentNode.getElementsByClassName('wptb-size-number')[0].value = this.value;
                            }
                            
                            let selectorElem = document.querySelector( '{{{selector}}}' );
                            if( selectorElem ) {
                                selectorElem.style['{{{cssSetting}}}'] = this.value + '{{{data.dimension}}}';
                            };
                            
                            event.target.onmouseup = function() {
                                let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                                wptbTableStateSaveManager.tableStateSet();
                            }
                        };
                    } else if( targetInputs[i].classList.contains( 'wptb-number-input' ) ) {
                        WPTB_Helper.numberImputSize( targetInputs[i], '{{{data.max}}}'.length - 1, '{{{data.max}}}' );
                        targetInputs[i].oninput = function( event ) {
                            this.parentNode.parentNode.getElementsByClassName('wptb-size-slider')[0].value = this.value;
                            this.parentNode.parentNode.getElementsByClassName('wptb-size-slider')[0].oninput( event );
                        }
                    }
                } 
            } )();
        </wptb-template-script>
        
		<?php
	}
}