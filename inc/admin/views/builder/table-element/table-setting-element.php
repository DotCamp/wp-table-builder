<?php

namespace WP_Table_Builder\Inc\Admin\Views\Builder\Table_Element;

use WP_Table_Builder\Inc\Admin\Base\Element_Base_Object as Element_Base_Object;
use WP_Table_Builder\Inc\Admin\Controls\Control_Section_Group_Collapse;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder as NS;
use function do_action;
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
		$this->setDefaultControlArg( 'elementOptionsGroupId', 'table-settings-group' );
		$this->setDefaultControlArg( 'elementOptionClass', 'wptb-element-option' );
		$general_section_group_controls = [
			// @deprecated
			// 'tableManageCells' =>
			// 	[
			// 		'label' => __( 'Manage Cells', 'wp_table_builder' ),
			// 		'type'  => Controls_Manager::BUTTON,
			// 	],

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

			'tableCellMinAutoWidth'   =>
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
				],
			'tableSortableVertical'   =>
				[
					'label'     => __( 'Sortable Table Vertically', 'wp_table_builder' ),
					'type'      => Controls_Manager::TOGGLE,
					'selectors' => [
						'{{{data.container}}}' => [ 'data-wptb-sortable-table-vertical', '1', null ]
					]
				],
			'tableSortableHorizontal' =>
				[
					'label'     => __( 'Sortable Table Horizontally', 'wp_table_builder' ),
					'type'      => Controls_Manager::TOGGLE,
					'selectors' => [
						'{{{data.container}}}' => [ 'data-wptb-sortable-table-horizontal', '1', null ]
					]
				]
		];

		// @deprecated in favor of new background menu
//		$background_section_group_controls = [
//			'tableHeaderBackground'  =>
//				[
//					'label'     => __( 'Header Background', 'wp_table_builder' ),
//					'type'      => Controls_Manager::COLOR,
//					'selectors' => [
//						'{{{data.container}}} tbody tr:nth-child(1)' => [ 'background-color', 'data-wptb-bg-color' ]
//					],
//					'dataSets' => [
//						'{{{data.container}}}' => 'wptbHeaderBackgroundColor'
//					]
//				],
//			'tableEvenRowBackground' =>
//				[
//					'label'     => __( 'Even Row Background', 'wp_table_builder' ),
//					'type'      => Controls_Manager::COLOR,
//					'selectors' => [
//						'{{{data.container}}} tbody tr:nth-child(2n + 2)' => [ 'background-color', 'data-wptb-bg-color' ]
//					],
//					'dataSets' => [
//						'{{{data.container}}}' => 'wptbEvenRowBackgroundColor'
//					]
//				],
//
//			'tableOddRowBackground' =>
//				[
//					'label'     => __( 'Odd Row Background', 'wp_table_builder' ),
//					'type'      => Controls_Manager::COLOR,
//					'selectors' => [
//						'{{{data.container}}} tbody tr:nth-child(2n + 3)' => [ 'background-color', 'data-wptb-bg-color' ]
//					],
//					'dataSets' => [
//						'{{{data.container}}}' => 'wptbOddRowBackgroundColor'
//					]
//				]
//		];

		$border_section_group_controls = [

			'tableBorder' =>
				[
					'label'        => __( 'Table Border', 'wp_table_builder' ),
					'type'         => Controls_Manager::SIZE,
					'selectors'    => [
						'{{{data.container}}}' => 'border-width',
					],
					'min'          => 0,
					'max'          => 50,
					'defaultValue' => 1,
					'dimension'    => 'px',
				],

			'tableBorderColor'     =>
				[
					'label'     => __( 'BorderColor', 'wp_table_builder' ),
					'type'      => Controls_Manager::COLOR,
					'selectors' => [
						'{{{data.container}}} td' => [ 'border-color' ],
						'{{{data.container}}}'    => [ 'border-color' ]
					]
				],
			'applyInnerBorder'     =>
				[
					'label'     => __( 'Apply Inner Border', 'wp_table_builder' ),
					'type'      => Controls_Manager::TOGGLE,
					'selectors' => [
						'{{{data.container}}} td' => [ 'border-style', 'solid', 'none' ],
					],
					'checked'   => true
				],
			'headerInnerBorder'    =>
				[
					'label'                 => __( 'Header Inner Border', 'wp_table_builder' ),
					'type'                  => Controls_Manager::TOGGLE,
					'selectors'             => [
						'{{{data.container}}} tr:first-child td' => [ 'border-style', 'solid', 'none' ],
					],
					'checked'               => true,
					'appearDependOnControl' => [ 'applyInnerBorder', [ 'checked' ], [ 'unchecked' ] ]
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

		// @deprecated
//		$responsive_section_group_controls = [
//			'makeTableResponsive'  =>
//				[
//					'label'     => __( 'Make Table Responsive', 'wp_table_builder' ),
//					'type'      => Controls_Manager::TOGGLE,
//					'selectors' => [
//						'{{{data.container}}}' => [ 'data-wptb-adaptive-table', '1', '0' ]
//					],
//				],
//			'tableTopRowsAsHeader' =>
//				[
//					'label'     => __( 'Top Rows As Header', 'wp_table_builder' ),
//					'type'      => Controls_Manager::TOGGLE,
//					'selectors' => [
//						'{{{data.container}}}' => [ 'class', 'wptb-table-preview-head', '' ]
//					],
//				]
//		];

		$help_support_section_group_controls = [
			'helpSupportLinks' => [
				'label' => 'test',
				'type'  => Controls_Manager::HTML_OUTPUT,
				'html'  => sprintf( '<div class="wptb-help-support-section-wrapper"><div><a href="https://wptablebuilder.com/" target="_blank">%s</a></div><div><a href="https://wptablebuilder.com/docs/" target="_blank">%s</a></div><div><a href="https://www.facebook.com/groups/wptbplugin/" target="_blank">%s</a></div></div>', esc_html__( 'Our Website', 'wp_table_builder' ), esc_html__( 'Documentation', 'wp_table_builder' ), esc_html__( 'Facebook Group', 'wp_table_builder' ) )
			]
		];

		$scroll_section_group_controls = [
			'horizontalScrollEnable' => [
				'label'     => esc_html__( 'Enable horizontal scrolling', 'wp-table-builder-pro' ),
				'type'      => Controls_Manager::TOGGLE,
				'selectors' => [
					'{{{data.container}}}' => [ 'data-wptb-horizontal-scroll-status', '1', null ]
				]
			]

		];

		// general section group
		Control_Section_Group_Collapse::add_section( 'table_settings_general', esc_html__( 'general', NS\PLUGIN_TEXT_DOMAIN ), $general_section_group_controls, [
			$this,
			'add_control'
		], false, 'sliders-h' );

		// @deprecated in favor of new background menu
//		// background section group
//		Control_Section_Group_Collapse::add_section( 'table_settings_background', esc_html__( 'background', NS\PLUGIN_TEXT_DOMAIN ), $background_section_group_controls, [
//			$this,
//			'add_control'
//		], false );

		// border section group
		Control_Section_Group_Collapse::add_section( 'table_settings_border', esc_html__( 'border', NS\PLUGIN_TEXT_DOMAIN ), $border_section_group_controls, [
			$this,
			'add_control'
		], false, 'border-style' );

		// scroll section group
		Control_Section_Group_Collapse::add_section( 'table_settings_scroll', esc_html__( 'Scroll', NS\PLUGIN_TEXT_DOMAIN ), $scroll_section_group_controls, [
			$this,
			'add_control'
		], false, 'arrows-alt-h' );

		// table settings registered action hook
		do_action( 'wp-table-builder/table_settings_registered', $this );

		// help&support section group
		Control_Section_Group_Collapse::add_section( 'table_settings_help_support', esc_html__( 'help & support', NS\PLUGIN_TEXT_DOMAIN ), $help_support_section_group_controls, [
			$this,
			'add_control'
		], false, 'info-circle' );

		$this->setDefaultControlArg( 'elementOptionsGroupId', 'wptb-bar-top' );
		$this->setDefaultControlArg( 'elementOptionsContainerOn', 'false' );
		$this->setDefaultControlArg( 'elementOptionContainerOn', 'false' );

		$this->add_control(
			'addLeftColumn',
			[
				'label'            => __( 'Add Left Column', 'wp_table_builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-no-cell-action visible',
				'id'               => 'wptb-add-start-column',
				'title'            => __( 'Add Column to the Start', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'addRightColumn',
			[
				'label'            => __( 'Add Right Column', 'wp_table_builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-no-cell-action visible',
				'id'               => 'wptb-add-end-column',
				'title'            => __( 'Add Column to the End', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'addTopRow',
			[
				'label'            => __( 'Add Top Row', 'wp_table_builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-no-cell-action visible',
				'id'               => 'wptb-add-start-row',
				'title'            => __( 'Add Row to the Start', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'addBottomRow',
			[
				'label'            => __( 'Add Bottom Row', 'wp_table_builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-no-cell-action visible',
				'id'               => 'wptb-add-end-row',
				'title'            => __( 'Add Row to the End', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'mergeSelectedCells',
			[
				'label'            => __( 'Merge', 'wp_table_builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-multiple-select-action',
				'id'               => 'wptb-merge-cells',
				'title'            => __( 'Merge Selected Cells', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'splitSelectedSell',
			[
				'label'            => __( 'Split', 'wp_table_builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-single-action',
				'id'               => 'wptb-split-cell',
				'title'            => __( 'Unmerge Selected Cell', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'deleteHighlightedColumn',
			[
				'label'            => __( 'Remove Column', 'wp_table_builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-single-action',
				'id'               => 'wptb-delete-column',
				'title'            => __( 'Delete Highlighted Column', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'deleteHighlightedRow',
			[
				'label'            => __( 'Remove Row', 'wp_table_builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-single-action',
				'id'               => 'wptb-delete-row',
				'title'            => __( 'Delete Highlighted Row', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'closeManageCellsModeTop',
			[
				'label'            => __( 'Close', 'wp_table_builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-table-edit-mode-close',
				'title'            => __( 'Close Manage Cells Mode', 'wp-table-builder' )
			]
		);

		$this->setDefaultControlArg( 'elementOptionsGroupId', 'wptb-bar-bottom' );

		$this->add_control(
			'insertColumnAfter',
			[
				'label'            => __( 'Insert Column After', 'wp_table_builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-single-action',
				'id'               => 'wptb-add-column-after',
				'title'            => __( 'Add Column After Highlighted One', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'insertColumnBefore',
			[
				'label'            => __( 'Insert Column Before', 'wp_table_builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-single-action',
				'id'               => 'wptb-add-column-before',
				'title'            => __( 'Add Column Before Highlighted One', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'insertRowAfter',
			[
				'label'            => __( 'Insert Row After', 'wp_table_builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-single-action',
				'id'               => 'wptb-add-row-after',
				'title'            => __( 'Add Row After Highlighted One', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'insertRowBefore',
			[
				'label'            => __( 'Insert Row Before', 'wp_table_builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-single-action',
				'id'               => 'wptb-add-row-before',
				'title'            => __( 'Add Row Before Highlighted One', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'closeManageCellsModeBottom',
			[
				'label'            => __( 'Close', 'wp_table_builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-table-edit-mode-close',
				'title'            => __( 'Close Manage Cells Mode', 'wp-table-builder' )
			]
		);
	}
}
