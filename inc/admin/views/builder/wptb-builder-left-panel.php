<?php
/**
 * Builder Left Panel
 */
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
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="40px" height="50px"><path d="M59.7 0h-51.2C3.8 0 0 3.8 0 8.5v51.2c0 4.7 3.8 8.5 8.5 8.5h51.2c4.7 0 8.5-3.8 8.5-8.5v-51.2C68.3 3.8 64.4 0 59.7 0zM51.2 51.2H17.1V17.1H51.2V51.2z"/><path d="M503.5 0h-51.2c-4.7 0-8.5 3.8-8.5 8.5v51.2c0 4.7 3.8 8.5 8.5 8.5h51.2c4.7 0 8.5-3.8 8.5-8.5v-51.2C512 3.8 508.2 0 503.5 0zM494.9 51.2H460.8V17.1h34.1V51.2z"/><path d="M59.7 443.7h-51.2c-4.7 0-8.5 3.8-8.5 8.5v51.2C0 508.2 3.8 512 8.5 512h51.2c4.7 0 8.5-3.8 8.5-8.5v-51.2C68.3 447.5 64.4 443.7 59.7 443.7zM51.2 494.9H17.1V460.8H51.2V494.9z"/><path d="M503.5 443.7h-51.2c-4.7 0-8.5 3.8-8.5 8.5v51.2c0 4.7 3.8 8.5 8.5 8.5h51.2c4.7 0 8.5-3.8 8.5-8.5v-51.2C512 447.5 508.2 443.7 503.5 443.7zM494.9 494.9H460.8V460.8h34.1V494.9z"/><path d="M477.9 51.2H460.8V34.1c0-4.7-3.8-8.5-8.5-8.5H59.7c-4.7 0-8.5 3.8-8.5 8.5V51.2H34.1c-4.7 0-8.5 3.8-8.5 8.5v392.5c0 4.7 3.8 8.5 8.5 8.5H51.2v17.1c0 4.7 3.8 8.5 8.5 8.5h392.5c4.7 0 8.5-3.8 8.5-8.5V460.8h17.1c4.7 0 8.5-3.8 8.5-8.5V59.7C486.4 55 482.6 51.2 477.9 51.2zM469.3 443.7h-17.1c-4.7 0-8.5 3.8-8.5 8.5v17.1H68.3v-17.1c0-4.7-3.8-8.5-8.5-8.5H42.7V68.3h17.1c4.7 0 8.5-3.8 8.5-8.5V42.7h375.5v17.1c0 4.7 3.8 8.5 8.5 8.5h17.1V443.7z"/><path d="M401.1 76.8H110.9c-4.7 0-8.5 3.8-8.5 8.5V153.6c0 4.7 3.8 8.5 8.5 8.5h34.1c4.7 0 8.5-3.8 8.5-8.5V128h76.8v256h-34.1c-4.7 0-8.5 3.8-8.5 8.5v34.1c0 4.7 3.8 8.5 8.5 8.5h119.5c4.7 0 8.5-3.8 8.5-8.5v-34.1c0-4.7-3.8-8.5-8.5-8.5H281.6V128h76.8v25.6c0 4.7 3.8 8.5 8.5 8.5h34.1c4.7 0 8.5-3.8 8.5-8.5V85.3C409.6 80.6 405.8 76.8 401.1 76.8zM392.5 145.1h-17.1v-25.6c0-4.7-3.8-8.5-8.5-8.5h-93.9c-4.7 0-8.5 3.8-8.5 8.5v273.1c0 4.7 3.8 8.5 8.5 8.5H307.2v17.1H204.8v-17.1h34.1c4.7 0 8.5-3.8 8.5-8.5V119.5c0-4.7-3.8-8.5-8.5-8.5h-93.9c-4.7 0-8.5 3.8-8.5 8.5v25.6h-17.1v-51.2h273.1V145.1z"/></svg>
                            <p><?php echo __( 'Text', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-element right" draggable="true" id="wptb-image">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 489.4 489.4" width="40px" height="50px"><path d="M0 437.8c0 28.5 23.2 51.6 51.6 51.6h386.2c28.5 0 51.6-23.2 51.6-51.6V51.6c0-28.5-23.2-51.6-51.6-51.6H51.6C23.1 0 0 23.2 0 51.6 0 51.6 0 437.8 0 437.8zM437.8 464.9H51.6c-14.9 0-27.1-12.2-27.1-27.1v-64.5l92.8-92.8 79.3 79.3c4.8 4.8 12.5 4.8 17.3 0l143.2-143.2 107.8 107.8v113.4C464.9 452.7 452.7 464.9 437.8 464.9zM51.6 24.5h386.2c14.9 0 27.1 12.2 27.1 27.1v238.1l-99.2-99.1c-4.8-4.8-12.5-4.8-17.3 0L205.2 333.8l-79.3-79.3c-4.8-4.8-12.5-4.8-17.3 0l-84.1 84.1v-287C24.5 36.7 36.7 24.5 51.6 24.5z"/><path d="M151.7 196.1c34.4 0 62.3-28 62.3-62.3s-28-62.3-62.3-62.3 -62.3 28-62.3 62.3S117.3 196.1 151.7 196.1zM151.7 96c20.9 0 37.8 17 37.8 37.8s-17 37.8-37.8 37.8 -37.8-17-37.8-37.8S130.8 96 151.7 96z"/></svg>
                            <p><?php echo __( 'Image', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-element left" draggable="true" id="wptb-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 65 65"><path d="M64.5 24.1c0 3.8-3.1 6.9-6.9 6.9H7.4C3.6 31 0.5 27.9 0.5 24.1V6.9C0.5 3.1 3.6 0 7.4 0h50.1C61.4 0 64.5 3.1 64.5 6.9V24.1zM60.5 6.9C60.5 5.3 59.2 4 57.6 4H7.4C5.8 4 4.5 5.3 4.5 6.9v17.1c0 1.6 1.3 2.9 2.9 2.9h50.1c1.6 0 2.9-1.3 2.9-2.9L60.5 6.9 60.5 6.9z"/><path d="M64.5 58.1c0 3.8-3.1 6.9-6.9 6.9H7.4C3.6 65 0.5 61.9 0.5 58.1V40.9C0.5 37.1 3.6 34 7.4 34h50.1c3.8 0 6.9 3.1 6.9 6.9L64.5 58.1 64.5 58.1zM60.5 40.9c0-1.6-1.3-2.9-2.9-2.9H7.4C5.8 38 4.5 39.3 4.5 40.9v17.1c0 1.6 1.3 2.9 2.9 2.9h50.1c1.6 0 2.9-1.3 2.9-2.9L60.5 40.9 60.5 40.9z"/><path d="M8.5 16c-0.6 0-1-0.4-1-1v-1.8C7.5 10.4 9.8 8 12.4 8h6.2c0.6 0 1 0.4 1 1s-0.4 1-1 1h-6.2c-1.6 0-2.9 1.7-2.9 3.2V15C9.5 15.6 9.1 16 8.5 16z"/><path d="M8.6 19.4c-0.3 0-0.5-0.1-0.7-0.3 -0.2-0.2-0.3-0.4-0.3-0.7 0-0.3 0.1-0.5 0.3-0.7 0.4-0.4 1-0.4 1.4 0 0.2 0.2 0.3 0.5 0.3 0.7 0 0.3-0.1 0.5-0.3 0.7C9.1 19.3 8.9 19.4 8.6 19.4z"/></svg>
                            <p><?php echo __( 'Button', 'wp-table-builder' ); ?></p>
                        </div>
                        <div class="wptb-element right" draggable="true" id="wptb-list">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="40px" height="50px">
                            <path d="M469.3 0H42.7C19.1 0 0 19.1 0 42.7v426.7C0 492.9 19.1 512 42.7 512h426.7C492.9 512 512 492.9 512 469.3V42.7C512 19.1 492.9 0 469.3 0zM494.9 469.3c0 14.1-11.5 25.6-25.6 25.6H42.7c-14.1 0-25.6-11.5-25.6-25.6V42.7c0-14.1 11.5-25.6 25.6-25.6h426.7c14.1 0 25.6 11.5 25.6 25.6V469.3z"/><path d="M119.5 230.4c-14.1 0-25.6 11.5-25.6 25.6s11.5 25.6 25.6 25.6 25.6-11.5 25.6-25.6S133.6 230.4 119.5 230.4zM119.5 264.5c-4.7 0-8.5-3.8-8.5-8.5s3.8-8.5 8.5-8.5S128 251.3 128 256 124.2 264.5 119.5 264.5z"/><path d="M409.6 247.5H170.7c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5H409.6c4.7 0 8.5-3.8 8.5-8.5S414.3 247.5 409.6 247.5z"/><path d="M119.5 110.9c-14.1 0-25.6 11.5-25.6 25.6s11.5 25.6 25.6 25.6 25.6-11.5 25.6-25.6S133.6 110.9 119.5 110.9zM119.5 145.1c-4.7 0-8.5-3.8-8.5-8.5s3.8-8.5 8.5-8.5 8.5 3.8 8.5 8.5S124.2 145.1 119.5 145.1z"/><path d="M409.6 128H170.7c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5H409.6c4.7 0 8.5-3.8 8.5-8.5S414.3 128 409.6 128z"/><path d="M119.5 349.9c-14.1 0-25.6 11.5-25.6 25.6s11.5 25.6 25.6 25.6 25.6-11.5 25.6-25.6S133.6 349.9 119.5 349.9zM119.5 384c-4.7 0-8.5-3.8-8.5-8.5s3.8-8.5 8.5-8.5 8.5 3.8 8.5 8.5S124.2 384 119.5 384z"/><path d="M409.6 366.9H170.7c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5H409.6c4.7 0 8.5-3.8 8.5-8.5S414.3 366.9 409.6 366.9z"/></svg>
                        <p><?php echo __( 'List', 'wp-table-builder' ); ?></p>
                        </div>
                    </div>
                </div>

                <div id="element-options" class="wptb-tab-content" style="display: none;">
                    <?php echo __( 'Elements Options Goes Here', 'wp-table-builder' ); ?>
                </div>
            </div>
            <div class="wptb-settings-section">
                <div class="wptb-settings-dropdown">
                    <?php echo __( 'Table Settings', 'wp-table-builder' ); ?>
                </div>
                <div class="wptb-settings-items" style="display: none;">
                    <p><?php echo __( 'Table Border', 'wp-table-builder' ); ?></p>
                    <div class="wptb-settings-row wptb-settings-middle-xs">
                        <div class="wptb-settings-col-xs-8">
                            <input id="wptb-table-border-slider" type="range" min="0" max="50" step="1" value="0">
                        </div>
                        <div class="wptb-settings-col-xs-4">
                            <input id="wptb-table-border-number" class="wptb-number-input" type="number" min="0" max="50" step="1" placeholder="0"><span class="wptb-input-px">px</span>
                        </div>
                    </div>
                    <div id="wptb-apply-inner-border" class="wptb-settings-row wptb-settings-middle-xs">
                        <label class="wptb-inner-border">
                            <span style="font-size: 16px"><?php echo __( 'Apply Inner Border', 'wp-table-builder' ); ?></span>
                            <input id="wptb-inner-border-check" type="checkbox"/>
                            <i></i>
                        </label>
                    </div>
                    <div style="display:none" id="wptb-inner-border-settings" class="wptb-settings-row wptb-settings-middle-xs">
                        <div class="wptb-settings-col-xs-8">
                            <input id="wptb-table-inner-border-slider" type="range" min="0" max="50" step="1" value="0">
                        </div>
                        <div class="wptb-settings-col-xs-4">
                            <input id="wptb-table-inner-border-number" class="wptb-number-input" type="number" min="0" max="50" step="1" placeholder="0"><span class="wptb-input-px">px</span>
                        </div>
                    </div>
                    <p><?php echo __( 'Cell Padding', 'wp-table-builder' ); ?></p>
                    <div class="wptb-settings-row wptb-settings-middle-xs">
                        <div class="wptb-settings-col-xs-8">
                            <input id="wptb-table-cell-slider" type="range" min="10" max="50" step="1" value="15">
                        </div>
                        <div class="wptb-settings-col-xs-4">
                            <input id="wptb-table-cell-number" class="wptb-number-input" type="number" min="10" max="50" step="1" placeholder="15"><span class="wptb-input-px">px</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>    
</div>