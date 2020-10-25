<?php

use WP_Table_Builder as NS;

/**
 * Table Builder UI
 */

?>


<div id="wptb_builder" class="wptb-admin-container">

    <div class="wptb-container">

		<?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-builder-left-panel.php'; ?>

        <div class="wptb-builder-panel">
            <div class="wptb-builder-header">
				<?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-builder-header.php'; ?>
		<?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-header-toolbox.php'; ?>
            </div>
            <div class="wptb-builder-content"><?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-builder-table-setup.php'; ?></div>
          <?php do_action('wp-table-builder/action/wptb-builder-view'); ?>
        </div>

    </div>

    <!-- after html -->
    <?php echo do_action( 'wp_table_builder:html_code_after' ); ?>

</div>

<style type="text/css" id="custom-cursor">

</style>