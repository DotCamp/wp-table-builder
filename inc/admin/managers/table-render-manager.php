<?php

namespace WP_Table_Builder\Inc\Admin\Managers;


use WP_Table_Builder\Inc\Common\Factory\Dom_Document_Factory;
use WP_Table_Builder\Inc\Common\Traits\Init_Once;
use function add_filter;
use DOMXPath;

/**
 * Class Table_Render_Manager
 *
 * Manager for pre/post table render operations.
 */
class Table_Render_Manager {
	use Init_Once;

	/**
	 * Initialize table render manager.
	 */
	public static function init_process() {
		add_filter( 'wp-table-builder/filter/table_html_shortcode', [ __CLASS__, 'table_html_render' ], 10, 1 );
		add_filter( 'wp-table-builder/filter/get_table', [ __CLASS__, 'table_html_render' ], 10, 1 );
	}

	/**
	 * Table HTML render filter function.
	 *
	 * @param string $table_html Table HTML.
	 *
	 * @return string Filtered table HTML.
	 */
	public static function table_html_render( $table_html ) {
		$dom_handler = Dom_Document_Factory::make( $table_html );

		if ( ! is_null( $dom_handler ) ) {
			$dom_query = new DOMXPath( $dom_handler );

			$img_onerror = $dom_query->query('//img[@onerror]');

			if($img_onerror->length > 0) {
				foreach ($img_onerror as $img_onerror_item) {
					$img_onerror_item->removeAttribute('onerror');
				}
				$table_html = $dom_handler->saveHTML();
			}
		}

		return $table_html;
	}
}
