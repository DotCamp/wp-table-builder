<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder\Inc\Core\Init;

// If this file is called directly, abort.
if (!defined('WPINC')) {
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
class Elements_Manager extends Elements_Manager_Base {
    /**
     * Elements objects.
     *
     * Holds the list of all the element objects.
     *
     * @since 1.1.2
     * @access protected
     *
     * @var WPTB_Element_Base_Object[]
     */
    protected $_element_objects = null;

    // element types
    /**
     * elements in free version
     */
    const BASIC = 'basic';

    /**
     * elements in pro version
     */
    const PRO = 'pro';


    /**
     * Elements position on table is relative to the table data
     */
    const TD_RELATIVE = 'td_relative';

    /**
     * Element's position on table is relative to other elements
     */
    const ELEMENT_RELATIVE = 'element_relative';

    /**
     * Elements names array.
     *
     * Holds the list of all the names which have element objects.
     *
     * @since 1.1.2
     * @access protected
     *
     * @var array
     */
    protected $_build_elements_name = [
        'text',
        'button',
        'image',
        'list',
        'star_rating',
        'custom_html',
        'shortcode',
    ];

    /**
     * Pro elements list to use in dummy display.
     * @var string[]
     */
    protected $pro_dummy_elements_name = [
        'circle_rating',
        'icon',
        'ribbon',
        'styled_list',
        'text_icon',
        'progress_bar',
        'badge'
    ];

    /**
     * Elements_Manager constructor.
     */
    public function __construct() {
        $this->_build_elements_name = apply_filters('wp-table-builder/filter/elements-manager-init', $this->_build_elements_name);
    }

    /**
     * Add new elements to already registered ones.
     *
     * @param array $new_elements array of new elements
     *
     * @return void
     */
    public function add_to_elements($new_elements) {
        $this->_build_elements_name = array_merge($this->_build_elements_name, $new_elements);
    }


    /**
     * Init Elements.
     *
     * Initialize WP Table Builder Elements manager.
     *
     * @since 1.1.2
     * @access private
     */
    public function element_elements() {
        parent::element_elements();

        do_action('wp-table-builder/elements_registered', $this);
    }

    /**
     * Element Object Create.
     *
     * Return Element Object. Include the necessary element files.
     *
     * @param $element_name
     *
     * @return mixed
     * @since 1.1.2
     * @access protected
     */
    protected function get_element_object($element_name) {
        $class_name = ucfirst($element_name) . '_Element';

        $class_name = '\WP_Table_Builder\Inc\Admin\Element_Classes\Elements\\' . $class_name;

        return new $class_name();
    }

    /**
     * Render Elements content.
     *
     * @since 1.1.2
     * @access public
     */
    public function output_elements_templates() {
        foreach ($this->get_element_objects() as $element) {
            if (method_exists($element, 'output_template')) {
                $element->output_template();
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
        foreach ($this->get_element_objects() as $element) {
            if (method_exists($element, 'get_url_icon')) {
                $directories_icons[$element->get_name()] = $element->get_url_icon();
            }
        }
?>
        <script type="text/html" id="tmpl-wptb-element-icons-directories">
            <?php echo json_encode($directories_icons); ?>
        </script>

        // code javascript for for preloading icons
        <script type="text/javascript">
            (function() {
                window.onload = function() {
                    let wptbElementIconsDirectories = 'wptb-element-icons-directories';
                    let tmplIconsDirectories = wp.template(wptbElementIconsDirectories);
                    let data = {};
                    let jsonIconsDirectories = tmplIconsDirectories(data);
                    let IconsDirectories = JSON.parse(jsonIconsDirectories);

                    if (IconsDirectories && typeof IconsDirectories === 'object') {
                        for (let key in IconsDirectories) {
                            let imageItem = WPTB_Helper.getElementIcon(IconsDirectories[key]);
                        }
                    }
                };
            })();
        </script>
<?php
    }

    /**
     * Get registered element controls.
     * @return array|null elements' control stack
     */
    public function element_control_stack() {
        return Init::instance()->controls_manager->get_current_control_stack();
    }

    /**
     * Set control stack for given element type.
     *
     * @param string $element_type table element type
     * @param array $control_stack element control stack
     */
    public function set_element_control_stack($element_type, $control_stack) {
        Init::instance()->controls_manager->set_element_stack($element_type, $control_stack);
    }
}
