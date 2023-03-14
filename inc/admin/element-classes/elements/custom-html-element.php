<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Element_Base as Element_Base;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Custom_Html_Element extends Element_Base {
    
    /**
	 * Get element name.
	 *
	 * Retrieve custom html editor element name.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string element name.
	 */
	public function get_name() {
		return 'custom_html';
	}

	/**
	 * Get element title.
	 *
	 * Retrieve custom html editor element title.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Element title.
	 */
	public function get_title() {
		return esc_html_e( 'Custom HTML', 'wp-table-builder' );
	}

	/**
	 * Get directory icon.
	 *
	 * Return directory custom html editor element icon.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string directory Element icon.
	 */
	public function get_directory_icon() {
		return NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/html.svg'; ;
	}
    
    /**
	 * Get url icon.
	 *
	 * Return url custom html icon
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Url Element icon.
	 */
	public function get_url_icon() {
		return wp_normalize_path ( NS\WP_TABLE_BUILDER_URL . 'inc/admin/views/builder/icons/html.svg' );
	}
    
    /**
	 * Include file with js script for element custom html
	 *
	 * @since 1.1.2
	 * @access protected
	 */
    public function element_script() {
        return wp_normalize_path ( NS\WP_TABLE_BUILDER_DIR . 'inc/admin/element-classes/element-scripts/custom-html-element.js' );
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
				'label' => __( 'Custom HTML Options', 'wp-table-builder' ),
				'type' => Controls_Manager::SECTION_HEADER,
                'buttonBack' => true
			]
		);
        
        $this->add_control(
            'textarea',
			[
				'label' => __( 'Insert HTML', 'wp-table-builder' ),
				'type' => Controls_Manager::TEXTAREA,
                'selectors' => [
                    '{{{data.container}}} .wptb-custom-html-wrapper',
                ],
                'placeholder' => __( 'Insert HTML Code Here', 'wp-table-builder' ),
                'rows' => 5,
                'defaultValue' => 'Insert Custom HTML'
			]  
        );
	}
    
    /**
	 * Render custom html editor element output in the editor.
	 *
	 * Written as a wp js template and used to generate the live preview.
	 *
	 * @since 1.1.2
	 * @access protected
	 */
	protected function _content_template() {
		?>
        <div class="wptb-custom-html-wrapper" data-wptb-new-element="1">
            <span><?php echo __('Insert Custom HTML', 'wp-table-builder'); ?></span>
        </div>
		<?php
	}
}
