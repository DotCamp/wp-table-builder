<?php
namespace WP_Table_Builder\Inc\Admin\Base;
use WP_Table_Builder\Inc\Admin\Base\Controls_Stack;



// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}
/**
 * WP Table Builder element base.
 *
 * An abstract class that provides the needed properties and methods to
 * manage and handle elements.
 *
 * @since 1.1.2
 * @abstract
 */
abstract class Element_Base_Object extends Controls_Stack {

    /**
     * Include file with js script for element
     *
     * @since 1.1.2
     * @access protected
     */
    public function element_script() {
    }

    /**
     * Output element script.
     *
     * @since 1.1.2
     * @access public
     */
    public function output_scripts() {
        $directory_sctipt = $this->element_script();
        if ( $directory_sctipt && file_exists( $directory_sctipt ) ) {
            ?>
            <script type="text/javascript">
                WPTB_ElementsScriptsLauncher['<?php echo $this->get_name(); ?>'] = function (element) {
                    <?php include $directory_sctipt; ?>
                    <?php
                    $directory_script_pro = apply_filters( 'wp-table-builder/element-scripts-launcher/' . $this->get_name(), '' );
                    if( $directory_script_pro && file_exists( $directory_script_pro ) ) {
                        include $directory_script_pro;
                    }
                    ?>
                }
            </script>
            <?php
        }
    }
}