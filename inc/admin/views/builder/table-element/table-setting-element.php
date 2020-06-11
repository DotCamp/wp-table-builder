<?php

namespace WP_Table_Builder\Inc\Admin\Views\Builder\Table_Element;

use WP_Table_Builder\Inc\Admin\Base\Element_Base_Object as Element_Base_Object;
use WP_Table_Builder\Inc\Admin\Controls\Control_Section_Group_Collapse;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder as NS;
use function sprintf;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Table_Setting_Element extends Element_Base_Object {
	/**
	 * Get name.
	 *
	 * @return string Section name.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	public function get_name() {
		return 'table_setting';
	}

	/**
	 * Get section title.
	 *
	 * @return string Section title.
	 * @since 1.1.2
	 * @access public
	 * @deprecated
	 *
	 */
	public function get_title() {
		return esc_html_e( 'Table Setting', 'wp-table-builder' );
	}

    /**
     * Include file with js script for element button
     *
     * @since 1.1.2
     * @access protected
     */
    public function element_script() {
        return wp_normalize_path( NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/table-element-scripts/table-settings.js' );
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
		$general_section_group_controls = [
			'tableManageCells' =>
				[
					'label' => __( 'Manage Cells', 'wp_table_builder' ),
					'type'  => Controls_Manager::BUTTON,
				],

			'tableCellPadding'            =>
				[
					'label'        => __( 'Cell Padding', 'wp_table_builder' ),
					'type'         => Controls_Manager::SIZE,
					'selectors'    => [
						'{{{data.container}}} td' => 'padding',
					],
					'min'          => '0',
					'max'          => '50',
					'defaultValue' => 10,
					'dimension'    => 'px'
				],
			'tableAlignmentCheckbox'      =>
				[
					'label'     => __( 'Table Alignment', 'wp_table_builder' ),
					'type'      => Controls_Manager::ALIGNMENT,
					'selected'  => 1,
					'selectors' => [
						'{{{data.container}}}' => 'data-wptb-table-alignment',
					]
				],
			'applyTableContainerMaxWidth' =>
				[
					'label'     => __( 'Table Container Max Width', 'wp_table_builder' ),
					'type'      => Controls_Manager::TOGGLE,
					'selectors' => [
						'{{{data.container}}}' => [ 'data-wptb-apply-table-container-max-width', '1', null ]
					],
				],
			'tableContainerMaxWidth'      =>
				[
					'label'                 => __( 'Table Container Max Width', 'wp_table_builder' ),
					'type'                  => Controls_Manager::SIZE,
					'selectors'             => [
						'{{{data.container}}}' => [ 'data-wptb-table-container-max-width' ]
					],
					'min'                   => 100,
					'max'                   => 5000,
					'defaultValue'          => 700,
					'dimension'             => 'px',
					'appearDependOnControl' => [ 'applyTableContainerMaxWidth', [ 'checked' ], [ 'unchecked' ] ]
				],

			'tableCellMinAutoWidth' =>
				[
					'label'        => __( 'Table Cell Min Auto Width', 'wp_table_builder' ),
					'type'         => Controls_Manager::SIZE,
					'selectors'    => [
						'{{{data.container}}}' => [ 'data-wptb-td-width-auto' ]
					],
					'min'          => 10,
					'max'          => 500,
					'defaultValue' => 100,
					'dimension'    => 'px'
				]
		];

		$background_section_group_controls = [
			'tableHeaderBackground'  =>
				[
					'label'     => __( 'Header Background', 'wp_table_builder' ),
					'type'      => Controls_Manager::COLOR,
					'selectors' => [
						'{{{data.container}}} tbody tr:nth-child(1)' => [ 'background-color' ]
					]
				],
			'tableEvenRowBackground' =>
				[
					'label'     => __( 'Even Row Background', 'wp_table_builder' ),
					'type'      => Controls_Manager::COLOR,
					'selectors' => [
						'{{{data.container}}} tbody tr:nth-child(2n + 2)' => [ 'background-color' ]
					]
				],

			'tableOddRowBackground' =>
				[
					'label'     => __( 'Odd Row Background', 'wp_table_builder' ),
					'type'      => Controls_Manager::COLOR,
					'selectors' => [
						'{{{data.container}}} tbody tr:nth-child(2n + 3)' => [ 'background-color' ]
					]
				]
		];

		$border_section_group_controls = [
			'tableBorder' =>
				[
					'label'        => __( 'Table Border', 'wp_table_builder' ),
					'type'         => Controls_Manager::SIZE,
					'selectors'    => [
						'{{{data.container}}}' => 'border-width',
					],
					'min'          => '0',
					'max'          => '50',
					'defaultValue' => '0',
					'dimension'    => 'px',
				],

			'tableBorderColor'     =>
				[
					'label'     => __( 'BorderColor', 'wp_table_builder' ),
					'type'      => Controls_Manager::COLOR,
					'selectors' => [
						'{{{data.container}}}'    => [ 'border-color' ],
						'{{{data.container}}} td' => [ 'border-color' ]
					]
				],
			'applyInnerBorder'     =>
				[
					'label'     => __( 'Apply Inner Border', 'wp_table_builder' ),
					'type'      => Controls_Manager::TOGGLE,
					'selectors' => [
						'{{{data.container}}} td' => [ 'border-style', 'solid', 'none' ],
					],
				],
			'tableInnerBorderSize' =>
				[
					'label'                 => __( 'Inner Border Size', 'wp_table_builder' ),
					'type'                  => Controls_Manager::SIZE,
					'selectors'             => [
						'{{{data.container}}} td' => 'border-width',
					],
					'min'                   => 1,
					'max'                   => 50,
					'defaultValue'          => 1,
					'dimension'             => 'px',
					'appearDependOnControl' => [ 'applyInnerBorder', [ 'checked' ], [ 'unchecked' ] ]
				]
		];

		$responsive_section_group_controls = [
			'makeTableResponsive'  =>
				[
					'label'     => __( 'Make Table Responsive', 'wp_table_builder' ),
					'type'      => Controls_Manager::TOGGLE,
					'selectors' => [
						'{{{data.container}}}' => [ 'data-wptb-adaptive-table', '1', '0' ]
					],
				],
			'tableTopRowsAsHeader' =>
				[
					'label'     => __( 'Top Rows As Header', 'wp_table_builder' ),
					'type'      => Controls_Manager::TOGGLE,
					'selectors' => [
						'{{{data.container}}}' => [ 'class', 'wptb-table-preview-head', '' ]
					],
				]
		];

		$help_support_section_grup_controls = [
			'helpSupportLinks' => [
				'label' => 'test',
				'type' => Controls_Manager::HTML_OUTPUT,
				'html' => sprintf('<div><a href="https://wptablebuilder.com/" target="_blank">%s</a></div><div><a href="https://wptablebuilder.com/community/" target="_blank">%s</a></div><div><a href="https://www.facebook.com/groups/wptbplugin/" target="_blank">%s</a></div>', esc_html__('Our Website' , 'wp_table_builder'), esc_html__('Support Community Forum' , 'wp_table_builder'), esc_html__('Facebook Group' , 'wp_table_builder'))
			]
		];

		// general section group
		Control_Section_Group_Collapse::add_section( 'table_settings_general', esc_html__( 'general', NS\PLUGIN_TEXT_DOMAIN ), $general_section_group_controls, [
			$this,
			'add_control'
		] );

		// background section group
		Control_Section_Group_Collapse::add_section( 'table_settings_background', esc_html__( 'background', NS\PLUGIN_TEXT_DOMAIN ), $background_section_group_controls, [
			$this,
			'add_control'
		], false );

		// border section group
		Control_Section_Group_Collapse::add_section( 'table_settings_border', esc_html__( 'border', NS\PLUGIN_TEXT_DOMAIN ), $border_section_group_controls, [
			$this,
			'add_control'
		], false );

		// responsive section group
		Control_Section_Group_Collapse::add_section( 'table_settings_responsive', esc_html__( 'responsive', NS\PLUGIN_TEXT_DOMAIN ), $responsive_section_group_controls, [
			$this,
			'add_control'
		], false );

		// help&support section group
		Control_Section_Group_Collapse::add_section( 'table_settings_help_support', esc_html__( 'help & support', NS\PLUGIN_TEXT_DOMAIN ), $help_support_section_grup_controls, [
			$this,
			'add_control'
		], false );
	}
}
