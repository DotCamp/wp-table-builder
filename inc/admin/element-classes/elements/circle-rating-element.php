<?php

namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Element_Classes\TableRenderer;
use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Dummy_Element_base;
use WP_Table_Builder as NS;

/**
 * Class Circle_Rating dummy
 *
 * Dummy pro element.
 * @package WP_Table_Builder\Inc\Admin\Element_Classes\Elements
 */
class Circle_Rating_Element extends Dummy_Element_base {

	private static $element_id = 1;
	/**
	 * Name for dummy element.
	 * @return string dummy name
	 */
	public function dummy_name() {
		return 'circle_rating';
	}

	/**
	 * Get element title.
	 * @return string element title
	 */
	public function get_title() {
		return esc_html_e( 'Circle Rating', 'wp-table-builder' );
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
	public function get_directory_icon() {
		return wp_normalize_path( NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/circle-rating-star.svg' );
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
	public function get_url_icon() {
		return wp_normalize_path( NS\WP_TABLE_BUILDER_URL . 'inc/admin/views/builder/icons/circle-rating-star.svg' );
	}
    
	public static function render($block) {
		$props = $block['props'];

		$style = TableRenderer::generate_css_string([
			'margin' => $props['margin'] ?? '',
			'padding' => $props['padding'] ?? '',
		]);

		$size = esc_attr($props['size'] ?? '100px');
		$value = (float) $props['value'] ?? '37';
		$unit = $props['ratingType'] ?? null === 'number' ? '':'%';
		$color = esc_attr($props['color'] ?? 'rgb(48, 123, 187)');
		$total = (float) $props['totalNumber'] ?? '100';

		if ($total < 1) {
			$total = 1;
		}

		$angle = ($value / $total) * 360;

		$barAngle = $value * 2 > $total ? 180 : 0;

		//@formatter:off
		return
		'<div class="wptb-circle_rating-container wptb-ph-element wptb-element-circle_rating-'.self::$element_id++.'" ' .
		'data-percentage-count="' . $value . '" ' .
		'data-wptb-total-number="' . $total . '" ' .
		'style="' . $style . '">' .
			'<div class="wptb-rating-circle-wrapper" style="font-size: ' . $size . '">' .
				'<span style="color: ' . $color . '">' . $value . $unit . '</span>' .
				'<div class="wptb-rating-circle-slice" style="clip: rect(0em, 1em, 1em, 0.5em)">' .
					'<div class="wptb-rating-circle-bar" style="border-color: ' . $color . '; transform: rotate(' . $barAngle . 'deg)"></div>' .
					'<div class="wptb-rating-circle-fill" style="border-color: ' . $color . '; transform: rotate(' . $angle . 'deg);"></div>' .
				'</div>' .
			'</div>' .
		'</div>';

		//@formatter:on
	}
}
