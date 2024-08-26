<?php

namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Element_Classes\TableRenderer;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager;
use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Dummy_Element_base;
use WP_Table_Builder as NS;

/**
 * Class Badge_Element dummy
 *
 * Dummy pro element.
 * @package WP_Table_Builder\Inc\Admin\Element_Classes\Elements
 */
class Badge_Element extends Dummy_Element_base
{

    private static $element_id = 1;
    /**
     * Name for dummy element.
     * @return string dummy name
     */
    public function dummy_name()
    {
        return 'badge';
    }

    /**
     * Get element title.
     * @return string element title
     */
    public function get_title()
    {
        return esc_html_e('Badge', 'wp-table-builder');
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
        return wp_normalize_path(NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/badge.svg');
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
        return wp_normalize_path(NS\WP_TABLE_BUILDER_URL . 'inc/admin/views/builder/icons/badge.svg');
    }

    public static function render($block)
    {

        $props = $block['props'];
        $style = TableRenderer::generate_css_string([
            "justify-content" => $props['alignment'] ?? 'center',
            "padding" => $props['padding'] ?? '',
            "margin" => $props['margin'] ?? '',
        ]);

        $wrapperStyle = TableRenderer::generate_css_string([
            "font-size" => $props['fontSize'] ?? '',
            "color" => $props['color'] ?? '',
            "background-color" => $props['background'] ?? '',
        ]);

        $text = wp_kses_post($props['text'] ?? '');

        // @formatter:off
        return
        '<div class="wptb-badge-container wptb-ph-element wptb-element-badge-'.self::$element_id++.' style="'.$style.'">'.
          '<div class="wptb-badge-wrapper" style="'.$wrapperStyle.'">'.
            '<p class="wptb-badge" style="position: relative">'.$text.'</p>'.
          '</div>'.
        '</div>';
        // @formatter:on

    }
}
