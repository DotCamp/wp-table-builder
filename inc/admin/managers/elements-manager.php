<?php
namespace WP_Table_Builder\Inc\Admin\Managers;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder Elements manager.
 *
 * WP Table Builder elements manager handler class is responsible for registering and
 * initializing all the supported WP Table Builder elements.
 *
 * @since 1.1.2
 */
class Elements_Manager {
    /**
	 * Elements objects.
	 *
	 * Holds the list of all the element objects.
	 *
	 * @since 1.1.2
	 * @access private
	 *
	 * @var WPTB_Element_Base_Object[]
	 */
	private $_element_objects = null;
    
    /**
	 * Elements file names array.
	 *
	 * Holds the list of all the files names which have element objects.
	 *
	 * @since 1.1.2
	 * @access private
	 *
	 * @var array
	 */
    private $_build_elements_name = [
			'text',
            'button',
            'image',
            'list',
            'star_rating',
            'custom_html',
            'shortcode'
		];

    /**
	 * Init Elements.
	 *
	 * Initialize WP Table Builder Elements manager.
	 *
	 * @since 1.1.2
	 * @access private
	*/
	private function element_elements() {
		$this->_element_objects = [];

		foreach ( $this->_build_elements_name as $element_name ) {
            $object = $this->get_element_object( $element_name );

			$this->register_element_object( $object );
            
            $object->init_controls();
		}

		do_action( 'wp-table-builder/elements_registered', $this );
	}
    
    /**
	 * Element Object Create.
	 *
	 * Return Element Object. Include the necessary element files.
	 *
	 * @since 1.1.2
	 * @access private
	*/
    private function get_element_object( $element_name ) {
        $class_name = ucfirst( $element_name ) . '_Element';

        $class_name = '\WP_Table_Builder\Inc\Admin\Element_Classes\Elements\\' . $class_name;
        
        return new $class_name();
    }
    
    /**
	 * Register element object.
	 *
	 * Add a new element object to the list of registered element objects.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @param WPTB_Element_Base_Object $element WP Table Builder element.
	 *
	 * @return true True if the element was registered.
	*/
	public function register_element_object( $element ) {
		$this->_element_objects[ $element->get_name() ] = $element;

		return true;
	}
    
    /**
	 * Get element objects.
	 *
	 * Returns the registered element objects list.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @param string $element_name Optional. Element name. Default is null.
	 *
	 * @return WPTB_Element_Base_Object|WPTB_Element_Base_Object[]|null Registered element objects.
	*/
	public function get_element_objects( $element_name = null ) {
		if ( is_null( $this->_element_objects ) ) {
			$this->element_elements();
		}

		if ( null !== $element_name ) {
			return isset( $this->_element_objects[ $element_name ] ) ? $this->_element_objects[ $element_name ] : null;
		}
		return $this->_element_objects;
	}
    
    /**
	 * Render Elements content.
	 *
	 * @since 1.1.2
	 * @access public
	*/
	public function output_elements_templates() {
		foreach ( $this->get_element_objects() as $element ) {
			if( method_exists( $element, 'output_template' ) ) {
                $element->output_template();
            }
		}
	}
    
    /**
	 * Render Elements scripts.
	 *
	 * @since 1.1.2
	 * @access public
	*/
	public function output_elements_scripts() {
        ?>
        <script type="text/javascript">
            var WPTB_ElementsScriptsLauncher = {};
        </script>
        <?php 
		foreach ( $this->get_element_objects() as $element ) {
            if( method_exists( $element, 'output_scripts' ) ) {
                $element->output_scripts();
            }
		}
	}
    
    /**
	 * Render Elements content.
	 *
	 * @since 1.1.2
	 * @access public
	*/
    
    public function output_directories_icons() {
        $directories_icons = array();
		foreach ( $this->get_element_objects() as $element ) {
            if( method_exists( $element, 'get_url_icon' ) ) {
                $directories_icons[$element->get_name()] = $element->get_url_icon();
            }
		}
        ?>
        <script type="text/html" id="tmpl-wptb-element-icons-directories">
            <?php echo json_encode( $directories_icons ); ?>
        </script>
        
        // code javascript for for preloading icons
        <script type="text/javascript">
            ( function() {
                window.onload = function() {
                    let wptbElementIconsDirectories = 'wptb-element-icons-directories';
                    let tmplIconsDirectories = wp.template( wptbElementIconsDirectories );
                    let data = {};
                    let jsonIconsDirectories = tmplIconsDirectories( data );
                    let IconsDirectories = JSON.parse( jsonIconsDirectories );

                    if( IconsDirectories && typeof IconsDirectories === 'object' ) {
                        for ( let key in IconsDirectories ) {
                            let imageItem = WPTB_Helper.getElementIcon( IconsDirectories[key] );
                        }
                    }
                };
            } )();
        </script>
        <?php
    }
}