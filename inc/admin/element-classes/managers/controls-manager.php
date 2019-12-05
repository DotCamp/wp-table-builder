<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Managers;
use WP_Table_Builder\Inc\Admin\Element_Classes\Controls\Base_Control as Base_Control;
use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Element_Base_Object as Element_Base_Object;

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
	 *  Change Element Attribute control.
	 */
	const CHANGE_ELEMENT_ATTRIBUTE = 'change_element_attribute';
    
    /**
	 *  Element Alignment control.
	 */
    const ELEMENT_ALIGNMENT = 'element_alignment';
    
    /**
	 *  Href control.
	 */
	const URL = 'url';
    
    /**
	 *  Adding user attribute control.
	 */
	const ADDING_USER_ATTR = 'adding_user_attr';
    
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
	 *  Adding select control.
	 */
	const SELECT = 'select';
    
    /**
	 *  Adding checkbox control.
	 */
	const CHECKBOX = 'checkbox';
    
    /**
	 *  Adding textarea control.
	 */
	const TEXTAREA = 'textarea';
    
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
            self::CHANGE_ELEMENT_ATTRIBUTE,
            self::ELEMENT_ALIGNMENT,
            self::URL,
            self::ADDING_USER_ATTR,
            self::TEXT,
            self::NUMBER,
            self::TOGGLE,
            self::SELECT,
            self::CHECKBOX,
            self::TEXTAREA
		];
	}
    
    /**
	 * Add control to stack.
	 *
	 * This method adds a new control to the stack.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @param Element_Base_Object $item      Item stack.
	 * @param string         $control_id   Control ID.
	 * @param array          $control_data Control data.
	 *
	 * @return bool True if control added, False otherwise.
	 */
	public function add_control_to_stack( Element_Base_Object $item, $control_id, $control_data ) {

		$control_data['name'] = $control_id;

		$control_type_instance = $this->get_control( $control_data['type'] );

		if ( ! $control_type_instance ) {
			_doing_it_wrong( sprintf( '%1$s::%2$s', __CLASS__, __FUNCTION__ ), sprintf( 'Control type "%s" not found.', $control_data['type'] ), '1.0.0' );
			return false;
		}

		$stack_id = $item->get_unique_name();

		if ( isset( $this->stacks[ $stack_id ][ $control_id ] ) ) {
			_doing_it_wrong( sprintf( '%1$s::%2$s', __CLASS__, __FUNCTION__ ), sprintf( 'Cannot redeclare control with same name "%s".', $control_id ), '1.0.0' );

			return false;
		}

		$this->stacks[ $stack_id ][ $control_id ] = $control_data;
        
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
			$class_name = '\WP_Table_Builder\Inc\Admin\Element_Classes\Controls\Control_' . $control_class_id;
            if( class_exists( $class_name ) ) {
                $this->register_control_object( $control_id, new $class_name() );
            }
		}
	}
    
    /**
	 * Register control object.
	 *
	 * This method adds a new control to the controls list. 
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @param string       $control_id       Control ID.
	 * @param Base_Control $control_instance Control instance, usually the
	 *                                       current instance.
	 */
	public function register_control_object( $control_id, Base_Control $control_instance ) {
		$this->controls[ $control_id ] = $control_instance;
	}
    
    
    /**
	 * Get controls.
	 *
	 * Returns the controls list from the current instance.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return Base_Control[] Controls list.
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
	 * @since 1.1.2
	 * @access public
	 *
	 * @param string $control_id Control ID.
	 *
	 * @return Base_Control Control instance, or False otherwise.
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
        if( ! is_null( $this->stacks ) && is_array( $this->stacks ) ) {
            foreach( $this->stacks as $key => $value ):
            ?>
            <script type="text/html" id="tmpl-wptb-<?php echo $key; ?>-control-stack">
                <?php echo json_encode( $value ); ?>
            </script>
            <?php
            endforeach;
        }
	}
}