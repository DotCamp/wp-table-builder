<?php

namespace WP_Table_Builder\Inc\Admin\Classes;

use WP_Table_Builder\Inc\Admin\Base\Data_Table_Binding_Base;

// if called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die();
}

class Data_Table_Operator_Binding extends Data_Table_Binding_Base {

	/**
	 * Generate data based on data bindings.
	 * @return array
	 */
	function generate_data() {
		return [];
	}
}
