<?php
use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Admin\Views\Builder\Table_Element\Table_Settings_Element as Table_Settings_Element;
use WP_Table_Builder\Inc\Core\Init as Init;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Table Settings 

?>

<div class="wptb-settings-items" style="display: block;">
    
    <div id="table-settings-group">
        <div class="wptb-panel-table-empty-message"><?php esc_html_e( 'Table settings will be available when a new table is generated.', 'wp-table-builder' ); ?></div>
    </div>
    
</div>