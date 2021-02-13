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
	 * Binding array
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

}
