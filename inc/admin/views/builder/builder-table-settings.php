<?php
namespace WP_Table_Builder\Inc\Admin\Views\Builder;

use WP_Table_Builder\Inc\Admin\Base\Controls_Stack as Controls_Stack;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Builder_Table_Settings extends Controls_Stack {
    /**
	 * Get name.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Section name.
	 */
	public function get_name() {
		return 'table_setting';
	}

	/**
	 * Get section title.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Section title.
	 */
	public function get_title() {
		return esc_html_e( 'Table Setting', 'wp-table-builder' );
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
			'tableAlignmentCheckbox',
			[
				'label' => __( 'Table Alignment', 'wp_table_builder' ),
				'type' => Controls_Manager::ALIGNMENT,
                'selected' => 1,
                'selectors' => [
                    '{{{data.container}}}' => 'float',
                ]
			]
		);
	}
}
