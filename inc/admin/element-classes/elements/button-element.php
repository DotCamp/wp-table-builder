<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Element_Base_Object as Element_Base_Object;
use WP_Table_Builder\Inc\Admin\Element_Classes\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Button_Element extends Element_Base_Object {
    
    /**
	 * Get element name.
	 *
	 * Retrieve button editor element name.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string element name.
	 */
	public function get_name() {
		return 'button';
	}
    
    /**
	 * Get element data.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string element data.
	 */
	public function get_element_data() {
		return esc_attr( 'button', 'wp-table-builder' );
	}

	/**
	 * Get element title.
	 *
	 * Retrieve button editor element.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Element title.
	 */
	public function get_title() {
		return esc_html_e( 'Button', 'wp-table-builder' );
	}

	/**
	 * Get directory icon.
	 *
	 * Retrieve url text editor element icon.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Url Element icon.
	 */
	public function get_directory_icon() {
		return NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/button.php'; ;
	}
    
    /**
	 * Register the element controls.
	 *
	 * Adds different fields to allow the user to change and customize the element settings.
	 *
	 * @since 1.1.2
	 *
	 * @access protected
	 */
	protected function _register_controls() {
		$this->add_control(
			'section_header',
			[
				'label' => __( 'Button Options', 'wp_table_builder' ),
				'type' => Controls_Manager::SECTION_HEADER,
			]
		);
        
		$this->add_control(
			'buttonSizeCheckbox',
			[
				'label' => __( 'Button Size', 'wp_table_builder' ),
				'type' => Controls_Manager::CHANGE_ELEMENT_ATTRIBUTE,
                'selectors' => [
                    '{{{data.container}}} .wptb-button-wrapper' => 'class: size',
                ],
                'numberSelectedButtonDefault' => '1',
                'buttonDataNames' => ['s', 'm', 'l', 'xl'],
                'buttonViews' => ['S', 'M', 'L', 'XL']
			]
		);

		$this->add_control(
			'textColor',
			[
				'label' => __( 'Button Text Color', 'wp_table_builder' ),
				'type' => Controls_Manager::COLOR,
                'selectors' => [
                    '{{{data.container}}} .wptb-button-wrapper a div' => 'color',
                ]
			]
		);
        
        $this->add_control(
			'buttonColor',
			[
				'label' => __( 'Button Color', 'wp_table_builder' ),
				'type' => Controls_Manager::COLOR,
                'selectors' => [
                    '{{{data.container}}} .wptb-button-wrapper a div' => 'backgroundColor',
                ]
			]
		);
        
        $this->add_control(
			'buttonLink',
			[
				'label' => __( 'Button Link', 'wp_table_builder' ),
				'type' => Controls_Manager::HREF,
                'selector' => '{{{data.container}}} .wptb-button-wrapper a'
			]
		);
        
		$this->add_control(
			'buttonAlignmentCheckbox',
			[
				'label' => __( 'Button Alignment', 'wp_table_builder' ),
				'type' => Controls_Manager::ELEMENT_ALIGNMENT,
                'selected' => 1,
                'selectors' => [
                    '{{{data.container}}} .wptb-button-wrapper' => 'justify-content',
                ]
			]
		);
        
		$this->add_control(
			'buttonId',
			[
				'label' => __( 'Button Id', 'wp_table_builder' ),
				'type' => Controls_Manager::ADDING_USER_ATTR,
                'attrName' => 'id',
                'selector' => '{{{data.container}}} .wptb-button-wrapper a',
                'placeholder' => __( 'Insert Button ID Here', 'wp_table_builder' )
			]
		);
	}
    
    /**
	 * Render text editor element output in the editor.
	 *
	 * Written as a wp js template and used to generate the live preview.
	 *
	 * @since 1.1.2
	 * @access protected
	 */
	protected function _content_template() {
		?>
        <div class="wptb-button-wrapper wptb-size-m">
            <a>
                <div class="wptb-button" 
                     style="position: relative;">
                    <p>Button Text</p>
                </div>
            </a>
        </div>
		<?php
	}
    
    /**
	 * Render element script output in the editor.
	 *
	 * Used to generate the live preview, using a wp js template
	 *
	 * @since 1.1.2
	 * @access protected
	 */
    protected function _element_script() {
        ?>
        ( function() {
            let element = document.getElementsByClassName( '{{{data.elemClass}}}' );
            if( element.length > 0 ) {
                element = element[0];
                let a = element.querySelector( 'a' );
                let target = a.querySelector( 'div' );
                a.onclick = function( e ) {
                    e.preventDefault();
                };
                if( target ) {
                    WPTB_Helper.buttonsTinyMceInit( target );
                }
            }
        } )();
        <?php
    }
}
