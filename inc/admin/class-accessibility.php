<?php

namespace WP_Table_Builder\Inc\Admin;

// if called directly, abort
use WP_Table_Builder\Inc\Admin\Controls\Control_Section_Group_Collapse;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager;
use WP_Table_Builder\Inc\Admin\Views\Builder\Table_Element\Table_Setting_Element;
use function add_action;

if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Accessibility.
 *
 * Accessibility related options/controls.
 * @package WP_Table_Builder\Inc\Admin
 */
class Accessibility {

	/**
	 * Accessibility constructor.
	 */
	public function __construct() {
		$this->add_controls();
	}

	public function add_controls() {
		$accessibility_group_controls = [
			'accessibilityRoles' => [
				'label'        => esc_html__( 'Table Role', 'wp-table-builder' ),
				'type'         => Controls_Manager::SELECT2,
				'options'      => [
					'table'        => 'table',
					'presentation' => 'presentation',
					'list'         => 'list',
					'rowgroup'     => 'rowgroup',
				],
				'defaultValue' => 'table',
				'selectors'    => [
					[
						'query' => '{{{data.container}}}',
						'type'  => Controls_Manager::ATTRIBUTE,
						'key'   => 'role'
					]
				]
			]
		];

		Table_Setting_Element::add_settings_section( 'table_settings_accessibility', esc_html__( 'Accessibility', 'wp-table-builder' ), $accessibility_group_controls, 'universal-access', -1 );
	}
}
