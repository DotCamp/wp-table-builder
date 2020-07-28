<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

// if called directly, abort.
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager;

if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Control_Section_Group_Tabbed
 *
 * Adds a tabbed control grouping for the supplied controls
 */
class Control_Section_Group_Tabbed {

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
		foreach ($section_controls as $tab => $controls){
			static::add_controls($section_id, $tab , $controls , $control_call);
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
		foreach($section_controls as $control_id => $control_options){
            $control_pos = 0;
            if( is_array( $control_options ) ) {
                if( array_key_exists( 'control_pos', $control_options ) ) {
                    $control_pos = $control_options['control_pos'];
                }
                if( array_key_exists( 'control_args', $control_options ) ) {
                    $control_options = $control_options['control_args'];
                }
            }
			call_user_func($control_call , $control_id , $control_options, $control_pos);
		}

		// end tab content end control
		call_user_func($control_call, "${section_id}_${tab_id}_tab_content_end", [
			'type'=> Controls_Manager::SECTION_GROUP_TAB_CONTENT_END,
			'sectionId' => $section_id,
			'groupId' => $tab_id,
		]);
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

