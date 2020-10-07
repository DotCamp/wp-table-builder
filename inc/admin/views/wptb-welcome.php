<?php

use WP_Table_Builder as NS;

/**
 * Table Welcome Page
 */

?>
<div class="wptb-container">
	<div class="wptb-headerPart">
		<div class="wptb-logoAndText">
			<img alt="" src="<?php echo wp_normalize_path( NS\WP_TABLE_BUILDER_URL . 'inc/admin/views/builder/icons/wp-table-builder-logo.png' )?>"> <span class="wptb-gettingStarted"><?php esc_html_e( 'Getting Started', 'wp-table-builder' ); ?></span>
		</div>
		<div class="wptb-skipToPrevious">
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=wptb-overview' ) ); ?>"><i class="dashicons dashicons-no" style="text-decoration: none" title="Skip"></i></a>
		</div>
	</div>
	<div class="wptb-gettingStartedContent">
		<div class="wptb-gettingStartedText">
			<h2><?php esc_html_e( 'Welcome to WP Table Builder!', 'wp-table-builder' ); ?></h2>
			<p><?php esc_html_e( 'We recommend you to watch this short getting started video, and then start dragging and dropping elements to create your first table.', 'wp-table-builder' ); ?></p>
		</div>
		<div class="wptb-gettingStartedViedo">
            <iframe width="716" height="415" src="https://www.youtube-nocookie.com/embed/VAU-i6RvXSI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
		</div>
		<div class="wptb-gettingStartedButton">
			<a class="wptb-buttonPrimary" href="<?php echo esc_url( admin_url( 'admin.php?page=wptb-builder' ) ); ?>">
                <?php esc_html_e( 'Create Your First Table', 'wp-table-builder' ); ?>
            </a>
            <a class="wptb-buttonSecondary" href="<?php echo esc_url( "https://wptablebuilder.com/" ); ?>">
                <?php esc_html_e ( 'Learn More', 'wp-table-builder' ); ?>
            </a>
		</div>
	</div>
</div>
