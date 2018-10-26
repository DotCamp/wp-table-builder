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
                        <div class="wptb-element left " draggable="true" data-wptb-element="text"  id="wptb-text">
                            <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/text.php'; ?>
                            <p class="wptb-draggable"><?php echo __( 'Text', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-element right  " draggable="true" data-wptb-element="image"  id="wptb-image">
                            <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/image.php'; ?>
                            <p class="wptb-draggable-prototype"><?php echo __( 'Image', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-element left " draggable="true" data-wptb-element="button"  id="wptb-button">
                            <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/button.php'; ?>
                            <p class="wptb-draggable-prototype"><?php echo __( 'Button', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-element right " draggable="true" data-wptb-element="list"  id="wptb-list">
                            <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/list.php'; ?>
                            <p class="wptb-draggable-prototype"><?php echo __( 'List', 'wp-table-builder' ); ?></p>
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
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php echo __( 'Font Size', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="margin: 9px 0; padding-bottom: 10px;">
                            <div class="wptb-settings-col-xs-8">
                              <input   data-type="font-size" class="wptb-text-font-size-slider wptb-element-property" type="range"   min="10" max="50" step="1" value="13"> 
                            </div>
                            <div class="wptb-settings-col-xs-4">
                                <input id="wptb-text-font-size-number" data-type="font-size"  class="wptb-text-font-size-number wptb-number-input wptb-element-property" type="number" min="10" max="50" step="1" placeholder="10"><span class="wptb-input-px">px</span>
                            </div>
                        </div>
                    </div>
                    <div class="wptb-element-option wptb-settings-items">
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php echo __( 'Font Color', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-top: 25px; padding-bottom: 10px;">
                            <div class='wptb-settings-col-xs-8'>
                                <input type="text" class="wptb-element-property wptb-color-picker" data-type="color"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='wptb-element-options  wptb-image-options wptb-image-options-prototype' style='display: none;'>
                    
                    <div class="wptb-element-option wptb-settings-items" >
                        <p><?php echo __( 'Image Width', 'wp-table-builder' ); ?></p>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 5px;">
                           
                            <div class="wptb-settings-col-xs-4">
                                <input id="wptb-image-width" data-type="image-width"  class="wptb-image-width wptb-number-input wptb-element-property" type="number" min="10" max="50" step="1" placeholder="10"><span class="wptb-input-px">px</span>
                            </div>
                        </div>
                    </div>

                    <div class="wptb-element-option wptb-settings-items" >
                        <p><?php echo __( 'Image Height', 'wp-table-builder' ); ?></p>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 5px;">
                            
                            <div class="wptb-settings-col-xs-4">
                                <input id="wptb-image-height" data-type="image-height"  class="wptb-image-height wptb-number-input wptb-element-property" type="number" min="10" max="50" step="1" placeholder="10"><span class="wptb-input-px">px</span>
                            </div>
                        </div>
                    </div>


                    <div class="wptb-element-option wptb-settings-items" >
                        <p><?php echo __( 'Image Alternative Text', 'wp-table-builder' ); ?></p>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 5px;">
                           
                            <div class="wptb-settings-col-xs-12">
                                <input id="wptb-image-alternative-text" data-type="alternative-text"  class="wptb-image-height " type="text"  placeholder="10">
                            </div>
                        </div>
                    </div>
                </div>
                <div class='wptb-element-options wptb-button-options wptb-button-options-prototype' style='display: none;'>
                    <div class="wptb-settings-dropdown">
                        <?php echo __( 'Button Options', 'wp-table-builder' ); ?>
                    </div>
                    <div class="wptb-element-option wptb-settings-items">
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php echo __( 'Button Size', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 0px">
                            <ul>
                                <li class="wptb-btn-size-btn wptb-element-property wptb-btn-size-switcher">S</li>
                                <li class="wptb-btn-size-btn wptb-element-property wptb-btn-size-switcher selected">M</li>
                                <li class="wptb-btn-size-btn wptb-element-property wptb-btn-size-switcher">L</li>
                                <li class="wptb-btn-size-btn wptb-element-property wptb-btn-size-switcher">XL</li>
                            </ul>
                        </div>
                    </div>
                    <div class="wptb-settings-items">
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php echo __( 'Button Color', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="margin-top: 9px; padding-bottom: 10px">
                            <div class='wptb-settings-col-xs-8' style="margin-top: 5px;">
                                <input data-type="button-color" class="wptb-element-property wptb-color-picker" />
                            </div>
                        </div>    
                    </div>
                    <div class="wptb-settings-items">
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php echo __( 'Button Link', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 10px">
                            <div class='wptb-settings-col-xs-8' style="margin: 15px 0;">
                                <input type="text" data-type="button-link" placeholder="<?php echo __( 'Insert Link Here', 'wp-table-builder' ); ?>" class="wptb-element-property" />
                            </div>
                            <div class='wptb-settings-col-xs-8'>
                                <input type="checkbox" data-type="button-link-target" id="button-link-target" class="wptb-element-property" />
                                <label for="button-link-target"><?php echo __( 'Open Link in New Tab', 'wp-table-builder' ); ?></label>
                            </div>
                        </div>    
                    </div>
                    <div class="wptb-settings-items">
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php echo __( 'Button Link', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 10px">
                            <div class='wptb-settings-col-xs-8' style="margin-top: 10px;">
                                <select>
                                    <option value="left"><?php echo __( 'Left', 'wp-table-builder' ); ?></option>
                                    <option value="center"><?php echo __( 'Center', 'wp-table-builder' ); ?></option>
                                    <option value="right"><?php echo __( 'Right', 'wp-table-builder' ); ?></option>
                                </select>
                            </div>
                        </div>    
                    </div>
                </div>
                <div class='wptb-element-options wptb-list-options wptb-list-options-prototype' style='display: none;'>
                    <div class="wptb-settings-dropdown">
                        <?php echo __( 'List Options', 'wp-table-builder' ); ?>
                    </div>
                    <div class="wptb-settings-items" >
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 10px">
                            <div class='wptb-settings-col-xs-4' style="flex-basis: 58.333%; max-width: 58.333%;">
                                <?php echo __( 'Type', 'wp-table-builder' ); ?>
                            </div>
                            <select data-type="list-class" class="wptb-element-property"> 
                                <option value="numbered">
                                    <?php echo __( 'Ordered', 'wp-table-builder' ); ?>
                                </option>
                                <option value="unordered">
                                    <?php echo __( 'Unordered', 'wp-table-builder' ); ?>
                                </option>
                            </select>              
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 0px; display: none;">
                            <div class='wptb-settings-col-xs-8' >
                                <?php echo __( 'Bullet Icon', 'wp-table-builder' ); ?>
                            </div>
                            <select data-type="list-style-type" class="wptb-element-property">
                                <option value="circle">
                                    <?php echo __( 'Circle', 'wp-table-builder' ); ?>
                                </option>
                                <option value="square">
                                    <?php echo __( 'Square', 'wp-table-builder' ); ?>
                                </option>
                                <option value="disc">
                                    <?php echo __( 'Disc', 'wp-table-builder' ); ?>
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>     
        </div>  
    </div>
</div>
