<?php

use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Table Import Page
 */

/* import tables from CSV */
?>
<div id="wptb-import-menu" class="wptb-menu-page-wrapper">
    <import-export-app :plugin-info="pluginInfo" :options="options"></import-export-app>
</div>
