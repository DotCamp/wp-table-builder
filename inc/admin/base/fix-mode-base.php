<?php

namespace WP_Table_Builder\Inc\Admin\Base;

use DOMDocument;
use Exception;
use function get_bloginfo;
use function get_post_meta;
use function get_post_type;


/**
 * Class for main process logic for specific fix operations.
 */
abstract class Fix_Mode_Base {

	/**
	 * Create a dom handler to traverse html content of a table.
	 * @return DOMDocument dom document instance
	 * @throws Exception upon unsuccessful dom parsing result
	 */
	protected final function create_dom_handler( $content ) {
		$dom_handler = new DOMDocument( '1.0', 'UTF-8' );
		$status      = @$dom_handler->loadHTML( $content, LIBXML_NOERROR | LIBXML_NOWARNING | LIBXML_HTML_NODEFDTD | LIBXML_HTML_NOIMPLIED );

		if ( $status === false ) {
			throw new Exception( 'could not load html content' );
		}

		return $dom_handler;
	}

	/**
	 * Fix content of a table.
	 *
	 * @param integer $table_id table id to fix its content
	 *
	 * @return boolean fix process result
	 */
	public final function fix( $table_id ) {
		$status = false;
		if ( get_post_type( $table_id ) === 'wptb-tables' ) {
			$content = get_post_meta( $table_id, '_wptb_content_', true );

			if ( $content !== false && empty( $content ) !== true && function_exists( 'mb_convert_encoding' ) ) {
				try {
					$site_charset    = get_bloginfo( 'charset' );
					$encoded_content = mb_convert_encoding( $content, "HTML-ENTITIES", $site_charset );

					$dom_handler = $this->create_dom_handler( $encoded_content );
					$result      = $this->fix_logic( $dom_handler );

					if ( $result ) {
						$status = update_post_meta( $table_id, '_wptb_content_', $dom_handler->saveHTML() );
					}
				} catch ( Exception $e ) {
					$status = false;
					// do nothing
				}
			}
		}

		return $status;
	}

	/**
	 * Fix table issues according to logic defined in here.
	 *
	 * @param DOMDocument $dom_handler dom handler instance
	 *
	 * @return boolean logic fix status
	 */
	abstract protected function fix_logic( $dom_handler );
}
