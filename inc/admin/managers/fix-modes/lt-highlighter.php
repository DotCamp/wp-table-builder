<?php

namespace WP_Table_Builder\Inc\Admin\Managers\Fix_Modes;

use DOMDocument;
use DOMXPath;
use WP_Table_Builder\Inc\Admin\Base\Fix_Mode_Base;

/**
 * Lt highlighter corruption fix.
 */
class Lt_Highlighter extends Fix_Mode_Base {

	/**
	 * Fix table issues according to logic defined in here.
	 *
	 * @param DOMDocument $dom_handler dom handler instance
	 *
	 * @return boolean logic fix status
	 */
	protected function fix_logic( $dom_handler ) {
		$dom_query = new DOMXPath( $dom_handler );

		$faulty_elements = $dom_query->query( '//div[contains(@class, "wptb-text-container")]//lt-highlighter' );

		if ( $faulty_elements->length > 0 ) {
			$elements_to_remove = [];
			foreach ( $faulty_elements as $lt_highlighter_element ) {
				$sibling_div = $lt_highlighter_element->nextSibling;
				if ( $sibling_div ) {
					$sibling_class = $sibling_div->getAttribute( 'class' ) . ' mce-content-body';
					$sibling_div->setAttribute( 'class', $sibling_class );
				}

				$elements_to_remove[] = $lt_highlighter_element;
			}

			foreach ( $elements_to_remove as $element ) {
				$element->parentNode->removeChild( $element );
			}

			return true;
		}

		return false;
	}
}
