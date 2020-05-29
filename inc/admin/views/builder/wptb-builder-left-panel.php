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
            <div class="wptb-panel-tabs wptb-settings-sections-wrapper wptb-plugins-m-b-40 wptb-plugin-box-shadow-md">
                <div class="wptb-settings-section-item static-active" data-wptb-section-button="elements"
                     data-wptb-section-display-type="table">
					<?php esc_html_e( 'elements', $plugin_textdomain ); ?>
                </div>
                <div class="wptb-settings-section-item static-active" data-wptb-section-button="table_settings">
					<?php esc_html_e( 'settings', $plugin_textdomain ); ?>
                </div>
            </div>
            <div class="wptb-elements-section">
                <div class="wptb-add-elements wptb-tab-content">
                    <div class="wptb-elements-container" data-wptb-section="elements">
						<?php

						$element_objects = Init::instance()->elements_manager->get_element_objects();

						$element_objects_by_type = [];

						foreach ( $element_objects as $element ) {
							$type = $element->get_type();

							$element_objects_by_type[ $type ][] = $element;
						}

						foreach ( $element_objects_by_type as $type => $elements ):

							?>
                            <div class="wptb-panel-toggle-group">
                                <div class="wptb-panel-toggle">
                                    <div class="header"><?php
										/* translators: dynamic value here is one of element types that is defined in elements-manager.php as a constant */
										esc_html_e( $type, NS\PLUGIN_TEXT_DOMAIN ); ?></div>
                                    <span class="dashicons toggle-icon"></span>
                                </div>
                                <div class="wptb-panel-toggle-target wptb-panel-elements-inner-wrapper">
									<?php

									// fire up wptb_before_elements action hook with type argument of the current elements group
									do_action( 'wptb_before_elements', $type );


									foreach ( $elements as $element ): ?>
                                        <div class="wptb-element" draggable="true"
                                             data-wptb-element="<?php echo esc_attr( $element->get_name(), 'wp-table-builder' ); ?>">
                                            <div class="wptb-element-draggable-icon"><span
                                                        class="dashicons dashicons-menu"></span></div>
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
						<?php endforeach ?>
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
        <div id="element-cell-options-group" class="wptb-tab-content" data-wptb-section="cell_settings"
             style="display: none;">
            <!-- here will be cell controls -->
        </div>
        <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-builder-table-cell-settings.php'; ?>
    </div>
</div>
