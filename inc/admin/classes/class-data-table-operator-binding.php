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
	 * @return array generated data
	 */
	function generate_data() {
		$operator_bindings = $this->get_operator_bindings();

		$operator_type = $operator_bindings['operatorType'];

		return call_user_func( [ $this, $operator_type . '_operator_type' ], $operator_bindings['compareColumn'] );
	}

	/**
	 * Higher than operator type logic.
	 *
	 * @param string $compare_column compare column id
	 *
	 * @return array higher than row data
	 */
	private function higher_operator_type( $compare_column ) {
		$column_values = $this->get_column_values( $compare_column );
		$amount        = $this->get_operator_bindings()['thanAmount'];

		$row_ids = array_reduce( $column_values, function ( $carry, $cell ) use ( $amount ) {
			if ( $cell['value'] > $amount ) {
				$carry[] = $cell['rowId'];
			}

			return $carry;
		} );

		return [];
	}

	/**
	 * Highest operator type logic.
	 *
	 * @param string $compareColumn compare column id
	 *
	 * @return array highest row data
	 */
	private function highest_operator_type( $compareColumn ) {
		return $this->highest_lowest_base( $compareColumn, true );
	}

	/**
	 * Lowest operator type logic.
	 *
	 * @param string $compareColumn compare column id
	 *
	 * @return array highest row data
	 */
	private function lowest_operator_type( $compareColumn ) {
		return $this->highest_lowest_base( $compareColumn, false );
	}

	/**
	 * Base function for highest/lowest operations.
	 *
	 * @param string $compareColumn id of column to compare values
	 * @param bool $highest is highest value or lowest one to go for
	 *
	 * @return array row data
	 */
	private function highest_lowest_base( $compareColumn, $highest ) {
		$multiplier = $highest ? 1 : - 1;

		$column_values = self::get_column_values( $compareColumn );

		$row_id = array_reduce( $column_values, function ( $carry, $cell ) use ( $multiplier ) {
			if ( ( ( $cell['value'] > $carry['value'] ) ? 1 : - 1 ) * $multiplier > 0 || $carry['value'] === null ) {
				$carry['value'] = $cell['value'];
				$carry['rowId'] = $cell['rowId'];
			}

			return $carry;
		}, [ 'value' => null, 'rowId' => null ] )['rowId'];

		return [ $this->get_row( $row_id ) ];

	}
}
