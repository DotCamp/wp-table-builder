<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Controls;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder change element attribute control.
 *
 * A control class for creating change element attribute controle.
 *
 * @since 1.1.2
 */
class Control_Change_Element_Attribute extends Base_Control {
    /**
	 * Get control type.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'change_element_attribute';
	}

	/**
	 * Enqueue change element attribute control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles 
     * used by the change element attribute control.
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
            let selector,
            attributeAndName,
            attribute,
            attributeName;
            for ( let prop in data.selectors ) {
                selector = prop;
                attributeAndTitle = data.selectors[prop];
            }
            
            if( attributeAndTitle ) {
                let attributeAndTitleArr = attributeAndTitle.split( ':' );
                attribute = attributeAndTitleArr[0].trim();
                attributeName = attributeAndTitleArr[1].trim();
            }
            
            let selectorArr = selector.replace( '.', '' ).split( ' ' );
            var infArr = selectorArr[0].match(/wptb-element-((.+-)\d+)/i);
            let dataElement = 'wptb-options-' + infArr[1];
            let targetAddClass = selector.trim();
            targetAddClass = WPTB_Helper.replaceAll( targetAddClass, '.', '' ).trim();
            targetAddClass = WPTB_Helper.replaceAll( targetAddClass, ' ', '-' ).trim();
            targetAddClass += '-' + attributeName;
            targetAddClass = targetAddClass.toLowerCase();
        #>
        
        <div class="wptb-settings-item-header">
            <p class="wptb-settings-item-title">{{{data.label}}}</p>
        </div>
            <# if( data.buttonDataNames && Array.isArray( data.buttonDataNames ) ) { #>
            <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 0px; padding-top: 23px;">
                <ul>
                <# let selected,
                       selectedI,
                       buttonDataNames = data.buttonDataNames;
                    if( data.numberSelectedButtonDefault &&
                        data.numberSelectedButtonDefault >= 0 &&
                        data.numberSelectedButtonDefault < data.buttonDataNames.length ) {
                        selectedI = data.numberSelectedButtonDefault;
                    } else {
                        selectedI = 1;
                    }
                    for( let i = 0; i < data.buttonDataNames.length; i++ ) { 
                        if( i == selectedI ) {
                            selected = 'selected';
                        } else {
                            selected = '';
                        }
                        #>
                    <li class="wptb-btn-size-btn wptb-element-property wptb-btn-size-switcher 
                        {{{selected}}} {{{targetAddClass}}}" data-name="{{{data.buttonDataNames[i]}}}" 
                        data-element="{{{dataElement}}}">{{{data.buttonViews[i]}}}</li>
                    <# } #>
                </ul>
            </div>
            
            <wptb-template-script>
                ( function() {
                    let buttons = document.getElementsByClassName( '{{{targetAddClass}}}' );
                    let selectorEl = document.querySelector( '{{{selector}}}' );
                    let selectedButtonName;
                    if( selectorEl ) {
                        let regex = new RegExp('wptb-{{{attributeName}}}-([a-z]+)', "i");
                        let infArr = selectorEl.className.match( regex );
                        if( infArr && Array.isArray( infArr ) ) {
                            selectedButtonName = infArr[1];
                        }
                    }
                    for ( var i = 0; i < buttons.length; i++ ) {
                        if( selectedButtonName ) {
                            buttons[i].classList.remove( 'selected' );
                            
                            if( selectedButtonName == buttons[i].dataset.name ) {
                                buttons[i].classList.add( 'selected' );
                            }
                        }
                        
                        buttons[i].onclick = function () {
                            var buttonDataName = this.dataset.name,
                            buttonDataNames = '{{{data.buttonDataNames}}}'.split( ',' ),
                            n_Class = this.dataset.element,
                            infArr = n_Class.match( /wptb-options-(.+)-(\d+)/i ),
                            type = infArr[1],
                            num = infArr[2],
                            affectedEl = document.querySelector( '{{{selector}}}' );
                            let attributeTitlesNew = '';
                            let attributesCollection;
                            if( buttonDataNames && Array.isArray( buttonDataNames ) ) {
                                attributesCollection = buttonDataNames.map( function( name ) {
                                    return 'wptb-{{{attributeName}}}-' + name;
                                });
                            }

                            if( affectedEl && '{{{attribute}}}' && '{{{attributeName}}}' ) {

                                let attributeTitles = affectedEl.getAttribute( '{{{attribute}}}' );

                                if( attributeTitles ) {
                                    let attributeTitlesArr = attributeTitles.split( ' ' );

                                    if( attributeTitlesArr.length > 0 ) {
                                        for( let i = 0; i < attributeTitlesArr.length; i++ ) {
                                            if( attributeTitlesArr[i] && ! attributesCollection.includes( attributeTitlesArr[i] ) ) {
                                                attributeTitlesNew += attributeTitlesArr[i] + ' ';
                                            }
                                        }
                                    }

                                }

                                attributeTitlesNew += 'wptb-{{{attributeName}}}-' + buttonDataName;
                                affectedEl.removeAttribute( '{{{attribute}}}' );

                                if( attributeTitlesNew ) {
                                    affectedEl.setAttribute( '{{{attribute}}}', attributeTitlesNew );
                                }

                                var b = this.parentNode.getElementsByClassName( 'wptb-btn-size-btn' );
                                for ( let i = 0; i < b.length; i++ ) {
                                    b[i].classList.remove( 'selected' );
                                }
                                this.classList.add( 'selected' );

                                let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                                wptbTableStateSaveManager.tableStateSet();
                            }
                        }
                    }
                } )();
            </wptb-template-script>
            <# } #>
		<?php
	}
}