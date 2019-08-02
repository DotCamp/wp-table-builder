<?php

// Table Settings 

?>

<div class="wptb-settings-items" style="display: block;">
    <div class="wptb-settings-row wptb-settings-middle-xs">
        <div class="wptb-settings-col-xs-12" style="margin: auto; text-align: center;">
            <input type="button" id="wptb-activate-cell-management-mode" name="wptb-activate-cell-management-mode" 
                class="wptb-button" value="<?php esc_attr_e( 'Manage Cells', 'wp_table_builder' ); ?>" 
                title="<?php esc_attr_e( 'Manage Cells', 'wp_table_builder' ); ?>">
        </div> 
    </div>
    <div class="wptb-settings-items wptb-adaptive-table-chose-block" style="display: none;">
        <div class="wptb-settings-row wptb-settings-middle-xs">
            <label class="wptb-checkbox-button">
                <span style="font-size: 16px">
                    <?php esc_html_e( 'Table Adaptive for mobile', 'wp-table-builder' ); ?>
                </span>
                <input id="wptb-adaptive-table-checkbox" type="checkbox" />
                <i></i>
            </label>  
        </div>  
    </div>
    <div class="wptb-settings-items">
        <div class="wptb-settings-row wptb-settings-middle-xs">
            <label class="wptb-checkbox-button">
                <span style="font-size: 16px">
                    <?php esc_html_e( 'Top Row As Header', 'wp-table-builder' ); ?>
                </span>
                <input id="wptb-top-row-as-header" type="checkbox" />
                <i></i>
            </label>  
        </div>  
    </div>
    <div class="wptb-settings-items">
        <div class="wptb-settings-item-header">
            <p style="margin: 0">
                <?php esc_html_e( 'Table Border', 'wp-table-builder' ); ?>
            </p>
        </div> 
        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-top: 25px; padding-bottom: 10px;">
            <div class="wptb-settings-col-xs-8">
                <input id="wptb-table-border-slider" type="range" min="0" max="50" step="1" value="0">
            </div>
            <div class="wptb-settings-col-xs-4">
                <input id="wptb-table-border-number" class="wptb-number-input" type="number" min="0" max="50" step="1" placeholder="0" pattern="[0-9]*">
                <span class="wptb-input-px">px</span>
            </div>
            <label class="wptb-checkbox-button">
                <span style="font-size: 16px">
                    <?php esc_html_e( 'Apply Inner Border', 'wp-table-builder' ); ?>
                </span>
                <input id="wptb-inner-border-check" type="checkbox" />
                <i></i>
            </label>  
        </div>  
    </div>
    <div id="wptb-apply-inner-border" style="display:none" class="wptb-settings-items">
        <div class="wptb-settings-item-header">
            <p style="margin: 0">
                <?php esc_html_e( 'Inner Border Size', 'wp-table-builder' ); ?>
            </p>
        </div>
        <div id="wptb-inner-border-settings" class="wptb-settings-row wptb-settings-middle-xs" style="padding-top: 25px; padding-bottom: 10px;">
            <div class="wptb-settings-col-xs-8">
                <input id="wptb-table-inner-border-slider" type="range" min="1" max="50" step="1" value="1">
            </div>
            <div class="wptb-settings-col-xs-4">
                <input id="wptb-table-inner-border-number" class="wptb-number-input" type="number" min="1" max="50" step="1" placeholder="1" value="1" pattern="[0-9]*">
                <span class="wptb-input-px">px</span>
            </div>
        </div>    
    </div>
    <div id="wptb-table-border-color-set-area" style="display:none" class="wptb-settings-row wptb-settings-middle-xs">
        <div class='wptb-settings-col-xs-8'>
            <p><?php esc_html_e( 'Border Color', 'wp-table-builder' ); ?></p>
        </div>
        <div class='wptb-settings-col-xs-8'>
            <input type="text" id="wptb-table-border-color" value=""/>
        </div>
    </div>

    <div class="wptb-settings-items">
        <div class="wptb-settings-item-header">
            <p style="margin: 0">
                <?php esc_html_e( 'Cell Padding', 'wp-table-builder' ); ?>
            </p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-top: 25px; padding-bottom: 10px;">
            <div class="wptb-settings-col-xs-8">
                <input id="wptb-table-cell-slider" type="range" min="0" max="50" step="1" value="15">
            </div>
            <div class="wptb-settings-col-xs-4">
                <input id="wptb-table-cell-number" class="wptb-number-input" type="number" min="0" max="50" step="1" placeholder="15" pattern="[0-9]*">
                <span class="wptb-input-px">px</span>
            </div>
        </div>    
    </div>
    <div class="wptb-settings-items">
        <div class="wptb-settings-item-header">
            <p style="margin: 0">
                <?php esc_html_e( 'Header Background', 'wp-table-builder' ); ?>
            </p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs">
            <div class="wptb-settings-col-xs-8" style="padding-top: 15px; margin-bottom: -5px;">
                <input type="text" id="wptb-table-header-bg" value=""/>
            </div>
        </div>
    </div>
    <div class="wptb-settings-items">
        <div class="wptb-settings-item-header">
            <p style="margin: 0">
                <?php esc_html_e( 'Even Row Background', 'wp-table-builder' ); ?>
            </p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs">
            <div class="wptb-settings-col-xs-8" style="padding-top: 15px; margin-bottom: -5px;">
                <input type="text" id="wptb-even-row-bg" value=""/>
            </div>
        </div>
    </div>
    <div class="wptb-settings-items">
        <div class="wptb-settings-item-header">
            <p style="margin: 0">
                <?php esc_html_e( 'Odd Row Background', 'wp-table-builder' ); ?>
            </p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs">
            <div class="wptb-settings-col-xs-8" style="padding-top: 15px; margin-bottom: -5px;">
                <input type="text" id="wptb-odd-row-bg" value=""/>
            </div>
        </div>
    </div>
</div>