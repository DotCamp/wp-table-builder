<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use Table_Setting_Element;
use WP_Table_Builder\Inc\Admin\Base\Element_Base_Object;
use WP_Table_Builder\Inc\Admin\Base\Dummy_Control_Base;
use WP_Table_Builder\Inc\Admin\Base\Manager_Base;
use WP_Table_Builder\Inc\Admin\Controls\Control_Section_Group_Collapse;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager as Controls_Manager;

/**
 * Manager responsible for dummy control operations.
 */
class Upsells_Dummy_Controls_Manager extends Manager_Base {

	/**
	 * Function to be called during initialization process.
	 */
	protected function init_process() {
		// add upsell pro controls
		$this->add_element_controls();

		// add upsell table setting controls
		$this->add_settings_controls();

		// add upsell manage cells controls
		$this->add_manage_cells_controls();

		// add builder related data to frontend
		$this->add_builder_data();
	}

	/**
	 * Add manage cells controls related upsells.
	 * @return void
	 */
	private function add_manage_cells_controls() {
		add_action( 'wp-table-builder/register_controls/table_setting', [
			$this,
			'register_manage_cells_upsells'
		], 10, 1 );

		add_action( 'wp-table-builder/register_controls/table_cell_setting', [
			$this,
			'register_table_cell_settings_upsells'
		], 10, 1 );
	}

	/**
	 * Register table cell settings upsells
	 *
	 * @param Table_Setting_Element $cell_settings_main cell setting element instance
	 *
	 * @return void
	 */
	public function register_table_cell_settings_upsells( $cell_settings_main ) {
		$cell_settings_main->add_control(
			'emptyCellDummy',
			[
				'label'    => __( 'Empty Cell Enable', 'wp_table_builder' ),
				'labelOn'  => __( 'Fixed', 'wp_table_builder' ),
				'labelOff' => __( 'Auto', 'wp_table_builder' ),
				'type'     => Controls_Manager::TOGGLE
			]
		);

		$cell_settings_main->add_control(
			'emptyCellDummyUpsellOverlay',
			[
				'type'              => Controls_Manager::PRO_OVERLAY,
				'featureName'       => esc_html__( 'Empty Cell', 'wp-table-builder' ),
				'target'            => 'append',
				'appendTargetQuery' => '.wptb-settings-row[id$=emptyCellDummy]'
			]
		);
	}

	/**
	 * Register manage cells upsells.
	 *
	 * @param Table_Setting_Element $table_settings_main table setting element instance
	 *
	 * @return void
	 */
	public function register_manage_cells_upsells( $table_settings_main ) {
		$table_settings_main->setDefaultControlArg( 'elementOptionsGroupId', 'wptb-bar-top' );

		$table_settings_main->add_control(
			'duplicateColumnUpsell',
			[
				'label'            => __( 'Duplicate Column', 'wp_table_builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-single-action',
				'title'            => __( 'Duplicate Column', 'wp-table-builder' )
			],
			- 6
		);

		$table_settings_main->add_control(
			'duplicateRowUpsell',
			[
				'label'            => __( 'Duplicate Row', 'wp_table_builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-single-action',
				'title'            => __( 'Duplicate Row', 'wp-table-builder' )
			],
			- 6
		);

		$table_settings_main->add_control(
			'duplicateColumnUpsellProOverlay',
			[
				'type'              => Controls_Manager::PRO_OVERLAY,
				'featureName'       => esc_html__( 'Duplicate Column', 'wp-table-builder' ),
				'target'            => 'append',
				'appendTargetQuery' => '.wptb-table_change_button[class$=duplicateColumnUpsell]'
			]
		);

		$table_settings_main->add_control(
			'duplicateRowUpsellProOverlay',
			[
				'type'              => Controls_Manager::PRO_OVERLAY,
				'featureName'       => esc_html__( 'Duplicate Row', 'wp-table-builder' ),
				'target'            => 'append',
				'appendTargetQuery' => '.wptb-table_change_button[class$=duplicateRowUpsell]'
			]
		);
	}


	/**
	 * Add table settings related upsells.
	 * @return void
	 */
	private function add_settings_controls() {
		add_action( 'wp-table-builder/table_settings_registered', [
			$this,
			'upsell_setting_controls'
		], 1, 1 );

		add_filter( 'wp-table-builder/register-controls-section-group/table_settings_general', [
			$this,
			'table_settings_general_controls_upsells'
		], 10, 1 );

		add_filter( 'wp-table-builder/register-controls-section-group/table_settings_border', [
			$this,
			'table_settings_border_controls_upsells'
		], 10, 1 );
	}

	/**
	 * Add upsell controls for table settings border section.
	 *
	 * @param array $section_controls section controls
	 *
	 * @return array filtered section controls
	 */
	public function table_settings_border_controls_upsells( $section_controls ) {
		$general_section_upsell_controls = [
			'differentBorderColorsUpsell'        =>
				[
					'label'     => __( 'Different Border Colors', 'wp_table_builder' ),
					'type'      => Controls_Manager::TOGGLE,
					'selectors' => [
					]
				],
			'differentBorderColorsUpsellOverlay' =>
				[
					'type'              => Controls_Manager::PRO_OVERLAY,
					'featureName'       => esc_html__( 'Different Border Colors', 'wp-table-builder' ),
					'target'            => 'append',
					'appendTargetQuery' => '.wptb-settings-row[id$=differentBorderColorsUpsell]'
				],
			'differentBorderColorsWidgetUpsell'  =>
				[
					'label'     => __( 'Different Border Colors', 'wp_table_builder' ),
					'type'      => Controls_Manager::DIFFERENT_BORDER,
					'selectors' => [
					]
				],

			'differentBorderColorsWidgetUpsellOverlay' =>
				[
					'type'              => Controls_Manager::PRO_OVERLAY,
					'featureName'       => esc_html__( 'different border colors', 'wp-table-builder' ),
					'target'            => 'append',
					'appendTargetQuery' => 'div .wptb-settings-items [id$=differentBorderColorsWidgetUpsell]'
				],
			'columnBorderOnlyUpsell'                   =>
				[
					'label'     => __( 'Column Border Only', 'wp_table_builder' ),
					'type'      => Controls_Manager::TOGGLE,
					'selectors' => [
					]
				],
			'columnBorderOnlyOverlay'                  =>
				[
					'type'              => Controls_Manager::PRO_OVERLAY,
					'featureName'       => esc_html__( 'Column border only', 'wp-table-builder' ),
					'target'            => 'append',
					'appendTargetQuery' => '.wptb-settings-row[id$=columnBorderOnlyUpsell]'
				],

			'rowBorderOnlyUpsell'                 =>
				[
					'label'     => __( 'Row Border Only', 'wp_table_builder' ),
					'type'      => Controls_Manager::TOGGLE,
					'selectors' => [
					]
				],
			'rowBorderOnlyOverlay'                =>
				[
					'type'              => Controls_Manager::PRO_OVERLAY,
					'featureName'       => esc_html__( 'row border only', 'wp-table-builder' ),
					'target'            => 'append',
					'appendTargetQuery' => '.wptb-settings-row[id$=rowBorderOnlyUpsell]'
				],
			'tableCellsBorderRadiusUpsell'        =>
				[
					'label'        => __( 'Table Cells Border Radius', 'wp_table_builder' ),
					'type'         => Controls_Manager::RANGE,
					'selectors'    => [
					],
					'min'          => 0,
					'max'          => 50,
					'defaultValue' => 0,
					'postFix'      => 'px',
				],
			'tableCellsBorderRadiusUpsellOverlay' =>
				[
					'type'              => Controls_Manager::PRO_OVERLAY,
					'featureName'       => esc_html__( 'Table cells border radius', 'wp-table-builder' ),
					'target'            => 'append',
					'appendTargetQuery' => 'div .wptb-settings-items [id$=tableCellsBorderRadiusUpsell]'
				],
		];

		if ( $section_controls && is_array( $section_controls ) ) {
			$section_controls = array_merge( $section_controls, $general_section_upsell_controls );
		}

		return $section_controls;

	}

	/**
	 * Add upsell controls for table settings general section.
	 *
	 * @param array $section_controls section controls
	 *
	 * @return array filtered section controls
	 */
	public function table_settings_general_controls_upsells( $section_controls ) {
		$general_section_upsell_controls = [
			'separateColumnsRowsUpsell'           =>
				[
					'label'     => __( 'Separate Columns/Rows', 'wp_table_builder' ),
					'type'      => Controls_Manager::TOGGLE,
					'selectors' => [
					]
				],
			'separateColumnsRowsUpsellProOverlay' =>
				[
					'type'              => Controls_Manager::PRO_OVERLAY,
					'featureName'       => esc_html__( 'Seperate Columns/Rows', 'wp-table-builder' ),
					'target'            => 'append',
					'appendTargetQuery' => '.wptb-settings-row[id$=separateColumnsRowsUpsell]'
				]
		];

		if ( $section_controls && is_array( $section_controls ) ) {
			$section_controls = array_merge( $section_controls, $general_section_upsell_controls );
		}

		return $section_controls;

	}

	/**
	 * Add elements' controls related upsells.
	 * @return void
	 */
	private function add_element_controls() {
		add_action( 'wp-table-builder/elements_registered', [ $this, 'add_dummy_controls' ], 10, 1 );
	}

	/**
	 * Add builder related data to frontend.
	 * @return void
	 */
	private function add_builder_data() {
		Frontend_Data_Manager::add_builder_translations( [
			'proFeature'   => esc_html__( "Pro feature", 'wp-table-builder' ),
			'upgradeToPro' => __( 'Please get the <span class="upsell-pro-indicator">PRO</span> add-on to unlock all exclusive features.', 'wp-table-builder' ),
			'unlockNow'    => esc_html__( "unlock now", 'wp-table-builder' ),
			'useCode'      => __( "Limited time: Use code <code style='font-size: 120%'>WPTB10</code> to get a 10% discount.", 'wp-table-builder' ),
		] );

		Frontend_Data_Manager::add_builder_data( [
			'upsellUrl' => 'https://wptablebuilder.com/pricing/?utm_source=dashboard&utm_medium=elements-section&utm_campaign=wptb'
		], 'upsells', true );
	}


	/**
	 * Add pro setting controls for tables with upsell.
	 *
	 * @param Element_Base_Object $context element base object
	 *
	 * @return void
	 */
	public function upsell_setting_controls( $context ) {
		$sticky_controls = [
			'topRowStickyUpsell'      =>
				[
					'label'     => __( 'Make Top Row Sticky', 'wp_table_builder' ),
					'type'      => Controls_Manager::TOGGLE,
					'selectors' => [
					],
				],
			'firstColumnStickyUpsell' => [
				'label'     => esc_html__( 'Make First Column Sticky', 'wp-table-builder' ),
				'type'      => Controls_Manager::TOGGLE,
				'selectors' => [
				]
			],
			'spacingProOverlay'       => [
				'type'        => Controls_Manager::PRO_OVERLAY,
				'featureName' => esc_html__( 'Sticky', 'wp-table-builder' ),
			],
		];

		Control_Section_Group_Collapse::add_section( 'upsell_pro_table_settings_sticky', esc_html__( 'sticky', 'wp-table-builder' ), $sticky_controls, [
			$context,
			'add_control'
		], false, 'thumbtack' );

	}

	/**
	 * Get dummy control instance.
	 *
	 * @param string $name control name
	 *
	 * @return Dummy_Control_Base control instance
	 */
	private function get_dummy_control_instance( $name ) {
		$compatible_dummy_control_class_name = implode( '_', array_map( 'ucfirst', explode( '_', $name ) ) );

		$class_namespace = '\WP_Table_Builder\Inc\Admin\Controls\Dummy_Controls\\' . $compatible_dummy_control_class_name;

		return new $class_namespace();
	}

	/**
	 * Add dummy controls to elements.
	 *
	 * @param Elements_Manager $elements_manager elements manager instance
	 *
	 * @return void
	 */
	public function add_dummy_controls( $elements_manager ) {
		if ( ! Addon_Manager::check_pro_status() ) {
			$element_controls          = $elements_manager->get_element_objects();
			$registered_dummy_controls = $this->get_class_options()['dummy_controls'];
			foreach ( $element_controls as $element ) {
				foreach ( $registered_dummy_controls as $control_name ) {
					$control_instance = $this->get_dummy_control_instance( $control_name );

					if ( $control_instance instanceof Dummy_Control_Base ) {
						$control_instance->add_controls( $element );
					}
				}

			}
		}
	}
}
