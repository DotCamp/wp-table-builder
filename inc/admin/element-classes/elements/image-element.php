<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Element_Base_Object as Element_Base_Object;
use WP_Table_Builder\Inc\Admin\Element_Classes\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Image_Element extends Element_Base_Object {
    
    /**
	 * Get element name.
	 *
	 * Retrieve image editor element name.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string element name.
	 */
	public function get_name() {
		return 'image';
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
		return esc_attr( 'image', 'wp-table-builder' );
	}

	/**
	 * Get element image.
	 *
	 * Retrieve image editor element.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Element title.
	 */
	public function get_title() {
		return esc_html_e( 'Image', 'wp-table-builder' );
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
		return NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/image.php'; ;
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
				'label' => __( 'Image Options', 'wp_table_builder' ),
				'type' => Controls_Manager::SECTION_HEADER,
			]
		);
        
		$this->add_control(
			'imageAlignmentCheckbox',
			[
				'label' => __( 'Image Alignment', 'wp_table_builder' ),
				'type' => Controls_Manager::ELEMENT_ALIGNMENT,
                'selected' => 1,
                'selectors' => [
                    '{{{data.container}}} .wptb-image-wrapper a' => 'float',
                ]
			]
		);
        
		$this->add_control(
			'imageSize',
			[
				'label' => __( 'Image Size', 'wp_table_builder' ),
				'type' => Controls_Manager::SIZE,
                'selectors' => [
                    '{{{data.container}}} .wptb-image-wrapper a' => 'width',
                ],
                'min' => 10, 
                'max' => 100,
                'defaultValue' => 100,
                'dimension' => '%'
			]
		);
        
        $this->add_control(
			'imageLink',
			[
				'label' => __( 'Image Link', 'wp_table_builder' ),
				'type' => Controls_Manager::HREF,
                'selector' => '{{{data.container}}} .wptb-image-wrapper a'
			]
		);
        
		$this->add_control(
			'imageAlternativeText',
			[
				'label' => __( 'Image Alternative Text', 'wp_table_builder' ),
				'type' => Controls_Manager::ADDING_USER_ATTR,
                'attrName' => 'alt',
                'selector' => '{{{data.container}}} .wptb-image-wrapper a img',
                'placeholder' => __( 'Image Alt Text', 'wp_table_builder' )
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
        <div class="wptb-image-wrapper">
            <a style="display: block;"><img></a>
        </div>
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
                let a = element.getElementsByTagName( 'a' );
                if( a.length > 0 ) {
                    a = a[0];
                }
                a.onclick = function( e ) {
                    e.preventDefault();
                };
                
                let img = element.getElementsByTagName( 'img' );
                if( img.length > 0 ) {
                    img = img[0];
                }
                
                let src;
                if( img.src ) {
                    src = img.src;
                }

                file_frame = wp.media.frames.file_frame = wp.media({
                    title: 'Select a image to upload',
                    button: {
                        text: 'Use this image'
                    },
                    multiple: false,
                    frame: 'post'
                });

                let imageSetting = function( img, attachment ) {
                    let imgSrc = attachment.url;
                    let linkArr = imgSrc.split( ':' ),
                        linkClean;
                    if ( Array.isArray( linkArr ) && linkArr.length > 0 ) {
                        linkClean = linkArr[linkArr.length - 1];
                    }
                    img.src = linkClean;
                    img.height = attachment.height;
                    img.width = attachment.width;
                    img.style.width = '100%';

                    let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                    wptbTableStateSaveManager.tableStateSet();
                };

                file_frame.on( 'select', function() {
                    attachment = file_frame.state().props.toJSON();
                    imageSetting( img, attachment );
                });

                file_frame.on( 'insert', function () {
                    attachment = file_frame.state().get( 'selection' ).first().toJSON();
                    imageSetting( img, attachment );
                });

                if ( src == undefined ) {
                    file_frame.open();
                    file_frame.menuItemVisibility( 'gallery', 'hide' );
                    file_frame.menuItemVisibility( 'playlist', 'hide' ), 
                    file_frame.menuItemVisibility( 'video-playlist', 'hide' ), 
                    file_frame.menuItemVisibility( 'audio-playlist', 'hide' )
                } else {
                    img.src = src;
                }
            };
        } )();
        <?php
    }
}
