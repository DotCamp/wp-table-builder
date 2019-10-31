<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Element_Base_Object as Element_Base_Object;
use WP_Table_Builder\Inc\Admin\Element_Classes\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Text_Element extends Element_Base_Object {
    
    /**
	 * Get element name.
	 *
	 * Retrieve text editor element name.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string element name.
	 */
	public function get_name() {
		return 'text';
	}
    
    /**
	 * Get element data.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string element data.
	 */
	public function get_element_data() {
		return esc_attr( 'text', 'wp-table-builder' );
	}

	/**
	 * Get element title.
	 *
	 * Retrieve text editor element title.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Element title.
	 */
	public function get_title() {
		return esc_html_e( 'Text', 'wp-table-builder' );
	}

	/**
	 * Get directory icon.
	 *
	 * Retrieve url text editor element icon.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Url Element icon.
	 */
	public function get_directory_icon() {
		return NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/text.php'; ;
	}
    
    /**
	 * Register the element controls.
	 *
	 * Adds different fields to allow the user to change and customize the element settings.
	 *
	 * @since 1.1.2
	 *
	 * @access protected
	 */
	protected function _register_controls() {
		$this->add_control(
			'section_header',
			[
				'label' => __( 'Text Options', 'wp_table_builder' ),
				'type' => Controls_Manager::SECTION_HEADER,
			]
		);

		$this->add_control(
			'color',
			[
				'label' => __( 'Font Color', 'wp_table_builder' ),
				'type' => Controls_Manager::COLOR,
                'selectors' => [
                    '{{{data.container}}}' => 'color',
                ]
			]
		);
        
		$this->add_control(
			'size',
			[
				'label' => __( 'Font Size', 'wp_table_builder' ),
				'type' => Controls_Manager::SIZE,
                'selectors' => [
                    '{{{data.container}}}' => 'fontSize',
                ],
                'min' => 10, 
                'max' => 50,
                'defaultValue' => 15,
                'dimension' => 'px'
			]
		);
	}
    
    /**
	 * Render text editor element output in the editor.
	 *
	 * Written as a wp js template and used to generate the live preview.
	 *
	 * @since 1.1.2
	 * @access protected
	 */
	protected function _content_template() {
		?>
        <div><p>Text</p></div>
		<?php
	}
    
    /**
	 * Render element script output in the editor.
	 *
	 * Used to generate the live preview, using a wp js template
	 *
	 * @since 1.1.2
	 * @access protected
	 */
    protected function _element_script() {
        ?>
        ( function() {
            let element = document.getElementsByClassName( '{{{data.elemClass}}}' );
            if( element.length > 0 ) {
                element = element[0];
                WPTB_Helper.textTinyMceInit( element );
                
                var observer = new MutationObserver( function( mutations ) {
                    let row = WPTB_Helper.findAncestor( element, 'wptb-row' );
                    if( row.classList.contains( 'wptb-table-head' ) ) {
                        let table = WPTB_Helper.findAncestor( row, 'wptb-preview-table' );
                        WPTB_Helper.dataTitleColumnSet( table );
                    }
                });
                var config = { attributes: true, attributeFilter: ['style'] };
                observer.observe( element, config );
            }
        } )();
        <?php
    }
}
