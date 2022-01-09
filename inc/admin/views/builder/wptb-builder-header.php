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
                    <div class="wptb-save">
                        <a href="#"
                           class="wptb-save-btn wptb-save-disabled wptb-settings-section-item static-active">
							<?php esc_html_e( 'Save Table', 'wp-table-builder' ); ?>
                        </a>
                        <div class="wptb-busy">
                            <div class="wptb-busy-circle"></div>
                            <div class="wptb-busy-circle"></div>
                            <div class="wptb-busy-circle"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="wptb-popup-window-modal">
                <div class="wptb-popup-box">
                    <div class="wptb-popup-window-close-icon" style="display: block;">×</div>
                    <div class="wptb-popup-content">
                        <p>
							<?php esc_html_e( 'To embed this table on your site, please paste the following shortcode inside a post or page.', 'wp-table-builder' ); ?>
                        </p>
                        <div id="divPArent">
                            <div id="divInput">
                                <input value="<?php echo isset($_GET['table']) && absint($_GET['table']) &&
                                get_post_meta(absint($_GET['table']), '_wptb_content_', true) ? '[wptb id=' . absint($_GET['table']) . ']' : ''; ?>"
                                       id="wptb-embed-shortcode" readonly>
                            </div>
                            <div onclick="copyToClipboard()" id="divSvg">
                                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                                     xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                     viewBox="0 0 115.77 122.88"
                                     width="30" height="30"
                                     style="enable-background:new 0 0 115.77 122.88" xml:space="preserve"><style
                                            type="text/css">.st0 {
                                            fill-rule: evenodd;
                                            clip-rule: evenodd;
                                        }</style>
                                    <g>
                                        <path class="st0"
                                              d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z"/>
                                    </g>

                        </svg>
                                <span class="tooltiptext">Copy</span>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
            <div class="wptb-popup-dark-area"></div>
        </div>
    </div>
<?php

do_action( 'wptb_after_header' );
