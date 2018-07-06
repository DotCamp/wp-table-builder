<?php

// Table Settings 

?>

<div class="wptb-settings-items" style="display: none;">
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