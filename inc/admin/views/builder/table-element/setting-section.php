<?php

namespace WP_Table_Builder\Inc\Admin\Views\Builder\Table_Element;

use WP_Table_Builder\Inc\Admin\Controls\Control_Section_Group_Collapse;

/**
 * Table setting individual section component.
 */
class Setting_Section {
	/**
	 * Sort multiplier.
	 */
	const SORT_MULTIPLIER = 1000;

	/**
	 * Section id.
	 * @var string
	 */
	private $id;

	/**
	 * Section label.
	 * @var string
	 */
	private $label;

	/**
	 * Section control definitions.
	 * @var array
	 */
	private $controls;

	/**
	 * Icon for section wrapper.
	 * @var string
	 */
	private $icon;

	/**
	 * Section position in other settings menu sections.
	 * @var int
	 */
	private $order;

	/**
	 * Force position status.
	 * @var boolean
	 */
	private $force_position;

	/**
	 * @param string $id id
	 * @param string $label section label
	 * @param array $controls section control definitions
	 * @param string $icon section icon
	 * @param int | null $order section position order in 1 indexed list, null for register order
	 */
	public function __construct( $id, $label, $controls, $icon, $order = null ) {
		$this->id       = $id;
		$this->label    = $label;
		$this->controls = $controls;
		$this->icon     = $icon;
		$this->order    = $order;
	}

	/**
	 * Get section position.
	 * @return int|null position
	 */
	public function get_order() {
		return $this->order;
	}

	/**
	 * Sort sections.
	 *
	 * @param Setting_Section $section_a first section
	 * @param Setting_Section $section_b second section
	 *
	 * @return int result
	 */
	public static function sort( $section_a, $section_b ) {
		$a_order = $section_a->get_order();
		$b_order = $section_b->get_order();

		if ( $a_order === $b_order ) {
			return 0;
		}

		return $a_order < $b_order ? - 1 : 1;
	}

	/**
	 * Register section to menu.
	 *
	 * @param $context Table_Setting_Element
	 *
	 * @return void
	 */
	public function register( $context ) {
		Control_Section_Group_Collapse::add_section( $this->id, $this->label, $this->controls, [
			$context,
			'add_control'
		], false, $this->icon );
	}
}
