<?php

use WP_Table_Builder as NS;

/**
 * Table Name and Structure Setuo
 */

 ?>

 <div class="wptb-name-setup">
    <span>Table Name</span>
    <input type="text" name="" id="wptb-setup-name" placeholder="Enter Table Name Here">
</div>
<div class="wptb-table-setup">
    <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-builder-table-preview.php'; ?>
</div>