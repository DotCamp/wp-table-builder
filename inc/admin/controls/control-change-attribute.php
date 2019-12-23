<?php
namespace WP_Table_Builder\Inc\Admin\Controls;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder "change attribute" control.
 *
 * A control class for creating "change attribute" control to add and then change attribute.
 * When this control adds to element there is opportunity to point type attribute ( id, class ... ) 
 * and part of name this abbtibute.
 *
 * @since 1.1.2
 */
class Control_Change_Attribute extends Base_Control {
    /**
	 * Get control type.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'change_attribute';
	}

	/**
	 * Enqueue change attribute control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles 
     * used by the change attribute control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {
        
	}

	/**
	 * Render change attribute control output in the editor.
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
            attributeAndTitle,
            attribute,
            attributeName,
            buttonDataNames,
            buttonViews = [],
            targetAddClass;
             
            if( data.label ) {
                label = data.label;
            }
            
            for ( let prop in data.selectors ) {
                selector = prop;
                attributeAndTitle = data.selectors[prop];
            }
            
            if( attributeAndTitle ) {
                let attributeAndTitleArr = attributeAndTitle.split( ':' );
                attribute = attributeAndTitleArr[0].trim();
                attributeName = attributeAndTitleArr[1].trim();
            }
            
            if( data.buttonDataNames ) {
                buttonDataNames = data.buttonDataNames;
            }
            
            if( data.buttonViews ) {
                buttonViews = data.buttonViews;
            }
            
            let selectorArr = selector.replace( '.', '' ).split( ' ' );
            var infArr = selectorArr[0].match(/wptb-element-((.+-)\d+)/i);
            let dataElement = 'wptb-options-' + infArr[1];
            
            targetAddClass = data.elementControlTargetUnicClass;
        #>
        
        <div class="wptb-settings-item-header">
            <p class="wptb-settings-item-title">{{{label}}}</p>
        </div>
            <# if( buttonDataNames && Array.isArray( buttonDataNames ) ) { #>
            <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 0px; padding-top: 23px;">
                <ul>
                <# let selected,
                       selectedI;
                    if( data.numberSelectedButtonDefault &&
                        data.numberSelectedButtonDefault >= 0 &&
                        data.numberSelectedButtonDefault < buttonDataNames.length ) {
                        selectedI = data.numberSelectedButtonDefault;
                    } else {
                        selectedI = 1;
                    }
                    for( let i = 0; i < buttonDataNames.length; i++ ) { 
                        if( i == selectedI ) {
                            selected = 'selected';
                        } else {
                            selected = '';
                        }
                        #>
                        <li class="wptb-btn-size-btn wptb-element-property wptb-btn-size-switcher 
                            {{{selected}}} {{{targetAddClass}}}" data-name="{{{buttonDataNames[i]}}}" >
                            {{{buttonViews[i]}}}
                        </li>
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
                            buttonDataNames = '{{{buttonDataNames}}}'.split( ',' ),
                            selectorEl = document.querySelector( '{{{selector}}}' );
                            let attributeTitlesNew = '';
                            let attributesCollection;
                            if( buttonDataNames && Array.isArray( buttonDataNames ) ) {
                                attributesCollection = buttonDataNames.map( function( name ) {
                                    return 'wptb-{{{attributeName}}}-' + name;
                                });
                            }

                            if( selectorEl && '{{{attribute}}}' && '{{{attributeName}}}' ) {

                                let attributeTitles = selectorEl.getAttribute( '{{{attribute}}}' );

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
                                selectorEl.removeAttribute( '{{{attribute}}}' );

                                if( attributeTitlesNew ) {
                                    selectorEl.setAttribute( '{{{attribute}}}', attributeTitlesNew );
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