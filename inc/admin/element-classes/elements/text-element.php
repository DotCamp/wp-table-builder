<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Element_Base as Element_Base;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Text_Element extends Element_Base {
    
    /**
	 * Get element name.
	 *
	 * Retrieve text editor element name.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string element name.
	 */
	public function get_name() {
		return 'text';
	}

	/**
	 * Get element title.
	 *
	 * Retrieve text editor element title.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Element title.
	 */
	public function get_title() {
		return esc_html_e( 'Text', 'wp-table-builder' );
	}

	/**
	 * Get directory icon.
	 *
	 * Return directory text editor element icon.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string directory Element icon.
	 */
	public function get_directory_icon() {
		return NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/text.svg'; ;
	}
    
    /**
	 * Get url icon.
	 *
	 * Return url text icon
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Url Element icon.
	 */
	public function get_url_icon() {
		return wp_normalize_path ( NS\WP_TABLE_BUILDER_URL . 'inc/admin/views/builder/icons/text.svg' );
	}
    
    /**
	 * Include file with js script for element text
	 *
	 * @since 1.1.2
	 * @access protected
	 */
    public function element_script() {
        return wp_normalize_path ( NS\WP_TABLE_BUILDER_DIR . 'inc/admin/element-classes/element-scripts/text-element.js' );
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
				'label' => __( 'Text Options', 'wp_table_builder' ),
				'type' => Controls_Manager::SECTION_HEADER,
                'buttonBack' => true
			]
		);

		$this->add_control(
			'color',
			[
				'label' => __( 'Font Color', 'wp_table_builder' ),
				'type' => Controls_Manager::COLOR,
                'selectors' => [
                    '{{{data.container}}}' => 'color',
                ]
			]
		);

		$this->add_control(
			'linkColor',
			[
				'label' => __( 'Link Font Color', 'wp_table_builder' ),
				'type' => Controls_Manager::COLOR,
                'selectors' => [
                    '{{{data.container}}} a' => 'color',
                ]
			]
		);
        
		$this->add_control(
			'size',
			[
				'label' => __( 'Font Size', 'wp_table_builder' ),
				'type' => Controls_Manager::SIZE,
                'selectors' => [
                    '{{{data.container}}}' => 'fontSize',
                ],
                'min' => 10, 
                'max' => 50,
                'defaultValue' => 15,
                'dimension' => 'px'
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
        <div><p>Text</p></div>
		<?php
	}
}
