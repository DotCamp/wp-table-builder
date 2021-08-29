<?php

namespace WP_Table_Builder\Inc\Admin\Base;

use WP_Table_Builder\Inc\Admin\Base\Controls_Stack;


// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder element base.
 *
 * An abstract class that provides the needed properties and methods to
 * manage and handle elements.
 *
 * @since 1.1.2
 * @abstract
 */
abstract class Element_Base_Object extends Controls_Stack {

	/**
	 * Include file with js script for element
	 *
	 * @since 1.1.2
	 * @access protected
	 */
	public function element_script() {
	}

	/**
	 * Include data to be used with element script.
	 *
	 * Included data will be formatted in JSON format and will follow the naming convention of 'wptb${camelCasedElementName}Data' within element script context.
	 */
	public function script_data() {
	}

	/**
	 * Output a js line including script data as a variable to be used within the context of element's script.
	 * Included data will be in JSON format and will follow the naming convention of 'wptb${camelCasedElementName}Data'.
	 *
	 * @private
	 *
	 * @param bool $echoToOut whether to echo to output buffer or return the value
	 *
	 * @return string script data if $echoToOut is false
	 */
	private function output_script_data( $echoToOut = true ) {
		$prefix    = 'wptb';
		$postfix   = 'data';
		$splitName = explode( '_', $this->get_name() );

		// turn element name into camelcase format
		$camelCased = implode( array_map( 'ucfirst', $splitName ) );

		// js variable name
		$js_const_name = $prefix . $camelCased . ucfirst( $postfix );

		$data_encoded = json_encode( $this->script_data() );

		// prepared js line ready to inject into a js file
		$js_line = "const {$js_const_name}= JSON.parse('{$data_encoded}');";

		if ( $echoToOut ) {
			echo $js_line;
		} else {
			return $js_line;
		}
	}

	/**
	 * Output element script.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function output_scripts() {
		$directory_script = $this->element_script();
		if ( $directory_script && file_exists( $directory_script ) ) {
			?>
            <script type="text/javascript">
                WPTB_ElementsScriptsLauncher['<?php echo $this->get_name(); ?>'] = function (element, elementId) {
					<?php $this->output_script_data(); ?>
					<?php include $directory_script; ?>
					<?php
					$directory_script_pro = apply_filters( 'wp-table-builder/element-scripts-launcher/' . $this->get_name(), '' );
					if ( $directory_script_pro && file_exists( $directory_script_pro ) ) {
						include $directory_script_pro;
					}
					?>
                }
            </script>
			<?php
		}
	}
}
