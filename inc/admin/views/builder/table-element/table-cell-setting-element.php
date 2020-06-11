<?php

namespace WP_Table_Builder\Inc\Admin\Views\Builder\Table_Element;

use WP_Table_Builder\Inc\Admin\Base\Element_Base_Object as Element_Base_Object;
use WP_Table_Builder\Inc\Admin\Controls\Control_Section_Group_Collapse;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder as NS;
use function sprintf;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

class Table_Cell_Setting_Element extends Element_Base_Object {
    /**
     * Get name.
     *
     * @return string Section name.
     * @since 1.2.1
     * @access public
     *
     */
    public function get_name() {
        return 'table_cell_setting';
    }

    /**
     * Get section title.
     *
     * @return string Section title.
     * @since 1.2.1
     * @access public
     * @deprecated
     *
     */
    public function get_title() {
        return esc_html_e( 'Cell Settings', 'wp-table-builder' );
    }

    /**
     * Register the element controls.
     *
     * Adds different fields to allow the user to change and customize the element settings.
     *
     * @since 1.2.0
     *
     * @access protected
     */
    protected function _register_controls() {
        $this->add_control(
            'section_header',
            [
                'label' => __( 'Cell Settings ', 'wp_table_builder' ),
                'type' => Controls_Manager::SECTION_HEADER,
                'buttonBack' => false
            ]
        );

        $this->add_control(
            'cellWidth',
            [
                'label' => __( 'Column Width', 'wp_table_builder' ),
                'type' => Controls_Manager::SIZE,
                'selectors' => [
                    '{{{data.container}}}' => 'width',
                ],
                'min' => 50,
                'max' => 500,
                'defaultValue' => 100,
                'dimension' => 'px'
            ]
        );

        $this->add_control(
            'cellWidthFixed',
            [
                'labelOn' => __( 'Fixed', 'wp_table_builder' ),
                'labelOff' => __( 'Auto', 'wp_table_builder' ),
                'type' => Controls_Manager::TOGGLE2,
            ]
        );

        $this->add_control(
            'cellHeight',
            [
                'label' => __( 'Row Height', 'wp_table_builder' ),
                'type' => Controls_Manager::SIZE,
                'selectors' => [
                    '{{{data.container}}}' => 'height',
                ],
                'min' => 50,
                'max' => 500,
                'defaultValue' => 100,
                'dimension' => 'px'
            ]
        );

        $this->add_control(
            'cellHeightFixed',
            [
                'labelOn' => __( 'Fixed', 'wp_table_builder' ),
                'labelOff' => __( 'Auto', 'wp_table_builder' ),
                'type' => Controls_Manager::TOGGLE2,
            ]
        );
    }
}
