<?php

namespace WP_Table_Builder\Inc\Common;
/**
 * Contains various functions that will used throughout the plugin.
 *
 * @link       http://wptablebuilder.com/
 * @since      1.0.0
 *
 * @author    Imtiaz Rayhan
 */
class Helpers {
    
    /**
    * Get the default capability to manage everything for WPTB.
    *
    * @since 1.0.0
    *
    * @return string
    */
    static function wptb_get_capability_manage_options() {
        return apply_filters( 'wptb_manage_cap', 'manage_options' );
    }

    /**
    * Check permissions for currently logged in user.
    *
    * @since 1.0.0
    *
    * @return bool
    */
    static function wptb_current_user_can() {
        $capability = wptb_get_capability_manage_options();
        return apply_filters( 'wptb_current_user_can', current_user_can( $capability ), $capability );
    }

}