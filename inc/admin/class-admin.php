<?php

namespace WP_Table_Builder\Inc\Admin;

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @link       http://wptablebuilder.com/
 * @since      1.0.0
 *
 * @author    Imtiaz Rayhan
 */
class Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string $plugin_name The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string $version The current version of this plugin.
	 */
	private $version;

	/**
	 * The text domain of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string $plugin_text_domain The text domain of this plugin.
	 */
	private $plugin_text_domain;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param string $plugin_name The name of this plugin.
	 * @param string $version The version of this plugin.
	 * @param string $plugin_text_domain The text domain of this plugin.
	 *
	 * @since       1.0.0
	 */
	public function __construct( $plugin_name, $version, $plugin_text_domain ) {

		$this->plugin_name        = $plugin_name;
		$this->version            = $version;
		$this->plugin_text_domain = $plugin_text_domain;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles( $hook ) {
	    // load styles at post screen to help plugins with dynamic shortcode parsing abilities to render the preview of table in realtime
		if ( $hook === 'post.php' ) {
			do_action( 'wptb_frontend_enqueue_style' );
		}
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
	    // @deprecated
		//wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/wp-table-builder-admin.js', array( 'jquery' ), $this->version, false );
	}

	/**
	 * Generating the review notice.
	 *
	 * @since 2.0
	 */
	public function review_notice() {

		$tables_count  = wp_count_posts( 'wptb-tables' );
		$tables_number = $tables_count->draft;

		if ( $tables_number >= 3 && get_option( 'wptb_review_notify' ) == "no" ) {
			?>
            <div class="wptb-review-notice notice notice-info">
                <p style="font-size: 14px;">
					<?php _e( 'Hey,<br> I noticed that you have already created ' . $tables_number . ' tables with WP Table Builder plugin - that’s awesome! Could you please do me a BIG favor and <b>give it a 5-star rating on WordPress</b>? Just to help us spread the word and boost our motivation. Thank you. <br>~ Imtiaz Rayhan', 'wp-table-builder' ); ?>
                </p>
                <ul>
                    <li>
                        <a style="margin-right: 5px; margin-bottom: 5px;" class="button-primary"
                           href="https://wordpress.org/support/plugin/wp-table-builder/reviews/#new-post"
                           target="_blank"><?php echo __('Sure, you deserve it.', 'wp-table-builder'); ?></a>
                        <a style="margin-right: 5px;" class="wptb_HideReview_Notice button" href="javascript:void(0);"><?php echo __('I already did.', 'wp-table-builder');?></a>
                        <a class="wptb_HideReview_Notice button" href="javascript:void(0);"><?php echo __('No, not good enough.', 'wp-table-builder');?></a>
                    </li>
                </ul>
            </div>
            <script>
                jQuery(document).ready(function ($) {
                    jQuery('.wptb_HideReview_Notice').click(function () {
                        var data = {'action': 'wptbReviewNoticeHide'};
                        jQuery.ajax({
                            url: "<?php echo admin_url( 'admin-ajax.php' ); ?>",
                            type: "post",
                            data: data,
                            dataType: "json",
                            async: !0,
                            success: function (notice_hide) {
                                if (notice_hide == "success") {
                                    jQuery('.wptb-review-notice').slideUp('fast');
                                }
                            }
                        });
                    });
                });
            </script>
			<?php

		}

	}

	/**
	 * Hides the review notice.
	 *
	 * @since 2.0
	 */
	public function wptb_hide_review_notify() {

		update_option( 'wptb_review_notify', 'yes' );
		echo json_encode( array( "success" ) );
		exit;

	}

}
