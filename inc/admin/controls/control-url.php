<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder url control.
 *
 * A control class for creating url control for to add tag "a" with href attribute
 * and also to set attributes target and rel="nofollow".
 *
 * @since 1.1.2
 */
class Control_Url extends Base_Control {
	/**
	 * Get control type.
	 *
	 * @return string Control type.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	public function get_type() {
		return 'url';
	}

	/**
	 * Enqueue url control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles used by the url
	 * control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {

	}

	/**
	 * Render url control output in the editor.
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
                selector,
                dataElement;
            
            if( data.label ) {
                label = data.label;
            }
            
            if( data.selector ) {
                selector = data.selector;
            }
            
            if( selector ) {
                let selectorArr = selector.replace( '.', '' ).split( ' ' );
                let infArr = selectorArr[0].match( /wptb-element-((.+-)\d+)/i );
                let dataElement = 'wptb-options-' + infArr[1];
            }
            
            targetInputAddClass = data.elementControlTargetUnicClass;
            let postfixIdFor = targetInputAddClass.replace( 'wptb-el', '' ).toLowerCase();
        #>

        <div class="wptb-settings-item-header">
            <p class="wptb-settings-item-title">{{{label}}}</p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 10px">
            <div class="wptb-settings-col-xs-8" style="margin: 15px 0;">
                <input type="text" data-type="element-link"
                       placeholder="<?php esc_attr_e( 'Insert Link Here', NS\PLUGIN_TEXT_DOMAIN ); ?>"
                       class="wptb-element-property {{{targetInputAddClass}}}" data-element="{{{dataElement}}}">
            </div>
            <div class="wptb-settings-space-between wptb-settings-dropdown-row">
                <label for="element-rel-{{{postfixIdFor}}}"><?php esc_html_e('Link', 'wp-table-builder'); ?></label>
                <select data-type="element-rel" id="element-rel-{{{postfixIdFor}}}" class="wptb-element-property {{{targetInputAddClass}}}" data-element="{{{dataElement}}}">
                    <option value="none"><?php esc_html_e('None', 'wp-table-builder'); ?></option>
                    <option value="sponsored">sponsored</option>
                    <option value="nofollow">nofollow</option>
                    <option value="noreferrer">noreferrer</option>
                </select>
            </div>
            <div class="wptb-settings-space-between wptb-settings-dropdown-row">
                <label for="element-target-{{{postfixIdFor}}}"><?php esc_html_e('Open in', 'wp-table-builder'); ?></label>
                <select data-type="element-target" id="element-target-{{{postfixIdFor}}}" class="wptb-element-property {{{targetInputAddClass}}}" data-element="{{{dataElement}}}">
                    <option value="_blank"><?php esc_html_e('New tab', 'wp-table-builder'); ?></option>
                    <option value="_self"><?php esc_html_e('Current window', 'wp-table-builder'); ?></option>
                </select>
            </div>
            <div class="wptb-settings-checkbox-row">
                <input type="checkbox" data-type="element-link-convert-relative"
                       id="element-convert-relative{{{postfixIdFor}}}"
                       class="wptb-element-property {{{targetInputAddClass}}}" data-element="{{{dataElement}}}">
                <label for="element-convert-relative{{{postfixIdFor}}}"><?php esc_html_e( 'Convert Relative Link to Absolute', NS\PLUGIN_TEXT_DOMAIN ); ?></label>
            </div>
        </div>

        <wptb-template-script>
            ( function() {
                let selectorElement = document.querySelector( '{{{selector}}}' );
                let targetInputs = document.getElementsByClassName( '{{{targetInputAddClass}}}' );
                for( let i = 0; i < targetInputs.length; i++ ) {
                    if( targetInputs[i].dataset.type == 'element-link' ) {
                        let href = selectorElement.getAttribute( 'href' );
                        targetInputs[i].value = href;

                        targetInputs[i].onchange = function() {
                            if ( this.value ) {
                                const convertRelative = selectorElement.dataset.wptbLinkEnableConvertRelative;
                                selectorElement.href = WPTB_Helper.linkHttpCheckChange( this.value , convertRelative === 'true' );
                            } else {
                                selectorElement.removeAttribute( 'href' );
                            }
                            
                            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                            wptbTableStateSaveManager.tableStateSet();
                        }
                    } else if( targetInputs[i].dataset.type == 'element-target' ) {
                        const target = selectorElement.getAttribute('target') || '_self';
                        const controller = targetInputs[i];
                        controller.value = target;

                        controller.addEventListener('input', (e) => {
                            const val = e.target.value;
                            selectorElement.setAttribute('target', val);
                            new WPTB_TableStateSaveManager().tableStateSet();
                        });
                    } else if(targetInputs[i].dataset.type === 'element-rel') {
                        const linkRel = selectorElement.getAttribute('rel') || 'none';
                        const controller = targetInputs[i];
                        controller.value = linkRel;

                        controller.addEventListener('input', (e) => {
                            const val = e.target.value;
                            if(val === 'none') {
                                selectorElement.removeAttribute('rel');
                            }else{
                                selectorElement.setAttribute('rel', e.target.value);

                            }
                            new WPTB_TableStateSaveManager().tableStateSet();
                        });
                    }
            else if(targetInputs[i].dataset.type === 'element-link-convert-relative'){

            const currentCheckbox = targetInputs[i];
            const relativeDataValue = selectorElement.dataset.wptbLinkEnableConvertRelative;

            if (relativeDataValue === 'true') {
            currentCheckbox.checked = true;
            }

            currentCheckbox.addEventListener('change', function () {
            const hrefVal = selectorElement.href;
            if (this.checked) {
            selectorElement.dataset.wptbLinkEnableConvertRelative = true;
            } else {
            selectorElement.dataset.wptbLinkEnableConvertRelative = false;
            }


            selectorElement.href = WPTB_Helper.linkHttpCheckChange(hrefVal, this.checked);

            new WPTB_TableStateSaveManager().tableStateSet();
            })

                    }
                }
            } )();
        </wptb-template-script>
        
		<?php
	}
}
