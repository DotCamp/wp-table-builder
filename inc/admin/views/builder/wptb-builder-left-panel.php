<?php
/**
 * Builder Left Panel
 *
 * Left panel main sections are using css grid area names to be loaded on to the correct position on the DOM, detailed information about those area names can be found at wptb-panel-left css class' grid-template-areas property.
 *
 */

use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Core\Init as Init;

?>

<div class="wptb-left-panel"
     data-wptb-panel-location="<?php echo esc_attr( apply_filters( 'wp-table-builder/filter/panel_location', 'left' ) ); ?>">
    <div class="wptb-left-scroll-panel">
        <div class="wptb-panel-left">
            <div class="wptb-panel-brand">
                <span class="wptb-brand-name">
                    <?php esc_html_e( 'WP Table Builder', 'wp-table-builder' ); ?>
                </span>
            </div>
            <!--            main left panel section selectors-->
            <div class="wptb-panel-tabs wptb-settings-sections-wrapper wptb-plugin-box-shadow-md">
                <div class="wptb-settings-section-item static-active" data-wptb-section-button="elements"
                     data-wptb-section-display-type="table">
					<?php esc_html_e( 'elements', 'wp-table-builder' ); ?>
                </div>
                <div class="wptb-settings-section-item static-active" data-wptb-section-button="table_settings">
					<?php esc_html_e( 'settings', 'wp-table-builder' ); ?>
                </div>
                <div class="wptb-settings-section-item static-active" data-wptb-section-button="table_responsive_menu">
					<?php esc_html_e( 'responsive', 'wp-table-builder' ); ?>
                </div>
            </div>
            <!--            available elements list-->
            <div class="wptb-elements-section wptb-left-panel-sidebar-content">
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
                            <div class="wptb-panel-toggle-group" id="<?php esc_attr_e( $type ); ?>">
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


									foreach ( $elements as $element ):
										$is_pro_dummy = $element instanceof NS\Inc\Admin\Element_Classes\Base\Dummy_Element_base;
										?>
                                        <div class="wptb-element"
                                             draggable="<?php echo $is_pro_dummy ? "false" : "true"; ?>"
                                             data-wptb-element="<?php echo esc_attr( $element->get_name(), 'wp-table-builder' ); ?>" <?php if ( $is_pro_dummy ): echo 'data-wptb-pro-dummy="true"'; endif; ?>
                                             data-wptb-relative-elements="<?php echo esc_attr( $element->position_relative() ); ?>">
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

											<?php
											if ( $is_pro_dummy ):
												$unique_item_id = 'pro-dummy-element-' . $element->get_name();
												?>
                                                <div id="<?php echo esc_attr( $unique_item_id ); ?>">
                                                    <pro-overlay
                                                            feature-name="<?php $element->get_title(); ?>"></pro-overlay>
                                                </div>
                                                <script type="text/javascript">
                                                    WPTB_ControlsManager.setControlData('<?php echo esc_attr( $unique_item_id ); ?>', {});

                                                    document.addEventListener('DOMContentLoaded', () => {
                                                        WPTB_ControlsManager.callControlScript('ProOverlay', '<?php echo esc_attr( $unique_item_id ); ?>');
                                                    })
                                                </script>
											<?php
											endif;
											?>
                                        </div>
									<?php endforeach; ?>

                                </div>
                            </div>
						<?php endforeach ?>
						<?php do_action( 'wp-table-builder/action/after_elements' ); ?>
                    </div>
                </div>
            </div>

            <!--            table settings-->
            <div class="wptb-settings-section wptb-left-panel-sidebar-content" data-wptb-section="table_settings"
                 style="display: none">
				<?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-builder-table-settings.php'; ?>
            </div>
            <!--            responsive menu-->
            <div class="wptb-responsive-section wptb-left-panel-sidebar-content"
                 data-wptb-section="table_responsive_menu" style="display: none">
				<?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-builder-responsive-panel.php'; ?>
            </div>
            <!--            background settings-->
            <div class="wptb-responsive-section wptb-left-panel-sidebar-content"
                 data-wptb-section="background_menu" style="display: none">
				<?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-builder-background-menu.php'; ?>
            </div>
            <!--            element controls-->
            <div id="element-options-group" class="wptb-tab-content wptb-left-panel-sidebar-content"
                 data-wptb-section="options_group"
                 style="display: none;">
                <!-- here will be elements controls -->
            </div>
            <!--            left panel toggle element-->
            <div class="wptb-panel-toggle-section wptb-plugin-box-shadow-up-md">
                <span class="dashicons wptb-panel-drawer-icon"></span>
            </div>
        </div>
    </div>
    <div id="wptb-left-scroll-panel-curtain">
        <p><?php esc_html_e( 'You are currently editing the table cells. Click "Close" to go back to editing the table.', 'wp-table-builder' ); ?></p>
        <p><?php esc_html_e( 'Click on cells to select them or deselect them. Selected cells will be highlighted.', 'wp-table-builder' ); ?></p>
        <p><?php esc_html_e( 'Hold "SHIFT" and click on cells to select multiple cells.', 'wp-table-builder' ); ?></p>
        <div>
            <button class="wptb-table_change_button wptb-table-edit-mode-close"
                    title="<?php esc_attr_e( 'Close Manage Cells Mode', 'wp-table-builder' ); ?>"><?php esc_html_e( 'Close', 'wp-table-builder' ); ?></button>
        </div>
		<?php do_action( 'wp-table-builder/action/after_cell_notselected_left_panel' ); ?>
    </div>
    <div id="wptb-left-scroll-panel-cell-settings">
        <div id="element-cell-options-group" class="wptb-tab-content" data-wptb-section="cell_settings"
             style="display: none;">
            <!-- here will be cell controls -->
        </div>
		<?php do_action( 'wp-table-builder/action/cell_option' ); ?>
    </div>
</div>
