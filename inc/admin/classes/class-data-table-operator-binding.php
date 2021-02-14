<?php

namespace WP_Table_Builder\Inc\Admin\Classes;

use WP_Table_Builder\Inc\Admin\Base\Data_Table_Binding_Base;

// if called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die();
}

class Data_Table_Operator_Binding extends Data_Table_Binding_Base {

	/**
	 * Get data bindings related to operator binding mode.
	 * @return array operator bindings array
	 */
	private function get_operator_bindings() {
		return ( $this->binding )['operator'];
	}

	/**
	 * Generate data based on data bindings.
	 * @return array
	 */
	function generate_data() {
		$operator_bindings = $this->get_operator_bindings();

		$operator_type = $operator_bindings['operatorType'];

		$data = call_user_func( [ $this, $operator_type . '_operator_type' ], $operator_bindings['compareColumn'] );

		return $data;
	}

	/**
	 * Highest operator type logic.
	 *
	 * @param string $compareColumn compare column id
	 *
	 * @return array highest row data
	 */
	private function highest_operator_type( $compareColumn ) {
		return array_reduce( $this->data, function ( $carry, $row ) use ( $compareColumn ) {


			return $carry;
		}, [] );
	}
}
