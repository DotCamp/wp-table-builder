<?php

/**
 * Builder Header.
 */

do_action( 'wptb_before_header' );

?>

    <div class="wptb-header">
        <div class="wptb-name-setup">
            <input type="text" name="" id="wptb-setup-name"
                   placeholder="<?php esc_attr_e( 'Enter table name here...', 'wp-table-builder' ); ?>">
        </div>
        <div class="wptb-settings-section-item wptb-plugin-margin-no wptb-plugin-header-close">
            <a href="<?php echo esc_url( admin_url( 'admin.php?page=wptb-overview' ) ); ?>"><span
                        class="dashicons dashicons-no wptb-header-close"></span></a>
        </div>
        <div class="wptb-header-buttons-container">
			<?php
			// create a nonce
			$nonce = wp_create_nonce( 'wptb_nonce_table_preview' );
			?>
            <div class="wptb-right">
				<?php
				$wptb_button_disable_class        = '';
				$wptb_preview_button_url_value_id = 'empty';
				if ( ! isset( $_GET['table'] ) || ! absint( $_GET['table'] ) || ! get_post_meta( absint( $_GET['table'] ), '_wptb_content_', true ) ) {
					$wptb_button_disable_class = 'wptb-button-disable';
				} else {
					$wptb_preview_button_url_value_id = absint( $_GET['table'] );
				}
				$wptb_preview_button_url = add_query_arg(
					array(
						'post_type' => 'wptb-tables',
						'p'         => $wptb_preview_button_url_value_id,
						'_wpnonce'  => $nonce,
					),
					home_url()
				);
				?>
                <div class="wptb-undo-redo-container">
                    <div class="wptb-undo wptb-undoredo-disabled" data-wptb-undoredo="undo">
                        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                             xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                             viewBox="0 0 511.983 511.983" style="enable-background:new 0 0 511.983 511.983;"
                             xml:space="preserve" width="30" height="30" class="">
                    <g>
                        <path style="fill:#3B7EC0" d="M255.983,160.199V63.986c-0.007-5.891-4.788-10.661-10.679-10.655
                            c-2.134,0.002-4.218,0.645-5.983,1.844l-234.667,160c-4.866,3.321-6.119,9.957-2.798,14.823c0.75,1.099,1.699,2.048,2.798,2.798
                            l234.667,160c4.873,3.311,11.507,2.045,14.817-2.828c1.199-1.765,1.841-3.849,1.844-5.983v-95.68
                            c121.323,6.997,233.472,130.581,234.667,159.232v0.619c0.093,5.824,4.842,10.497,10.667,10.496l0,0
                            c5.891,0,10.667-4.776,10.667-10.667v-0.533C509.85,329.33,420.037,166.983,255.983,160.199z"
                              data-original="#2196F3" class="active-path" data-old_color="#2196F3">
                        </path>
                    </g>
                </svg>
                    </div>
                    <div class="wptb-redo wptb-undoredo-disabled" data-wptb-undoredo="redo">
                        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                             xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                             viewBox="0 0 511.983 511.983" style="enable-background:new 0 0 511.983 511.983;"
                             xml:space="preserve" width="30" height="30">
                    <g>
                        <path style="fill:#3B7EC0"
                              d="M507.328,215.175l-234.667-160c-4.873-3.311-11.507-2.045-14.817,2.828
                            c-1.199,1.765-1.841,3.849-1.844,5.983v96.213C91.947,166.983,2.133,329.33,0,447.453v0.533c0,5.891,4.776,10.667,10.667,10.667l0,0
                            c5.825,0.001,10.573-4.672,10.667-10.496v-0.619C22.528,418.887,134.656,295.303,256,288.306v95.68
                            c0.007,5.891,4.788,10.661,10.679,10.655c2.134-0.002,4.218-0.645,5.983-1.844l234.667-160c4.866-3.321,6.119-9.957,2.798-14.823
                            C509.376,216.875,508.427,215.925,507.328,215.175z"
                              data-original="#2196F3" class="active-path" data-old_color="#2196F3">
                        </path>
                    </g>
                </svg>
                    </div>
                </div>
                <!--                    reserved for future night mode-->
                <!--                    <div class="wptb-panel-night-mode-container" >-->
                <!--                        <div id="wptbPanelNightMode"></div>-->
                <!--                    </div>-->
                <div class="wptb-panel-sub-container-buttons">
                    <div class="wptb-embed">
                        <a href="#"
                           class="static-active wptb-button-grey wptb-embed-btn wptb-settings-section-item <?php echo $wptb_button_disable_class; ?>">
							<?php esc_html_e( 'Embed', 'wp-table-builder' ); ?>
                        </a>
                    </div>
                    <div class="wptb-preview">
                        <a href="<?php echo $wptb_preview_button_url_value_id !== 'empty' ? $wptb_preview_button_url : '#'; ?>"
                           target="_blank"
                           class="static-active wptb-button-grey wptb-settings-section-item wptb-preview-btn <?php echo $wptb_button_disable_class; ?>"
                           data-preview-href="<?php echo $wptb_preview_button_url_value_id === 'empty' ? $wptb_preview_button_url : '#'; ?>">
							<?php esc_html_e( 'Preview', 'wp-table-builder' ); ?>
                        </a>
                    </div>
                    <div id="saveButton" class="wptb-save">
                        <save-button></save-button>
<!--                        @deprecated-->
<!--                        <a href="#"-->
<!--                           class="wptb-save-btn wptb-save-disabled wptb-settings-section-item static-active">-->
<!--							--><?php //esc_html_e( 'Save', 'wp-table-builder' ); ?>
<!--                        </a>-->
<!--                        <div class="wptb-busy">-->
<!--                            <div class="wptb-busy-circle"></div>-->
<!--                            <div class="wptb-busy-circle"></div>-->
<!--                            <div class="wptb-busy-circle"></div>-->
<!--                        </div>-->
                    </div>
                </div>
            </div>
            <div id="wptb-embed-modal">
            </div>
            <div class="wptb-popup-dark-area"></div>
        </div>
    </div>
<?php

do_action( 'wptb_after_header' );
