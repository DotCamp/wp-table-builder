<?php

namespace WP_Table_Builder\Inc\Admin\Classes;

use WP_Table_Builder\Inc\Admin\Base\Data_Table_Binding_Base;

// if called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Data_Table_Auto_Binding.
 *
 * Auto mode binding for data table.
 * @package WP_Table_Builder\Inc\Admin\Classes
 */
class Data_Table_Auto_Binding extends Data_Table_Binding_Base {
	/**
	 * Generate data based on data bindings.
	 * @return array
	 */
	function generate_data() {
		return $this->data;
	}
}
