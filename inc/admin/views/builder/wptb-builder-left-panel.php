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
                <div class="wptb-add-elements wptb-tab-content">
                    <div class="wptb-elements-container">
                        <div class="wptb-element left " draggable="true" data-wptb-element="text"  id="wptb-text">
                            <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/text.php'; ?>
                            <p class="wptb-draggable"><?php esc_html_e( 'Text', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-element right  " draggable="true" data-wptb-element="image"  id="wptb-image">
                            <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/image.php'; ?>
                            <p class="wptb-draggable-prototype"><?php esc_html_e( 'Image', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-element left " draggable="true" data-wptb-element="button"  id="wptb-button">
                            <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/button.php'; ?>
                            <p class="wptb-draggable-prototype"><?php esc_html_e( 'Button', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-element right " draggable="true" data-wptb-element="list"  id="wptb-list">
                            <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/list.php'; ?>
                            <p class="wptb-draggable-prototype"><?php esc_html_e( 'List', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-element left " draggable="true" data-wptb-element="star_rating"  id="wptb-star_rating">
                            <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/half-filled-rating-star.php'; ?>
                            <p class="wptb-draggable"><?php esc_html_e( 'Star Rating', 'wp-table-builder' ); ?></p>
                        </div>
                    </div>              
                </div>
            </div>
            
            <div class="wptb-settings-section">
                <div class="wptb-settings-dropdown">
                    <?php esc_html_e( 'Table Settings', 'wp-table-builder' ); ?>
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
                        <div class="wptb-back-button">
                             <a href="javascript:void(0)"  title="Back" class="wptb-exit-options" >
                            <svg pointer-events="none" width="12px" height="12px" x="0px" y="0px" viewBox="0 0 477.175 477.175" style="enable-background:new 0 0 477.175 477.175;" xml:space="preserve">
                                <g>
                                    <path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225
                                        c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/>
                                </g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                            </a>
                        </div>
                        <div class="wptb-option-text">  
                            <?php esc_html_e( 'Text Options', 'wp-table-builder' ); ?>
                        </div>                       
                        
                    </div>
                    <div class="wptb-element-option wptb-settings-items" >
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php esc_html_e( 'Font Size', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="margin: 9px 0; padding-bottom: 10px;">
                            <div class="wptb-settings-col-xs-8">
                              <input data-type="font-size" class="wptb-size-slider wptb-element-property" type="range"   min="10" max="50" step="1" value="15"> 
                            </div>
                            <div class="wptb-settings-col-xs-4">
                                <input id="wptb-size-number" data-type="font-size"  class="wptb-size-number wptb-number-input wptb-element-property" type="number" min="10" max="50" step="1"  value="15" placeholder="10" pattern="[0-9]*"><span class="wptb-input-px">px</span>
                            </div>
                        </div>
                    </div>
                    <div class="wptb-element-option wptb-settings-items">
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php esc_html_e( 'Font Color', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-top: 25px; padding-bottom: 10px;">
                            <div class='wptb-settings-col-xs-8'>
                                <input type="text" class="wptb-element-property wptb-color-picker" data-type="color"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='wptb-element-options  wptb-image-options wptb-image-options-prototype' style='display: none;'>
                    <div class="wptb-settings-dropdown">
                       <div class="wptb-back-button">
                             <a href="javascript:void(0)"  title="Back" class="wptb-exit-options" >
                            <svg pointer-events="none" width="12px" height="12px" x="0px" y="0px" viewBox="0 0 477.175 477.175" style="enable-background:new 0 0 477.175 477.175;" xml:space="preserve">
                                <g>
                                    <path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225
                                        c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/>
                                </g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                            </a>
                        </div>
                        <div class="wptb-option-text">  
                            <?php esc_html_e( 'Image Options', 'wp-table-builder' ); ?>
                        </div>
                    </div>
                    <div class="wptb-element-option wptb-settings-items">
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php esc_html_e( 'Image Alignment', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 0px">
                            <ul>
                                <li class="wptb-image-alignment-btn wptb-element-property wptb-image-alignment-switcher" data-image_alignment="left">
                                    <?php require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/left_align.php'; ?>
                                </li>
                                <li class="wptb-image-alignment-btn wptb-element-property wptb-image-alignment-switcher selected" data-image_alignment="center">
                                    <?php require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/center_align.php'; ?>
                                </li>
                                <li class="wptb-image-alignment-btn wptb-element-property wptb-image-alignment-switcher" data-image_alignment="right">
                                   <?php require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/right_align.php'; ?>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="wptb-element-option wptb-settings-items" style="margin-top: 5px;">
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php esc_html_e( 'Image Size', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 12px; padding-top: 23px;">
                            <div class="wptb-settings-col-xs-8">
                              <input data-type="image-size" class="wptb-image-width wptb-element-property  wptb-size-slider" type="range" min="10" max="100" step="1" value="100"> 
                            </div>
                            <div class="wptb-settings-col-xs-4">
                                <input id="wptb-size-number" data-type="image-size"  class="wptb-size-number wptb-image-width wptb-number-input wptb-element-property" type="number" min="10" max="100" step="1" placeholder="100" pattern="[0-9]*"><span class="wptb-input-px">%</span>
                            </div>
                        </div>
                    </div>
                    <div class="wptb-settings-items">
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php esc_html_e( 'Image Link', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 10px">
                            <div class='wptb-settings-col-xs-8' style="margin: 15px 0;">
                                <input type="text" data-type="image-link" placeholder="<?php esc_attr_e( 'Insert Link Here', 'wp-table-builder' ); ?>" class="wptb-element-property" />
                            </div>
                            <div class='wptb-settings-col-xs-8'>
                                <input type="checkbox" data-type="image-link-target" id="image-link-target" class="wptb-element-property" />
                                <label for="image-link-target"><?php esc_html_e( 'Open Link in New Tab', 'wp-table-builder' ); ?></label>
                            </div>
                            <div class='wptb-settings-col-xs-8'>
                                <input type="checkbox" data-type="image-link-nofollow" id="image-link-nofollow" class="wptb-element-property" />
                                <label for="image-link-nofollow"><?php esc_html_e( 'Nofollow Link', 'wp-table-builder' ); ?></label>
                            </div>
                        </div>    
                    </div>
                    <div class="wptb-element-option wptb-settings-items">
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php esc_html_e( 'Image Alternative Text', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 14px; padding-top: 25px;">
                            <div class="wptb-settings-col-xs-12">
                                <input id="wptb-image-alternative-text" data-type="alternative-text"  class="wptb-element-property wptb-image-height" type="text"  placeholder="<?php esc_attr_e( 'Image Alt Text', 'wp-table-builder' );?>">
                            </div>
                        </div>
                    </div>
                </div>
                <div class='wptb-element-options wptb-button-options wptb-button-options-prototype' style='display: none;'>
                    
                    <div class="wptb-settings-dropdown">
                        <div class="wptb-back-button">
                             <a href="javascript:void(0)"  title="Back" class="wptb-exit-options" >
                            <svg pointer-events="none" width="12px" height="12px" x="0px" y="0px" viewBox="0 0 477.175 477.175" style="enable-background:new 0 0 477.175 477.175;" xml:space="preserve">
                                <g>
                                    <path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225
                                        c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/>
                                </g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                            </a>
                        </div>
                        <div class="wptb-option-text">  
                            <?php esc_html_e( 'Button Options', 'wp-table-builder' ); ?>
                        </div>
                    </div>
                    <div class="wptb-element-option wptb-settings-items">
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php esc_html_e( 'Button Size', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 0px">
                            <ul>
                                <li class="wptb-btn-size-btn wptb-element-property wptb-btn-size-switcher"><?php esc_html_e( 'S', 'wp-table-builder' ); ?></li>
                                <li class="wptb-btn-size-btn wptb-element-property wptb-btn-size-switcher selected"><?php esc_html_e( 'M', 'wp-table-builder' ); ?></li>
                                <li class="wptb-btn-size-btn wptb-element-property wptb-btn-size-switcher"><?php esc_html_e( 'L', 'wp-table-builder' ); ?></li>
                                <li class="wptb-btn-size-btn wptb-element-property wptb-btn-size-switcher"><?php esc_html_e( 'XL', 'wp-table-builder' ); ?></li>
                            </ul>
                        </div>
                    </div>
                    <div class="wptb-settings-items">
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php esc_html_e( 'Button Text Color', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="margin-top: 9px; padding-bottom: 10px">
                            <div class='wptb-settings-col-xs-8' style="margin-top: 5px;">
                                <input data-type="button-text-color" class="wptb-element-property wptb-color-picker" />
                            </div>
                        </div>    
                    </div>
                    <div class="wptb-settings-items">
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php esc_html_e( 'Button Color', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="margin-top: 9px; padding-bottom: 10px">
                            <div class='wptb-settings-col-xs-8' style="margin-top: 5px;">
                                <input data-type="button-color" class="wptb-element-property wptb-color-picker" />
                            </div>
                        </div>    
                    </div>
                    <div class="wptb-settings-items">
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php esc_html_e( 'Button Link', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 10px">
                            <div class='wptb-settings-col-xs-8' style="margin: 15px 0;">
                                <input type="text" data-type="button-link" placeholder="<?php esc_attr_e( 'Insert Link Here', 'wp-table-builder' ); ?>" class="wptb-element-property" />
                            </div>
                            <div class='wptb-settings-col-xs-8'>
                                <input type="checkbox" data-type="button-link-target" id="button-link-target" class="wptb-element-property" />
                                <label for="button-link-target"><?php esc_html_e( 'Open Link in New Tab', 'wp-table-builder' ); ?></label>
                            </div>
                            <div class='wptb-settings-col-xs-8'>
                                <input type="checkbox" data-type="button-link-nofollow" id="button-link-nofollow" class="wptb-element-property" />
                                <label for="button-link-nofollow"><?php esc_html_e( 'Nofollow Link', 'wp-table-builder' ); ?></label>
                            </div>
                        </div>    
                    </div>
                    <div class="wptb-element-option wptb-settings-items">
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php esc_html_e( 'Button Alignment', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 0px">
                            <ul>
                                <li class="wptb-button-alignment-btn wptb-element-property wptb-button-alignment-switcher" data-button_alignment="left">
                                    <?php require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/left_align.php'; ?>
                                </li>
                                <li class="wptb-button-alignment-btn wptb-element-property wptb-button-alignment-switcher selected" data-button_alignment="center">
                                    <?php require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/center_align.php'; ?>
                                </li>
                                <li class="wptb-button-alignment-btn wptb-element-property wptb-button-alignment-switcher" data-button_alignment="right">
                                   <?php require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/right_align.php'; ?>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="wptb-settings-items">
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php esc_html_e( 'Button ID', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 10px">
                            <div class='wptb-settings-col-xs-8' style="margin: 15px 0;">
                                <input type="text" data-type="button-id" placeholder="<?php esc_attr_e( 'Insert Button ID Here', 'wp-table-builder' ); ?>" class="wptb-element-property" />
                            </div>
                        </div>    
                    </div>
                </div>
                <div class='wptb-element-options wptb-list-options wptb-list-options-prototype' style='display: none;'>
                    <div class="wptb-settings-dropdown">
                        <div class="wptb-back-button">
                             <a href="javascript:void(0)"  title="Back" class="wptb-exit-options" >
                            <svg pointer-events="none" width="12px" height="12px" x="0px" y="0px" viewBox="0 0 477.175 477.175" style="enable-background:new 0 0 477.175 477.175;" xml:space="preserve">
                                <g>
                                    <path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225
                                        c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/>
                                </g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                            </a>
                        </div>
                        <div class="wptb-option-text">  
                            <?php esc_html_e( 'List Options', 'wp-table-builder' ); ?>
                        </div>
                    </div>
                    <div class="wptb-settings-items" >
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php esc_html_e( 'List Type', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 15px; padding-top: 25px;">
                            <select data-type="list-class" class="wptb-element-property"> 
                                <option value="numbered">
                                    <?php esc_html_e( 'Ordered', 'wp-table-builder' ); ?>
                                </option>
                                <option value="unordered">
                                    <?php esc_html_e( 'Unordered', 'wp-table-builder' ); ?>
                                </option>
                            </select>              
                        </div>
                        <div class='wptb-settings-item-header wptb-list-icon-select-label' id="wptb-list-icon-select-label" style="display: none">
                            <p class="wptb-settings-item-title"><?php esc_html_e( 'List Icon', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 15px; padding-top: 25px; display: none;">
                            <select data-type="list-style-type" class="wptb-element-property">
                                <option value="circle">
                                    <?php esc_html_e( 'Circle', 'wp-table-builder' ); ?>
                                </option>
                                <option value="square">
                                    <?php esc_html_e( 'Square', 'wp-table-builder' ); ?>
                                </option>
                                <option value="disc">
                                    <?php esc_html_e( 'Disc', 'wp-table-builder' ); ?>
                                </option>
                                <option value="none">
                                    <?php echo __( 'None', 'wp-table-builder' ); ?>
                                </option>
                            </select>
                        </div>
                        
                    <!--<div class="wptb-element-option wptb-settings-items">-->
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php esc_html_e( 'List Font Color', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-top: 25px; padding-bottom: 10px;">
                            <div class='wptb-settings-col-xs-8'>
                                <input type="text" class="wptb-element-property wptb-color-picker" data-type="list-text-color"/>
                            </div>
                        </div>
                        <div class="wptb-element-option wptb-settings-items">
                            <div class='wptb-settings-item-header' >
                                <p class="wptb-settings-item-title"><?php esc_html_e( 'List Alignment', 'wp-table-builder' ); ?></p>
                            </div>
                            <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 0px">
                                <ul>
                                    <li class="wptb-list-alignment-btn wptb-element-property wptb-list-alignment-switcher" data-list_alignment="left">
                                        <?php require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/left_align.php'; ?>
                                    </li>
                                    <li class="wptb-list-alignment-btn wptb-element-property wptb-list-alignment-switcher selected" data-list_alignment="center">
                                        <?php require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/center_align.php'; ?>
                                    </li>
                                    <li class="wptb-list-alignment-btn wptb-element-property wptb-list-alignment-switcher" data-list_alignment="right">
                                       <?php require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/right_align.php'; ?>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='wptb-element-options wptb-star_rating-options wptb-star_rating-options-prototype' style='display: none;'>
                    <div class="wptb-settings-dropdown">
                        <div class="wptb-back-button">
                             <a href="javascript:void(0)"  title="Back" class="wptb-exit-options" >
                            <svg pointer-events="none" width="12px" height="12px" x="0px" y="0px" viewBox="0 0 477.175 477.175" style="enable-background:new 0 0 477.175 477.175;" xml:space="preserve">
                                <g>
                                    <path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225
                                        c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/>
                                </g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                            </a>
                        </div>
                        <div class="wptb-option-text">  
                            <?php esc_html_e( 'Star Rating Options', 'wp-table-builder' ); ?>
                        </div>
                    </div>
                    <div class="wptb-element-option" >
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php esc_html_e( 'Star Size', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="margin: 9px 0; padding-bottom: 10px;">
                            <div class="wptb-settings-col-xs-8">
                              <input data-type="star-size" class="wptb-size-slider wptb-element-property" type="range" min="10" max="50" step="1" value="20"> 
                            </div>
                            <div class="wptb-settings-col-xs-4">
                                <input id="wptb-size-number" data-type="star-size"  class="wptb-size-number wptb-number-input wptb-element-property" type="number" min="10" max="50" step="1" placeholder="20" pattern="[0-9]*" value="20"><span class="wptb-input-px">px</span>
                            </div>
                        </div>
                    </div>
                    <div class="wptb-element-option">
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php esc_html_e( 'Star Color', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-top: 25px; padding-bottom: 10px;">
                            <div class='wptb-settings-col-xs-8'>
                                <input type="text" class="wptb-element-property wptb-color-picker" data-type="star-color"/>
                            </div>
                        </div>
                    </div>
                    <div class="wptb-element-option">
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php esc_html_e( 'Stars Count', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-top: 25px; padding-bottom: 10px;">
                            <div class='wptb-settings-col-xs-8'>
                                <input type="number" class="wptb-element-property wptb-stars-count-field" data-type="stars-count" value="5" min="1" max="10"/>
                            </div>
                        </div>
                    </div>
                    <div class="wptb-element-option wptb-settings-items">
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php esc_html_e( 'Rating Alignment', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 0px">
                            <ul>
                                <li class="wptb-rating-alignment-btn wptb-element-property wptb-rating-alignment-switcher" data-star_alignment="left">
                                    <?php require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/left_align.php'; ?>
                                </li>
                                <li class="wptb-rating-alignment-btn wptb-element-property wptb-rating-alignment-switcher selected" data-star_alignment="center">
                                    <?php require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/center_align.php'; ?>
                                </li>
                                <li class="wptb-rating-alignment-btn wptb-element-property wptb-rating-alignment-switcher" data-star_alignment="right">
                                   <?php require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/right_align.php'; ?>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="wptb-element-option">
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
                    <div class="wptb-element-option wptb-numeral-rating-option-container" style="display: none;">
                        <div class='wptb-settings-item-header' >
                            <p class="wptb-settings-item-title"><?php esc_html_e( 'Number Rating Size', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-settings-row wptb-settings-middle-xs" style="margin: 9px 0; padding-bottom: 10px;">
                            <div class="wptb-settings-col-xs-8">
                              <input data-type="numeral-rating-size" class="wptb-size-slider wptb-element-property" type="range"   min="10" max="50" step="1" value="25"> 
                            </div>
                            <div class="wptb-settings-col-xs-4">
                                <input id="wptb-numeral-size-number" data-type="numeral-rating-size"  class="wptb-size-number wptb-number-input wptb-element-property" type="number" min="10" max="50" step="1" placeholder="25" pattern="[0-9]*" value="25"><span class="wptb-input-px">px</span>
                            </div>
                        </div>
                    </div>
                    <div class="wptb-element-option wptb-numeral-rating-option-container" style="display: none;">
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
            </div>     
        </div>  
    </div>
    <div id="wptb-left-scroll-panel-curtain">
        <p><?php esc_html_e( 'You are currently editing the table cells. Click "Close" to go back to editing the table.', 'wp-table-builder' ); ?></p>
        <p><?php esc_html_e( 'Click on cells to select them or deselect them. Selected cells will be shown in a green outline.', 'wp-table-builder'); ?></p>
        <div>
            <button id="wptb-left-scroll-panel-curtain-close" class="wptb-table_change_button" title="<?php esc_attr_e( 'Close Manage Cells Mode', 'wp-table-builder' );?>"><?php esc_html_e( 'Close', 'wp-table-builder' ); ?></button>
        </div>
    </div>
    <div id="wptb-left-scroll-panel-cell-settings">
        <div class="wptb-settings-section">
            <div class="wptb-settings-dropdown">
                Cell Settings                
            </div>
            <div class="wptb-settings-items">
                <div class="wptb-settings-item-header">
                    <p style="margin: 0">
                        <?php esc_html_e( 'Column Width', 'wp-table-builder' ); ?>
                    </p>
                </div>
                <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-top: 25px; padding-bottom: 10px;">
                    <div class="wptb-settings-col-xs-8">
                        <input id="wptb-table-column-width-slider" type="range" min="50" max="500" step="1" value="30">
                    </div>
                    <div class="wptb-settings-col-xs-4">
                        <input id="wptb-table-column-width-number" class="wptb-number-input" type="number" min="50" max="500" step="1" placeholder="30" pattern="[0-9]*">
                        <span class="wptb-input-px">px</span>
                    </div>
                    <div class="wptb-settings-col-xs-12">
                        <label class="wptb-checkbox-button wptb-column-width-fix-auto">
                            <input id="wptb-table-column-width-auto-fixed" type="checkbox" />
                            <i>
                                <div class="wptb-column-fixed"><?php esc_html_e( 'Fixed', 'wp-table-builder' ); ?></div>
                                <div class="wptb-column-auto"><?php esc_html_e( 'Auto', 'wp-table-builder' ); ?></div>
                            </i>
                        </label>  
                    </div>  
                </div>    
            </div>
            <div class="wptb-settings-items">
                <div class="wptb-settings-item-header">
                    <p style="margin: 0">
                        <?php esc_html_e( 'Row Height', 'wp-table-builder' ); ?>
                    </p>
                </div>
                <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-top: 25px; padding-bottom: 10px;">
                    <div class="wptb-settings-col-xs-8">
                        <input id="wptb-table-row-height-slider" type="range" min="10" max="200" step="1" value="10">
                    </div>
                    <div class="wptb-settings-col-xs-4">
                        <input id="wptb-table-row-height-number" class="wptb-number-input" type="number" min="10" max="200" step="1" placeholder="10" pattern="[0-9]*">
                        <span class="wptb-input-px">px</span>
                    </div>
                    <div class="wptb-settings-col-xs-12">
                        <label class="wptb-checkbox-button wptb-column-width-fix-auto">
                            <input id="wptb-table-row-height-auto-fixed" type="checkbox" />
                            <i>
                                <div class="wptb-column-fixed"><?php esc_html_e( 'Fixed', 'wp-table-builder' ); ?></div>
                                <div class="wptb-column-auto"><?php esc_html_e( 'Auto', 'wp-table-builder' ); ?></div>
                            </i>
                        </label>  
                    </div>  
                </div>    
            </div>
        </div>
    </div>
    <a href="javascript:void(0)" class="wptb-left-panel-extend" data-fn="togglePanel" data-title-collapsed="Expand panel" data-title-expanded="Collapse panel" title="Collapse panel">
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="512" height="512" viewBox="0 0 357 357" style="enable-background:new 0 0 357 357;" xml:space="preserve" class=""><g transform="matrix(-1, 1.22465e-16, -1.22465e-16, -1, 357, 357)"><g>
            <g id="play-arrow">
                <polygon points="38.25,0 38.25,357 318.75,178.5   " data-original="#000000" class="active-path" style="fill:#3B7EC0" data-old_color="##3B7EC"></polygon>
            </g>
            </g></g>
        </svg>
    </a>
</div>
