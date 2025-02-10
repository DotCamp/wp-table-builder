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

    public static function strip_xss($html)
    {
        if (!$html) {
            return '';
        }

        $wrapper = '<div>' . $html . '</div>';

        libxml_use_internal_errors(true);

        $dom = new \DOMDocument();
        $dom->encoding = 'UTF-8';
        $dom->loadHTML(mb_convert_encoding($wrapper, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

        $xpath = new \DOMXPath($dom);


        $dangerousTags = ['script', 'object', 'embed', 'link', 'style', 'iframe'];
        $tagsQuery = '//' . implode(' | //', $dangerousTags);

        foreach ($xpath->query($tagsQuery) as $node) {
            if ($node->nodeName === 'iframe') {
                $src = $node->getAttribute('src');
                if (!preg_match('#^https://(www\.)?youtube\.com/embed/[\w-]+$#', $src)) {
                    $node->parentNode->removeChild($node);
                }
            } else {
                $node->parentNode->removeChild($node);
            }
        }


        foreach ($xpath->query('//*[@*]') as $node) {
            foreach (iterator_to_array($node->attributes) as $attr) {
                if (self::isDangerousAttribute($attr)) {
                    $node->removeAttribute($attr->nodeName);
                }
            }
        }

        $body = $dom->getElementsByTagName('div')->item(0);
        $innerHTML = '';
        foreach ($body->childNodes as $child) {
            $innerHTML .= $dom->saveHTML($child);
        }

        libxml_clear_errors();

        return $innerHTML;
    }


    private static function isDangerousAttribute($attr)
    {
        $name = strtolower($attr->nodeName);
        $value = strtolower($attr->nodeValue);
        return (
            strpos($name, 'on') === 0 ||
            strpos($value, 'javascript:') !== false
            // || ($name === 'style' && (
            //     strpos($value, 'expression(') !== false ||
            //     strpos($value, 'javascript:') !== false
            // ))
        );
    }




    public static function render($body, $tblId)
    {
        $props = $body['props'];

        $borderCss = [];

        if (isset($props['tableBorder']) && $props['tableBorder'] !== '') {
            $borderCss = [
                'border' => $props['tableBorder'],
            ];
        } else {
            $borderCss = [
                'border-width' => $props['borderWidth'] ?? '',
                'border-color' => $props['borderColor'] ?? '',
                'border-style' => $props['borderStyle'] ?? '',
            ];
        }

        $tblStyle = self::generate_css_string([
            "border-spacing" => "{$props['tableSpacingX']}px {$props['tableSpacingY']}px",
            "border-collapse" => $props['borderCollapse'] ?? '',
            "min-width" => $props['minWidth'] ?? '',
        ] + $borderCss);

        $attrs_string = self::generate_attrs_string([

            "class" => "wptb-preview-table wptb-element-main-table_setting-" . $tblId,
            "style" => $tblStyle,

            "data-border-spacing-columns" => $props['tableSpacingX'] ?? false,
            "data-border-spacing-rows" => $props['tableSpacingY'] ?? false,

            "data-reconstraction" => "1",
            "data-wptb-table-directives" => $props['directives'] ?? false,
            "data-wptb-responsive-directives" => $props['responsiveDirectives'] ?? false,
            "data-wptb-cells-width-auto-count" => $props['cellsWidthAutoCount'] ?? false,

            "data-wptb-sortable-table-vertical" => $props['sortVertical'] ?? false,
            "data-wptb-sortable-table-horizontal" => $props['sortHorizontal'] ?? false,


            "data-wptb-apply-table-container-max-width" => $props['enableMaxWidth'] ?? false,
            "data-wptb-table-container-max-width" => $props['maxWidth'] ?? false,

            "data-wptb-horizontal-scroll-status" => $props['scrollX'] ?? false,
            "data-wptb-extra-styles" => $props['extraStyles'] ?? false,
            "data-wptb-first-column-sticky" => $props['stickyFirstColumn'] ?? false,

            "data-wptb-pagination-enable" => $props['paginationEnable'] ?? false,
            "data-wptb-pro-pagination-top-row-header" => $props['paginationTopRowAsHeader'] ?? false,
            "data-wptb-rows-per-page" => $props['rowsPerPage'] ?? false,
            "data-wptb-rows-changeable" => $props['rowsChangeable'] ?? false,

            "data-wptb-pro-search-top-row-header" => $props['searchKeepHeader'] ?? false,
            "data-wptb-searchbar-position" => $props['searchPosition'] ?? false,
            "role" => $props['role'] ?? false,
            "data-table-columns" => $props['cols'] ?? false,
            "data-wptb-table-alignment" => $props['alignment'] ?? false,
            "data-wptb-td-width-auto" => $props['cellMinWidth'] ?? false,
            "data-wptb-table-tds-sum-max-width" => $props['tdSumMaxWidth'] ?? false,
            "data-disable-theme-styles" => $props['disableThemeStyles'] ?? false,
            "data-wptb-search-enable" => $props['searchEnable'] ?? false,



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
            $classNames = isset($row['props']['highlighted']) ? 'wptb-row-highlighted-' . $row['props']['highlighted'] : '';
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
            $tbody .= '<tr ' . $attrs . ' class="wptb-row ' . $classNames . '" style="' . $style . '">' . $cells . '</tr>';
        }

        return "<table {$attrs_string}><tbody {$tbody_attrs}>{$tbody}</tbody></table>";
    }

    private static function render_cell($cell)
    {

        $props = $cell['props'];
        $borderCss = [];
        $radiusCss = [];

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

        if (isset($props['borderRadius']) && $props['borderRadius'] !== '') {
            $radiusCss = [
                'border-radius' => $props['borderRadius'],
            ];
        } else {
            $radiusCss = [
                'border-top-left-radius' => $props['borderTopLeftRadius'] ?? '',
                'border-top-right-radius' => $props['borderTopRightRadius'] ?? '',
                'border-bottom-right-radius' => $props['borderBottomRightRadius'] ?? '',
                'border-bottom-left-radius' => $props['borderBottomLeftRadius'] ?? '',
            ];
        }

        $styles = self::generate_css_string([
            "padding" => $props['padding'] ?? "",
            "height" => $props['height'] ?? "",
            "width" => $props['width'] ?? "",
            "background-color" => $props['background'] ?? '',
        ] + $borderCss + $radiusCss);

        $attrs = self::generate_attrs_string([

            "colspan" => $props['colspan'] ?? false,
            "rowspan" => $props['rowspan'] ?? false,

            "style" => $styles,

            "data-y-index" => $props['yIndex'] ?? false,
            "data-x-index" => $props['xIndex'] ?? false,
            "data-sorted-vertical" => $props['ySort'] ?? false,
            "data-sorted-horizontal" => $props['xSort'] ?? false,
            "data-wptb-css-td-auto-width" => $props['autoWidth'] ?? false,
            "data-wptb-css-td-auto-height" => $props['autoHeight'] ?? false,
            "data-wptb-cell-vertical-alignment" => $props['vAlign'] ?? false,
            "data-wptb-own-bg-color" => $props['ownBgColor'] ?? false,
        ]);

        $classNames = isset($props['highlighted']) ? 'wptb-col-highlighted-' . $props['highlighted'] . ' wptb-highlighted ' : '';
        $blocks = "";

        $isFirst = true;

        if ($props['hideOnMobile'] ?? false) {
            $classNames .= 'wptb-hide-on-mobile';
        }

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