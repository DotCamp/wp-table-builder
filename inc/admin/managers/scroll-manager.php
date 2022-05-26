<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use DOMDocument;
use DOMXPath;
use WP_Table_Builder\Inc\Common\Traits\Init_Once;
use WP_Table_Builder\Inc\Common\Traits\Singleton_Trait;
use function add_filter;
use function get_bloginfo;
use function mb_convert_encoding;

// if called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Scroll manager for table scrolling capabilities.
 */
class Scroll_Manager {
	use Singleton_Trait;
	use Init_Once;

	/**
	 * Function to be called during initialization process.
	 */
	public static function init_process() {
		$instance = static::get_instance();

		add_filter( 'wp-table-builder/filter/table_html_shortcode', [ $instance, 'process_shortcode' ], 1, 99 );

		add_filter( 'wp-table-builder/filter/wptb_frontend_data', [ $instance, 'handle_frontend_data' ], 1, 99 );
	}

	/**
	 * Add scroll manager frontend data.
	 *
	 * @param array $data frontend data
	 *
	 * @return array frontend related data
	 */
	public function handle_frontend_data( $data ) {
		$data['scrollManager'] = [
			'frontendCalculationStatus' => ! function_exists( 'mb_convert_encoding' )
		];

		return $data;
	}

	/**
	 * Process and prepare shortcode for scroll functionality.
	 *
	 * @param string $shortcode_html table shortcode
	 *
	 * @return string shortcode html
	 *
	 */
	public function process_shortcode( $shortcode_html ) {
		if ( function_exists( 'mb_convert_encoding' ) ) {
			$dom_handler = new DOMDocument();

			$charset = get_bloginfo( 'charset' );

			$handler_status = @$dom_handler->loadHTML( mb_convert_encoding( $shortcode_html, 'HTML-ENTITIES', $charset ), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_NOERROR | LIBXML_NOWARNING );

			if ( $handler_status ) {
				$table_element = $dom_handler->getElementsByTagName( 'table' );

				if ( ! empty( $table_element ) ) {
					$table_element            = $table_element[0];
					$horizontal_scroll_status = $table_element->getAttribute( 'data-wptb-horizontal-scroll-status' );

					if ( ! empty( $horizontal_scroll_status ) && filter_var( $horizontal_scroll_status, FILTER_VALIDATE_BOOLEAN ) ) {
						$dom_query = new DOMXPath( $dom_handler );

						$parent_container = $dom_query->query( '//div[contains(@class, "wptb-table-container") and not(contains(@class, "wptb-table-container-matrix"))]' );

						if ( $parent_container->length > 0 ) {
							$parent_container = $parent_container->item( 0 );

							$parent_container->setAttribute( 'data-wptb-horizontal-scroll-status', 'true' );

							$max_width = $table_element->getAttribute( 'data-wptb-table-container-max-width' );

							if ( ! empty( $max_width ) ) {
								$container_matrix = $dom_query->query( '//div[contains(@class, "wptb-table-container-matrix")]' );

								if ( $container_matrix->length > 0 ) {
									$container_matrix       = $container_matrix->item( 0 );
									$container_matrix_style = $container_matrix->getAttribute( 'style' );

									$width_style_property = sprintf( 'width: %1$spx', $max_width );

									$container_matrix_style = $container_matrix_style . ' ' . $width_style_property;

									$container_matrix->setAttribute( 'style', $container_matrix_style );
								}
							}
							$shortcode_html = $dom_handler->saveHTML();
						}
					}

				}
			}
		}

		return $shortcode_html;
	}
}
