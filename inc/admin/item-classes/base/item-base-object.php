<?php
namespace WP_Table_Builder\Inc\Admin\Item_Classes\Base;
use WP_Table_Builder\Inc\Core\Init as Init;
use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}


/**
 * WP Table Builder item base.
 *
 * An abstract class to register new WP Table Builder items. 
 *
 * This abstract class must be extended in order to register new items.
 *
 * @since 1.0.0
 * @abstract
 */
abstract class Item_Base_Object {
    
    /**
	 * Get item name.
	 *
	 * Retrieve the item name.
	 *
	 * @since 1.4.0
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
	 * them. By default it retrieves the regular name.
	 *
	 * @since 1.6.0
	 * @access public
	 *
	 * @return string Unique name.
	 */
	public function get_unique_name() {
		return $this->get_name();
	}
    
    /**
	 * Get item data.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string element data.
	 */
	public function get_item_data() {
		return '';
	}
    
    /**
	 * Get item title.
	 *
	 * Retrieve the item title.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Item title.
	 */
	public function get_title() {
		return '';
	}
    
    /**
	 * Get directory icon.
	 *
	 * Retrieve url item icon.
	 *
	 * @since 1.0.0
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
	 * Retrieve the stack of controls.
	 *
	 * @since 1.9.2
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
	 * @since 1.4.0
	 * @access protected
	 */
	protected function _register_controls() {}
    
    /**
	 * Initialize controls.
	 *
	 * Register the all controls added by `_register_controls()`.
	 *
	 * @since 2.0.0
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
	 * @since 1.4.0
	 * @access public
	 *
	 * @param string $id      Control ID.
	 * @param array  $args    Control arguments.
	 * @param array  $options Optional. Control options. Default is an empty array.
	 *
	 * @return bool True if control added, False otherwise.
	 */
    
	public function add_control( $id, array $args ) {
        Init::instance()->controls_manager->add_control_to_stack( $this, $id, $args );
	}
    
    /**
	 * Render item output in the editor.
	 *
	 * Used to generate the live preview, using a wp js template
	 *
	 * @since 2.0.0
	 * @access protected
	 */
	protected function _content_template() {}
    
    /**
	 * Render item script output in the editor.
	 *
	 * Used to generate the live preview, using a wp js template
	 *
	 * @since 2.0.0
	 * @access protected
	 */
	protected function _item_script() {}

    /**
	 * Output item template and script.
	 *
	 * Used to generate the item template on the editor.
	 *
	 * @since 2.0.0
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
        
        $this->_item_script();
        
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