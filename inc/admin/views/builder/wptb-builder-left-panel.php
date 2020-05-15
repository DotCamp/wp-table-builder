<?php
/**
 * Builder Left Panel
 */

use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Core\Init as Init;

$plugin_textdomain = NS\PLUGIN_TEXT_DOMAIN;
?>

<div class="wptb-left-panel">
    <div class="wptb-left-scroll-panel">
        <div class="wptb-panel-left">
            <div class="wptb-panel-brand">
                <span class="wptb-brand-name">
                    WP Table Builder
                </span>
            </div>
            <div class="wptb-panel-tabs wptb-settings-sections-wrapper wptb-plugin-box-shadow-md">
                <div class="wptb-settings-section-item static-active" data-wptb-section-button="elements"
                     data-wptb-section-display-type="table">
					<?php esc_html_e( 'elements', $plugin_textdomain ); ?>
                </div>
                <div class="wptb-settings-section-item static-active" data-wptb-section-button="table_settings">
					<?php esc_html_e( 'table', $plugin_textdomain ); ?>
                </div>
            </div>
            <div class="wptb-elements-section">
                <div class="wptb-add-elements wptb-tab-content">
                    <div class="wptb-elements-container" data-wptb-section="elements">
                        <div class="wptb-panel-toggle-group">
                            <div class="wptb-panel-toggle">
                                <div class="header"><?php esc_html_e( 'basic', $plugin_textdomain ); ?></div>
                                <span class="dashicons toggle-icon"></span>
                            </div>
                            <div class="wptb-panel-toggle-target wptb-panel-elements-inner-wrapper">
			                    <?php

			                    do_action( 'wptb_before_elements' );

			                    $element_objects = Init::instance()->elements_manager->get_element_objects();

			                    foreach ( $element_objects as $element ): ?>

                                    <div class="wptb-element" draggable="true"
                                         data-wptb-element="<?php echo esc_attr( $element->get_name(), 'wp-table-builder' ); ?>">

					                    <?php

					                    if ( file_exists( $element->get_directory_icon() ) ) :
						                    require_once $element->get_directory_icon();
					                    endif;

					                    ?>

                                        <p class="wptb-draggable">

						                    <?php

						                    if ( method_exists( $element, 'get_title' ) ) :
							                    $element->get_title();
						                    endif;

						                    ?>

                                        </p>

                                    </div>

			                    <?php endforeach; ?>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="wptb-settings-section" data-wptb-section="table_settings" style="display: none">
				<?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-builder-table-settings.php'; ?>
            </div>

            <div id="element-options-group" class="wptb-tab-content" data-wptb-section="options_group"
                 style="display: none;">
                <!-- here will be elements controls -->
            </div>
            <div class="wptb-panel-drawer-toggle">
                <span class="dashicons wptb-panel-drawer-icon"></span>
            </div>
        </div>
    </div>
    <div id="wptb-left-scroll-panel-curtain">
        <p><?php esc_html_e( 'You are currently editing the table cells. Click "Close" to go back to editing the table.', 'wp-table-builder' ); ?></p>
        <p><?php esc_html_e( 'Click on cells to select them or deselect them. Selected cells will be shown in a green outline.', 'wp-table-builder' ); ?></p>
        <div>
            <button class="wptb-table_change_button wptb-table-edit-mode-close"
                    title="<?php esc_attr_e( 'Close Manage Cells Mode', 'wp-table-builder' ); ?>"><?php esc_html_e( 'Close', 'wp-table-builder' ); ?></button>
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
                        <input id="wptb-table-column-width-number" class="wptb-number-input" type="number" min="50"
                               max="500" step="1" placeholder="30" pattern="[0-9]*">
                        <span class="wptb-input-px">px</span>
                    </div>
                    <div class="wptb-settings-col-xs-12">
                        <label class="wptb-toggle wptb-column-width-fix-auto">
                            <input id="wptb-table-column-width-auto-fixed" type="checkbox"/>
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
                        <input id="wptb-table-row-height-number" class="wptb-number-input" type="number" min="10"
                               max="200" step="1" placeholder="10" pattern="[0-9]*">
                        <span class="wptb-input-px">px</span>
                    </div>
                    <div class="wptb-settings-col-xs-12">
                        <label class="wptb-toggle wptb-column-width-fix-auto">
                            <input id="wptb-table-row-height-auto-fixed" type="checkbox"/>
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
    <!--    <a href="javascript:void(0)" class="wptb-left-panel-extend" data-fn="togglePanel"-->
    <!--       data-title-collapsed="Expand panel" data-title-expanded="Collapse panel" title="Collapse panel">-->
    <!--        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"-->
    <!--             x="0px" y="0px" width="512" height="512" viewBox="0 0 357 357" style="enable-background:new 0 0 357 357;"-->
    <!--             xml:space="preserve" class=""><g transform="matrix(-1, 1.22465e-16, -1.22465e-16, -1, 357, 357)">-->
    <!--                <g>-->
    <!--                    <g id="play-arrow">-->
    <!--                        <polygon points="38.25,0 38.25,357 318.75,178.5   " data-original="#000000" class="active-path"-->
    <!--                                 style="fill:#3B7EC0" data-old_color="##3B7EC"></polygon>-->
    <!--                    </g>-->
    <!--                </g>-->
    <!--            </g>-->
    <!--        </svg>-->
    <!--    </a>-->
</div>
