<?php

namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Controls\Control_Section_Group_Tabbed;
use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Element_Base as Element_Base;
use WP_Table_Builder\Inc\Admin\Element_Classes\TableRenderer;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder as NS;
use function trailingslashit;

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

class Button_Element extends Element_Base
{

    private static $element_id = 1;

    /**
     * Get element name.
     *
     * Retrieve button editor element name.
     *
     * @return string element name.
     * @since 1.1.2
     * @access public
     *
     */
    public function get_name()
    {
        return 'button';
    }

    /**
     * Get element title.
     *
     * Retrieve button editor element.
     *
     * @return string Element title.
     * @since 1.1.2
     * @access public
     *
     */
    public function get_title()
    {
        return esc_html_e('Button', 'wp-table-builder');
    }

    /**
     * Get directory icon.
     *
     * Return directory button editor icon
     *
     * @return string Directory Element icon.
     * @since 1.1.2
     * @access public
     *
     */
    public function get_directory_icon()
    {
        return wp_normalize_path(NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/button.svg');
    }

    /**
     * Get url icon.
     *
     * Return url button icon
     *
     * @return string Url Element icon.
     * @since 1.1.2
     * @access public
     *
     */
    public function get_url_icon()
    {
        return wp_normalize_path(NS\WP_TABLE_BUILDER_URL . 'inc/admin/views/builder/icons/button.svg');
    }

    /**
     * Include file with js script for element button
     *
     * @since 1.1.2
     * @access protected
     */
    public function element_script()
    {
        return wp_normalize_path(NS\WP_TABLE_BUILDER_DIR . 'inc/admin/element-classes/element-scripts/button-element.js');
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
    protected function _register_controls()
    {

        $general_controls = [
            'buttonSizeCheckbox' =>
                [
                    'label' => __('Button Size', 'wp-table-builder'),
                    'type' => Controls_Manager::NAMED_TOGGLE,
                    'items' => [
                        's' => esc_html__('S', 'wp-table-builder'),
                        'm' => esc_html__('M', 'wp-table-builder'),
                        'l' => esc_html__('L', 'wp-table-builder'),
                        'xl' => esc_html__('XL', 'wp-table-builder'),
                    ],
                    'selectors' => [
                        [
                            'query' => '{{{data.container}}} .wptb-button-wrapper',
                            'type' => Controls_Manager::CLASSTYPE,
                            'format' => 'wptb-size-{$}'
                        ]
                    ],
                    'defaultValue' => 'm'
                ],
            'buttonFullWidth' =>
                [
                    'label' => __('Button Full Width', 'wp-table-builder'),
                    'type' => Controls_Manager::TOGGLE,
                    'selectors' => [
                        '{{{data.container}}} .wptb-button-wrapper .wptb-link-target' => ['width', '100%', null]
                    ],
                ],
            'buttonBorderRadius' =>
                [
                    'label' => __('Button Border Radius', 'wp-table-builder'),
                    'type' => Controls_Manager::RANGE,
                    'selectors' => [
                        [
                            'query' => '{{{data.container}}} .wptb-button-wrapper .wptb-button',
                            'type' => Controls_Manager::STYLE,
                            'key' => 'borderRadius',
                            'format' => '{$}px'
                        ],
                    ],
                    'min' => 0,
                    'max' => 30,
                    'defaultValue' => 5,
                    'postFix' => 'px'
                ],
            'buttonColor' =>
                [
                    'label' => __('Button Color', 'wp-table-builder'),
                    'type' => Controls_Manager::COLOR_PALETTE,
                    'selectors' => [
                        [
                            'query' => '{{{data.container}}} .wptb-button-wrapper .wptb-link-target > div',
                            'type' => Controls_Manager::DATASET,
                            'key' => 'wptbElementBgColor',
                        ],
                        [
                            'query' => '{{{data.container}}} .wptb-button-wrapper .wptb-link-target > div',
                            'type' => Controls_Manager::STYLE,
                            'key' => 'backgroundColor',
                        ],
                    ],
                    'defaultValue' => '#329d3f'
                ],
            'buttonTextSize' =>
                [
                    'label' => __('Button Text Size', 'wp-table-builder'),
                    'type' => Controls_Manager::RANGE,
                    'selectors' => [
                        [
                            'query' => '{{{data.container}}} .wptb-button-wrapper p',
                            'type' => Controls_Manager::STYLE,
                            'key' => 'fontSize',
                            'format' => '{$}px',
                        ],
                    ],
                    'min' => 10,
                    'max' => 50,
                    'defaultValue' => 15,
                    'postFix' => 'px'
                ],
            'textColor' =>
                [
                    'label' => __('Button Text Color', 'wp-table-builder'),
                    'type' => Controls_Manager::COLOR_PALETTE,
                    'selectors' => [
                        [
                            'query' => '{{{data.container}}} .wptb-button-wrapper .wptb-link-target > div',
                            'type' => Controls_Manager::DATASET,
                            'key' => 'wptbElementColor',
                        ],
                        [
                            'query' => '{{{data.container}}} .wptb-button-wrapper .wptb-link-target > div',
                            'type' => Controls_Manager::STYLE,
                            'key' => 'color',
                        ],
                    ],
                    'defaultValue' => '#FFFFFF'
                ],
            'buttonAlignmentCheckbox' =>
                [
                    'label' => __('Button Alignment', 'wp-table-builder'),
                    'type' => Controls_Manager::ALIGNMENT2,
                    'selectors' => [
                        [
                            'query' => '{{{data.container}}} .wptb-button-wrapper',
                            'type' => Controls_Manager::STYLE,
                            'key' => 'justifyContent',
                        ],
                    ],
                    'keyMaps' => [
                        'left' => 'flex-start',
                        'right' => 'flex-end',
                    ],
                    'defaultValue' => 'center'
                ],
            'buttonContentAlignmentCheckbox' =>
                [
                    'label' => __('Content Alignment', 'wp-table-builder'),
                    'type' => Controls_Manager::ALIGNMENT2,
                    'selectors' => [
                        [
                            'query' => '{{{data.container}}} .wptb-button',
                            'type' => Controls_Manager::STYLE,
                            'key' => 'justifyContent',
                        ],
                    ],
                    'keyMaps' => [
                        'left' => 'flex-start',
                        'right' => 'flex-end',
                    ],
                    'defaultValue' => 'center'
                ],
            'button-id' =>
                [
                    'label' => __('Button ID', 'wp-table-builder'),
                    'type' => Controls_Manager::TEXT,
                    'placeholder' => __('Insert Button ID Here', 'wp-table-builder'),
                    'selectors' => [
                        '{{{data.container}}} .wptb-button-wrapper .wptb-link-target' => 'id',
                    ]
                ],
        ];

        $hover_controls = [
            'hoverBgColor' =>
                [
                    'label' => __('Color', 'wp-table-builder'),
                    'type' => Controls_Manager::COLOR_PALETTE,
                    'selectors' => [
                        [
                            'query' => '{{{data.container}}} .wptb-button-wrapper .wptb-link-target div',
                            'type' => Controls_Manager::DATASET,
                            'key' => 'wptbElementHoverBgColor',
                        ]
                    ],
                    'defaultValue' => 'null'
                ],
            'hoverTextColor' =>
                [
                    'label' => __('Text Color', 'wp-table-builder'),
                    'type' => Controls_Manager::COLOR_PALETTE,
                    'selectors' => [
                        [
                            'query' => '{{{data.container}}} .wptb-button-wrapper .wptb-link-target div',
                            'type' => Controls_Manager::DATASET,
                            'key' => 'wptbElementHoverTextColor',
                        ]
                    ],
                    'defaultValue' => 'null'
                ],
            'hoverButtonScale' => [
                'label' => __('Scale', 'wp-table-builder'),
                'type' => Controls_Manager::RANGE,
                'selectors' => [
                    [
                        'query' => '{{{data.container}}} .wptb-button-wrapper .wptb-link-target div',
                        'type' => Controls_Manager::DATASET,
                        'key' => 'wptbElementHoverScale'
                    ]
                ],
                'min' => 1,
                'max' => 3,
                'step' => 0.1,
                'defaultValue' => 1,
                'postFix' => esc_html__(' times', 'wp-table-builder')
            ]
        ];

        $icon_controls = [
            'buttonIcon' => [
                'label' => __('Button Icon', 'wp-table-builder'),
                'type' => Controls_Manager::ICON_SELECT,
                'icons' => $this->read_icons(),
                'perPage' => 20,
                'selectors' => [
                    [
                        'query' => '{{{data.container}}} .wptb-button-icon',
                        'type' => Controls_Manager::DATASET,
                        'key' => 'wptbButtonIconSrc'
                    ]
                ]
            ],
            'iconPosition' => [
                'label' => esc_html__('Icon Position', 'wp-table-builder'),
                'type' => Controls_Manager::NAMED_TOGGLE,
                'items' => [
                    'left' => esc_html__('left', 'wp-table-builder'),
                    'right' => esc_html__('right', 'wp-table-builder'),
                ],
                'selectors' => [
                    [
                        'query' => '{{{data.container}}} .wptb-button-wrapper .wptb-link-target .wptb-button',
                        'type' => Controls_Manager::CLASSTYPE,
                        'format' => 'wptb-plugin-button-order-{$}'
                    ]
                ],
                'defaultValue' => 'left'
            ],
            'iconSize' =>
                [
                    'label' => __('Icon Size', 'wp-table-builder'),
                    'type' => Controls_Manager::RANGE,
                    'selectors' => [
                        [
                            'query' => '{{{data.container}}} .wptb-button-icon',
                            'type' => Controls_Manager::STYLE,
                            'key' => 'width',
                            'format' => '{$}px',
                        ],
                        [
                            'query' => '{{{data.container}}} .wptb-button-icon',
                            'type' => Controls_Manager::STYLE,
                            'key' => 'height',
                            'format' => '{$}px',
                        ],
                    ],
                    'min' => 15,
                    'max' => 100,
                    'defaultValue' => 25,
                    'postFix' => 'px'
                ],
        ];

        $link_controls = [
            'buttonLink' =>
                [
                    'label' => __('Button Link', 'wp-table-builder'),
                    'type' => Controls_Manager::URL,
                    'selector' => '{{{data.container}}} .wptb-button-wrapper .wptb-link-target',
                ],
        ];

        $label_controls = [
            'proButtonLabelEnable' =>
                [
                    'label' => __('Enable Button Label', 'wp-table-builder'),
                    'type' => Controls_Manager::TOGGLE,
                    'selectors' => [],
                ],
            'proButtonLabelColor' => [
                'label' => __('Label Color', 'wp-table-builder'),
                'type' => Controls_Manager::COLOR_PALETTE,
                'selectors' => [],
                'defaultValue' => '#FFFFFF'
            ],
            'proButtonLabelTextColor' => [
                'label' => __('Text Color', 'wp-table-builder'),
                'type' => Controls_Manager::COLOR_PALETTE,
                'selectors' => [],
                'defaultValue' => '#329D3F'
            ],
            'buttonLabelProOverlay' => [
                'type' => Controls_Manager::PRO_OVERLAY,
                'featureName' => esc_html__('Button Label', 'wp-table-builder'),
            ]
        ];

        $button_controls = [
            esc_html__('general', 'wp-table-builder') => $general_controls,
            esc_html__('link', 'wp-table-builder') => $link_controls,
            esc_html__('hover', 'wp-table-builder') => $hover_controls,
            esc_html__('icon', 'wp-table-builder') => $icon_controls,
            esc_html__('label', 'wp-table-builder') => $label_controls,
        ];

        Control_Section_Group_Tabbed::add_section('buttonElementOptions', __('button options', 'wp-table-builder'), $button_controls, [
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
    protected function _content_template()
    {
        ?>
        <div class="wptb-button-wrapper wptb-size-m">
            <span class="wptb-link-target">
                <div class="wptb-button" style="position: relative;">
                    <p><?php echo __('Button Text', 'wp-table-builder'); ?></p>
                    <div class="wptb-button-icon" data-wptb-button-icon-src="">
                    </div>
                    <div class="wptb-button-label" style="display: none;">
                        <div class="wptb-button-label-decorator"></div>
                        <div class="wptb-button-label-text">label</div>
                    </div>
                </div>
            </span>
        </div>
        <?php
    }

    public static function render($block)
    {
        $props = $block['props'] ?? [];

        $cStyle = TableRenderer::generate_css_string([
            'padding' => $props['padding'] ?? '',
            'margin' => $props['margin'] ?? '',
        ]);

        $btnStyle = TableRenderer::generate_css_string([
            "border-radius" => $props['borderRadius'] ?? '',
            "background-color" => $props['background'] ?? '',
            "color" => $props['color'] ?? '',
            "justify-content" => $props['contentAlignment'] ?? '',
            "transform" => $props[''] ?? '',
        ]);

        $hoverAttrs = TableRenderer::generate_attrs_string([
            "data-wptb-element-hover-bg-color" => $props['hoverBg'] ?? false,
            "data-wptb-element-hover-text-color" => $props['hoverColor'] ?? false,
            "data-wptb-element-hover-scale" => $props['hoverScale'] ?? false,
        ]);

        $btnAttrs = TableRenderer::generate_attrs_string([
            "data-wptb-element-bg-color" => $props['background'] ?? false,
            "data-wptb-element-color" => $props['color'] ?? false,
        ]) . $hoverAttrs;

        $labelBg = esc_attr($props['labelBg'] ?? '#ffffff');

        $labelStyle = TableRenderer::generate_css_string([
            "display" => $props['hasLabel'] ?? false ? 'inline-flex' : 'none',
            "background-color" => $labelBg,
            "color" => $props['labelColor'] ?? '',
        ]);

        $pStyle = TableRenderer::generate_css_string([
            'font-size' => esc_attr($props['fontSize'] ?? '15px')
        ]);

        switch ($props['contentAlignment']) {
            case 'flex-start':
                $pStyle .= 'margin-right: auto !important;';
                break;
            case 'flex-end':
                $pStyle .= 'margin-left: auto !important;';
                break;
            default:
                $pStyle .= 'margin-inline: auto !important;';
                break;

        }


        $lTag = 'span';
        $lAttrs = TableRenderer::generate_attrs_string([
            "id" => $props['id'] ?? false,
            "style" => isset($props['width']) ? 'width: ' . $props['width'] . ';' : false,
        ]);

        if (isset($props['url']) && $props['url'] !== '') {
            $lTag = 'a';
            if ($props['convertToAbsolute'] && !preg_match('/^https?:\/\//', $props['url'])) {
                $props['url'] = 'https://' . ltrim($props['url'], '/');
            }
            $lAttrs .= TableRenderer::generate_attrs_string([
                "href" => $props['url'] ?? false,
                "target" => $props['linkTarget'] ?? false,
                "rel" => $props['linkRel'] ?? false,
                "data-wptb-link-enable-convert-relative" => $props['convertToAbsolute'] ?? false,
            ]);
        }

        $btnOrder = esc_attr($props['iconPosition'] ?? 'left');
        $wrapperClass = 'wptb-size-' . esc_attr($props['size']);
        if ($props['hasLabel'] ?? false) {
            $wrapperClass .= ' wptb-button-has-label';
        }
        $btnAlignment = esc_attr($props['buttonAlignment'] ?? 'center');

        $text = wp_kses_post($props['text']  ?? '');
        $labelText = wp_kses_post($props['labelText']  ?? '');

        $iconSrc = esc_attr($props['icon'] ?? '');
        $icon = TableRenderer::get_icon($iconSrc);
        $iconSize = esc_attr($props['iconSize'] ?? '25px');
        
        
        //@formatter:off
        return 
        '<div class="wptb-button-container wptb-ph-element wptb-element-button-'.self::$element_id++.' edit-active" style="' . $cStyle . '">' .
            '<div class="wptb-button-wrapper ' . $wrapperClass . '" style="justify-content: ' . $btnAlignment . '">' .
                '<' . $lTag . ' class="wptb-link-target" ' . $lAttrs . '>' .
                    '<div class="wptb-button wptb-plugin-button-order-' . $btnOrder . '" style="position: relative;' . $btnStyle . '" ' . $btnAttrs . '>' .
                        '<p style="'.$pStyle.'">' . $text . '</p>' .
                        '<div class="wptb-button-icon" data-wptb-button-icon-src="'.$iconSrc.'" ' . $hoverAttrs . ' style="width: ' . $iconSize . '; height: ' . $iconSize . '">' .
                            $icon .
                        '</div>' .
                        '<div class="wptb-button-label" style="' . $labelStyle . '" ' . $hoverAttrs . '>' .
                            '<div class="wptb-button-label-decorator" ' . $hoverAttrs . ' style="border-color: rgba(0, 0, 0, 0) '.$labelBg.' rgba(0, 0, 0, 0) rgba(0, 0, 0, 0);">' .
                                '<br />' .
                            '</div>' .
                            '<div class="wptb-button-label-text" ' . $hoverAttrs . '>' .
                                $labelText .
                            '</div>' .
                        '</div>' .
                    '</div>' .
                '</' . $lTag . '>' .
            '</div>' .
        '</div>';
        //@formatter:on
    }
}
