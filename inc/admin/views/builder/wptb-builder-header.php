<?php

/**
 * Builder Header.
 */

?>

<div class="wptb-header">
    <div class="wptb-logo">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 478.854 478.854" style="enable-background:new 0 0 478.854 478.854;" xml:space="preserve" width="64" height="64" class=""><g><path style="fill:#0B1C28;" d="M444.101,478.854c-25.183-89.379-107.244-154.915-204.674-154.915S59.936,389.475,34.753,478.854  H444.101z" data-original="#0B1C28" class=""/><path style="fill:#1B374F;" d="M378.738,224.737c0,63.126-51.184,114.31-114.31,114.31h-50.003  c-63.126,0-114.31-51.184-114.31-114.31v-46.434c0-63.126,51.184-114.31,114.31-114.31h50.003c63.126,0,114.31,51.184,114.31,114.31  V224.737z" data-original="#1B374F" class=""/><path style="fill:#0B1C28;" d="M378.738,178.302v46.434c0,63.126-51.184,114.31-114.31,114.31h-50.003" data-original="#0B1C28" class=""/><g>
	<circle style="fill:#3B7EC0" cx="173.812" cy="213.67" r="13.131" data-original="#DDDD85" class="" data-old_color="#3D80C3"/>
	<circle style="fill:#3B7EC0" cx="305.066" cy="213.67" r="13.131" data-original="#DDDD85" class="" data-old_color="#3D80C3"/>
    </g><path style="fill:#0D557E" d="M382.031,154.798c0.047-1.063,0.165-2.095,0.165-3.167c0-78.848-63.913-142.769-142.769-142.769  c-78.864,0-142.769,63.921-142.769,142.769c0,1.079,0.134,2.111,0.165,3.167H382.031z" data-original="#FFB600" class="" data-old_color="#0D567F"/><path style="fill:#156793" d="M317.117,154.798c0.016-1.063,0.095-2.095,0.095-3.167c0-78.848-34.832-142.769-77.785-142.769  c-42.961,0-77.785,63.921-77.785,142.769c0,1.079,0.071,2.111,0.095,3.167H317.117z" data-original="#FF9D00" class="" data-old_color="#156895"/><path style="fill:#3E99CA" d="M392.365,158.531c0,4.34-3.521,7.877-7.877,7.877H94.366c-4.356,0-7.877-3.537-7.877-7.877l0,0  c0-4.356,3.521-7.877,7.877-7.877h290.123C388.844,150.654,392.365,154.183,392.365,158.531L392.365,158.531z" data-original="#FFE000" class="active-path" data-old_color="#3E9ACC"/><path style="fill:#0D557E" d="M279.796,83.693c0,13.06-10.587,23.631-23.631,23.631h-33.477c-13.044,0-23.631-10.571-23.631-23.631  V12.8c0-13.044,10.587-12.8,23.631-12.8h33.477c13.044,0,23.631-0.244,23.631,12.8V83.693z" data-original="#FFB600" class="" data-old_color="#0D567F"/><path style="fill:#3E99CA" d="M256.166,0h-33.477c-13.044,0-23.631-0.244-23.631,12.8v55.8c0,13.044,10.587,23.631,23.631,23.631  h33.477c13.044,0,23.631-10.587,23.631-23.631V12.8C279.796-0.252,269.21,0,256.166,0z" data-original="#FFE000" class="active-path" data-old_color="#3E9ACC"/><g>
	<path style="fill:#0D557E" d="M133.75,456.673c0,3.631-2.954,6.585-6.585,6.585h-15.722c-3.631,0-6.585-2.954-6.585-6.585V352.839   c0-3.647,2.954-6.585,6.585-6.585h15.722c3.631,0,6.585,2.938,6.585,6.585V456.673z" data-original="#FFB600" class="" data-old_color="#0D567F"/>
	<path style="fill:#0D557E" d="M373.996,456.673c0,3.631-2.954,6.585-6.585,6.585h-15.722c-3.631,0-6.585-2.954-6.585-6.585   V352.839c0-3.647,2.954-6.585,6.585-6.585h15.722c3.631,0,6.585,2.938,6.585,6.585V456.673z" data-original="#FFB600" class="" data-old_color="#0D567F"/>
    </g></g> </svg>
    </div>
    
    <div class="wptb-close">
        <a href="<?php echo esc_url( admin_url( 'admin.php?page=wptb-overview' ) ); ?>"><span class="dashicons dashicons-no" style="font-size: 30px; width: 30px; height: 30px;"></span></a>
    </div>
    <div class="wptb-right">
        <?php
            $wptb_button_disable_class = '';
            $wptb_preview_button_url_value_id = 'empty';
            if( ! isset( $_GET['table'] ) || ! absint( $_GET['table'] ) || ! get_post_meta( absint( $_GET['table'] ) , '_wptb_content_', true ) ) {
                $wptb_button_disable_class =  'wptb-button-disable';
            } else {
                $wptb_preview_button_url_value_id = absint( $_GET['table'] );
            }
            $wptb_preview_button_url = add_query_arg(
                array(
                    'post_type' => 'wptb-tables',
                    'p' => $wptb_preview_button_url_value_id,
                ),
                home_url()
            );
        ?>
<!--        <div class="wptb-undo-redo-container">
            <div class="wptb-undo">
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
            <div class="wptb-redo">
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
        </div>-->
        <div class="wptb-embed">
            <a href="#" class="wptb-button-grey wptb-embed-btn <?php echo $wptb_button_disable_class; ?>">
                <?php esc_html_e( '</> Embed', 'wp-table-builder' ); ?>
            </a>
        </div>
        <div class="wptb-preview">
            <a href="<?php echo $wptb_preview_button_url_value_id !== 'empty' ? $wptb_preview_button_url : '#'; ?>" 
               target="_blank" class="wptb-button-grey wptb-preview-btn <?php echo $wptb_button_disable_class; ?>" 
               data-preview-href="<?php echo $wptb_preview_button_url_value_id === 'empty' ? $wptb_preview_button_url : '#'; ?>">
                <?php esc_html_e( 'Preview', 'wp-table-builder' ); ?>
            </a>
        </div>
        <div class="wptb-save">
            <a href="#" class="wptb-save-btn">
                <?php esc_html_e( 'Save Table', 'wp-table-builder' ); ?>
            </a>
        </div>
    </div>
    <div id="wptb-messaging-area">
            
    </div>
    
    <div class="wptb-popup-window-modal">
        <div class="wptb-popup-box">
            <div class="wptb-popup-window-close-icon" style="display: block;">×</div>
            <div class="wptb-popup-content">
                <p>
                    <?php esc_html_e( 'To embed this table on your site, please paste the following shortcode inside a post or page.', 'wp-table-builder' ); ?>
                </p>
                
                <input type="text" value="<?php echo isset( $_GET['table'] ) && absint( $_GET['table'] ) && 
                get_post_meta( absint( $_GET['table'] ) , '_wptb_content_', true ) ? '[wptb id=' . absint( $_GET['table'] ) . ']' : '';?>" id="wptb-embed-shortcode" readonly>
            </div>
        </div>
    </div>
    <div class="wptb-popup-dark-area"></div>
    
</div>