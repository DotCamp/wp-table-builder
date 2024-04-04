<?php

namespace WP_Table_Builder\Inc\Common\Factory;

use DOMDocument;
use WP_Table_Builder\Inc\Common\Interfaces\Factory;
use function get_bloginfo;
use function mb_encode_numericentity;

/**
 * DomDocument factory.
 */
class Dom_Document_Factory implements Factory {
	/**
	 * Create factory target.
	 *
	 * @param string $html_string html string to be used with DomDocument;
	 *
	 * @return null | DOMDocument DomDocument instance or null if operation is failed
	 */
	public static function make( $html_string ) {
		if ( function_exists( 'mb_encode_numericentity' ) ) {
			$dom_handler = new DOMDocument();
			$charset     = get_bloginfo( 'charset' );

			$converted_html_string = mb_encode_numericentity(
				$html_string,
				[ 0x80, 0x10ffff, 0, 0xffff ],
				$charset
			);

			$status = @$dom_handler->loadHTML( $converted_html_string, LIBXML_NOWARNING | LIBXML_NOERROR | LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );

			if ( $status ) {
				return $dom_handler;
			}
		}

		return null;
	}
}
