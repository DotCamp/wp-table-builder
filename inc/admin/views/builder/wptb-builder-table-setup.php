<?php

use WP_Table_Builder as NS;

/**
 * Table Name and Structure Setup
 */

?>
<div class="wptb-messaging">
</div>
<div id="wpcd_fixed_toolbar" class="wptb-fixed-toolbar">
</div>


<!--region old generate logic-->
<!--@deprecated -->
<!--<table class="wptb-table-generator" style="display: none;">-->
<!--    <tr>-->
<!--        <td style="font-size: 20px">--><?php //esc_html_e( 'Columns', 'wp-table-builder' ); ?><!--</td>-->
<!--        <td style="font-size: 20px">--><?php //esc_html_e( 'Rows', 'wp-table-builder' ); ?><!--</td>-->
<!--    </tr>-->
<!--    <tr>-->
<!--        <td style="padding: 15px">-->
<!--            <span class="wptb-input-number-decrement">–</span><input class="wptb-input-number" id="wptb-columns-number"-->
<!--                                                                     type="text" value="1" min="1" max="30"><span-->
<!--                    class="wptb-input-number-increment">+</span>-->
<!--        </td>-->
<!--        <td style="padding: 15px">-->
<!--            <span class="wptb-input-number-decrement">–</span><input class="wptb-input-number" id="wptb-rows-number"-->
<!--                                                                     type="text" value="1" min="1" max="30"><span-->
<!--                    class="wptb-input-number-increment">+</span>-->
<!--        </td>-->
<!--    </tr>-->
<!--    <tr>-->
<!--        <td colspan="2">-->
<!--            <button id="wptb-generate-table" class="wptb-generator-btn">-->
<!--				--><?php //esc_html_e( 'Generate', 'wp-table-builder' ); ?>
<!--            </button>-->
<!--        </td>-->
<!--    </tr>-->
<!--</table>-->
<!--endregion-->
<div id="wptb-cell_mode_background">

</div>
<div class="wptb-management_table_container">

    <!-- wptb top bar -->
    <div id="wptb-bar-top" class="wptb-management wptb-bar wptb-edit-bar">
        <button class="wptb-table_change_button wptb-no-cell-action visible" id="wptb-add-start-column"
                title="<?php esc_attr_e( 'Add Column to the Start', 'wp-table-builder' ); ?>">
            <?php esc_html_e( 'Add Left Column', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-no-cell-action visible" id="wptb-add-end-column"
                title="<?php esc_attr_e( 'Add Column to the End', 'wp-table-builder' ); ?>">
            <?php esc_html_e( 'Add Right Column', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-no-cell-action visible" id="wptb-add-start-row"
                title="<?php esc_attr_e( 'Add Row to the Start', 'wp-table-builder' ); ?>">
            <?php esc_html_e( 'Add Top Row', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-no-cell-action visible" id="wptb-add-end-row"
                title="<?php esc_attr_e( 'Add Row to the End', 'wp-table-builder' ); ?>">
            <?php esc_html_e( 'Add Bottom Row', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-multiple-select-action" id="wptb-merge-cells"
                title="<?php esc_attr_e( 'Merge Selected Cells', 'wp-table-builder' ); ?>">
            <?php esc_html_e( 'Merge', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-single-action" id="wptb-split-cell"
                title="<?php esc_attr_e( 'Unmerge Selected Cell', 'wp-table-builder' ); ?>">
            <?php esc_html_e( 'Split', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-single-action" id="wptb-delete-column"
                title="<?php esc_attr_e( 'Delete Highlighted Column', 'wp-table-builder' ); ?>">
            <?php esc_html_e( 'Remove Column', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-single-action" id="wptb-delete-row"
                title="<?php esc_attr_e( 'Delete Highlighted Row', 'wp-table-builder' ); ?>">
            <?php esc_html_e( 'Remove Row', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-table-edit-mode-close"
                title="<?php esc_attr_e( 'Close Manage Cells Mode', 'wp-table-builder' ); ?>">
            <?php esc_html_e( 'Close', 'wp-table-builder' ); ?>
        </button>
    </div>

    <!-- wptb base table setup -->
    <div class="wptb-table-setup"></div>

    <!-- wptb bottom bar -->
    <div id="wptb-bar-bottom" class="wptb-management wptb-bar wptb-edit-bar">
        <button class="wptb-table_change_button wptb-single-action" id="wptb-add-column-after"
                title="<?php esc_attr_e( 'Add Column After Highlighted One', 'wp-table-builder' ); ?>">
            <?php esc_html_e( 'Insert Column After', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-single-action" id="wptb-add-column-before"
                title="<?php esc_attr_e( 'Add Column Before Highlighted One', 'wp-table-builder' ); ?>">
            <?php esc_html_e( 'Insert Column Before', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-single-action" id="wptb-add-row-after"
                title="<?php esc_attr_e( 'Add Row After Highlighted One', 'wp-table-builder' ); ?>">
            <?php esc_html_e( 'Insert Row After', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-single-action" id="wptb-add-row-before"
                title="<?php esc_attr_e( 'Add Row Before Highlighted One', 'wp-table-builder' ); ?>">
            <?php esc_html_e( 'Insert Row Before', 'wp-table-builder' ); ?>
        </button>
        <button class="wptb-table_change_button wptb-table-edit-mode-close"
                title="<?php esc_attr_e( 'Close Manage Cells Mode', 'wp-table-builder' ); ?>">
            <?php esc_html_e( 'Close', 'wp-table-builder' ); ?>
        </button>
    </div>
</div>

<div id="wptbGenerate">
</div>

<div id="wptb-messaging-area" style="display: none">
</div>
