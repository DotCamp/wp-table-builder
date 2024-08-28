<?php

namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Element_Base as Element_Base;
use WP_Table_Builder\Inc\Admin\Element_Classes\TableRenderer;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder as NS;

// If this file is called directly, abort.
if (!defined('WPINC')) {
	die;
}

class Star_Rating_Element extends Element_Base
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
		return 'star_rating';
	}

	/**
	 * Get element button.
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
		return esc_html_e('Star Rating', 'wp-table-builder');
	}

	/**
	 * Get directory icon.
	 *
	 * Retrieve directory star-rating editor element icon.
	 *
	 * @return string Directory Element icon.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	public function get_directory_icon()
	{
		return NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/star_rating.svg';
		;
	}

	/**
	 * Get url icon.
	 *
	 * Return url star-rating icon
	 *
	 * @return string Url Element icon.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	public function get_url_icon()
	{
		return wp_normalize_path(NS\WP_TABLE_BUILDER_URL . 'inc/admin/views/builder/icons/star_rating.svg');
	}

	/**
	 * Include file with js script for element star rating
	 *
	 * @since 1.1.2
	 * @access protected
	 */
	public function element_script()
	{
		return wp_normalize_path(NS\WP_TABLE_BUILDER_DIR . 'inc/admin/element-classes/element-scripts/star-rating-element.js');
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
		$this->add_control(
			'section_header',
			[
				'label' => __('Star Rating Options', 'wp-table-builder'),
				'type' => Controls_Manager::SECTION_HEADER,
				'buttonBack' => true
			]
		);

		$this->add_control(
			'starRatingSize',
			[
				'label' => __('Star Size', 'wp-table-builder'),
				'type' => Controls_Manager::RANGE,
				'selectors' => [
					[
						'query' => '{{{data.container}}} .wptb-rating-star',
						'type' => Controls_Manager::STYLE,
						'key' => ['width', 'height'],
						'format' => '{$}px'
					],
				],
				'min' => 10,
				'max' => 50,
				'defaultValue' => 20,
				'postFix' => 'px'
			]
		);

		$this->add_control(
			'starColor',
			[
				'label' => __('Star Color', 'wp-table-builder'),
				'type' => Controls_Manager::COLOR_PALETTE,
				'selectors' => [
					[
						'query' => '{{{data.container}}} .wptb-rating-star span svg',
						'type' => Controls_Manager::STYLE,
						'key' => 'fill'
					]
				],
				"defaultValue" => 'null'
			]
		);

		$this->add_control(
			'starCount',
			[
				'label' => __('Star Count', 'wp-table-builder'),
				'type' => Controls_Manager::NUMBER,
				'min' => 1,
				'max' => 10,
				'selectors' => [
					'{{{data.container}}}' => 'data-star-count',
				],
				'defaultValue' => 5,
			]
		);

		$this->add_control(
			'ratingAlignmentCheckbox',
			[
				'label' => __('Rating Alignment', 'wp-table-builder'),
				'type' => Controls_Manager::ALIGNMENT2,
				'selectors' => [
					[
						'query' => '{{{data.container}}}',
						'type' => Controls_Manager::STYLE,
						'key' => 'textAlign'
					]
				],
				'defaultValue' => 'center'
			]
		);

		$this->add_control(
			'numberRatingShowHide',
			[
				'label' => __('Show Number Rating', 'wp-table-builder'),
				'type' => Controls_Manager::TOGGLE,
				'selectors' => [
					'{{{data.container}}} .wptb-rating-stars-box .wptb-number-rating-box' => [
						'display',
						'block',
						'none'
					],
					'{{{data.container}}} .wptb-rating-stars-box .wptb-success-box' => [
						'display',
						'block',
						'none'
					],
				],
			]
		);

		$this->add_control(
			'numberRatingSize',
			[
				'label' => __('Number Rating Size', 'wp-table-builder'),
				'type' => Controls_Manager::SIZE,
				'selectors' => [
					'{{{data.container}}} .wptb-number-rating' => ['fontSize', 'lineHeight', 'height']
				],
				'min' => 10,
				'max' => 50,
				'defaultValue' => 25,
				'dimension' => 'px',
				'customClassForContainer' => 'wptb-numeral-star-rating-option',
				'containerAdditionalStyles' => 'display:none;',
				'appearDependOnControl' => ['numberRatingShowHide', ['checked'], ['unchecked']]
			]
		);

		$this->add_control(
			'numberRatingColor',
			[
				'label' => __('Font Color', 'wp-table-builder'),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{{data.container}}} .wptb-number-rating' => 'color',
				],
				'customClassForContainer' => 'wptb-numeral-star-rating-option',
				'containerAdditionalStyles' => 'display:none;',
				'appearDependOnControl' => ['numberRatingShowHide', ['checked'], ['unchecked']]
			]
		);
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
		<div class="wptb-rating-stars-box">
			<?php

			$countStarts = 5;

			ob_start();
			require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/filled-rating-star-small.php';
			$filled_rating_star_html = ob_get_clean();


			ob_start();
			require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/not-filled-rating-star-small.php';
			$not_filled_rating_star_html = ob_get_clean();


			ob_start();
			require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/half-filled-rating-star-small.php';
			$half_filled_rating_star_html = ob_get_clean();

			$rating_star_list = '<ul class="wptb-rating-stars-list">';

			$rating_star = '';
			for ($i = 0; $i < $countStarts; $i++) {
				$rating_star .= '<li class="wptb-rating-star" style="width:20px;" data-value="' . ($i + 1) . '">';
				$rating_star_zero_set = '';
				if ($i == 0) {
					$rating_star_zero_set = '<span class="wptb-rating-star-zero-set"></span>';
				}

				$rating_star .= '<span class="wptb-rating-star-left-signal-part"></span>'
					. '<span class="wptb-filled-rating-star">' . $filled_rating_star_html . '</span>'
					. '<span class="wptb-not-filled-rating-star">' . $not_filled_rating_star_html . '</span>'
					. '<span class="wptb-half-filled-rating-star">' . $half_filled_rating_star_html . '</span>'
					. '<span  class="wptb-rating-star-right-signal-part"></span>';
				$rating_star .= '</li>';
			}
			$rating_star_list .= $rating_star . '</ul>';

			echo $rating_star_list;

			?>
			</ul>
			<div class="wptb-number-rating-box" style="display: none;">
				<div class="wptb-number-rating" style="font-size: 25px;">0/<?php echo $countStarts; ?></div>
			</div>
		</div>
		<?php
	}

	private static function get_rating_star($size, $val, $color)
	{
		$class = 'wptb-rating-star';
		if ($val == 1) {
			$class .= ' wptb-rating-star-selected-full';
		} else if ($val == 0.5) {
			$class .= ' wptb-rating-star-selected-half';
		}
	
		// @formatter:off
		return 
		'<li style="width: ' . $size . '; height: ' . $size . '" data-value="3" class="' . $class . '">' .
			'<span class="wptb-rating-star-left-signal-part"></span>' .
			'<span class="wptb-filled-rating-star">' .
				'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 426.667 426.667" style="enable-background: new 0 0 426.667 426.667; fill: ' . $color . ';" xml:space="preserve">' .
					'<polygon points="426.667,165.12 273.28,152.107 213.333,10.667 153.387,152.107 0,165.12 116.48,266.027 81.493,416 213.333,336.427 345.173,416 310.187,266.027 "/>' .
				'</svg>' .
			'</span>' .
			'<span class="wptb-not-filled-rating-star">' .
				'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 426.667 426.667" style="enable-background: new 0 0 426.667 426.667; fill: ' . $color . ';" xml:space="preserve">' .
					'<path d="M426.667,165.12L273.28,151.893L213.333,10.667l-59.947,141.44L0,165.12l116.48,100.907L81.493,416l131.84-79.573L345.173,416L310.4,266.027L426.667,165.12z M213.333,296.533L133.12,344.96l21.333-91.307l-70.827-61.44l93.44-8.107l36.267-85.973l36.48,86.187l93.44,8.107l-70.827,61.44l21.333,91.307L213.333,296.533z"/>' .
				'</svg>' .
			'</span>' .
			'<span class="wptb-half-filled-rating-star">' .
				'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 426.667 426.667" style="enable-background: new 0 0 426.667 426.667; fill: ' . $color . ';" xml:space="preserve">' .
					'<path d="M426.667,165.12L273.28,151.893L213.333,10.667l-59.947,141.44L0,165.12l116.48,100.907L81.493,416l131.84-79.573L345.173,416L310.4,266.027L426.667,165.12z M213.333,296.533v-198.4l36.48,86.187l93.44,8.107l-70.827,61.44l21.333,91.307L213.333,296.533z"/>' .
				'</svg>' .
			'</span>' .
			'<span class="wptb-rating-star-right-signal-part"></span>' .
		'</li>';
		// @formatter:on
	}


	public static function render($block)
	{

		$props = $block['props'];

		$style = TableRenderer::generate_css_string([
			'text-align' => $props['alignment'] ?? 'center',
			'padding' => $props['padding'] ?? '',
			'margin' => $props['margin'] ?? '',
		]);

		$fontSize = $props['fontSize'] ?? '15px';
		$ratingStyle = TableRenderer::generate_css_string([
			'font-size' => $fontSize,
			'line-height' => $fontSize,
			'height' => $fontSize,
			'color' => $props['color'] ?? '',
		]);

		$total = (int) $props['starCount'] ?? 0;
		$value = (float) $props['value'] ?? 0;

		$ratingDisplay = $props['showRating'] ?? false ? 'block' : 'none';

		$stars = '';

		$starColor = esc_attr($props['starColor'] ?? '#000000');
		$starSize = esc_attr($props['starSize'] ?? '20px');

		$rem = $value;

		for ($i = 0; $i < $total; $i++) {
			$stars .= self::get_rating_star($starSize, $rem > 1 ? 1 : $rem, $starColor);
			$rem--;
		}
	
		// @formatter:off
		return 
		'<div class="wptb-star_rating-container wptb-ph-element wptb-element-star_rating-'.self::$element_id++.'" data-star-count="' . $total . '" style="' . $style . '">' .
			'<div class="wptb-rating-stars-box">' .
				'<ul class="wptb-rating-stars-list">' .
					$stars .
				'</ul>' .
				'<div class="wptb-number-rating-box" style="display: ' . $ratingDisplay . '">' .
					'<div class="wptb-number-rating" style="' . $ratingStyle . '">' . $value . '/' . $total . '</div>' .
				'</div>' .
			'</div>' .
		'</div>';
		// @formatter:on
	}

}
