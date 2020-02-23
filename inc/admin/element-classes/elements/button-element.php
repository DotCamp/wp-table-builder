<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Element_Base_Object as Element_Base_Object;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager as Controls_Manager;
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
	 * Return directory button editor icon
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Directory Element icon.
	 */
	public function get_directory_icon() {
		return wp_normalize_path ( NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/button.svg' );
	}
    
    /**
	 * Get url icon.
	 *
	 * Return url button icon
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Url Element icon.
	 */
	public function get_url_icon() {
		return wp_normalize_path ( NS\WP_TABLE_BUILDER_URL . 'inc/admin/views/builder/icons/button.svg' );
	}
    
    /**
	 * Include file with js script for element button
	 *
	 * @since 1.1.2
	 * @access protected
	 */
    public function element_script() {
        return wp_normalize_path ( NS\WP_TABLE_BUILDER_DIR . 'inc/admin/element-classes/element-scripts/button-element.js' );
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
                'buttonBack' => true
			]
		);
        
		$this->add_control(
			'buttonSizeCheckbox',
			[
				'label' => __( 'Button Size', 'wp_table_builder' ),
				'type' => Controls_Manager::CHANGE_ATTRIBUTE,
                'selectors' => [
                    '{{{data.container}}} .wptb-button-wrapper' => 'class: size',
                ],
                'numberSelectedButtonDefault' => '1',
                'buttonDataNames' => ['s', 'm', 'l', 'xl'],
                'buttonViews' => ['S', 'M', 'L', 'XL']
			]
		);
        
        $this->add_control(
			'buttonColor',
			[
				'label' => __( 'Button Color', 'wp_table_builder' ),
				'type' => Controls_Manager::COLOR,
                'selectors' => [
                    '{{{data.container}}} .wptb-button-wrapper a div' => 'background-color',
                ]
			]
		);
        
		$this->add_control(
			'buttonTextSize',
			[
				'label' => __( 'Button Text Size', 'wp_table_builder' ),
				'type' => Controls_Manager::SIZE,
                'selectors' => [
                    '{{{data.container}}} .wptb-button-wrapper p' => 'fontSize',
                ],
                'min' => 10, 
                'max' => 50,
                'defaultValue' => 15,
                'dimension' => 'px'
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
			'buttonLink',
			[
				'label' => __( 'Button Link', 'wp_table_builder' ),
				'type' => Controls_Manager::URL,
                'selector' => '{{{data.container}}} .wptb-button-wrapper a'
			]
		);
        
		$this->add_control(
			'buttonAlignmentCheckbox',
			[
				'label' => __( 'Button Alignment', 'wp_table_builder' ),
				'type' => Controls_Manager::ALIGNMENT,
                'selected' => 1,
                'selectors' => [
                    '{{{data.container}}} .wptb-button-wrapper' => 'justify-content',
                ]
			]
		);

		$this->add_control(
			'button-id',
			[
				'label' => __( 'Button Id', 'wp_table_builder' ),
				'type' => Controls_Manager::TEXT,
                'placeholder' => __( 'Insert Button ID Here', 'wp_table_builder' ),
                'selectors' => [
                    '{{{data.container}}} .wptb-button-wrapper a' => 'id',
                ]
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
}
