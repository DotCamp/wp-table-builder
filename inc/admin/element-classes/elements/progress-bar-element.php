<?php

namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Element_Classes\TableRenderer;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager;
use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Dummy_Element_base;
use WP_Table_Builder as NS;

/**
 * Class Progress_Bar_Element dummy
 *
 * Dummy pro element.
 * @package WP_Table_Builder\Inc\Admin\Element_Classes\Elements
 */
class Progress_Bar_Element extends Dummy_Element_base
{

    private static $element_id = 1;
    /**
     * Name for dummy element.
     * @return string dummy name
     */
    public function dummy_name()
    {
        return 'progress_bar';
    }

    /**
     * Get element title.
     * @return string element title
     */
    public function get_title()
    {
        return esc_html_e('Progress Bar', 'wp-table-builder');
    }

    /**
     * Get directory icon.
     *
     * Retrieve directory item icon.
     *
     * @return string Directory Item icon.
     * @since 1.1.2
     * @access public
     *
     */
    public function get_directory_icon()
    {
        return wp_normalize_path(NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/progress-bar.svg');
    }

    /**
     * Get url icon.
     *
     * Return url icon.
     *
     * @return string Url Item icon.
     * @since 1.1.2
     * @access public
     *
     */
    public function get_url_icon()
    {
        return wp_normalize_path(NS\WP_TABLE_BUILDER_URL . 'inc/admin/views/builder/icons/progress-bar.svg');
    }

    public static function render($block)
    {
        $props = $block['props'];

        $style = TableRenderer::generate_css_string([
            'margin' => $props['margin'] ?? '',
            'padding' => $props['padding'] ?? '',
        ]);

        $value = (int) $props['value'];
        $rest = 100 - $value;

        $thickness = esc_attr($props['thickness'] ?? '5');

        $primaryColor = esc_attr($props['primaryColor'] ?? '#3C87B1');
        $secondaryColor = esc_attr($props['secondaryColor'] ?? '#CCCCCC');
        $labelColor = esc_attr($props['labelColor'] ?? 'rgb(60, 135, 177)');

        // @formatter:off
        return 
        '<div class="wptb-progress_bar-container wptb-ph-element wptb-ondragenter wptb-element-progress_bar-'.self::$element_id++.'" style="' . $style . '">' .
            '<div class="wptb-progress-bar-wrapper">' .
                '<svg class="wptb-progress-bar" viewBox="0 0 100 10" preserveAspectRatio="none">' .
                    '<path d="M 0,5 L 100,5" class="wptb-progress-bar-trail" stroke="' . $secondaryColor . '" style="stroke-width: ' . $thickness . '"></path>' .
                    '<path d="M 0,5 L 100,5" class="wptb-progress-bar-path" stroke="' . $primaryColor . '" style="stroke-dashoffset: ' . $rest . 'px; stroke-width: ' . $thickness . '"></path>' .
                '</svg>' .
                '<div class="wptb-progress-bar-label" style="width: ' . $value . '%; color: ' . $labelColor . '">' .
                    $value . '%' .
                '</div>' .
            '</div>' .
        '</div>';
        // @formatter:on

    }
}
