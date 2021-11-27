<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

// if called directly, abort.
use WP_Table_Builder\Inc\Admin\Base\Control_Group_Base;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager;
use WP_Table_Builder\Inc\Admin\Managers\Elements_Manager;

if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Control_Section_Group_Tabbed
 *
 * Adds a tabbed control grouping for the supplied controls
 */
class Control_Section_Group_Tabbed extends Control_Group_Base {

	/**
	 * Add tabbed control group to control manager instance.
	 *
	 * @param string $section_id section id to be used as id property of the first section element
	 * @param string $section_label title for section tabbed group
	 * @param array $section_controls controls array
	 * @param callable $control_call function to add the group controls to control manager instance
	 */
	public static function add_section( $section_id, $section_label, $section_controls, $control_call ) {
		$tab_labels = array_keys( $section_controls );

		// add first part of the tabbed content
		static::add_start( $section_label, $section_id, $tab_labels, $control_call );

		// add controls to related tabs
		foreach ( $section_controls as $tab => $controls ) {
			static::add_controls( $section_id, $tab, $controls, $control_call );
		}
	}

	/**
	 * Inject a control to an already registered tabbed section group.
	 *
	 * @param string $element_type table element type controls will be injected
	 * @param array $control controls that will be injected
	 * @param string $section_id section id
	 * @param string $tab_id tab id
	 * @param callable $control_call function to add controls to control manager instance
	 * @param object $element_instance element instance
	 * @param Elements_Manager $element_manager_main element manager main instance
	 * @param integer $position position to inject controls, negative integer to add last
	 */
	public static function inject_to_section( $element_type, $control, $section_id, $tab_id, $control_call, $element_instance, $element_manager_main, $position = - 1 ) {
		if ( $element_instance->get_name() === $element_type ) {
			foreach ( $control as $control_id => $control_options ) {
				call_user_func( $control_call, $control_id, $control_options );
			}

			$current_control_stack = $element_manager_main->element_control_stack();

			if ( isset( $current_control_stack[ $element_type ] ) ) {
				$element_control_stack = $current_control_stack[ $element_type ];

				$tab_start_id = array_reduce( array_keys( $element_control_stack ), function ( $carry, $control_id ) use ( $element_control_stack, $section_id, $tab_id ) {
					if ( filter_var( preg_match( '/^.+_tab_content_start$/', $control_id ), FILTER_VALIDATE_BOOLEAN ) ) {
						$tab_start_candidate = $element_control_stack[ $control_id ];

						if ( isset( $tab_start_candidate['groupId'] ) && isset( $tab_start_candidate['sectionId'] ) ) {
							if ( $tab_start_candidate['groupId'] === $tab_id && $tab_start_candidate['sectionId'] === $section_id ) {
								return $control_id;
							}
						}
					}

					return $carry;
				}, null );

				if ( ! is_null( $tab_start_id ) ) {
					// index of section tab start control inside element control stack
					$tab_start_index = array_search( $tab_start_id, array_keys( $element_control_stack ) );

					$tab_end_id = array_reduce( array_keys( $element_control_stack ), function ( $carry, $control_id ) use ( $element_control_stack, $section_id, $tab_id ) {
						if ( filter_var( preg_match( '/^.+_tab_content_end$/', $control_id ), FILTER_VALIDATE_BOOLEAN ) ) {
							$tab_end_candidate = $element_control_stack[ $control_id ];

							if ( isset( $tab_end_candidate['groupId'] ) && isset( $tab_end_candidate['sectionId'] ) ) {
								if ( $tab_end_candidate['groupId'] === $tab_id && $tab_end_candidate['sectionId'] === $section_id ) {
									return $control_id;
								}
							}
						}

						return $carry;
					}, null );

					if ( ! is_null( $tab_end_id ) ) {
						// index of section tab start control inside element control stack
						$tab_end_index = array_search( $tab_end_id, array_keys( $element_control_stack ) );

						// amount of controls in target tab
						$tab_length = $tab_end_index - $tab_start_index - 1;

						// these are the controls that will be injected into section tab
						$controls_to_reposition = array_splice( $element_control_stack, sizeof( $element_control_stack ) - sizeof( $control ) );

						$reposition_index = min( $position >= 0 ? $position : $tab_length, $tab_length ) + $tab_start_index + 1;

						$stack_head  = array_slice( $element_control_stack, 0, $reposition_index );
						$stack_tail  = array_slice( $element_control_stack, $reposition_index );
						$final_stack = array_merge( $stack_head, $controls_to_reposition, $stack_tail );

						$element_manager_main->set_element_control_stack( $element_type, $final_stack );
					}
				}
			}
		}
	}

	/**
	 * Add element controls to tab content
	 *
	 * @param string $section_id tab group id
	 * @param string $tab_id current tab id
	 * @param array $section_controls an array of element controls, keys for control id, values for control arguments
	 * @param callable $control_call function to add controls to control manager instance
	 */
	private static function add_controls( $section_id, $tab_id, $section_controls, $control_call ) {
		// start tab content start control
		call_user_func( $control_call, "${section_id}_${tab_id}_tab_content_start", [
			'type'      => Controls_Manager::SECTION_GROUP_TAB_CONTENT_START,
			'sectionId' => $section_id,
			'groupId'   => $tab_id,
		] );

		// add group controls
		static::control_batch_add( $section_controls, $control_call );

		// end tab content end control
		call_user_func( $control_call, "${section_id}_${tab_id}_tab_content_end", [
			'type'      => Controls_Manager::SECTION_GROUP_TAB_CONTENT_END,
			'sectionId' => $section_id,
			'groupId'   => $tab_id,
		] );
	}

	/**
	 * Add start part of tabbed section.
	 *
	 * @param string $section_label label for section start control
	 * @param string $section_id unique id for tabbed section
	 * @param array $tabs an array of tab labels
	 * @param callable $control_call function to add controls to control manager instance
	 */
	private static function add_start( $section_label, $section_id, $tabs, $control_call ) {
		call_user_func( $control_call, $section_id, [
			'type'      => Controls_Manager::SECTION_GROUP_TABBED_START,
			'label'     => $section_label,
			'sectionId' => $section_id,
			'tabs'      => $tabs
		] );
	}
}

