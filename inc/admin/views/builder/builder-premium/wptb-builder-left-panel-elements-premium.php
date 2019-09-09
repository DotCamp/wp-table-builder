<?php
/**
 * Left Panel Elements Premium
 */

use WP_Table_Builder as NS;

?>

<div class="wptb-element left " draggable="true" data-wptb-element="star_rating"  id="wptb-star_rating">
    <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/half-filled-rating-star.php'; ?>
    <p class="wptb-draggable"><?php esc_html_e( 'Star Rating', 'wp-table-builder' ); ?></p>
</div>