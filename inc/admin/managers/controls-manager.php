<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder\Inc\Admin\Controls\Base_Control as Base_Control;
use WP_Table_Builder\Inc\Admin\Base\Controls_Stack as Controls_Stack;
use function apply_filters;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder Controls Manager.
 *
 * WP Table Builder control manager handler class is responsible for registering and
 * initializing all the supported controls.
 *
 * @since 1.1.2
 */
class Controls_Manager {

	/**
	 * Size control.
	 */
	const SIZE = 'size';

	/**
	 * Color control.
	 */
	const COLOR = 'color';

	/**
	 *  Section Header control.
	 */
	const SECTION_HEADER = 'section_header';

	/**
	 *  Change Attribute control.
	 */
	const CHANGE_ATTRIBUTE = 'change_attribute';

	/**
	 *  Alignment control.
	 */
	const ALIGNMENT = 'alignment';

	/**
	 *  Href control.
	 */
	const URL = 'url';

	/**
	 *  Adding text control.
	 */
	const TEXT = 'text';

	/**
	 *  Adding number control.
	 */
	const NUMBER = 'number';

	/**
	 *  Adding on toggle control.
	 */
	const TOGGLE = 'toggle';

	/**
	 *  Adding on toggle2 control.
	 */
	const TOGGLE2 = 'toggle2';

	/**
	 *  Adding on toggle3 control.
	 */
	const TOGGLE3 = 'toggle3';

	/**
	 *  Adding select control.
	 */
	const SELECT = 'select';

	/**
	 *  Adding select control.
	 */
	const SELECT2 = 'select2';

	/**
	 *  Adding checkbox control.
	 */
	const CHECKBOX = 'checkbox';

	/**
	 *  Adding textarea control.
	 */
	const TEXTAREA = 'textarea';
	/**
	 *  Adding button control.
	 */
	const BUTTON = 'button';

	/**
	 *  Adding button2 control
	 */
	const BUTTON2 = 'button2';

	/**
	 * Adding start of collapsible section group control.
	 */
	const SECTION_GROUP_COLLAPSE_START = 'section_group_collapse_start';

	/**
	 * Adding end of collapsible section group control.
	 */
	const SECTION_GROUP_COLLAPSE_END = 'section_group_collapse_end';

	/**
	 * Adding start of tabbed section group control.
	 */
	const SECTION_GROUP_TABBED_START = 'section_group_tabbed_start';

	/**
	 * Adding start of tab group content.
	 */
	const SECTION_GROUP_TAB_CONTENT_START = 'section_group_tab_content_start';

	/**
	 * Adding end of tab group content.
	 */
	const SECTION_GROUP_TAB_CONTENT_END = 'section_group_tab_content_end';

	/**
	 * Adding icon selection control.
	 */
	const ICON_SELECT = 'icon_select';

	/**
	 * Adding range control.
	 */
	const RANGE = 'range';

	/**
	 * Adding media select control.
	 */
	const MEDIA = 'media_select';

	/**
	 * Adding html output control.
	 */
	const HTML_OUTPUT = 'html_output';

	/**
	 * Adding html output control.
	 */
	const DATA_MULE = 'data_mule';

	/**
	 * Adding sides control.
	 */
	const SIDES = 'sides';

	/**
	 * Adding named toggle control.
	 */
	const NAMED_TOGGLE = 'named_toggle';

	/**
	 * Adding tag control.
	 */
	const TAG_CONTROL = 'tag_control';

	/**
	 * Adding different border control.
	 */
	const DIFFERENT_BORDER = 'different_border';

	/**
	 * Upgraded size control.
	 */
	const SIZE2 = 'size2';

	/**
	 * Adding local development files.
	 */
	const LOCAL_DEV = 'local_dev_file';

	/**
	 * Adding extra styles control.
	 */
	const EXTRA_STYLES = 'extra_styles';

	/**
	 * Adding multiple checkbox control.
	 */
	const MULTI_CHECKBOX = 'multi_checkbox';

	/**
	 * Adding improved alignment control.
	 */
	const ALIGNMENT2 = 'alignment2';

	/**
	 * Adding color palette controls.
	 */
	const COLOR_PALETTE = 'color_palette';

	/**
	 * Adding pro overlay controls.
	 */
	const PRO_OVERLAY = 'pro_overlay';

	// Control elements query types
	const CLASSTYPE = 'class';
	const DATASET = 'dataset';
	const STYLE = 'style';
	const ATTRIBUTE = 'attribute';

	/**
	 * Controls.
	 *
	 * Holds the list of all the controls. Default is `null`.
	 *
	 * @since 1.1.2
	 * @access private
	 *
	 * @var Base_Control[]
	 */
	private $controls = null;

	/**
	 * Control stacks.
	 *
	 * Holds the list of all the control stacks. Default is `null`.
	 *
	 * @since 1.1.2
	 * @access private
	 *
	 * @var array
	 */
	private $stacks = null;

	public static function get_controls_names() {
		return [
			self::COLOR,
			self::SIZE,
			self::SECTION_HEADER,
			self::CHANGE_ATTRIBUTE,
			self::ALIGNMENT,
			self::URL,
			self::TEXT,
			self::NUMBER,
			self::TOGGLE,
			self::TOGGLE2,
			self::TOGGLE3,
			self::SELECT,
			self::SELECT2,
			self::CHECKBOX,
			self::TEXTAREA,
			self::BUTTON,
			self::BUTTON2,
			self::SECTION_GROUP_COLLAPSE_START,
			self::SECTION_GROUP_COLLAPSE_END,
			self::SECTION_GROUP_TABBED_START,
			self::SECTION_GROUP_TAB_CONTENT_START,
			self::SECTION_GROUP_TAB_CONTENT_END,
			self::ICON_SELECT,
			self::RANGE,
			self::DATA_MULE,
			self::MEDIA,
			self::HTML_OUTPUT,
			self::SIDES,
			self::NAMED_TOGGLE,
			self::TAG_CONTROL,
			self::DIFFERENT_BORDER,
			self::LOCAL_DEV,
			self::EXTRA_STYLES,
			self::MULTI_CHECKBOX,
			self::SIZE2,
			self::ALIGNMENT2,
			self::COLOR_PALETTE,
			self::PRO_OVERLAY,
		];
	}

	/**
	 * Add control to stack.
	 *
	 * This method adds a new control to the stack.
	 *
	 * @param Controls_Stack $element
	 * @param string $control_id Control ID.
	 * @param array $control_data Control data.
	 *
	 * @param int $control_pos
	 *
	 * @return bool True if control added, False otherwise.
	 * @since 1.1.2
	 * @access public
	 */
	public function add_control_to_stack( Controls_Stack $element, $control_id, $control_data, $control_pos ) {

		$control_data['name'] = $control_id;

		$control_type_instance = $this->get_control( $control_data['type'] );

		if ( ! $control_type_instance ) {
			_doing_it_wrong( sprintf( '%1$s::%2$s', __CLASS__, __FUNCTION__ ), sprintf( 'Control type "%s" not found.', $control_data['type'] ), '1.0.0' );

			return false;
		}

		$stack_id = $element->get_unique_name();

		if ( isset( $this->stacks[ $stack_id ][ $control_id ] ) ) {
			_doing_it_wrong( sprintf( '%1$s::%2$s', __CLASS__, __FUNCTION__ ), sprintf( 'Cannot redeclare control with same name "%s".', $control_id ), '1.0.0' );

			return false;
		}

		if ( $control_pos && ( int ) $control_pos && abs( ( int ) $control_pos ) > 0 ) {
			$control_pos = ( int ) $control_pos;
			if ( $control_pos > 0 ) {
				if ( is_array( $this->stacks[ $stack_id ] ) && count( $this->stacks[ $stack_id ] ) > $control_pos ) {
					$a        = array();
					$arr_keys = array_keys( $this->stacks[ $stack_id ] );

					for ( $i = 0; $i < $control_pos; $i ++ ) {
						$first_key  = array_shift( $arr_keys );
						$first_elem = $this->stacks[ $stack_id ][ $first_key ];
						unset( $this->stacks[ $stack_id ][ $first_key ] );
						$a[ $first_key ] = $first_elem;
					}
					$b                         = array( $control_id => $control_data );
					$ab                        = array_merge( $a, $b );
					$this->stacks[ $stack_id ] = array_merge( $ab, $this->stacks[ $stack_id ] );
				}
			} else if ( $control_pos < 0 ) {
				$control_pos = abs( $control_pos );
				if ( is_array( $this->stacks[ $stack_id ] ) && count( $this->stacks[ $stack_id ] ) > $control_pos ) {
					$a        = array();
					$arr_keys = array_keys( $this->stacks[ $stack_id ] );
					for ( $i = 0; $i < $control_pos; $i ++ ) {
						$last_key  = array_pop( $arr_keys );
						$last_elem = $this->stacks[ $stack_id ][ $last_key ];
						unset( $this->stacks[ $stack_id ][ $last_key ] );
						$a[ $last_key ] = $last_elem;
					}
					$a                                        = array_reverse( $a );
					$this->stacks[ $stack_id ][ $control_id ] = $control_data;
					$this->stacks[ $stack_id ]                = array_merge( $this->stacks[ $stack_id ], $a );
				}
			}
		} else {
			$this->stacks[ $stack_id ][ $control_id ] = $control_data;
		}

		return true;
	}

	/**
	 * Register controls.
	 *
	 * This method creates a list of all the supported controls by requiring the
	 * control files and initializing each one of them.
	 *
	 * The list of supported controls includes the regular controls
	 *
	 * @since 1.1.2
	 * @access private
	 */
	private function register_controls() {
		$this->controls = [];

		foreach ( self::get_controls_names() as $control_id ) {
			$control_class_id = str_replace( ' ', '_', ucwords( str_replace( '_', ' ', $control_id ) ) );
			$class_name       = '\WP_Table_Builder\Inc\Admin\Controls\Control_' . $control_class_id;
			if ( class_exists( $class_name ) && $class_name::register_evaluation() ) {
				$this->register_control_object( $control_id, new $class_name() );
			}
		}
	}

	/**
	 * Register control object.
	 *
	 * This method adds a new control to the controls list.
	 *
	 * @param string $control_id Control ID.
	 * @param Base_Control $control_instance Control instance, usually the
	 *                                       current instance.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 */
	public function register_control_object( $control_id, Base_Control $control_instance ) {
		$this->controls[ $control_id ] = $control_instance;
	}


	/**
	 * Get controls.
	 *
	 * Returns the controls list from the current instance.
	 *
	 * @return Base_Control[] Controls list.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	public function get_controls() {
		if ( null === $this->controls ) {
			$this->register_controls();
		}

		return $this->controls;
	}

	/**
	 * Get control.
	 *
	 * Returns a specific control from the current controls instance.
	 *
	 * @param string $control_id Control ID.
	 *
	 * @return Base_Control Control instance, or False otherwise.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	public function get_control( $control_id ) {
		$controls = $this->get_controls();

		return isset( $controls[ $control_id ] ) ? $controls[ $control_id ] : false;
	}

	/**
	 * Render controls.
	 *
	 * Generate the final HTML for all the registered controls using the element
	 * template.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function output_controls_templates() {
		foreach ( $this->get_controls() as $control ) {
			$control->output_template();
		}
	}

	/**
	 * Render element content js templates.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function output_control_stacks() {
		if ( ! is_null( $this->stacks ) && is_array( $this->stacks ) ) {
			foreach ( $this->stacks as $key => $value ):
				$final_value = apply_filters( 'wp-table-builder/filter/output_control_stacks_shortcircuit', $value );
				?>
                <script type="text/html" id="tmpl-wptb-<?php echo $key; ?>-control-stack">
					<?php echo json_encode( $final_value ); ?>
                </script>
			<?php
			endforeach;
		}
	}

	/**
	 * Get currently registered controls.
	 * @return array|null current controls in stack
	 */
	public function get_current_control_stack() {
		return $this->stacks;
	}

	/**
	 * Set control stack for given element type.
	 *
	 * @param string $element_type table element type
	 * @param array $control_stack element control stack array
	 */
	public function set_element_stack( $element_type, $control_stack ) {
		if ( isset( $this->stacks[ $element_type ] ) ) {
			$this->stacks[ $element_type ] = $control_stack;
		}
	}
}
