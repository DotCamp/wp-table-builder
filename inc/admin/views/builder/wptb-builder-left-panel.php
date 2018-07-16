<?php
/**
 * Builder Left Panel
 */

use WP_Table_Builder as NS;

?>

<div class="wptb-left-panel">
    <div class="wptb-left-scroll-panel">
        <div class="wptb-panel-left">
            <div class="wptb-elements-section">
                <ul class="wptb-tabs wptb-clear">
                    <li class="wptb-tab" id="add-elements">
                        <a href="#" class="active">
                            <?php echo __( 'Add Elements', 'wp-table-builder' ); ?>
                        </a>
                    </li>
                    <li class="wptb-tab" id="element-options">
                        <a href="#">
                            <?php echo __( 'Element Options', 'wp-table-builder' ); ?>
                        </a>
                    </li>
                </ul>
                <div class="add-elements wptb-tab-content">
                    <div class="wptb-elements-container">
                        <div class="wptb-element left" draggable="true" id="wptb-text">
                            <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/text.php'; ?>
                            <p><?php echo __( 'Text', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-element right" draggable="true" id="wptb-image">
                            <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/image.php'; ?>
                            <p><?php echo __( 'Image', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-element left" draggable="true" id="wptb-button">
                            <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/button.php'; ?>
                            <p><?php echo __( 'Button', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-element right" draggable="true" id="wptb-list">
                            <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/list.php'; ?>
                            <p><?php echo __( 'List', 'wp-table-builder' ); ?></p>
                        </div>
                    </div>              
                </div>
            </div>
            
            <div class="wptb-settings-section">
                <div class="wptb-settings-dropdown">
                    <?php echo __( 'Table Settings', 'wp-table-builder' ); ?>
                </div>
                <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-builder-table-settings.php'; ?>
            </div>
            
            <div id="element-options-group" class="wptb-tab-content" style="display: none;">
                <!-- all copies of properties will be here -->
            </div>
            
            <div class='wptb-protoypes-options' style='display: none;'>
                <!-- Here's a prototype of each Elements's option -->
                <div class='wptb-element-options wptb-text-options wptb-text-options-prototype' style='display: none;'>
                    <div class="wptb-settings-dropdown">
                        <?php echo __( 'Text Options', 'wp-table-builder' ); ?>
                    </div>
                    <div class="wptb-element-option wptb-settings-items" >
                        <p><?php echo __( 'Font Size', 'wp-table-builder' ); ?></p>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 5px;">
                            <div class="wptb-settings-col-xs-8">
                                <input id="wptb-text-font-size-slider" data-type="font-size" class="wptb-text-font-size-slider wptb-element-property" type="range" min="10" max="50" step="1" value="13">
                            </div>
                            <div class="wptb-settings-col-xs-4">
                                <input id="wptb-text-font-size-number" data-type="font-size"  class="wptb-text-font-size-number wptb-number-input wptb-element-property" type="number" min="10" max="50" step="1" placeholder="13"><span class="wptb-input-px">px</span>
                            </div>
                        </div>
                    </div>
                    <div class="wptb-element-option wptb-settings-items">
                        <div class="wptb-settings-row wptb-settings-middle-xs">
                            <div class='wptb-settings-col-xs-8' style="margin-bottom: 15px;"><?php echo __( 'Font Color', 'wp-table-builder' ); ?></div>
                            <div class='wptb-settings-col-xs-8'>
                                <input type="text" class="wptb-element-property wptb-color-picker" data-type="color"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='wptb-element-options  wptb-image-options wptb-image-options-prototype' style='display: none;'>
                    <div class="wptb-settings-dropdown">
                        <?php echo __( 'Image Options', 'wp-table-builder' ); ?>
                    </div>
                    <div class="wptb-settings-items" >
                        <div class='wptb-settings-col-xs-4'>Image Url</div>
                        <div class='wptb-settings-col-xs-8'><input type="text" /></div>
                    </div>
                </div>
                <div class='wptb-element-options wptb-button-options wptb-button-options-prototype' style='display: none;'>
                    <div class="wptb-settings-dropdown">
                        <?php echo __( 'Button Options', 'wp-table-builder' ); ?>
                    </div>
                    <div class="wptb-element-option wptb-settings-items">
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 0px">
                            <div class='wptb-settings-col-xs-8' >
                                <?php echo __( 'Button Size', 'wp-table-builder' ); ?>
                            </div>
                            <ul>
                                <li class="wptb-btn-size-btn wptb-btn-size-switcher">S</li>
                                <li class="wptb-btn-size-btn wptb-btn-size-switcher">M</li>
                                <li class="wptb-btn-size-btn wptb-btn-size-switcher">L</li>
                                <li class="wptb-btn-size-btn wptb-btn-size-switcher">XL</li>
                            </ul>
                        </div>
                    </div>
                    <div class="wptb-settings-items" >
                        <div class='wptb-settings-col-xs-8' style="margin-bottom: 15px;">
                            <?php echo __( 'Button Color', 'wp-table-builder' ); ?>
                        </div>
                        <div class='wptb-settings-col-xs-8'>
                            <input type="color" />
                        </div>
                    </div>
                </div>
                <div class='wptb-element-options wptb-list-options wptb-list-options-prototype' style='display: none;'>
                    <div class="wptb-settings-dropdown">
                        <?php echo __( 'List Options', 'wp-table-builder' ); ?>
                    </div>
                    <div class="wptb-settings-items" >
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 0px">
                            <div class='wptb-settings-col-xs-8' >
                                <?php echo __( 'List Bullet Icon', 'wp-table-builder' ); ?>
                            </div>
                            <select data-type="list-style-type" class="wptb-element-property">
                                <option value="circle">Circle</option>
                                <option value="square">Square</option>
                                <option value="disc">Disc</option>
                            </select>
                            
                        </div>
                    </div>
                </div>
            </div>     
        </div>  
    </div>
</div>
