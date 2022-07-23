<?php

namespace WP_Table_Builder\Inc\Admin\Managers\Fix_Modes;

use DOMDocument;
use DOMXPath;
use WP_Table_Builder\Inc\Admin\Base\Fix_Mode_Base;

/**
 * Fix mode for supporting older tables with tooltip functionality.
 */
class Legacy_Tooltip extends Fix_Mode_Base {

	/**
	 * Fix table issues according to logic defined in here.
	 *
	 * @param DOMDocument $dom_handler dom handler instance
	 *
	 * @return boolean logic fix status
	 */
	protected function fix_logic( $dom_handler ) {
		return false;
	}

	/**
	 * Fix table content issues according to logic defined in here
	 *
	 * @param DOMDocument $dom_handler dom handler instance
	 *
	 * @return string|null fixed content logic, null if not implemented
	 */
	protected function content_fix_logic( $dom_handler ) {
		$dom_query = new DOMXPath( $dom_handler );

		$tooltip_items = $dom_query->query( '//li[contains(@class, "wptb-tooltip")]//div[contains(@class, "tooltip") and not(contains(@class, "wptb-m-tooltip"))]' );

		if ( $tooltip_items->length > 0 ) {
			foreach ( $tooltip_items as $tooltip_item ) {
				$class_attr     = $tooltip_item->getAttribute( 'class' );
				$replaced_class = preg_replace( '/(?<![\w-])(tooltip\b)/', 'wptb-m-tooltip', $class_attr );

				$tooltip_item->setAttribute( 'class', $replaced_class );
			}
		}

		return $dom_handler->saveHTML();
	}
}


