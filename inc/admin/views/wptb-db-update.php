<?php

use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Admin\Database_Updater;

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

?>
<div class="wptb-menu-page-wrapper">WPTB Database Updater</div>
<div>
    <ul>
        <?php
        $tables = (new Database_Updater())->get_updated_tables();
        ?>
    </ul>
</div>