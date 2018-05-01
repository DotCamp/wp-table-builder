<?php

/**
 * Contains various functions that will used throughout the plugin.
 *
 * @package    WPTB
 * @since      1.0.0
 * @license    GPL-3.0+
 */

/**
 * Get the default capability to manage everything for WPTB.
 *
 * @since 1.0.0
 *
 * @return string
 */
function wptb_get_capability_manage_options() {
	return apply_filters( 'wptb_manage_cap', 'manage_options' );
}

/**
 * Check permissions for currently logged in user.
 *
 * @since 1.0.0
 *
 * @return bool
 */
function wptb_current_user_can() {
	$capability = wptb_get_capability_manage_options();
	return apply_filters( 'wptb_current_user_can', current_user_can( $capability ), $capability );
}