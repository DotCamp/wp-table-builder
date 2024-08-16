<?php

namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Element_Classes\TableRenderer;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager;
use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Dummy_Element_base;
use WP_Table_Builder as NS;

/**
 * Class Icon_Element dummy
 *
 * Dummy pro element.
 * @package WP_Table_Builder\Inc\Admin\Element_Classes\Elements
 */
class Icon_Element extends Dummy_Element_base {

	/**
	 * Name for dummy element.
	 * @return string dummy name
	 */
	public function dummy_name() {
		return 'icon';
	}

	/**
	 * Get element title.
	 * @return string element title
	 */
	public function get_title() {
		return esc_html_e( 'Icon', 'wp-table-builder' );
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
		return wp_normalize_path( NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/icon.svg' );
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
		return wp_normalize_path( NS\WP_TABLE_BUILDER_URL . 'inc/admin/views/builder/icons/icon.svg' );
	}

	public static function render($block) {
		
		$props = $block['props'];

		$style = TableRenderer::generate_css_string([
		  'padding' => $props['padding'] ?? '',
		  'margin' => $props['margin'] ?? '',
		]);

		$size = esc_attr($props['size'] ?? '25px');
		$icons = '';

		$i = 0;

		foreach ($block['icons'] as $icon) {
			$i++;
			$lTag = 'span';
			$lAttrs = "";
			$color = esc_attr($icon['color'] ?? 'rgb(0, 0, 0)');
			$iconSrc = esc_attr($icon['icon'] ?? 'star');
			$iconStr = TableRenderer::get_icon($iconSrc);

			if ($icon['url'] !== '') {
				$lTag = 'a';
				if ($icon['convertToAbsolute'] && !preg_match('/^https?:\/\//', $icon['url'])) {
					$icon['url'] = 'https://' . ltrim($icon['url'], '/');
				}
				$lAttrs = TableRenderer::generate_attrs_string([
					"href" => $icon['url'],
					"target" => $icon['linkTarget'],
					"rel" => $icon['linkRel'],
					"data-wptb-link-enable-convert-relative" => $icon['convertToAbsolute'],
				]);
			}
			$icons .= <<<HTML
			<{$lTag} {$lAttrs} class="wptb-icon-link-target-{$i}">
			  <div
			    class="wptb-icon wptb-icon-{$i}"
			    style="width: {$size}; height: {$size}; fill: {$color}"
			    data-wptb-icon-src="{$iconSrc}"
			  >
			    {$iconStr}
			  </div>
			</{$lTag}>
			HTML;
		}

		$starIcon = TableRenderer::get_icon('star');

		for (; $i <= 5; $i++) {
			$i++;
			$icons .= <<<HTML
			<span class="wptb-icon-link-target-{$i}">
			  <div
			    class="wptb-icon wptb-icon-{$i}"
				style="width: {$size}; height: {$size}; fill: rgb(0, 0, 0);"
				data-wptb-icon-src="star"
			  >
			    {$starIcon}
			  </div>
			</span>
			HTML;
		}

		$align = esc_attr( $props['alignment'] ?? 'center' );

		return <<<HTML
		  <div
		    class="wptb-icon-container wptb-ph-element wptb-element-icon-1"
		    style="{$style}"
		  >
		  <div class="wptb-icon-wrapper" style="text-align: {$align}">
		      {$icons}
		  </div>
		  </div>
		HTML;
	}
}
