<?php

use WP_Table_Builder as NS;

// abort at direct call
if (!defined('WPINC')) {
    die;
}

?>
<div id="wptb-settings-page" class="wptb-menu-page-wrapper">
    <settings-app :sections-data="sectionsData" :settings="settings" :plugin-info="pluginInfo">
    </settings-app>
</div>