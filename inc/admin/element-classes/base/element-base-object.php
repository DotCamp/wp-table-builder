<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Base;
use WP_Table_Builder\Inc\Core\Init as Init;
use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}


/**
 * WP Table Builder element base.
 *
 * An abstract class to register new WP Table Builder elements. 
 *
 * This abstract class must be extended in order to register new elements.
 *
 * @since 1.1.2
 * @abstract
 */
abstract class Element_Base_Object {
    
    /**
	 * Get element name.
	 *
	 * Retrieve the element name.
	 *
	 * @since 1.1.2
	 * @access public
	 * @abstract
	 *
	 * @return string The name.
	 */
	abstract public function get_name();
    
    /**
	 * Get unique name.
	 *
	 * Some classes need to use unique names, this method allows you to create
	 * them. By default it returns the regular name.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Unique name.
	 */
	public function get_unique_name() {
		return $this->get_name();
	}
    
    /**
	 * Get element data.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string element data.
	 */
	public function get_item_data() {
		return '';
	}
    
    /**
	 * Get element title.
	 *
	 * Retrieve the item title.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Element title.
	 */
	public function get_title() {
		return '';
	}
    
    /**
	 * Get directory icon.
	 *
	 * Retrieve url item icon.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Url Item icon.
	 */
	public function get_directory_icon() {
        return '';
    }
    
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
	}
    
    /**
	 * Add new control to stack.
	 *
	 * Register a single control to allow the user to set/update data.
	 *
	 * This method should be used inside `_register_controls()`.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @param string $id      Control ID.
	 * @param array  $args    Control arguments.
	 *
	 * @return bool True if control added, False otherwise.
	 */
    
	public function add_control( $id, array $args ) {
        return Init::instance()->controls_manager->add_control_to_stack( $this, $id, $args );
	}
    
    /**
	 * Render item output in the editor.
	 *
	 * Used to generate the live preview, using a wp js template
	 *
	 * @since 1.1.2
	 * @access protected
	 */
	protected function _content_template() {}
    
    /**
	 * Render element script output in the editor.
	 *
	 * Used to generate the live preview, using a wp js template
	 *
	 * @since 1.1.2
	 * @access protected
	 */
	protected function _element_script() {}

    /**
	 * Output element template and script.
	 *
	 * Used to generate the element template on the editor.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function output_template() {
		ob_start();

		$this->_content_template();

		$template_content = ob_get_clean();

		if ( empty( $template_content ) ) {
			return;
		}
        
        ob_start();
        
        $this->_element_script();
        
        $item_script = ob_get_clean();
        
		?>
		<script type="text/html" id="tmpl-wptb-<?php echo esc_attr( $this->get_name() ); ?>-content">
			<?php echo $template_content; ?>
		</script>
		<?php
        if( ! empty( $item_script ) ) {
        ?>
        <script type="text/html" id="tmpl-wptb-<?php echo esc_attr( $this->get_name() ); ?>-script">
            <?php echo $item_script; ?>
        </script>
        <?php
        }
	}
}