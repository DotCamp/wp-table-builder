<?php

namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Element_Classes\TableRenderer;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager;
use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Dummy_Element_base;
use WP_Table_Builder as NS;

/**
 * Class Text_Icon_Element dummy
 *
 * Dummy pro element.
 * @package WP_Table_Builder\Inc\Admin\Element_Classes\Elements
 */
class Text_Icon_Element extends Dummy_Element_base
{

	private static $element_id = 1;
	/**
	 * Name for dummy element.
	 * @return string dummy name
	 */
	public function dummy_name()
	{
		return 'text_icon';
	}

	/**
	 * Get element title.
	 * @return string element title
	 */
	public function get_title()
	{
		return esc_html_e('Text Icon', 'wp-table-builder');
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
		return wp_normalize_path(NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/text-icon.svg');
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
		return wp_normalize_path(NS\WP_TABLE_BUILDER_URL . 'inc/admin/views/builder/icons/text-icon.svg');
	}

	public static function render($block)
	{
		$props = $block['props'];

		$iconLoc = $props['iconLocation'] ?? 'left';
		$space = $props['spaceBetween'] ?? '5px';

		$attrs = TableRenderer::generate_attrs_string([
			"data-wptb-text-icon-space-between" => $space,
			"data-wptb-text-icon-alignment" => $props['alignment'] ?? 'left',
			"data-wptb-text-icon-icon-location" => $iconLoc,
		]);

		$style = TableRenderer::generate_css_string([
			"font-size" => $props['fontSize'] ?? '',
			"padding" => $props['padding'] ?? '',
			"margin" => $props['margin'] ?? '',
		]);

		$iconSrc = esc_attr($props['icon'] ?? 'star');
		$icon = TableRenderer::get_icon($iconSrc);
		$iconSize = esc_attr($props['iconSize'] ?? '15px');
		$iconColor = esc_attr($props['iconColor'] ?? '#000000');

		$text = wp_kses_post($props['text'] ?? '');
		$txtStyle = TableRenderer::generate_css_string(
			[
				'color' => $props['color'] ?? '#000000',
			] + ($iconLoc === 'left' ? [
					'margin-left' => $space,
					'margin-right' => '0',
				] : [
					'margin-left' => '0',
					'margin-right' => $space,
				])
		);

		// @formatter:off
		return 
		'<div class="wptb-text_icon_element-container wptb-ph-element mce-content-body wptb-element-text_icon_element-'.self::$element_id++.'" ' . $attrs . ' style="' . $style . '">' .
			'<div class="wptb-element-text-icon-wrapper">' .
				'<div id="wptbTextIconIconWrapper" class="wptb-text-icon-icon-wrapper" data-wptb-text-icon-icon-src="' . $iconSrc . '" style="color: ' . $iconColor . '; width: ' . $iconSize . '; height: ' . $iconSize . ';">' .
					$icon .
					'<br />' .
				'</div>' .
				'<div id="wptbTextIconMainTextWrapper" style="' . $txtStyle . '">' .
					'<p id="wptbTextIconMainText">' . $text . '</p>' .
				'</div>' .
			'</div>' .
		'</div>';
		// @formatter:on

	}
}
