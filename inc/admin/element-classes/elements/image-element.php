<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Element_Base_Object as Element_Base_Object;
use WP_Table_Builder\Inc\Admin\Element_Classes\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Image_Element extends Element_Base_Object {
    
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
		return NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/image.svg'; ;
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
			]
		);
        
		$this->add_control(
			'imageAlignmentCheckbox',
			[
				'label' => __( 'Image Alignment', 'wp_table_builder' ),
				'type' => Controls_Manager::ELEMENT_ALIGNMENT,
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
            <a style="display: block;"><img></a>
        </div>
		<?php
	}
}
