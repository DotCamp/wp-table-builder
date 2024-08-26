<?php

namespace WP_Table_Builder\Inc\Admin\Element_Classes;
use WP_Table_Builder\Inc\Admin\Element_Classes\Elements\Badge_Element;
use WP_Table_Builder\Inc\Admin\Element_Classes\Elements\Button_Element;
use WP_Table_Builder\Inc\Admin\Element_Classes\Elements\Circle_Rating_Element;
use WP_Table_Builder\Inc\Admin\Element_Classes\Elements\Custom_Html_Element;
use WP_Table_Builder\Inc\Admin\Element_Classes\Elements\Icon_Element;
use WP_Table_Builder\Inc\Admin\Element_Classes\Elements\Image_Element;
use WP_Table_Builder\Inc\Admin\Element_Classes\Elements\List_Element;
use WP_Table_Builder\Inc\Admin\Element_Classes\Elements\Progress_Bar_Element;
use WP_Table_Builder\Inc\Admin\Element_Classes\Elements\Ribbon_Element;
use WP_Table_Builder\Inc\Admin\Element_Classes\Elements\Shortcode_Element;
use WP_Table_Builder\Inc\Admin\Element_Classes\Elements\Star_Rating_Element;
use WP_Table_Builder\Inc\Admin\Element_Classes\Elements\Styled_List_Element;
use WP_Table_Builder\Inc\Admin\Element_Classes\Elements\Text_Element;
use WP_Table_Builder\Inc\Admin\Element_Classes\Elements\Text_Icon_Element;

class TableRenderer
{

    public static function generate_css_string($styles)
    {
        $css_string = '';

        foreach ($styles as $key => $value) {
            if (trim($value) !== '') {
                $css_string .= $key . ': ' . $value . '; ';
            }
        }

        return esc_attr($css_string);
    }

    public static function generate_attrs_string($attrs)
    {
        $attrs_string = '';
        foreach ($attrs as $key => $value) {
            if ($value !== false) {
                $attrs_string .= $key . '="' . esc_attr($value) . '" ';
            }
        }
        return $attrs_string;
    }

    public static function get_icon($name)
    {
        $path = dirname(dirname(__DIR__)) . '/frontend/views/icons/' . $name . '.svg';
        if (file_exists($path)) {
            return file_get_contents($path);
        }
        return '';
    }

    public static function render($body)
    {
        $props = $body['props'];

        $tblStyle = self::generate_css_string([
            "border" => $props['tableBorder'],
            "border-spacing" => "{$props['tableSpacingX']}px {$props['tableSpacingY']}px",
            "border-collapse" => $props['borderCollapse'] ?? '',
        ]);

        $attrs_string = self::generate_attrs_string([

            "class" => "wptb-preview-table wptb-element-main-table_setting-237",
            "style" => $tblStyle,

            "data-reconstraction" => "1",
            "data-wptb-table-directives" => $props['directives'],
            "data-wptb-responsive-directives" => $props['responsiveDirectives'] ?? "",
            "data-wptb-cells-width-auto-count" => $props['cellsWidthAutoCount'],
            "data-wptb-horizontal-scroll-status" => $props['scrollX'],
            "data-wptb-extra-styles" => $props['extraStyles'],
            "data-wptb-first-column-sticky" => $props['stickyFirstColumn'],
            "data-wptb-pro-pagination-top-row-header" => $props['paginationTopRowAsHeader'],
            "data-wptb-rows-per-page" => $props['rowsPerPage'],
            "data-wptb-pro-search-top-row-header" => $props['searchKeepHeader'],
            "data-wptb-searchbar-position" => $props['searchPosition'],
            "role" => $props['role'],
            "data-table-columns" => $props['cols'],
            "data-wptb-table-alignment" => $props['alignment'],
            "data-wptb-td-width-auto" => $props['cellMinWidth'],
            "data-wptb-table-tds-sum-max-width" => $props['tdSumMaxWidth'],
            "data-disable-theme-styles" => $props['disableThemeStyles'],
            "data-wptb-search-enable" => $props['searchEnable'],

            "data-wptb-header-background-color" => $props['headerBg'] ?? false,
            "data-wptb-even-row-background-color" => $props['evenRowBg'] ?? false,
            "data-wptb-odd-row-background-color" => $props['oddRowBg'] ?? false,
            "data-wptb-header-hover-background-color" => $props['hoverHeaderBg'] ?? false,
            "data-wptb-even-row-hover-background-color" => $props['hoverEvenRowBg'] ?? false,
            "data-wptb-odd-row-hover-background-color" => $props['hoverOddRowBg'] ?? false,
        ]);

        $tbody_attrs = self::generate_attrs_string([
            "data-global-font-color" => $props['fontColor'] ?? false,
            "data-global-link-color" => $props['linkColor'] ?? false,
            "data-global-font-size" => $props['fontSize'] ?? false,
        ]);

        $tbody = "";

        foreach ($body['rows'] as $i => $row) {
            $cells = "";
            foreach ($row['cells'] as $cell) {
                $cells .= self::render_cell($cell);
            }
            $classNames = $row['props']['hightLighted'] ?? '';
            $attrs = "";
            if ($props['stickyTopRow'] && $i == 0) {
                $attrs = 'data-wptb-sticky-row="true"';
            }
            $hoverColor = '';
            if ($i === 0 && isset($props['hoverHeaderBg']) && $props['hoverHeaderBg'] !== '') {
                $hoverColor = $props['hoverHeaderBg'];
            } elseif ($i % 2 === 0) {
                if (isset($props['hoverOddRowBg']) && $props['hoverOddRowBg'] !== '') {
                    $hoverColor = $props['hoverOddRowBg'];
                }
            } elseif (isset($props['hoverEvenRowBg']) && $props['hoverEvenRowBg'] !== '') {
                $hoverColor = $props['hoverEvenRowBg'];
            }

            if ($hoverColor !== '') {
                $classNames .= ' wptb-row-has-hover';
            }

            $style = self::generate_css_string([
                'background-color' => $row['props']['background'] ?? '',
                '--hover-bg-color' => $hoverColor,
            ]);
            $tbody .= <<<HTML
            <tr $attrs class="wptb-row {$classNames}" style="{$style}">$cells</tr>
            HTML;
        }

        return "<table {$attrs_string}><tbody {$tbody_attrs}>{$tbody}</tbody></table>";
    }

    private static function render_cell($cell)
    {

        $props = $cell['props'];
        $borderCss = [];

        if (isset($props['border']) && $props['border'] !== '') {
            $borderCss = [
                'border' => $props['border'],
            ];
        } else {
            $borderCss = [
                'border-width' => $props['borderWidth'] ?? '',
                'border-color' => $props['borderColor'] ?? '',
                'border-style' => $props['borderStyle'] ?? '',
            ];
        }

        $styles = self::generate_css_string([
            "border-radius" => $props['borderRadius'] ?? '',
            "padding" => $props['padding'] ?? "",
            "height" => $props['height'] ?? "",
            "width" => $props['width'] ?? "",
            "background-color" => $props['background'] ?? '',
        ] + $borderCss);

        $attrs = self::generate_attrs_string([
            "style" => $styles,

            "data-y-index" => $props['yIndex'] ?? '',
            "data-x-index" => $props['xIndex'] ?? '',
            "data-sorted-vertical" => $props['sortedVertical'] ?? false,
            "data-sorted-horizontal" => $props['sortedHorizontal'] ?? false,
            "data-wptb-css-td-auto-width" => $props['autoWidth'],
            "data-wptb-css-td-auto-height" => $props['autoHeight'],
            "data-wptb-cell-vertical-alignment" => $props['vAlign'],
            "data-wptb-own-bg-color" => $props['ownBgColor'] ?? false,
        ]);

        $classNames = $props['hightLighted'] ?? '';
        $blocks = "";

        $isFirst = true;

        if ($props['isEmpty']) {
            $classNames .= ' wptb-empty';
        } else {
            foreach ($cell['blocks'] as $block) {

                switch ($block['type']) {
                    case 'text':
                        $block['props']['isFirst'] = $isFirst;
                        $isFirst = false;
                        $blocks .= Text_Element::render($block);
                        break;
                    case 'button':
                        $blocks .= Button_Element::render($block);
                        break;
                    case 'image':
                        $blocks .= Image_Element::render($block);
                        break;
                    case 'list':
                        $blocks .= List_Element::render($block);
                        break;
                    case 'starRating':
                        $blocks .= Star_Rating_Element::render($block);
                        break;
                    case 'customHtml':
                        $blocks .= Custom_Html_Element::render($block);
                        break;
                    case 'shortcode':
                        $blocks .= Shortcode_Element::render($block);
                        break;

                    case 'circleRating':
                        $blocks .= Circle_Rating_Element::render($block);
                        break;
                    case 'icon':
                        $blocks .= Icon_Element::render($block);
                        break;
                    case 'ribbon':
                        $blocks .= Ribbon_Element::render($block);
                        break;
                    case 'styledList':
                        $blocks .= Styled_List_Element::render($block);
                        break;
                    case 'textIcon':
                        $blocks .= Text_Icon_Element::render($block);
                        break;
                    case 'progressBar':
                        $blocks .= Progress_Bar_Element::render($block);
                        break;
                    case 'badge':
                        $blocks .= Badge_Element::render($block);
                        break;
                }
            }
        }

        return "<td class=\"wptb-cell {$classNames}\" {$attrs}>{$blocks}</td>";
    }

}