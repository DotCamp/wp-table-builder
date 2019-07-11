<?php

use WP_Table_Builder as NS;

/**
 * Table Name and Structure Setuo
 */

 ?>
<div class="wptb-messaging"> 
</div>
<div class="wptb-name-setup">
    <span><?php echo __( 'Table Name', 'wp-table-builder' ); ?></span>
    <input type="text" name="" id="wptb-setup-name" placeholder="<?php echo __( 'Enter Table Name Here', 'wp-table-builder' ); ?>">
</div>
<div id="wpcd_fixed_toolbar" class="wptb-fixed-toolbar">
</div>

<table class="wptb-table-generator" style="display: none;">
    <tr>
        <td style="font-size: 20px"><?php echo __( 'Columns', 'wp-table-builder' ); ?></td>
        <td style="font-size: 20px"><?php echo __( 'Rows', 'wp-table-builder' ); ?></td>
    </tr>
    <tr>
        <td style="padding: 15px">
            <span class="wptb-input-number-decrement">–</span><input class="wptb-input-number" id="wptb-columns-number" type="text" value="1" min="1" max="10"><span class="wptb-input-number-increment">+</span>
        </td>
        <td style="padding: 15px">
            <span class="wptb-input-number-decrement">–</span><input class="wptb-input-number" id="wptb-rows-number" type="text" value="1" min="1" max="10"><span class="wptb-input-number-increment">+</span>
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <button id="wptb-generate-table" class="wptb-generator-btn">
                <?php echo __( 'Generate', 'wp-table-builder' ); ?>
            </button>
        </td>
    </tr>
</table>
<div id="wptb-cell_mode_background">
    
</div>
<div class="wptb-management_table_container">

    <div class="wptb-management wptb-bar wptb-edit-bar">
        <button class="wptb-table_change_button wptb-no-cell-action visible" id="wptb-add-start-column" title="<?php echo __( 'Add Column to the Start', 'wp-table-builder' ); ?>">
            <?php echo __( 'Add Left Column', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-no-cell-action visible" id="wptb-add-end-column" title="<?php echo __( 'Add Column to the End', 'wp-table-builder' ); ?>">
            <?php echo __( 'Add Right Column', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-no-cell-action visible" id="wptb-add-start-row" title="<?php echo __( 'Add Row to the Start', 'wp-table-builder' ); ?>">
            <?php echo __( 'Add Top Row', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-no-cell-action visible" id="wptb-add-end-row" title="<?php echo __( 'Add Row to the End', 'wp-table-builder'); ?>">
            <?php echo __( 'Add Bottom Row', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-multiple-select-action" id="wptb-merge-cells" title="<?php echo __( 'Merge Selected Cells', 'wp-table-builder' ); ?>">
            <?php echo __( 'Merge', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-single-action" id="wptb-split-cell" title="<?php echo __( 'Unmerge Selected Cell', 'wp-table-builder' ); ?>">
            <?php echo __( 'Split', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-single-action" id="wptb-delete-column" title="<?php echo __( 'Delete Highlighted Column', 'wp-table-builder' ); ?>">
            <?php echo __( 'Remove Column', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-single-action" id="wptb-delete-row" title="<?php echo __( 'Delete Highlighted Row', 'wp-table-builder' ); ?>">
            <?php echo __( 'Remove Row', 'wp-table-builder' ); ?>
        </button>
    </div>
    
    <div class="wptb-table-setup">
        
    </div>
    <div class="wptb-management wptb-bar wptb-edit-bar">
        <button class="wptb-table_change_button wptb-single-action" id="wptb-add-column-after" title="<?php echo __( 'Add Column After Highlighted One', 'wp-table-builder' ); ?>">
            <?php echo __( 'Insert Column After', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-single-action" id="wptb-add-column-before" title="<?php echo __( 'Add Column Before Highlighted One', 'wp-table-builder' ); ?>">
            <?php echo __( 'Insert Column Before', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-single-action" id="wptb-add-row-after" title="<?php echo __( 'Add Row After Highlighted One', 'wp-table-builder' ); ?>">
            <?php echo __( 'Insert Row After', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-single-action" id="wptb-add-row-before" title="<?php echo __( 'Add Row Before Highlighted One', 'wp-table-builder' ); ?>">
            <?php echo __( 'Insert Row Before', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button"  id="wptb-table-edit-mode-close" title="<?php echo __( 'Close Manage Cells Mode', 'wp-table-builder' ); ?>">
            <?php echo __( 'Close', 'wp-table-builder' ); ?>
        </button>
    </div>
</div>