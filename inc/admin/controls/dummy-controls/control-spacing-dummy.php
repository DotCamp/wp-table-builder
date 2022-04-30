<?php

namespace WP_Table_Builder\Inc\Admin\Controls\Dummy_Controls;

use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager;
use WP_Table_Builder\Inc\Admin\Base\Dummy_Control_Base;
use function esc_html__;

/**
 * Dummy control for pro spacing functionality.
 */
class Control_Spacing_Dummy extends Dummy_Control_Base {

	/**
	 * Get control name.
	 * @return string control name
	 */
	public function get_name() {
		return 'spacing';
	}

	/**
	 * Get dummy controls for collapsable control section group.
	 * @return array controls
	 */
	protected function get_section_controls() {
		return [
			'proControlPadding' => [
				'type'          => Controls_Manager::SIDES,
				'label'         => esc_html__( 'Padding', 'wp-table-builder' ),
				'selectors'     => [
				],
				'defaultValue'  => '0 0 0 0',
				'allowNegative' => false
			],
			'proControlMargin'  => [
				'type'          => Controls_Manager::SIDES,
				'label'         => esc_html__( 'Margin', 'wp-table-builder' ),
				'selectors'     => [
				],
				'defaultValue'  => '0 0 0 0',
				'allowNegative' => true
			],
			'spacingProOverlay' => [
				'type'        => Controls_Manager::PRO_OVERLAY,
				'featureName' => esc_html__( 'Spacing', 'wp-table-builder' ),
			],
		];
	}

	/**
	 * Control group label
	 * @return string label
	 */
	public function get_label() {
		return esc_html__( 'spacing', 'wp-table-builder' );
	}
}
