<?php

namespace WP_Table_Builder\Inc\Admin\Classes;

use WP_Table_Builder\Inc\Admin\Base\Data_Table_Binding_Base;

// if called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Data_Table_Operator_Binding.
 *
 * Operator mode binding for data table.
 * @package WP_Table_Builder\Inc\Admin\Classes
 */
class Data_Table_Operator_Binding extends Data_Table_Binding_Base {

	/**
	 * Get data bindings related to operator binding mode.
	 * @return array operator bindings array
	 */
	private function get_operator_bindings() {
		return ( $this->binding )['operator'];
	}

	/**
	 * Logic used to generate data.
	 * @return array generated data
	 */
	public function generate_data_logic() {
		$operator_bindings = $this->get_operator_bindings();

		$operator_type = $operator_bindings['operatorType'];

		return $this->call_operator_logic( $operator_type, $operator_bindings['compareColumn'] );
	}


	/**
	 * Call operator type specific logic function.
	 *
	 * @param string $operator_type type of operator
	 * @param mixed ...$args arguments to call operator logic
	 *
	 * @return array operator logic result
	 */
	private function call_operator_logic( $operator_type, ...$args ) {
		return call_user_func_array( [
			$this,
			$operator_type . '_operator_type_logic'
		], $args );
	}


	/**
	 * Final call before generated data is sent.
	 *
	 * Use this function to make final operations on generated data.
	 *
	 * @param array $final_data final data array
	 *
	 * @return array final data
	 */
	public function call_before_data_send( $final_data ) {
		return $this->select_operations( $final_data );
	}

	/**
	 * Operator select operations.
	 *
	 * @param array $final_data final data
	 *
	 * @return array select operation applied final data
	 */
	private function select_operations( $final_data ) {
		$operator_bindings = $this->get_operator_bindings();

		$select_amount        = $operator_bindings['rowAmount'];
		$select_custom_amount = $operator_bindings['rowCustomAmount'];

		if ( $select_amount === 'custom' ) {
			$final_data = array_slice( $final_data, 0, $select_custom_amount );
		}

		return $final_data;
	}

	/**
	 * Not operator type logic.
	 *
	 * @param string $compare_column compare column id
	 *
	 * @return array equal row data
	 */
	private function not_operator_type_logic( $compare_column ) {
		$operator_second = $this->get_operator_bindings()['operatorType2'];

		$operator_result_data = $this->call_operator_logic( $operator_second, $compare_column );
		$row_ids              = array_map( function ( $row ) {
			return $row['rowId'];
		}, $operator_result_data );

		return array_filter( $this->data, function ( $row ) use ( $row_ids ) {
			return ! in_array( $row->rowId, $row_ids );
		} );
	}

	/**
	 * Equal operator type logic.
	 *
	 * @param string $compare_column compare column id
	 *
	 * @return array equal row data
	 */
	private function equal_operator_type_logic( $compare_column ) {
		$equal_amount  = $this->get_operator_bindings()['equalAmount'];
		$column_values = $this->get_column_values( $compare_column );

		$rows_ids = array_reduce( $column_values, function ( $carry, $cell ) use ( $equal_amount ) {
			if ( $cell['value'] === $equal_amount ) {
				$carry[] = $cell['rowId'];
			}

			return $carry;
		} );

		return $this->get_row( $rows_ids );
	}

	/**
	 * Higher than operator type logic.
	 *
	 * @param string $compare_column compare column id
	 *
	 * @return array higher than row data
	 */
	private function higher_operator_type_logic( $compare_column ) {
		return $this->higher_lower_operator_type_base( $compare_column, true );

	}

	/**
	 * Lower than operator type logic.
	 *
	 * @param string $compare_column compare column id
	 *
	 * @return array lower than row data
	 */
	private function lower_operator_type_logic( $compare_column ) {
		return $this->higher_lower_operator_type_base( $compare_column, false );
	}

	/**
	 * Higher/lower than operator type base.
	 *
	 * @param string $compare_column compare column id
	 * @param boolean $higher use higher than logic or lower than
	 *
	 * @return array higher/lower than row data
	 */
	private function higher_lower_operator_type_base( $compare_column, $higher ) {
		$column_values = $this->get_column_values( $compare_column );
		$amount        = $this->get_operator_bindings()['thanAmount'];

		$row_ids = array_reduce( $column_values, function ( $carry, $cell ) use ( $amount, $higher ) {
			if ( $higher ? $cell['value'] > $amount : $cell['value'] < $amount ) {
				$carry[] = $cell['rowId'];
			}

			return $carry;
		} );

		return $this->get_row( $row_ids );
	}

	/**
	 * Highest operator type logic.
	 *
	 * @param string $compareColumn compare column id
	 *
	 * @return array highest row data
	 */
	private function highest_operator_type_logic( $compareColumn ) {
		return $this->highest_lowest_base( $compareColumn, true );
	}

	/**
	 * Lowest operator type logic.
	 *
	 * @param string $compareColumn compare column id
	 *
	 * @return array highest row data
	 */
	private function lowest_operator_type_logic( $compareColumn ) {
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

		return $this->get_row( $row_id );
	}
}
