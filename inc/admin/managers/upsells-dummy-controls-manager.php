<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder\Inc\Admin\Base\Element_Base_Object;
use WP_Table_Builder\Inc\Admin\Base\Dummy_Control_Base;
use WP_Table_Builder\Inc\Admin\Base\Manager_Base;
use WP_Table_Builder\Inc\Admin\Controls\Control_Section_Group_Collapse;

/**
 * Manager responsible for dummy control operations.
 */
class Upsells_Dummy_Controls_Manager extends Manager_Base {

	/**
	 * Function to be called during initialization process.
	 */
	protected function init_process() {
		// add upsell pro controls
		add_action( 'wp-table-builder/elements_registered', [ __CLASS__, 'add_dummy_controls' ], 10, 1 );

		// add upsell table setting controls
		add_action( 'wp-table-builder/table_settings_registered', [
			static::get_instance(),
			'upsell_setting_controls'
		], 1, 1 );

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
	public static function upsell_setting_controls( $context ) {
		$sticky_controls = [
			'topRowSticky'      =>
				[
					'label'     => __( 'Make Top Row Sticky', 'wp_table_builder' ),
					'type'      => Controls_Manager::TOGGLE,
					'selectors' => [
					],
				],
			'firstColumnSticky' => [
				'label'     => esc_html__( 'Make First Column Sticky', 'wp-table-builder' ),
				'type'      => Controls_Manager::TOGGLE,
				'selectors' => [
				]
			],
			'spacingProOverlay' => [
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
	private static function get_dummy_control_instance( $name ) {
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
	public static function add_dummy_controls( $elements_manager ) {
		if ( ! Addon_Manager::check_pro_status() ) {
			$element_controls          = $elements_manager->get_element_objects();
			$registered_dummy_controls = static::get_instance()->get_class_options()['dummy_controls'];
			foreach ( $element_controls as $element ) {
				foreach ( $registered_dummy_controls as $control_name ) {
					$control_instance = static::get_dummy_control_instance( $control_name );

					if ( $control_instance instanceof Dummy_Control_Base ) {
						$control_instance->add_controls( $element );
					}
				}

			}
		}
	}
}
