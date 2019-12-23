<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Base;
use WP_Table_Builder\Inc\Admin\Base\Controls_Stack;
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
abstract class Element_Base_Object extends Controls_Stack {
    
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