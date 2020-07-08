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
class Control_Button2 extends Base_Control {
    /**
	 * Get "Button" control type.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'button2';
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
                additionsClasses,
                id,
                title,
                elemContainer,
                targetInputAddClass = '';

            if( data.label ) {
                label = data.label;
            }

            if(data.style) {
                style = 'style="' + data.style + '"';
            }

            if(data.additionsClasses) {
                additionsClasses = data.additionsClasses;
            }

            if(data.id) {
                id = 'id="' + data.id + '"';
            }

            if(data.title) {
                title = 'title="' + data.title + '"';
            }

            if( data.elemContainer ) {
                elemContainer = data.elemContainer;
            }

            targetInputAddClass = data.elementControlTargetUnicClass;
        #>
        <button {{{style}}} class="wptb-element-property {{{additionsClasses}}} {{{targetInputAddClass}}}" data-element="{{{elemContainer}}}" {{{id}}}
                {{{title}}}>{{{label}}}</button>

        <wptb-template-script>
            ( function() {
                let targetButtons = document.getElementsByClassName( '{{{targetInputAddClass}}}' );
                if( targetButtons.length > 0 ) {
                    targetButton = targetButtons[0];
                    let dataSelectorElement = targetButton.dataset.element;
                    if( dataSelectorElement ) {
                        let selectorElement = document.querySelector( '.' + dataSelectorElement );
                        if( selectorElement ) {
                            targetButton.onclick = function( event ) {
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