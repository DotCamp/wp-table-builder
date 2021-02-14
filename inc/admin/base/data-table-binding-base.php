<?php

namespace WP_Table_Builder\Inc\Admin\Base;

// called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Data_Table_Binding_Base.
 *
 * Base class for data table bindings.
 * @package WP_Table_Builder\Inc\Admin\Base
 */
abstract class Data_Table_Binding_Base {
	/**
	 * Data array.
	 * @var array
	 */
	protected $data;

	/**
	 * Binding array.
	 * @var array
	 */
	protected $binding;

	/**
	 * Data_Table_Binding_Base constructor.
	 *
	 * @param array $data
	 * @param array $binding
	 */
	public function __construct( $data, $binding ) {
		$this->data    = $data;
		$this->binding = $binding;
	}

	/**
	 * Generate data based on data bindings.
	 * @return array generated data
	 */
	public function generate_data() {
		$generated_data = $this->generate_data_logic();
		$sorted_data    = $this->sort_data( $generated_data );

		return $this->call_before_data_send( $sorted_data );
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
		return $final_data;
	}

	/**
	 * Sort data according to bindings.
	 *
	 * @param array $data data array
	 *
	 * @return array sorted data array
	 */
	private function sort_data( $data ) {
		$sort_bindings   = $this->get_sort_bindings();
		$sort_target     = $sort_bindings['sortTarget'];
		$sort_multiplier = $sort_bindings['sortDirection'] === 'asc' ? 1 : - 1;


		$sorted_data = $data;

		if ( $sort_target !== 'none' ) {
			$column_values = $this->get_column_values( $sort_target, $data );
			usort( $column_values, function ( $a, $b ) use ( $sort_multiplier ) {
				if ( $a['value'] > $b['value'] ) {
					return 1 * $sort_multiplier;
				}
				if ( $a['value'] < $b['value'] ) {
					return - 1 * $sort_multiplier;
				}

				return 0;
			} );

			$context     = $this;
			$sorted_data = array_map( function ( $cell ) use ( $context ) {
				return $context->get_row( $cell['rowId'] )[0];
			}, $column_values );
		}

		return $sorted_data;
	}

	/**
	 * Logic used to generate data.
	 * @return array generated data
	 */
	abstract function generate_data_logic();

	/**
	 * Get sort related bindings.
	 * @return array sort bindings
	 */
	private function get_sort_bindings() {
		return ( $this->binding )['sort'];
	}

	/**
	 * Get column values.
	 *
	 * @param string $col_id column id
	 * @param array|null $custom_data custom data to use, if not supplied, binding data will be used
	 *
	 * @return array column values
	 */
	public function get_column_values( $col_id, $custom_data = null ) {
		if ( $custom_data === null ) {
			$custom_data = $this->data;
		}

		return array_reduce( $custom_data, function ( $carry, $row ) use ( $col_id ) {
			if ( is_array( $row ) ) {
				$row = (object) $row;
			}

			$row_id = $row->rowId;

			$row_values = array_reduce( $row->values, function ( $carry, $value ) use ( $col_id, $row_id ) {
				if ( $value->colId === $col_id ) {
					$carry[] = array_merge( (array) $value, [ 'rowId' => $row_id ] );
				}

				return $carry;
			}, [] );

			return array_merge( $carry, $row_values );
		}, [] );
	}

	/**
	 * Get row array, if an array of row ids are supplied get all of those rows instead.
	 *
	 * @param string|array $row_id row id(s)
	 * @param array|null $custom_data data to use for operation, if this parameter is not supplied, binding data will be used instead
	 *
	 * @return array row object(s)
	 */
	public function get_row( $row_id, $custom_data = null ) {
		if ( $custom_data === null ) {
			$custom_data = $this->data;
		}

		if ( ! is_array( $row_id ) ) {
			$row_id = [ $row_id ];
		}

		return array_reduce( $custom_data, function ( $carry, $row ) use ( $row_id ) {
			if ( is_array( $row ) ) {
				$row = (object) $row;
			}

			if ( in_array( $row->rowId, $row_id ) ) {
				$carry[] = (array) $row;
			}

			return $carry;
		}, [] );
	}
}
