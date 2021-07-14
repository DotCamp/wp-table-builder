<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Element_Base as Element_Base;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Image_Element extends Element_Base {
    
    /**
	 * Get element name.
	 *
	 * Retrieve image editor element name.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string element name.
	 */
	public function get_name() {
		return 'image';
	}

	/**
	 * Get element image.
	 *
	 * Retrieve image editor element.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Element title.
	 */
	public function get_title() {
		return esc_html_e( 'Image', 'wp-table-builder' );
	}

	/**
	 * Get directory icon.
	 *
	 * Retrieve directory image editor element icon.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Directory Element icon.
	 */
	public function get_directory_icon() {
		return NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/image.svg';
	}
    
    /**
	 * Get url icon.
	 *
	 * Return url image icon
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Url Element icon.
	 */
	public function get_url_icon() {
		return wp_normalize_path ( NS\WP_TABLE_BUILDER_URL . 'inc/admin/views/builder/icons/image.svg' );
	}
    
    /**
	 * Include file with js script for element image
	 *
	 * @since 1.1.2
	 * @access protected
	 */
    public function element_script() {
        return wp_normalize_path ( NS\WP_TABLE_BUILDER_DIR . 'inc/admin/element-classes/element-scripts/image-element.js' );
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
				'label' => __( 'Image Options', 'wp_table_builder' ),
				'type' => Controls_Manager::SECTION_HEADER,
                'buttonBack' => true
			]
		);
        
        $this->add_control(
			'imageReplaceButton',
			[
				'label' => __( 'Replace Image', 'wp_table_builder' ),
				'type' => Controls_Manager::BUTTON,
			]
		);
        
		$this->add_control(
			'imageAlignmentCheckbox',
			[
				'label' => __( 'Image Alignment', 'wp_table_builder' ),
				'type' => Controls_Manager::ALIGNMENT,
                'selected' => 1,
                'selectors' => [
                    '{{{data.container}}} .wptb-image-wrapper a' => 'float',
                ]
			]
		);
        
		$this->add_control(
			'imageSize',
			[
				'label' => __( 'Image Size', 'wp_table_builder' ),
				'type' => Controls_Manager::SIZE,
                'selectors' => [
                    '{{{data.container}}} .wptb-image-wrapper a' => 'width',
                ],
                'min' => 10, 
                'max' => 100,
                'defaultValue' => 100,
                'dimension' => '%'
			]
		);
        
        $this->add_control(
			'imageLink',
			[
				'label' => __( 'Image Link', 'wp_table_builder' ),
				'type' => Controls_Manager::URL,
                'selector' => '{{{data.container}}} .wptb-image-wrapper a'
			]
		);

		$this->add_control(
			'imageAlternativeText',
			[
				'label' => __( 'Image Alternative Text', 'wp_table_builder' ),
				'type' => Controls_Manager::TEXT,
                'selectors' => [
                    '{{{data.container}}} .wptb-image-wrapper a img' => 'alt',
                ],
                'placeholder' => __( 'Image Alt Text', 'wp_table_builder' ),
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
        <div class="wptb-image-wrapper">
            <a style="display: block;">
                <span class="wptb-icon-image-button">
                    <svg class="wptb-draggable-prototype" xmlns="http://www.w3.org/2000/svg" 
                         viewBox="0 0 489.4 489.4" width="40px" height="50px">
                        <path d="M0 437.8c0 28.5 23.2 51.6 51.6 51.6h386.2c28.5 0 51.6-23.2 
                              51.6-51.6V51.6c0-28.5-23.2-51.6-51.6-51.6H51.6C23.1 0 0 23.2 0 
                              51.6 0 51.6 0 437.8 0 437.8zM437.8 464.9H51.6c-14.9 
                              0-27.1-12.2-27.1-27.1v-64.5l92.8-92.8 79.3 79.3c4.8 4.8 
                              12.5 4.8 17.3 0l143.2-143.2 107.8 107.8v113.4C464.9 452.7 452.7 
                              464.9 437.8 464.9zM51.6 24.5h386.2c14.9 0 27.1 12.2 27.1 
                              27.1v238.1l-99.2-99.1c-4.8-4.8-12.5-4.8-17.3 0L205.2 
                              333.8l-79.3-79.3c-4.8-4.8-12.5-4.8-17.3 0l-84.1 84.1v-287C24.5 
                              36.7 36.7 24.5 51.6 24.5z"/>
                        <path d="M151.7 196.1c34.4 0 62.3-28 62.3-62.3s-28-62.3-62.3-62.3 -62.3 
                              28-62.3 62.3S117.3 196.1 151.7 196.1zM151.7 96c20.9 0 37.8 17 37.8 
                              37.8s-17 37.8-37.8 37.8 -37.8-17-37.8-37.8S130.8 96 151.7 96z"/>
                    </svg>
                    <span>Insert Image</span>
                </span>
            </a>
        </div>
		<?php
	}
}
