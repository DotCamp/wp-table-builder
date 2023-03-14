<?php

namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Controls\Control_Section_Group_Tabbed;
use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Element_Base as Element_Base;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder as NS;

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

class Image_Element extends Element_Base {

    /**
     * Get element name.
     *
     * Retrieve image editor element name.
     *
     * @return string element name.
     * @since 1.1.2
     * @access public
     *
     */
    public function get_name() {
        return 'image';
    }

    /**
     * Get element image.
     *
     * Retrieve image editor element.
     *
     * @return string Element title.
     * @since 1.1.2
     * @access public
     *
     */
    public function get_title() {
        return esc_html_e('Image', 'wp-table-builder');
    }

    /**
     * Get directory icon.
     *
     * Retrieve directory image editor element icon.
     *
     * @return string Directory Element icon.
     * @since 1.1.2
     * @access public
     *
     */
    public function get_directory_icon() {
        return NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/image.svg';
    }

    /**
     * Get url icon.
     *
     * Return url image icon
     *
     * @return string Url Element icon.
     * @since 1.1.2
     * @access public
     *
     */
    public function get_url_icon() {
        return wp_normalize_path(NS\WP_TABLE_BUILDER_URL . 'inc/admin/views/builder/icons/image.svg');
    }

    /**
     * Include file with js script for element image
     *
     * @since 1.1.2
     * @access protected
     */
    public function element_script() {
        return wp_normalize_path(NS\WP_TABLE_BUILDER_DIR . 'inc/admin/element-classes/element-scripts/image-element.js');
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
        $general_controls = [
            'imageReplaceButton'   =>
            [
                'label' => __('Replace Image', 'wp-table-builder'),
                'type'  => Controls_Manager::BUTTON,
            ],
            'imageAlignment'       =>
            [
                'label'        => __('Image Alignment', 'wp-table-builder'),
                'type'         => Controls_Manager::ALIGNMENT2,
                'selectors'    => [
                    [
                        'query' => '{{{data.container}}}',
                        'type'  => Controls_Manager::DATASET,
                        'key'   => 'wptbImageAlignment',
                    ]
                ],
                'defaultValue' => 'center'
            ],
            'imageAlternativeText' =>
            [
                'label'       => __('Image Alternative Text', 'wp-table-builder'),
                'type'        => Controls_Manager::TEXT,
                'selectors'   => [
                    '{{{data.container}}} .wptb-image-wrapper img' => 'alt',
                ],
                'placeholder' => __('Image Alt Text', 'wp-table-builder'),
            ]
        ];

        $size_controls = [
            'imageSize' =>
            [
                'label'        => __('Image Size', 'wp-table-builder'),
                'type'         => Controls_Manager::SIZE,
                'selectors'    => [
                    '{{{data.container}}} .wptb-image-wrapper .wptb-link-target' => 'width',
                ],
                'min'          => 10,
                'max'          => 100,
                'defaultValue' => 100,
                'dimension'    => '%'
            ]
        ];

        $link_controls = [
            'imageLink' =>
            [
                'label'    => __('Image Link', 'wp-table-builder'),
                'type'     => Controls_Manager::URL,
                'selector' => '{{{data.container}}} .wptb-image-wrapper .wptb-link-target',
            ]
        ];

        $image_controls = [
            esc_html__('general', 'wp-table-builder') => $general_controls,
            esc_html__('size', 'wp-table-builder')    => $size_controls,
            esc_html__('link', 'wp-table-builder')    => $link_controls,
        ];

        Control_Section_Group_Tabbed::add_section('imageElementOptions', __('image options', 'wp-table-builder'), $image_controls, [
            $this,
            'add_control'
        ]);
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
            <span class="wptb-link-target">
                <span class="wptb-icon-image-button">
                    <svg class="wptb-draggable-prototype" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 489.4 489.4" width="40px" height="50px">
                        <path d="M0 437.8c0 28.5 23.2 51.6 51.6 51.6h386.2c28.5 0 51.6-23.2 
                              51.6-51.6V51.6c0-28.5-23.2-51.6-51.6-51.6H51.6C23.1 0 0 23.2 0 
                              51.6 0 51.6 0 437.8 0 437.8zM437.8 464.9H51.6c-14.9 
                              0-27.1-12.2-27.1-27.1v-64.5l92.8-92.8 79.3 79.3c4.8 4.8 
                              12.5 4.8 17.3 0l143.2-143.2 107.8 107.8v113.4C464.9 452.7 452.7 
                              464.9 437.8 464.9zM51.6 24.5h386.2c14.9 0 27.1 12.2 27.1 
                              27.1v238.1l-99.2-99.1c-4.8-4.8-12.5-4.8-17.3 0L205.2 
                              333.8l-79.3-79.3c-4.8-4.8-12.5-4.8-17.3 0l-84.1 84.1v-287C24.5 
                              36.7 36.7 24.5 51.6 24.5z" />
                        <path d="M151.7 196.1c34.4 0 62.3-28 62.3-62.3s-28-62.3-62.3-62.3 -62.3 
                              28-62.3 62.3S117.3 196.1 151.7 196.1zM151.7 96c20.9 0 37.8 17 37.8 
                              37.8s-17 37.8-37.8 37.8 -37.8-17-37.8-37.8S130.8 96 151.7 96z" />
                    </svg>
                    <span><?php echo __('Insert Image', 'wp-table-builder');?></span>
                </span>
                <img class="wptb-image-element-dummy">
            </span>
        </div>
<?php
    }
}
