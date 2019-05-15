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
<div id="wpcd_fixed_toolbar">
</div>

<table class="wptb-table-generator">
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
<div id="cell_mode_background">
    
</div>
<div class="management_table_container">
    <div class="table management bar edit-bar">
        <button class="table_change_button no-cell-action visible" id="wptb-add-start-column" title="Add column to the start">Add left column</button>
        <button class="table_change_button no-cell-action visible" id="wptb-add-end-column" title="Add column to the end">Add right column</button>
        <button class="table_change_button no-cell-action visible" id="wptb-add-start-row" title="Add row to the start">Add top row</button>
        <button class="table_change_button no-cell-action visible" id="wptb-add-end-row" title="Add row to the end">Add bottom row</button>
        <button class="table_change_button multiple-select-action"  id="wptb-merge-cells" title="Merge selected Cells">Merge</button>
        <button class="table_change_button single-action"  id="wptb-split-cell" title="Unmerge selected cell">Split</button>
        <button class="table_change_button single-action"  id="wptb-delete-column" title="Delete highlighted column">Remove column</button>
        <button class="table_change_button single-action"  id="wptb-delete-row" title="Delete highlighted row">Remove row</button>
    </div>
    <div class="wptb-table-setup">
        
    </div>
    <div class="table management bar edit-bar">
        <button class="table_change_button single-action"  id="wptb-add-column-after" title="Add column after highlighted one">Insert column after</button>
        <button class="table_change_button single-action"  id="wptb-add-column-before" title="Add column before highlighted one">Insert column before</button>
        <button class="table_change_button single-action"  id="wptb-add-row-after" title="Add row after highlighted one">Insert row after</button>
        <button class="table_change_button single-action"  id="wptb-add-row-before" title="Add row before highlighted one">Insert row before</button>
        <button class="table_change_button"  id="wptb-table-edit-mode-close" title="Close Manage Cells Mode">Close</button>
    </div>
</div>