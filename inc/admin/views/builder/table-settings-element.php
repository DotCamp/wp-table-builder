<?php
namespace WP_Table_Builder\Inc\Admin\Views\Builder;

use WP_Table_Builder\Inc\Admin\Base\Controls_Stack as Controls_Stack;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Table_Settings_Element extends Controls_Stack {
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
			'section_header',
			[
				'label' => __( 'Table Settings', 'wp_table_builder' ),
				'type' => Controls_Manager::SECTION_HEADER,
			]
		);
        
        $this->add_control(
			'tableManageCells',
			[
				'label' => __( 'Manage Cells', 'wp_table_builder' ),
				'type' => Controls_Manager::BUTTON,
			]
		);
        
        $this->add_control(
			'makeTableResponsive',
			[
				'label' => __( 'Make Table Responsive', 'wp_table_builder' ),
				'type' => Controls_Manager::TOGGLE,
			]
		);
        
        $this->add_control(
			'tableTopRowsAsHeader',
			[
				'label' => __( 'Top Rows As Header', 'wp_table_builder' ),
				'type' => Controls_Manager::TOGGLE,
			]
		);
        
        $this->add_control(
			'applyTableContainerMaxWidth',
			[
				'label' => __( 'Apply Table Container Max Width', 'wp_table_builder' ),
				'type' => Controls_Manager::TOGGLE
			]
		);
        
		$this->add_control(
			'tableContainerMaxWidth',
			[
				'label' => __( 'Table Container Max Width', 'wp_table_builder' ),
				'type' => Controls_Manager::SIZE,
                'selectors' => [
                    '{{{data.container}}}' => ['data-wptb-table-container-max-width']
                ],
                'min' => 100, 
                'max' => 5000,
                'defaultValue' => 850,
                'dimension' => 'px',
                'appearDependOnControl' => ['applyTableContainerMaxWidth', ['checked'], ['unchecked']]
			]
		);
        
		$this->add_control(
			'tableBorder',
			[
				'label' => __( 'Table Border', 'wp_table_builder' ),
				'type' => Controls_Manager::SIZE,
                'selectors' => [
                    '{{{data.container}}}' => 'border-width',
                ],
                'min' => '0', 
                'max' => '50',
                'defaultValue' => '0',
                'dimension' => 'px',
			]
		);
        
        $this->add_control(
			'applyInnerBorder',
			[
				'label' => __( 'Apply Inner Border', 'wp_table_builder' ),
				'type' => Controls_Manager::TOGGLE,
                'selectors' => [
                    '{{{data.container}}} td' => ['border-style', 'solid', 'none'],
                ],
			]
		);
        
		$this->add_control(
			'tableInnerBorderSize',
			[
				'label' => __( 'Inner Border Size', 'wp_table_builder' ),
				'type' => Controls_Manager::SIZE,
                'selectors' => [
                    '{{{data.container}}} td' => 'border-width',
                ],
                'min' => 1, 
                'max' => 50,
                'defaultValue' => 1,
                'dimension' => 'px',
                'appearDependOnControl' => ['applyInnerBorder', ['checked'], ['unchecked']]
			]
		);
        
        $this->add_control(
			'tableBorderColor',
			[
				'label' => __( 'BorderColor', 'wp_table_builder' ),
				'type' => Controls_Manager::COLOR,
                'selectors' => [
                    '{{{data.container}}}' => ['border-color'],
                    '{{{data.container}}} td' => ['border-color']
                ]
			]
		);
        
		$this->add_control(
			'tableCellPadding',
			[
				'label' => __( 'Cell Padding', 'wp_table_builder' ),
				'type' => Controls_Manager::SIZE,
                'selectors' => [
                    '{{{data.container}}} td' => 'padding',
                ],
                'min' => 0, 
                'max' => 50,
                'defaultValue' => 15,
                'dimension' => 'px'
			]
		);
        
		$this->add_control(
			'tableAlignmentCheckbox',
			[
				'label' => __( 'Table Alignment', 'wp_table_builder' ),
				'type' => Controls_Manager::ALIGNMENT,
                'selected' => 1,
                'selectors' => [
                    '{{{data.container}}}' => 'data-wptb-table-alignment',
                ]
			]
		);
        
        $this->add_control(
			'tableHeaderBackground',
			[
				'label' => __( 'Header Background', 'wp_table_builder' ),
				'type' => Controls_Manager::COLOR,
                'selectors' => [
                    '{{{data.container}}} tbody tr:nth-child(1)' => ['background-color']
                ]
			]
		);
        
        $this->add_control(
			'tableEvenRowBackground',
			[
				'label' => __( 'Even Row Background', 'wp_table_builder' ),
				'type' => Controls_Manager::COLOR,
                'selectors' => [
                    '{{{data.container}}} tbody tr:nth-child(2n + 2)' => ['background-color']
                ]
			]
		);
        
        $this->add_control(
			'tableOddRowBackground',
			[
				'label' => __( 'Odd Row Background', 'wp_table_builder' ),
				'type' => Controls_Manager::COLOR,
                'selectors' => [
                    '{{{data.container}}} tbody tr:nth-child(2n + 3)' => ['background-color']
                ]
			]
		);
	}
}
