<?php

namespace WP_Table_Builder\Inc\Admin\Views\Builder\Table_Element;

use WP_Table_Builder\Inc\Admin\Base\Element_Base_Object as Element_Base_Object;
use WP_Table_Builder\Inc\Admin\Controls\Control_Section_Group_Collapse;
use WP_Table_Builder\Inc\Admin\Managers\Addon_Manager;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager;
use WP_Table_Builder as NS;

// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Table_Responsive_Menu_Element.
 *
 * Left panel container for responsive menu controls/options/settings.
 *
 * @package WP_Table_Builder\Inc\Admin\Views\Builder\Table_Element
 */
class Table_Responsive_Menu_Element extends Element_Base_Object {

	/**
	 * Get element name.
	 *
	 * Retrieve the element name.
	 *
	 * @return string The name.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	public function get_name() {
		return 'table_responsive_menu';
	}

	/**
	 * Include file with js script for element
	 *
	 * @since 1.1.2
	 * @access protected
	 */
	public function element_script() {
		return wp_normalize_path( NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/table-element-scripts/table-responsive-menu.js' );
	}

	/**
	 * Register controls.
	 *
	 * Used to add new controls group to stack
	 *
	 * @since 1.1.2
	 * @access protected
	 */
	protected function _register_controls() {
		$this->setDefaultControlArg( 'elementOptionsGroupId', 'table-responsive-group' );
		$this->setDefaultControlArg( 'elementOptionClass', 'wptb-element-option' );

		// general control group
		$general_section_group_controls = [
			'generalResponsiveControls' => [
				'label' => 'none',
				'type'  => Controls_Manager::HTML_OUTPUT,
				'html'  => '<div id="responsiveBuilderLeftPanelGeneralControls"></div>',
			],
		];

		Control_Section_Group_Collapse::add_section( 'table_responsive_general_controls', esc_html__( 'general', 'wp-table-builder' ), $general_section_group_controls, [
			$this,
			'add_control'
		] );

		$mode_options = [
			'modeOptions' => [
				'label' => 'none',
				'type'  => Controls_Manager::HTML_OUTPUT,
				'html'  => '<div id="responsiveBuilderLeftPanelModeOptions"></div>'
			]
		];

		Control_Section_Group_Collapse::add_section( 'table_responsive_mode_options', esc_html__( 'mode options', 'wp-table-builder' ), $mode_options, [
			$this,
			'add_control'
		] );

		$how_to_text = esc_html__( 'You can check out the layout of your table by selecting any size breakpoint from the top slider menu or from breakpoint tabs on mode options, or even input your custom size to see the reaction of your table. After selecting the breakpoint, you can work on the layout for that breakpoint.', 'wp-table-builder' );

		// how-to control group
		$howto_section_group_controls = [
			'helpAndInfo' => [
				'label' => 'none',
				'type'  => Controls_Manager::HTML_OUTPUT,
				'html'  => '<div style="font-size: 80%; padding: 20px 20px"><i>' . $how_to_text . '</i></div>',
			]
		];

		Control_Section_Group_Collapse::add_section( 'table_responsive_how_to', esc_html__( 'how to', 'wp-table-builder' ), $howto_section_group_controls, [
			$this,
			'add_control'
		], false );

		$this->add_control( 'responsiveData', [
			'type'    => Controls_Manager::DATA_MULE,
			'dataId'  => 'responsiveMenuData',
			'dataObj' => [
				'isPro' => Addon_Manager::check_pro_status(),
				'enableBreakpointCustomization' => Addon_Manager::check_pro_status(),
				'screenSizes'                   => [
					'desktop' => [
						'name'  => __( 'desktop', 'wp-table-builder' ),
						'width' => 1024
					],
					'tablet'  => [
						'name'  => __( 'tablet', 'wp-table-builder' ),
						'width' => 700
					],
					'mobile'  => [
						'name'  => __( 'mobile', 'wp-table-builder' ),
						'width' => 300
					]
				],
				'compareSizes'                  => [
					'iPad'      => 768,
					'iPhone X'  => 375,
					'Pixel 2'   => 411,
					'Galaxy S5' => 360,
				],
				'strings'                       => [
					'rebuilding'              => esc_html__( 'rebuilding', 'wp-table-builder' ),
					'enableResponsive'        => esc_html__( 'enable responsive table', 'wp-table-builder' ),
					'enableResponsiveHelp'    => esc_html__( 'Enable responsive capabilities of current table', 'wp-table-builder' ),
					'stackDirection'          => esc_html__( 'Cell stack direction', 'wp-table-builder' ),
					'topRowHeader'            => esc_html__( 'Top row as header', 'wp-table-builder' ),
					'repeatMergedHeader'      => esc_html__( 'Repeat merged header', 'wp-table-builder' ),
					'staticTopRow'            => esc_html__( 'Static top row', 'wp-table-builder' ),
					'identifyCells'           => esc_html__( 'Identify cells', 'wp-table-builder' ),
					'cellsPerRow'             => esc_html__( 'Cells per row', 'wp-table-builder' ),
					'itemsPerHeader'          => esc_html__( 'Items per header', 'wp-table-builder' ),
					'preserveRowColor'        => esc_html__( 'Preserve row color', 'wp-table-builder' ),
					'row'                     => esc_html__( 'row', 'wp-table-builder' ),
					'column'                  => esc_html__( 'column', 'wp-table-builder' ),
					'mode'                    => esc_html__( 'mode', 'wp-table-builder' ),
					'auto'                    => esc_html__( 'auto', 'wp-table-builder' ),
					'pattern'                 => esc_html__( 'pattern', 'wp-table-builder' ),
					'full'                    => esc_html__( 'full', 'wp-table-builder' ),
					'okay'                    => esc_html__( 'Okay', 'wp-table-builder' ),
					'relative'                => esc_html__( 'target width', 'wp-table-builder' ),
					'window'                  => esc_html__( 'window', 'wp-table-builder' ),
					'container'               => esc_html__( 'container', 'wp-table-builder' ),
					// for help text of responsive modes, use the format of `{mode_name}Help`, this will be parsed dynamically to change the help text at frontend
					'autoHelp'                => esc_html__( 'Auto: Table will be reconstructed automatically with the given options by stacking rows/columns.', 'wp-table-builder' ),
					'patternHelp'             => esc_html__( 'Pattern: Pattern of the topmost selected rows/columns will be applied to the rest of the table.', 'wp-table-builder' ),
					'fullHelp'                => esc_html__( 'Full: You have full control over how table will be constructed.', 'wp-table-builder' ),
					'stackDirectionHelp'      => esc_html__( 'The order of stacking, either by rows or by columns.', 'wp-table-builder' ),
					'topRowHeaderHelp'        => esc_html__( 'Use the top most row of table as a header.', 'wp-table-builder' ),
					'cellsPerRowHelp'         => esc_html__( 'Amount of cells that will be available per row. Can be further customized for different breakpoints.', 'wp-table-builder' ),
					'legacyResponsiveWarning' => esc_html__( 'Your table has legacy responsive functionality. While it is still supported, enabling newer responsive system will override it. If this is not what you want, do not enable newer version.', 'wp-table-builder' ),
					'preserveRowColorHelp'    => esc_html__( 'Preserve the original row color for cell, or use even/odd row colors', 'wp-table-builder' ),
					'disableBreakpoint'    => esc_html__( 'Disable breakpoint', 'wp-table-builder' )
				]
			]
		] );
	}
}
