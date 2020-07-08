<?php
namespace WP_Table_Builder\Inc\Admin\Base;
use WP_Table_Builder\Inc\Admin\Base\Base_Object;
use WP_Table_Builder\Inc\Core\Init as Init;
use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}


/**
 * WP Table Builder control stack.
 *
 * An abstract class that provides the needed properties and methods to
 * manage and handle controls.
 *
 * @since 1.1.2
 * @abstract
 */
abstract class Controls_Stack extends Base_Object {

    protected $defaultControlArgs = [
        'elementOptionsContainerOn' => 'true',
        'elementOptionContainerOn' => 'true',
        'elementOptionsGroupId' => 'element-options-group',
        'elementOptionClass' => 'wptb-element-option'
    ];
    
    /**
	 * Get stack.
	 *
	 * Returns the stack of controls.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return array Stack of controls.
	 */
	public function get_stack() {
		$stack = NS::init()->controls_manager->get_item_stack( $this );

		if ( null === $stack ) {
			$this->init_controls();

			return NS::init()->controls_manager->get_item_stack( $this );
		}

		return $stack;
	}
    
    /**
	 * Register controls.
	 *
	 * Used to add new controls group to stack
	 *
	 * @since 1.1.2
	 * @access protected
	 */
	protected function _register_controls() {}
    
    /**
	 * Initialize controls.
	 *
	 * Register the all controls added by `_register_controls()`.
	 *
	 * @since 1.1.2
	 * @access protected
	 */
	public function init_controls() {
		$this->_register_controls();
        do_action( 'wp-table-builder/register_controls/' . $this->get_name(), $this );
	}

    /**
     * Return default control args
     * @since 1.1.2
     * @access public
     *
     * @return array
     */
	public function getDefaultControlArgs() {
        return $this->defaultControlArgs;
    }

    /**
     * Change default control args
     *
     * @param $name
     * @param $value
     * @since 1.1.2
     * @access public
     *
     */
    public function setDefaultControlArg( $name, $value ) {
        $this->defaultControlArgs[$name] = $value;
    }

    /**
     * Add new control to stack.
     *
     * Register a single control to allow the user to set/update data.
     *
     * This method should be used inside `_register_controls()`.
     *
     * @param string $id Control ID.
     * @param array $args Control arguments.
     *
     * @param int $control_pos
     * @return bool True if control added, False otherwise.
     * @since 1.1.2
     * @access public
     *
     */
    
	public function add_control( $id, array $args, $control_pos = 0 ) {
	    $defaultControlArgs = $this->getDefaultControlArgs();
	    if( $defaultControlArgs && is_array( $defaultControlArgs ) ) {
	        $args = array_merge( $defaultControlArgs, $args );
        }
        return Init::instance()->controls_manager->add_control_to_stack( $this, $id, $args, $control_pos );
	}
}