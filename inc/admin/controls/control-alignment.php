<?php
namespace WP_Table_Builder\Inc\Admin\Controls;
use WP_Table_Builder as NS;
// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder "alignment" control.
 *
 * A control class for creating "alignment" control.
 * When this control adds to element there is opportunity to point css type (for example text-align, float ...)
 * witch will be necessary to use for element alignment.
 *
 * @since 1.1.2
 */
class Control_Alignment extends Base_Control {
    /**
	 * Get control type.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'alignment';
	}

	/**
	 * Enqueue "alignment" control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles 
     * used by the "alignment" control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {
        
	}

	/**
	 * Render "alignment" control output in the editor.
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
                selected0,
                selected1,
                selected2,
                styleAlignment,
                left,
                center,
                right,
                dataElement,
                targetAddClass;
                    
            if( data.label ) {
                label = data.label;
            }
                    
            if( 'selected' in data ) {
                if( data.selected == 0 ) {
                    selected0 = 'selected';
                } else if( data.selected == 1 ) {
                    selected1 = 'selected';
                } else if( data.selected == 2 ) {
                    selected2 = 'selected';
                }
            }
            
            for ( let prop in data.selectors ) {
                selector = prop;
                styleAlignment = data.selectors[prop];
            }
            
            if( styleAlignment == 'text-align' || styleAlignment.indexOf( 'data-' ) === 0 ) {
                left = 'left';
                center = 'center';
                right = 'right';
            } else if( styleAlignment == 'justify-content' ) {
                left = 'flex-start';
                center = 'center';
                right = 'flex-end';
            } else if( styleAlignment == 'float' ) {
                left = 'left';
                center = 'none';
                right = 'right';
            }
            
            targetAddClass = data.elementControlTargetUnicClass;
        #>
        <?php
            ob_start();
            require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/left_align.php';
            $left_align_image_svg = ob_get_clean();

            ob_start();
            require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/center_align.php';
            $center_align_image_svg = ob_get_clean();

            ob_start();
            require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/right_align.php';
            $right_align_image_svg = ob_get_clean();
        ?>
        <div class="wptb-settings-item-header">
            <p class="wptb-settings-item-title">{{{label}}}</p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 0px; padding-top: 23px;">
            <ul>
                <li class="wptb-btn-size-btn wptb-element-property wptb-btn-size-switcher 
                    {{{selected0}}} {{{targetAddClass}}}" data-alignment-value="{{{left}}}">
                    <?php echo $left_align_image_svg; ?>
                </li>
                <li class="wptb-btn-size-btn wptb-element-property wptb-btn-size-switcher 
                    {{{selected1}}} {{{targetAddClass}}}" data-alignment-value="{{{center}}}">
                    <?php echo $center_align_image_svg; ?>
                </li>
                <li class="wptb-btn-size-btn wptb-element-property wptb-btn-size-switcher 
                    {{{selected2}}} {{{targetAddClass}}}" data-alignment-value="{{{right}}}">
                    <?php echo $right_align_image_svg; ?>
                </li>
            </ul>
        </div>

        <wptb-template-script>
            ( function() {
                let buttons = document.getElementsByClassName( '{{{targetAddClass}}}' );
                let selectorEl = document.querySelectorAll( '{{{selector}}}' );
                let selectedButtonAlignment;
                if( selectorEl.length && '{{{styleAlignment}}}' ) {
                    for( let i = 0; i < selectorEl.length; i++ ) {
                        if( i === 0 ) {
                            if( '{{{styleAlignment}}}'.indexOf( 'data-' ) === 0 ) {
                                selectedButtonAlignment = selectorEl[i].getAttribute( '{{{styleAlignment}}}' );
                            } else {
                                selectedButtonAlignment = selectorEl[i].style['{{{styleAlignment}}}'];
                            }
                        }
                        
                        if( i > 0 ) {
                            if( '{{{styleAlignment}}}'.indexOf( 'data-' ) === 0 ) {
                                if ( selectedButtonAlignment != selectorEl[i].getAttribute( '{{{styleAlignment}}}' ) ) {
                                    selectedButtonAlignment = false;
                                }
                            } else {
                                if ( selectedButtonAlignment != selectorEl[i].style['{{{styleAlignment}}}'] ) {
                                    selectedButtonAlignment = false;
                                }
                            }
                        }
                    }
                    
                }
                
                for ( var i = 0; i < buttons.length; i++ ) {
                    if( selectedButtonAlignment ) {
                        buttons[i].classList.remove( 'selected' );

                        if( selectedButtonAlignment == buttons[i].dataset.alignmentValue ) {
                            buttons[i].classList.add( 'selected' );
                        }
                    }

                    buttons[i].onclick = function () {
                        let selectorEl = document.querySelectorAll( '{{{selector}}}' );
                        if( selectorEl.length > 0 && '{{{styleAlignment}}}' ) {
                            let buttonDataAlignment = this.dataset.alignmentValue;
                            
                            for( let i = 0; i < selectorEl.length; i++ ) {
                                if( '{{{styleAlignment}}}'.indexOf( 'data-' ) === 0 ) {
                                    selectorEl[i].setAttribute( '{{{styleAlignment}}}', buttonDataAlignment );
                                } else {
                                    selectorEl[i].style['{{{styleAlignment}}}'] = buttonDataAlignment;
                                }
                            }

                            var b = this.parentNode.getElementsByClassName( 'wptb-btn-size-btn' );
                            for ( let i = 0; i < b.length; i++ ) {
                                b[i].classList.remove( 'selected' );
                            }
                            this.classList.add( 'selected' );
                            
                            let details = {value: buttonDataAlignment};
                            WPTB_Helper.wptbDocumentEventGenerate( 'wptb-control:{{{targetAddClass}}}', selectorEl[0], details );
                            WPTB_Helper.controlsStateManager( '{{{targetAddClass}}}', true );
                            
                            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                            wptbTableStateSaveManager.tableStateSet();
                        }
                    }
                }
                
                WPTB_Helper.controlsStateManager( '{{{targetAddClass}}}' );
            } )();
        </wptb-template-script>
		<?php
	}
}