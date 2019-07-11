<?php 

use WP_Table_Builder as NS;

/**
 * Table Builde UI
 */

?>

<?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-builder-header.php'; ?>

<div id="wptb_builder" class="wptb-admin-container">

    <div class="wptb-container">
        
        <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-builder-left-panel.php'; ?>  
        
        <div class="wptb-builder-panel">

            <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-builder-table-setup.php'; ?> 
            
        </div>
        
    </div>
    
</div> 

<style type="text/css" id="custom-cursor">
        
</style>