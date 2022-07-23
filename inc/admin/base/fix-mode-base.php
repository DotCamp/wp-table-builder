<?php

namespace WP_Table_Builder\Inc\Admin\Base;

use DOMDocument;
use Exception;
use function get_bloginfo;
use function get_post_meta;
use function get_post_type;

/**
 * Class for main process logic for specific fix operations.
 *
 * Implement either `fix_logic` or `content_fix_logic` (or both) depending on use case.
 */
abstract class Fix_Mode_Base {

	/**
	 * Create a dom handler to traverse html content of a table.
	 * @return DOMDocument dom document instance
	 * @throws Exception upon unsuccessful dom parsing result
	 */
	protected final function create_dom_handler_base( $content ) {
		$dom_handler = new DOMDocument( '1.0', 'UTF-8' );
		$status      = @$dom_handler->loadHTML( $content, LIBXML_NOERROR | LIBXML_NOWARNING | LIBXML_HTML_NODEFDTD | LIBXML_HTML_NOIMPLIED );

		if ( $status === false ) {
			throw new Exception( 'could not load html content' );
		}

		return $dom_handler;
	}

	/**
	 * Create a dom handler with converted encodings to traverse html content of a table.
	 *
	 * @return DOMDocument dom document instance
	 * @throws Exception upon unsuccessful dom parsing result
	 */
	protected final function create_dom_handler( $content ) {
		if ( function_exists( 'mb_convert_encoding' ) ) {
			$site_charset    = get_bloginfo( 'charset' );
			$encoded_content = mb_convert_encoding( $content, "HTML-ENTITIES", $site_charset );

			return $this->create_dom_handler_base( $encoded_content );

		} else {
			throw new Exception( esc_html__( 'no mb_convert_encoding_found' ) );
		}
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

			if ( $content !== false && empty( $content ) !== true ) {
				try {
					$dom_handler = $this->create_dom_handler( $content );
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
	 * Fix table content.
	 *
	 * @param string $table_content table html content
	 *
	 * @return string fixed content
	 */
	public function fix_content( $table_content ) {
		try {
			$dom_handler   = $this->create_dom_handler( $table_content );
			$table_content = $this->content_fix_logic( $dom_handler );

			if ( is_null( $table_content ) ) {
				throw new Exception( esc_html__( 'content_fix_logix is not implementd' ) );
			} else {
				return $table_content;
			}

		} catch ( Exception $e ) {
			// do nothing
		}

		return $table_content;
	}

	/**
	 * Fix table issues according to logic defined in here.
	 *
	 * @param DOMDocument $dom_handler dom handler instance
	 *
	 * @return boolean logic fix status
	 */
	abstract protected function fix_logic( $dom_handler );

	/**
	 * Fix table content issues according to logic defined in here
	 *
	 * @param DOMDocument $dom_handler dom handler instance
	 *
	 * @return string|null fixed content logic, null if not implemented
	 */
	protected function content_fix_logic( $dom_handler ) {
		return null;
	}
}
