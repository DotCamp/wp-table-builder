<?php

namespace WP_Table_Builder\Inc\Admin\Managers\Fix_Modes;

use DOMDocument;
use WP_Table_Builder\Inc\Admin\Base\Fix_Mode_Base;

/**
 * Pwa container corruption fix.
 */
class Pwa_Container extends Fix_Mode_Base {

	/**
	 * Fix table issues according to logic defined in here.
	 *
	 * @param DOMDocument $dom_handler dom handler instance
	 *
	 * @return boolean fix process result
	 */
	protected function fix_logic( $dom_handler ) {
		$faulty_elements = $dom_handler->getElementsByTagName( 'pwa-container-wrapper' );

		if ( $faulty_elements->length > 0 ) {
			$elements_to_remove = [];
			for ( $i = 0; $i < $faulty_elements->length; $i ++ ) {
				$elements_to_remove[] = $faulty_elements[ $i ];
			}

			foreach ( $elements_to_remove as $dom_element ) {
				$dom_element->parentNode->removeChild( $dom_element );
			}

			return true;
		}

		return false;
	}
}
