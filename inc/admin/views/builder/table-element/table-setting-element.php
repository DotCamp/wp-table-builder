<?php

namespace WP_Table_Builder\Inc\Admin\Views\Builder\Table_Element;

use WP_Table_Builder\Inc\Admin\Base\Element_Base_Object as Element_Base_Object;
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
	 * Registered sections for settings menu.
	 * @var Setting_Section[]
	 */
	private static $registered_settings_sections = [];

	/**
	 * Class constructor.
	 */
	public function __construct() {
		$this->register_scroll_controls();
		$this->register_border_controls();
		$this->register_general_controls();
		$this->register_help_controls();
	}


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
	 * Add a control section to builder settings menu.
	 *
	 * @param string $section_id section id
	 * @param string $section_label label
	 * @param array $section_controls section controls
	 * @param string $icon section icon
	 * @param null | int $order section position order in a 1 indexed list, null for register order
	 * @param boolean $internal_register whether to register section with the defaults one in setting element
	 *
	 * @return void
	 */
	public static function add_settings_section( $section_id, $section_label, $section_controls, $icon, $order = null, $internal_register = false ) {
		$setting_section = new Setting_Section( $section_id, $section_label, $section_controls, $icon, $order );

		if ( $internal_register ) {
			array_unshift( static::$registered_settings_sections, $setting_section );
		} else {
			static::$registered_settings_sections[] = $setting_section;
		}
	}

	/**
	 * Register general related controls.
	 * @return void
	 */
	private function register_general_controls() {
		$general_section_group_controls = [
			'tableCellPadding'            =>
				[
					'label'        => __( 'Cell Padding', 'wp-table-builder' ),
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
					'label'     => __( 'Table Alignment', 'wp-table-builder' ),
					'type'      => Controls_Manager::ALIGNMENT,
					'selected'  => 1,
					'selectors' => [
						'{{{data.container}}}' => 'data-wptb-table-alignment',
					]
				],
			'applyTableContainerMaxWidth' =>
				[
					'label'     => __( 'Table Container Max Width', 'wp-table-builder' ),
					'type'      => Controls_Manager::TOGGLE,
					'selectors' => [
						'{{{data.container}}}' => [ 'data-wptb-apply-table-container-max-width', '1', null ]
					],
				],
			'tableContainerMaxWidth'      =>
				[
					'label'                 => __( 'Table Container Max Width', 'wp-table-builder' ),
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
					'label'        => __( 'Table Cell Min Auto Width', 'wp-table-builder' ),
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
					'label'     => __( 'Sortable Table Vertically', 'wp-table-builder' ),
					'type'      => Controls_Manager::TOGGLE,
					'selectors' => [
						'{{{data.container}}}' => [ 'data-wptb-sortable-table-vertical', '1', null ]
					]
				],
			'tableSortableHorizontal' =>
				[
					'label'     => __( 'Sortable Table Horizontally', 'wp-table-builder' ),
					'type'      => Controls_Manager::TOGGLE,
					'selectors' => [
						'{{{data.container}}}' => [ 'data-wptb-sortable-table-horizontal', '1', null ]
					]
				]
		];

		static::add_settings_section( 'table_settings_general', esc_html__( 'general', 'wp-table-builder' ), $general_section_group_controls, 'sliders-h', 1 );
	}

	/**
	 * Register border related controls
	 * @return void
	 */
	private function register_border_controls() {
		$border_section_group_controls = [

			'tableBorder' =>
				[
					'label'        => __( 'Table Border', 'wp-table-builder' ),
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
					'label'     => __( 'BorderColor', 'wp-table-builder' ),
					'type'      => Controls_Manager::COLOR,
					'selectors' => [
						'{{{data.container}}} td' => [ 'border-color' ],
						'{{{data.container}}}'    => [ 'border-color' ]
					]
				],
			'applyInnerBorder'     =>
				[
					'label'     => __( 'Apply Inner Border', 'wp-table-builder' ),
					'type'      => Controls_Manager::TOGGLE,
					'selectors' => [
						'{{{data.container}}} td' => [ 'border-style', 'solid', 'none' ],
					],
					'checked'   => true
				],
			'headerInnerBorder'    =>
				[
					'label'                 => __( 'Header Inner Border', 'wp-table-builder' ),
					'type'                  => Controls_Manager::TOGGLE,
					'selectors'             => [
						'{{{data.container}}} tr:first-child td' => [ 'border-style', 'solid', 'none' ],
					],
					'checked'               => true,
					'appearDependOnControl' => [ 'applyInnerBorder', [ 'checked' ], [ 'unchecked' ] ]
				],
			'tableInnerBorderSize' =>
				[
					'label'                 => __( 'Inner Border Size', 'wp-table-builder' ),
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

		// border section group
		static::add_settings_section( 'table_settings_border', esc_html__( 'border', 'wp-table-builder' ), $border_section_group_controls, 'border-style', null, true );

	}

	/**
	 * Register scroll related controls.
	 * @return void
	 */
	private function register_scroll_controls() {
		$scroll_section_group_controls = [
			'horizontalScrollEnable' => [
				'label'        => esc_html__( 'Enable horizontal scrolling', 'wp-table-builder' ),
				'type'         => Controls_Manager::TOGGLE3,
				'selectors'    => [
					[
						'query' => '{{{data.container}}}',
						'type'  => Controls_Manager::DATASET,
						'key'   => 'wptbHorizontalScrollStatus'
					]
				],
				'defaultValue' => false
			]

		];

		// scroll section group
		static::add_settings_section( 'table_settings_scroll', esc_html__( 'Scroll', 'wp-table-builder' ), $scroll_section_group_controls, 'arrows-alt-h', null, true );
	}

	/**
	 * Register help related controls.
	 * @return void
	 */
	private function register_help_controls() {
		$help_support_section_group_controls = [
			'helpSupportLinks' => [
				'label' => 'test',
				'type'  => Controls_Manager::HTML_OUTPUT,
				'html'  => sprintf( '<div class="wptb-help-support-section-wrapper"><div><a href="https://wptablebuilder.com/" target="_blank">%s</a></div><div><a href="https://wptablebuilder.com/docs/" target="_blank">%s</a></div><div><a href="https://www.facebook.com/groups/wptbplugin/" target="_blank">%s</a></div></div>', esc_html__( 'Our Website', 'wp-table-builder' ), esc_html__( 'Documentation', 'wp-table-builder' ), esc_html__( 'Facebook Group', 'wp-table-builder' ) )
			]
		];

		// help&support section group
		static::add_settings_section( 'table_settings_help_support', esc_html__( 'help & support', 'wp-table-builder' ), $help_support_section_group_controls, 'info-circle', - 1 );
	}

	/**
	 * Sort registered sections by positions.
	 *
	 * @return void
	 */
	private function sort_sections() {
		$position_free_sections = array_values( array_filter( static::$registered_settings_sections, function ( $section ) {
			return is_null( $section->get_order() );
		} ) );

		$position_explicit_sections = array_values( array_filter( static::$registered_settings_sections, function ( $section ) {
			return ! is_null( $section->get_order() );
		} ) );

		usort( $position_explicit_sections, [ Setting_Section::class, 'sort' ] );

		foreach ( $position_explicit_sections as $section ) {
			$section_order = $section->get_order() - 1;

			if ( $section_order < 0 ) {
				$position_free_sections[] = $section;
			} else {
				array_splice( $position_free_sections, $section_order, 0, [ $section ] );
			}
		}

		static::$registered_settings_sections = $position_free_sections;
	}

	/**
	 * Register all available menu sections related to table settings
	 * @return void
	 */
	private function register_settings_sections() {
		// pre table settings registered action hook
		do_action( 'wp-table-builder/pre_table_settings_registered', $this );

		// sort sections based on their assigned positions
		$this->sort_sections();

		foreach ( static::$registered_settings_sections as $section ) {
			$section->register( $this );
		}
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

		$this->register_settings_sections();

		$this->setDefaultControlArg( 'elementOptionsGroupId', 'wptb-bar-top' );
		$this->setDefaultControlArg( 'elementOptionsContainerOn', 'false' );
		$this->setDefaultControlArg( 'elementOptionContainerOn', 'false' );

		$this->add_control(
			'addLeftColumn',
			[
				'label'            => __( 'Add Left Column', 'wp-table-builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-no-cell-action visible',
				'id'               => 'wptb-add-start-column',
				'title'            => __( 'Add Column to the Start', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'addRightColumn',
			[
				'label'            => __( 'Add Right Column', 'wp-table-builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-no-cell-action visible',
				'id'               => 'wptb-add-end-column',
				'title'            => __( 'Add Column to the End', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'addTopRow',
			[
				'label'            => __( 'Add Top Row', 'wp-table-builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-no-cell-action visible',
				'id'               => 'wptb-add-start-row',
				'title'            => __( 'Add Row to the Start', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'addBottomRow',
			[
				'label'            => __( 'Add Bottom Row', 'wp-table-builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-no-cell-action visible',
				'id'               => 'wptb-add-end-row',
				'title'            => __( 'Add Row to the End', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'mergeSelectedCells',
			[
				'label'            => __( 'Merge', 'wp-table-builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-multiple-select-action',
				'id'               => 'wptb-merge-cells',
				'title'            => __( 'Merge Selected Cells', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'splitSelectedSell',
			[
				'label'            => __( 'Split', 'wp-table-builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-single-action',
				'id'               => 'wptb-split-cell',
				'title'            => __( 'Unmerge Selected Cell', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'deleteHighlightedColumn',
			[
				'label'            => __( 'Remove Column', 'wp-table-builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-single-action',
				'id'               => 'wptb-delete-column',
				'title'            => __( 'Delete Highlighted Column', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'deleteHighlightedRow',
			[
				'label'            => __( 'Remove Row', 'wp-table-builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-single-action',
				'id'               => 'wptb-delete-row',
				'title'            => __( 'Delete Highlighted Row', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'closeManageCellsModeTop',
			[
				'label'            => __( 'Close', 'wp-table-builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-table-edit-mode-close',
				'title'            => __( 'Close Manage Cells Mode', 'wp-table-builder' )
			]
		);

		$this->setDefaultControlArg( 'elementOptionsGroupId', 'wptb-bar-bottom' );

		$this->add_control(
			'insertColumnAfter',
			[
				'label'            => __( 'Insert Column After', 'wp-table-builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-single-action',
				'id'               => 'wptb-add-column-after',
				'title'            => __( 'Add Column After Highlighted One', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'insertColumnBefore',
			[
				'label'            => __( 'Insert Column Before', 'wp-table-builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-single-action',
				'id'               => 'wptb-add-column-before',
				'title'            => __( 'Add Column Before Highlighted One', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'insertRowAfter',
			[
				'label'            => __( 'Insert Row After', 'wp-table-builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-single-action',
				'id'               => 'wptb-add-row-after',
				'title'            => __( 'Add Row After Highlighted One', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'insertRowBefore',
			[
				'label'            => __( 'Insert Row Before', 'wp-table-builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-single-action',
				'id'               => 'wptb-add-row-before',
				'title'            => __( 'Add Row Before Highlighted One', 'wp-table-builder' )
			]
		);

		$this->add_control(
			'closeManageCellsModeBottom',
			[
				'label'            => __( 'Close', 'wp-table-builder' ),
				'type'             => Controls_Manager::BUTTON2,
				'additionsClasses' => 'wptb-table_change_button wptb-table-edit-mode-close',
				'title'            => __( 'Close Manage Cells Mode', 'wp-table-builder' )
			]
		);
	}
}
