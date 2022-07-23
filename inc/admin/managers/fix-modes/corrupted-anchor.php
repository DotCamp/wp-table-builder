<?php

namespace WP_Table_Builder\Inc\Admin\Managers\Fix_Modes;

use DOMDocument;
use DOMElement;
use DOMXPath;
use WP_Table_Builder\Inc\Admin\Base\Fix_Mode_Base;

/**
 * Corrupted anchor fix.
 */
class Corrupted_Anchor extends Fix_Mode_Base {
	/**
	 * Highest element ids related to WPTB Text element.
	 * @var null|array
	 */
	private $highest_anchor_ids = null;

	/**
	 * Fix table issues according to logic defined in here.
	 *
	 * @param DOMDocument $dom_handler dom handler instance
	 *
	 * @return boolean logic fix status
	 */
	protected function fix_logic( $dom_handler ) {
		$dom_query = new DOMXPath( $dom_handler );

		$faulty_elements = $dom_query->query( '//td/a' );

		if ( $faulty_elements->length > 0 ) {
			$remove_list = [];
			foreach ( $faulty_elements as $element ) {
				$element_id = $this->generate_id( $dom_handler );
				$this->create_container_element( $element, $element_id, $dom_handler );
				$remove_list[] = $element;
			}

			foreach ( $remove_list as $remove_element ) {
				$remove_element->parentNode->removeChild( $remove_element );
			}

			return true;
		}

		return false;
	}

	/**
	 * Create a container element for the given DOMElement.
	 *
	 * @param DOMElement $element element
	 * @param integer $id element id
	 * @param DOMDocument $dom_handler DOMDocument instance
	 */
	private function create_container_element( $element, $id, $dom_handler ) {
		$outer_html = wp_sprintf(
			'<div class="wptb-text-container wptb-ph-element wptb-element-text-%1$s" style="padding: 0px; margin: 0px;"><div class="" style="position: relative;"><p><a href="%2$s" data-mce-href="%2$s" data-mce-selected="inline-boundary">%3$s</a></p></div></div>', $id, $element->getAttribute( 'href' ), $element->nodeValue
		);

		$contextual_fragment = $dom_handler->createDocumentFragment();
		$contextual_fragment->appendXML( $outer_html );

		$element->parentNode->appendChild( $contextual_fragment );
	}

	/**
	 * Generate element and mce ids.
	 *
	 * @param DOMDocument $dom_handler DOMDocument instance
	 *
	 * @return array generated ids
	 */
	private function generate_id( $dom_handler ) {
		if ( is_null( $this->highest_anchor_ids ) ) {
			$this->highest_anchor_ids = $this->find_highest_ids( $dom_handler );

		}

		return $this->highest_anchor_ids['element'] ++;
	}

	/**
	 * Will find the highest text element and mce ids.
	 *
	 * @param DOMDocument $dom_handler DOMDocument instance
	 *
	 * @return array|null associated array with the highest element and mce ids
	 */
	private function find_highest_ids( $dom_handler ) {
		$text_element_query = new DOMXPath( $dom_handler );

		$wptb_text_elements = $text_element_query->query( '//div[contains(@class, "wptb-text-container")]' );

		$id_array = [ 'element' => 0 ];

		if ( $wptb_text_elements->length > 0 ) {
			foreach ( $wptb_text_elements as $text_element ) {
				$match = [];

				$status = preg_match( '/wptb-element-text-(?<id>\d*)/', $text_element->getAttribute( 'class' ), $match );

				if ( filter_var( $status, FILTER_VALIDATE_BOOLEAN ) && isset( $match['id'] ) ) {
					$id_array['element'] = max( $id_array['element'], $match['id'] );
				}
			}
		}

		return $id_array;
	}
}
