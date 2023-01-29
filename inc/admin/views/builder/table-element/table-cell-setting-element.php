<?php

namespace WP_Table_Builder\Inc\Admin\Views\Builder\Table_Element;

use WP_Table_Builder\Inc\Admin\Base\Element_Base_Object as Element_Base_Object;
use WP_Table_Builder\Inc\Admin\Controls\Control_Section_Group_Collapse;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder as NS;
use function sprintf;

// If this file is called directly, abort.
if (!defined('WPINC')) {
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
        return esc_html_e('Cell Settings', 'wp-table-builder');
    }

    /**
     * Include file with js script for element button
     *
     * @since 1.2.2
     * @access protected
     */
    public function element_script() {
        return wp_normalize_path(NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/table-element-scripts/table-cell-settings.js');
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
        $this->setDefaultControlArg('elementOptionsGroupId', 'element-cell-options-group');
        $this->setDefaultControlArg('elementOptionClass', 'wptb-element-option');

        $this->add_control(
            'section_header',
            [
                'label' => __('Cell Settings ', 'wp-table-builder'),
                'type' => Controls_Manager::SECTION_HEADER,
                'buttonBack' => false
            ]
        );

        $this->add_control(
            'cellWidth',
            [
                'label' => __('Column Width', 'wp-table-builder'),
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
                'labelOn' => __('Fixed', 'wp-table-builder'),
                'labelOff' => __('Auto', 'wp-table-builder'),
                'type' => Controls_Manager::TOGGLE2,
            ]
        );

        $this->add_control(
            'cellHeight',
            [
                'label' => __('Row Height', 'wp-table-builder'),
                'type' => Controls_Manager::SIZE,
                'selectors' => [
                    '{{{data.container}}}' => 'height',
                ],
                'min' => 5,
                'max' => 500,
                'defaultValue' => 100,
                'dimension' => 'px'
            ]
        );

        $this->add_control(
            'cellHeightFixed',
            [
                'labelOn' => __('Fixed', 'wp-table-builder'),
                'labelOff' => __('Auto', 'wp-table-builder'),
                'type' => Controls_Manager::TOGGLE2,
            ]
        );

        $this->add_control('cellVerticalAlignment', [
            'label' => esc_html__('Cell Vertical Alignment', 'wp-table-builder'),
            'type'      => Controls_Manager::ALIGNMENT,
            'selected'  => 1,
            'alignmentAxis' => 'vertical',
            'selectors' => [
                '{{{data.container}}}' => 'data-wptb-cell-vertical-alignment'
            ]
        ]);
    }
}
