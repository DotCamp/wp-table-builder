<?php

namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Element_Classes\TableRenderer;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager;
use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Dummy_Element_base;
use WP_Table_Builder as NS;

/**
 * Class Styled_List_Element dummy
 *
 * Dummy pro element.
 * @package WP_Table_Builder\Inc\Admin\Element_Classes\Elements
 */
class Styled_List_Element extends Dummy_Element_base
{

	private static $element_id = 1;
	/**
	 * Name for dummy element.
	 * @return string dummy name
	 */
	public function dummy_name()
	{
		return 'styled_list';
	}

	/**
	 * Get element title.
	 * @return string element title
	 */
	public function get_title()
	{
		return esc_html_e('Styled List', 'wp-table-builder');
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
		return wp_normalize_path(NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/styled_list.svg');
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
		return wp_normalize_path(NS\WP_TABLE_BUILDER_URL . 'inc/admin/views/builder/icons/styled_list.svg');
	}

	public static function render($block)
	{
		$props = $block['props'];

		$style = TableRenderer::generate_css_string([
			"padding" => $props['padding'] ?? '',
			"margin" => $props['margin'] ?? '',
		]);

		$txtStyle = TableRenderer::generate_css_string([
			"font-size" => $props['fontSize'] ?? '',
			"line-height" => $props['fontSize'] ?? '',
			"color" => $props['color'] ?? '#000000',
			"margin-left" => $props['iconSpacing'] ?? '',
		]);

		$vSpace = esc_attr($props['itemSpacing'] ?? '5px');
		$icSize = esc_attr($props['iconSize'] ?? '20px');
		$icColor = esc_attr($props['iconColor'] ?? 'rgb(0, 153, 71)');

		$iconSrc = esc_attr($props['icon'] ?? 'check');
		$icon = TableRenderer::get_icon($iconSrc);

		$items = '';

		foreach ($block['items'] as $item) {

			$alignment = esc_attr($item['alignment'] ?? 'left');
			$ttStyle = esc_attr($item['toolTipStyle'] ?? '');

			$text = wp_kses_post($item['text'] ?? '');
			$toolTip = wp_kses_post($item['toolTip'] ?? '');

			$liClass = 'wptb-in-element';
			if ($item['toolTip'] != '') {
				$liClass .= ' wptb-tooltip wptb-tooltip-' . esc_attr($item['tooltipPosision'] ?? 'top');
			}
		
			// @formatter:off
			$items .= 
			'<li class="' . $liClass . '" style="margin-bottom: ' . $vSpace . ';">' .
				'<div class="wptb-styled-list-li-inner-wrap" data-wptb-styled-list-alignment="' . $alignment . '">' .
					'<div class="wptb-styled-list-icon" data-wptb-styled-list-icon-src="' . $iconSrc . '" style="width: ' . $icSize . '; height: ' . $icSize . '; flex: 0 0 ' . $icSize . '; fill: ' . $icColor . ';">' .
						$icon .
					'</div>' .
					'<div class="wptb-styled-list-item-content" style="position: relative">' .
						'<p data-styled_list-marker="" style="' . $txtStyle . '">' .
							$text .
						'</p>' .
					'</div>' .
					'<div class="wptb-m-tooltip" style="' . $ttStyle . '">' .
						$toolTip .
					'</div>' .
				'</div>' .
				'<div class="wptb-clear-both"></div>' .
			'</li>';
			// @formatter:on
		}



		// @formatter:off
		return 
		'<div class="wptb-styled_list-container wptb-ph-element wptb-element-styled_list-'.self::$element_id++.'" style="' . $style . '">' .
			'<ul>' .
				$items .
			'</ul>' .
		'</div>';
		// @formatter:on

	}
}
