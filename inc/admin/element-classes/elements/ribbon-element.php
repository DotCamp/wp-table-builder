<?php

namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Element_Classes\TableRenderer;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager;
use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Dummy_Element_base;
use WP_Table_Builder as NS;

/**
 * Class Ribbon_Element dummy
 *
 * Dummy pro element.
 * @package WP_Table_Builder\Inc\Admin\Element_Classes\Elements
 */
class Ribbon_Element extends Dummy_Element_base {

	/**
	 * Name for dummy element.
	 * @return string dummy name
	 */
	public function dummy_name() {
		return 'ribbon';
	}

	/**
	 * Get element title.
	 * @return string element title
	 */
	public function get_title() {
		return esc_html_e( 'Ribbon', 'wp-table-builder' );
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
		return wp_normalize_path( NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/ribbon-element-icon.svg' );
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
		return wp_normalize_path( NS\WP_TABLE_BUILDER_URL . 'inc/admin/views/builder/icons/ribbon-element-icon.svg' );
	}

	public static function render($block) {
		$props = $block['props'];
		$type = $props['type'] ?? false;
		$side = $props['side'] ?? false;

		$attrs = TableRenderer::generate_attrs_string([
			"data-wptb-ribbon-type" => $type,
		    "data-wptb-ribbon-modifications" => $props['modifications'] ?? false,
		    "data-wptb-ribbon-side" => $side,
		    "data-wptb-ribbon-width" => $props['width'] ?? false,
		    "data-wptb-ribbon-x-offset" => $props['xOffset'] ?? false,
		    "data-wptb-ribbon-y-offset" => $props['yOffset'] ?? false,
		]);

		$style = esc_attr($props['style'] ?? '');

		$bgColor = esc_attr($props['background'] ?? '');
		$borderColor = esc_attr($props['borderColor'] ?? '');

		$cClass = '';
		if ( $type == 'sideRibbon' ) {
			$cClass = ' wptb-ribbon-side-fix';
		}

		$mainWrapClass = [
			'rectangleRibbon' => 'wptb-element-ribbon-wrapper',
			'bookmarkRibbon' => 'wptb-element-ribbon-wrapper wptb-ribbon-bookmark-main-wrap wptb-plugin-filter-box-shadow-md',
			'cornerRibbon' => 'wptb-element-ribbon-wrapper wptb-ribbon-corner-main-wrap',
			'iconRibbon' => 'wptb-element-ribbon-wrapper wptb-ribbon-icon01-main-wrap',
			'sideRibbon' => 'wptb-element-ribbon-wrapper wptb-ribbon-sideFancy-main-wrap',
		][$type]??'';

		$iconDisplay = 'none';
		if ( $type === 'iconRibbon' || $type === 'sideRibbon' ) {
			if ($side === 'right') {
				$mainWrapClass .= ' flip';
			}

			$iconDisplay = 'block';
		}

		$textWrapClass = [
			'rectangleRibbon' => 'wptb-element-ribbon-inner wptb-ribbon-type-rectangle-text-wrap wptb-plugin-box-shadow-md',
			'bookmarkRibbon' => 'wptb-element-ribbon-inner',
			'cornerRibbon' => 'wptb-element-ribbon-inner wptb-plugin-filter-box-shadow-md-close',
			'iconRibbon' => 'wptb-element-ribbon-inner wptb-ribbon-icon01-text-wrap wptb-plugin-filter-box-shadow-md',
			'sideRibbon' => 'wptb-element-ribbon-inner wptb-ribbon-sideFancy-text-wrap wptb-plugin-filter-box-shadow-md',
		][$type]??'';

		$wrapStyle = [
			'bookmarkRibbon' => 'width: '.($props['width']??'70').'px'
		][$type]??'';

		$fontSize = esc_attr($props['fontSize'] ?? '15px');

		$text = wp_kses_post($props['text'] ?? '');

		$iconSrc = esc_attr($props['icon'] ?? 'star');
		$icon = TableRenderer::get_icon($iconSrc);
		$iconAttrs = TableRenderer::generate_attrs_string([
			"data-wptb-ribbon-icon-animation-type"=>$props['animationType'] ?? false,
			"data-enable-animation" => $props['enableAnimation'] ?? false
		]);

		$ribbonExtra = [
			'bookmarkRibbon' => <<<HTML
			    <div
			      id="wptbBookmarkRibbonElementEnd"
			      style="color: rgb(155, 65, 65); width: 72px"
			    >
			      <svg
			    	preserveAspectRatio="none"
			    	viewBox="0 0 64 40"
			    	fill="none"
			    	xmlns="http://www.w3.org/2000/svg"
			      >
			    	<path
			    	  class="wptb-ribbon-bookmark-main-path"
			    	  d="M0 40V0H64V38.5714L32.5 19.6429L0 40Z"
			    	  fill="currentColor"
			    	></path>
			      </svg>
			    </div>
			HTML,
			'sideRibbon' => <<<HTML
				<div class="wptb-ribbon-side-fancy-triangle-wrapper">
				<div
					class="wptb-ribbon-side-fancy-triangle-end"
					style="
					border-right: 20px solid transparent;
					border-bottom: 20px solid rgb(255, 255, 255);
					"
				></div>
				<div
					class="wptb-ribbon-side-fancy-triangle-overlay"
					style="
					border-right: 20px solid transparent;
					border-bottom: 20px solid rgba(0, 0, 0, 0.4);
					"
				></div>
				</div>
			HTML,
			
		][$type]??'';

		return <<<HTML
		<div
		  class="wptb-ribbon_element-container wptb-ph-element wptb-element-ribbon_element-1{$cClass}"
		  style="{$style}"
		  {$attrs}
		>
		  <div
		    id="wptbRibbonMainWrap"
		    class="{$mainWrapClass}"
		    style="{$wrapStyle}"
		  >
		    <div
		      id="wptbRibbonTextWrap"
		      class="{$textWrapClass}"
		      style="
		        background-color: {$bgColor};
		        border-color: {$borderColor};
		      "
		    >
		      <p
		        style="width: auto; font-size: {$fontSize}; position: relative"
		        class="wptb-element-ribbon-text"
		      >
		        {$text}
		      </p>
		    </div>
		    <div
		      class="wptb-element-ribbon-color-dump"
		      style="
		        background-color: {$bgColor};
		        border-color: {$borderColor};
		      "
		    ></div>
		    <div
		      id="wptbRibbonIconDump"
		      style="display: {$iconDisplay}"
		      data-wptb-ribbon-icon-src="{$iconSrc}"
		      {$iconAttrs}
		    >
		      {$icon}
		    </div>
		    {$ribbonExtra}
		  </div>
		</div>
		HTML;
	}
}
