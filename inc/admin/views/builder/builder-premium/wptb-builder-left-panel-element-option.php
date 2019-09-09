<?php
/**
 * Left Panel Elements Premium
 */

use WP_Table_Builder as NS;

?>

<div class='wptb-element-options wptb-star_rating-options wptb-star_rating-options-prototype' style='display: none;'>
    <div class="wptb-settings-dropdown">
        <?php esc_html_e( 'Star Rating Options', 'wp-table-builder' ); ?>
    </div>
    <div class="wptb-element-option wptb-settings-items" >
        <div class='wptb-settings-item-header' >
            <p class="wptb-settings-item-title"><?php esc_html_e( 'Star Size', 'wp-table-builder' ); ?></p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="margin: 9px 0; padding-bottom: 10px;">
            <div class="wptb-settings-col-xs-8">
              <input data-type="star-size" class="wptb-size-slider wptb-element-property" type="range"   min="10" max="50" step="1" value="10"> 
            </div>
            <div class="wptb-settings-col-xs-4">
                <input id="wptb-size-number" data-type="star-size"  class="wptb-size-number wptb-number-input wptb-element-property" type="number" min="10" max="50" step="1" placeholder="10" pattern="[0-9]*"><span class="wptb-input-px">px</span>
            </div>
        </div>
    </div>
    <div class="wptb-element-option wptb-settings-items">
        <div class='wptb-settings-item-header' >
            <p class="wptb-settings-item-title"><?php esc_html_e( 'Star Color', 'wp-table-builder' ); ?></p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-top: 25px; padding-bottom: 10px;">
            <div class='wptb-settings-col-xs-8'>
                <input type="text" class="wptb-element-property wptb-color-picker" data-type="star-color"/>
            </div>
        </div>
    </div>
    <div class="wptb-element-option wptb-settings-items">
        <div class='wptb-settings-item-header' >
            <p class="wptb-settings-item-title"><?php esc_html_e( 'Star Background Color', 'wp-table-builder' ); ?></p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-top: 25px; padding-bottom: 10px;">
            <div class='wptb-settings-col-xs-8'>
                <input type="text" class="wptb-element-property wptb-color-picker" data-type="star-background-color"/>
            </div>
        </div>
    </div>
    <div class="wptb-element-option wptb-settings-items">
        <div class="wptb-settings-row wptb-settings-middle-xs">
            <label class="wptb-checkbox-button">
                <span style="font-size: 16px">
                    <?php esc_html_e( 'Show Number Rating', 'wp-table-builder' ); ?>
                </span>
                <input id="wptb-show-number-rating" data-type="show-number-rating" class="wptb-element-property" type="checkbox" />
                <i></i>
            </label>  
        </div>  
    </div>
    <div class="wptb-element-option wptb-settings-items wptb-numeral-rating-option-container" style="display: none;">
        <div class='wptb-settings-item-header' >
            <p class="wptb-settings-item-title"><?php esc_html_e( 'Number Rating Size', 'wp-table-builder' ); ?></p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="margin: 9px 0; padding-bottom: 10px;">
            <div class="wptb-settings-col-xs-8">
              <input data-type="numeral-rating-size" class="wptb-size-slider wptb-element-property" type="range"   min="10" max="50" step="1" value="10"> 
            </div>
            <div class="wptb-settings-col-xs-4">
                <input id="wptb-numeral-size-number" data-type="numeral-rating-size"  class="wptb-size-number wptb-number-input wptb-element-property" type="number" min="10" max="50" step="1" placeholder="10" pattern="[0-9]*"><span class="wptb-input-px">px</span>
            </div>
        </div>
    </div>
    <div class="wptb-element-option wptb-settings-items wptb-numeral-rating-option-container" style="display: none;">
        <div class='wptb-settings-item-header' >
            <p class="wptb-settings-item-title"><?php esc_html_e( 'Number Rating Color', 'wp-table-builder' ); ?></p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-top: 25px; padding-bottom: 10px;">
            <div class='wptb-settings-col-xs-8'>
                <input type="text" class="wptb-element-property wptb-color-picker" data-type="numeral-rating-color"/>
            </div>
        </div>
    </div>
</div>