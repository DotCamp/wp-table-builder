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
	 * Retrieve directory item icon.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Directory Item icon.
	 */
	abstract public function get_directory_icon();
    
    /**
	 * Get url icon.
	 *
	 * Return url icon.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Url Item icon.
	 */
	abstract public function get_url_icon();
    
    /**
	 * Include file with js script for element
	 *
	 * @since 1.1.2
	 * @access protected
	 */
    public function element_script() {}
    
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
        
		?>
		<script type="text/html" id="tmpl-wptb-<?php echo esc_attr( $this->get_name() ); ?>-content">
			<?php echo $template_content; ?>
		</script>
        
        <?php
	}
    
    /**
	 * Output element script.
	 *
	 * @since 1.1.2
	 * @access public
	 */
    public function output_scripts() {
        $directory_sctipt = $this->element_script();
        if( $directory_sctipt && file_exists( $directory_sctipt ) ) {
            ?>
            <script type="text/javascript">
                WPTB_ElementsScriptsLauncher['<?php echo $this->get_name(); ?>'] = function( element ) {
                    <?php include $directory_sctipt; ?>
                }
            </script>
            <?php
        }
    }
}