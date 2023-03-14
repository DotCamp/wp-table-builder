<?php

namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Element_Base as Element_Base;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Shortcode_Element extends Element_Base {

	/**
	 * Get element name.
	 *
	 * Retrieve shortcode editor element name.
	 *
	 * @return string element name.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	public function get_name() {
		return 'shortcode';
	}

	/**
	 * Get element title.
	 *
	 * Retrieve shortcode editor element title.
	 *
	 * @return string Element title.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	public function get_title() {
		return esc_html_e( 'Shortcode', 'wp-table-builder' );
	}

	/**
	 * Get directory icon.
	 *
	 * Return directory shortcode editor element icon.
	 *
	 * @return string directory Element icon.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	public function get_directory_icon() {
		return NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/shortcode.svg';;
	}

	/**
	 * Get url icon.
	 *
	 * Return url shortcode icon
	 *
	 * @return string Url Element icon.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	public function get_url_icon() {
		return wp_normalize_path( NS\WP_TABLE_BUILDER_URL . 'inc/admin/views/builder/icons/shortcode.svg' );
	}

	/**
	 * Include file with js script for element shortcode
	 *
	 * @since 1.1.2
	 * @access protected
	 */
	public function element_script() {
		return wp_normalize_path( NS\WP_TABLE_BUILDER_DIR . 'inc/admin/element-classes/element-scripts/shortcode-element.js' );
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
				'label'      => __( 'Element Shortcode Options', 'wp-table-builder' ),
				'type'       => Controls_Manager::SECTION_HEADER,
				'buttonBack' => true
			]
		);

		$this->add_control(
			'textarea',
			[
				'label'        => __( 'Insert Shortcode', 'wp-table-builder' ),
				'type'         => Controls_Manager::TEXTAREA,
				'selectors'    => [
					'{{{data.container}}} div',
				],
				'placeholder'  => __( 'Insert Shortcode Here', 'wp-table-builder' ),
				'rows'         => 5,
				'defaultValue' => '[Shortcode]',
				'allowHTML'    => false
			]
		);
	}

	/**
	 * Render shortcode editor element output in the editor.
	 *
	 * Written as a wp js template and used to generate the live preview.
	 *
	 * @since 1.1.2
	 * @access protected
	 */
	protected function _content_template() {
		?>
        <wptb_shortcode_container_element>
            <div>[Shortcode]</div>
        </wptb_shortcode_container_element>
		<?php
	}
}
