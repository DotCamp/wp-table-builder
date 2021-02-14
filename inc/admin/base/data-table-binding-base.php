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
	 * @return array
	 */
	abstract function generate_data();

	/**
	 * Get column values.
	 *
	 * @param string $col_id column id
	 *
	 * @return array column values
	 */
	public function get_column_values( $col_id ) {
		return array_reduce( $this->data, function ( $carry, $row ) use ( $col_id ) {
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
	 * Get row array.
	 *
	 * @param string $row_id row id
	 *
	 * @return array row object
	 */
	public function get_row( $row_id ) {
		return array_reduce( $this->data, function ( $carry, $row ) use ( $row_id ) {
			if ( $row->rowId === $row_id ) {
				$carry = (array) $row;
			}

			return $carry;
		}, [] );
	}
}
