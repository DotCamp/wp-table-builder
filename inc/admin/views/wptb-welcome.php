<?php

use WP_Table_Builder as NS;

/**
 * Table Welcome Page
 */

?>

<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />

<div class="wptb-welcome-container">
    <div class="wptb-welcome-header">
        <h1><?php esc_html_e( 'Welcome to WP Table Builder!', 'wp-table-builder' ); ?></h1>
        <h5><?php esc_html_e( 'The Drag & Drop Wordpress Table Builder', 'wp-table-builder' ); ?></h5>
        <img src="<?php echo wp_normalize_path( NS\WP_TABLE_BUILDER_URL . 'inc/admin/views/builder/icons/icon-128x128.png' )?>">
    </div>
    <div class="wptb-welcome-intro">
        <p><?php esc_html_e( ' ', 'wp-table-builder' ); ?></p>
        <h2><span class="color-blue"><?php esc_html_e( '7 elements.', 'wp-table-builder' ); ?></span> <?php esc_html_e( 'More in the making...', 'wp-table-builder' ); ?></h2>
        <div class="wptb-welcome-button-wrap wptb-after-clear-both">
            <div class="left">
                <a href="<?php echo esc_url( admin_url( 'admin.php?page=wptb-builder' ) ); ?>" class="wptb-btn wptb-btn-block wptb-btn-lg wptb-btn-blue">
                    <?php esc_html_e( 'Create Table', 'wp-table-builder' ); ?>
                </a>
            </div>
            <div class="right">
                <a href="https://wptablebuilder.com/"
                   class="wptb-btn wptb-btn-block wptb-btn-lg wptb-btn-grey" target="_blank" rel="noopener noreferrer">
                    <?php esc_html_e( 'Learn More', 'wp-table-builder' ); ?>
                </a>
            </div>
        </div>
    </div>
</div>

<div class="wptb-welcome-container">
    <div class="wptb-welcome-social">
        <h2><?php esc_html_e( 'Stay Connected with Us!', 'wp-table-builder' ); ?></h2>
        <p><?php esc_html_e( 'For upcoming plugins updates, news, tips and tutorials on WP Table Builder in general you can stay connected with us.', 'wp-table-builder' ); ?></p>
        <div class="wptb-welcome-button-wrap wptb-after-clear-both">
            <div class="left">
                <a href="https://twitter.com/wptbplugin" target="_blank" class="wptb-btn wptb-btn-block wptb-btn-lg wptb-btn-twitter">
                    <?php esc_html_e( 'Follow Us On Twitter!', 'wp-table-builder' ); ?>
                </a>
            </div>
            <div class="right">
                <a href="https://www.facebook.com/groups/497986907442780/"
                   class="wptb-btn wptb-btn-block wptb-btn-lg wptb-btn-facebook" target="_blank" rel="noopener noreferrer">
                    <?php esc_html_e( 'Join Our Facebook Group!', 'wp-table-builder' ); ?>
                </a>
            </div>
        </div>
    </div>
</div>

<style type="text/css" id="custom-cursor">

</style>