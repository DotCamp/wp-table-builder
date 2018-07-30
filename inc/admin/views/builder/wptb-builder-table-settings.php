<?php

// Table Settings 

?>

<div class="wptb-settings-items" style="display: none;">
    <div class="wptb-settings-row wptb-settings-middle-xs">
        
        <div class="wptb-settings-col-xs-12">
            <input type="button" id="wptb-activate-cell-management-mode" name="wptb-activate-cell-management-mode" class="wptb-button" value="<?php echo __('Manage Cells','wp_table_builder'); ?>" title="<?php echo __('Manage Cells','wp_table_builder'); ?>">
        </div> 
    </div>
    <div class="wptb-cell-management">
        <input type="button" id="wptb-add-end-row" name="wptb-add-end-row" class="wptb-button" value="<?php echo __('Add row at the end','wp_table_builder'); ?>" title="<?php echo __('Add row at the end','wp_table_builder'); ?>">
        <input type="button" id="wptb-add-start-row" name="wptb-add-start-row" class="wptb-button" value="<?php echo __('Add row at the start','wp_table_builder'); ?>" title="<?php echo __('Add row at the start','wp_table_builder'); ?>">
        <input type="button" id="wptb-add-end-column" name="wptb-add-end-column" class="wptb-button" value="<?php echo __('Add column at the end','wp_table_builder'); ?>" title="<?php echo __('Add column at the end','wp_table_builder'); ?>">
        <input type="button" id="wptb-add-start-column" name="wptb-add-start-column" class="wptb-button" value="<?php echo __('Add column at the start','wp_table_builder'); ?>" title="<?php echo __('Add column at the start','wp_table_builder'); ?>">
        <input type="button" id="wptb-delete-row" name="wptb-delete-row" class="wptb-button" value="<?php echo __('Delete Row','wp_table_builder'); ?>" title="<?php echo __('Add column at the start','wp_table_builder'); ?>">
        <input type="button" id="wptb-delete-column" name="wptb-delete-column" class="wptb-button" value="<?php echo __('Delete Column','wp_table_builder'); ?>" title="<?php echo __('Add column at the start','wp_table_builder'); ?>">
    </div>
    <div class="wptb-settings-row wptb-settings-middle-xs">
        <p>
            <?php echo __( 'Table Border', 'wp-table-builder' ); ?>
        </p>
        <div class="wptb-settings-col-xs-8">
            <input id="wptb-table-border-slider" type="range" min="0" max="50" step="1" value="0">
        </div>
        <div class="wptb-settings-col-xs-4">
            <input id="wptb-table-border-number" class="wptb-number-input" type="number" min="0" max="50" step="1" placeholder="0">
            <span class="wptb-input-px">px</span>
        </div>
    </div>
    <div id="wptb-apply-inner-border" style="max-width: 96%;" class="wptb-settings-row wptb-settings-middle-xs">
        <label class="wptb-inner-border">
            <span style="font-size: 16px">
                <?php echo __( 'Apply Inner Border', 'wp-table-builder' ); ?>
            </span>
            <input id="wptb-inner-border-check" type="checkbox" />
            <i></i>
        </label>
    </div>
    <div style="display:none" id="wptb-inner-border-settings" class="wptb-settings-row wptb-settings-middle-xs">
        <div class="wptb-settings-col-xs-8">
            <input id="wptb-table-inner-border-slider" type="range" min="0" max="50" step="1" value="0">
        </div>
        <div class="wptb-settings-col-xs-4">
            <input id="wptb-table-inner-border-number" class="wptb-number-input" type="number" min="0" max="50" step="1" placeholder="0">
            <span class="wptb-input-px">px</span>
        </div>
    </div>
    <div class="wptb-settings-row wptb-settings-middle-xs">
        <p>
            <?php echo __( 'Cell Padding', 'wp-table-builder' ); ?>
        </p>
        <div class="wptb-settings-col-xs-8">
            <input id="wptb-table-cell-slider" type="range" min="10" max="50" step="1" value="15">
        </div>
        <div class="wptb-settings-col-xs-4">
            <input id="wptb-table-cell-number" class="wptb-number-input" type="number" min="10" max="50" step="1" placeholder="15">
            <span class="wptb-input-px">px</span>
        </div>
    </div>
    <div class="wptb-settings-row wptb-settings-middle-xs">
        <div class='wptb-settings-col-xs-8'>
            <p><?php echo __( 'Header Background', 'wp-table-builder' ); ?></p>
        </div>
        <div class='wptb-settings-col-xs-8'>
            <input type="text" id="wptb-table-header-bg" value=""/>
        </div>
    </div>
    <div class="wptb-settings-row wptb-settings-middle-xs">
        <div class='wptb-settings-col-xs-8'>
            <p><?php echo __( 'Even Row Background', 'wp-table-builder' ); ?></p>
        </div>
        <div class='wptb-settings-col-xs-8'>
            <input type="text" id="wptb-even-row-bg" value=""/>
        </div>
    </div>
    <div class="wptb-settings-row wptb-settings-middle-xs">
        <div class='wptb-settings-col-xs-8'>
            <p><?php echo __( 'Odd Row Background', 'wp-table-builder' ); ?></p>
        </div>
        <div class='wptb-settings-col-xs-8'>
            <input type="text" id="wptb-odd-row-bg" value=""/>
        </div>
    </div>
</div>