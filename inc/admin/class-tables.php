<?php

namespace WP_Table_Builder\Inc\Admin;

use WP_Table_Builder\Inc\Admin\Managers\Addon_Manager;
use WP_Table_Builder\Inc\Core\Init;
use WP_Table_Builder as NS;
use function apply_filters;
use function esc_attr;
use function get_plugin_data;

/**
 * All the table stuffs.
 *
 * Contains a bunch of helper methods as well.
 *
 * @link       http://wptablebuilder.com/
 * @since      1.0.0
 *
 * @author    Imtiaz Rayhan
 */
class Tables {

	/**
	 * Primary class constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		// Register wptb-tables custom post type
		$this->register_cpt();
		// Add the custom columns to the book post type:
		add_filter( 'manage_wptb-tables_posts_columns', [ $this, 'addHeader' ] );
		add_filter( 'post_row_actions', [ $this, 'customizeActions' ], 10, 2 );
		add_action( 'manage_wptb-tables_posts_custom_column', [ $this, 'addContent' ], 10, 2 );
//		add_filter( 'get_post_metadata', [ $this, 'post_content_filter' ], 100, 4 );
	}

	/**
	 * Add table id unique class to tables without one on meta value fetch.
	 *
	 * @param mixed $meta_val metal value to be filtered
	 * @param int $post_id post id
	 * @param string $meta_key meta key
	 * @param boolean $single whether to get single meta value
	 *
	 * @return mixed filtered meta value
	 */
	public function post_content_filter( $meta_val, $post_id, $meta_key, $single ) {
		if ( get_post_type( $post_id ) === 'wptb-tables' && $meta_key === '_wptb_content_' ) {
			global $wpdb;

			$table_content = $wpdb->get_var( "SELECT meta_value FROM {$wpdb->postmeta} where post_id={$post_id}" );

			if ( $table_content ) {
				$meta_val = Init::instance()->admin_menu->add_table_id_to_dom( $table_content, $post_id );

				if ( ! $single ) {
					$meta_val = [ $meta_val ];
				}
			}
		}

		return $meta_val;
	}

	function customizeActions( $actions, $post ) {

		if ( $post->post_type == "wptb-tables" ) {
			unset( $actions['inline hide-if-no-js'] );
			$actions['edit'] = '<a href="' . esc_url( menu_page_url( 'wptb-builder', false ) ) . '&table=' . $post->ID . '">' . esc_html_e( 'Edit', 'wp-table-builder' ) . '</a>';
		}

		return $actions;

	}

	function addHeader( $columns ) {
		$columns['shortcode'] = __( 'Shortcode', 'wp-table-builder' );

		return array(
			'cb'        => '<input type="checkbox" />',
			'title'     => __( 'Title', 'wp-table-builder' ),
			'shortcode' => __( 'Shortcode', 'wp-table-builder' ),
			'date'      => __( 'Date', 'wp-table-builder' ),
		);
	}

	// Add the data to the custom columns for the book post type:
	function addContent( $column, $post_id ) {
		switch ( $column ) {

			case 'title' :
				$post  = get_post( $post_id );
				$title = $post->post_title;
				echo "$title";
				break;
			case 'shortcode' :
				echo '<input class="wptb_shortcode" value="[wptb id=' . $post_id . ']" readonly style="border:none;display:inline;">'
				     . '<button onclick="event.preventDefault();var s=this.parentNode.getElementsByClassName(\'wptb_shortcode\')[0];s.select();document.execCommand(\'copy\');var elem = document.createElement(\'div\');elem.classList.add(\'notice\',\'notice-success\',\'is-dismissible\');elem.innerHTML = \'<p>Selected!</p><button onclick=\\\'var n = this.parentNode,p= n.parentNode;p.removeChild(n);\\\' type=\\\'button\\\' class=\\\'notice-dismiss\\\'><span class=\\\'screen-reader-text\\\'>Descartar este aviso.</span></button>\'; document.getElementsByClassName(\'wrap\')[0].prepend(elem);" class="button wptb-edit-button">Copy</button>';
				break;

		}
	}

	public function table_exists( $table_id ) {
		$table_content = get_post_meta( $table_id, '_wptb_content_', true );

		return ! empty( $table_content );
	}

	/**
	 * Registers the custom post type to be used for table.
	 *
	 * @since 1.0.0
	 */
	public function register_cpt() {

		// Custom post type arguments, which can be filtered if needed
		$args = apply_filters(
			'wptb_tables_post_type_args',
			array(
				'label'             => 'WPTB Tables',
				'public'            => true,
				'show_ui'           => false,
				'show_in_admin_bar' => false,
				'rewrite'           => false,
				'query_var'         => true,
				'can_export'        => false,
				'supports'          => array( 'title', 'custom-fields' ),
				'show_in_rest'      => true
			)
		);

		// Register the post type
		register_post_type( 'wptb-tables', $args );

		// register content meta
		register_post_meta( 'wptb-tables', '_wptb_content_', [
			'show_in_rest' => true
		] );

		// register prebuilt meta
		register_post_meta( 'wptb-tables', '_wptb_prebuilt_', [
			'show_in_rest' => true
		] );

		add_shortcode( 'wptb', array( $this, 'get_table' ) );
	}

	public function get_table( $args ) {
		if ( ! $this->table_exists( $args['id'] ) ) {
			return '[wptb id="' . $args['id'] . '" not found ]';
		}

		// @deprecated
//		do_action( 'wptb_frontend_enqueue_style' );
//		do_action( 'wptb_frontend_enqueue_script' );
		$html = get_post_meta( $args['id'], '_wptb_content_', true );

		if ( preg_match_all( '|<wptb_shortcode_container_element(.+)</wptb_shortcode_container_element>|isU', $html, $arr ) ) {
			foreach ( $arr[1] as $value ) {
				if ( ! isset( $args['internal_shortcodes_stop'] ) && $value ) {
					$pattern = get_shortcode_regex();

					if ( preg_match_all( '/' . $pattern . '/s', $value, $matches ) ) {

						for ( $i = 0; $i < count( $matches[0] ); $i ++ ) {
							$shortcode = $matches[0][ $i ];
							if ( isset( $matches[2][ $i ] ) && $matches[2][ $i ] == 'wptb' ) {

								$shortcode = str_replace( ']', ' internal_shortcodes_stop="1"]', $matches[0][ $i ] );

								$div_outer_html_new = str_replace( $matches[0][ $i ], $shortcode, $value );

								$html = str_replace( $value, $div_outer_html_new, $html );

								$html = str_replace( $div_outer_html_new, do_shortcode( $div_outer_html_new ), $html );
							} else {
								$html = str_replace( $value, do_shortcode( $value ), $html );
							}
						}
					}
				}
			}
		}

		$post_edit_link   = '';
		$post_give_credit = '';
		$after_table      = '';
		$settings_manager = Init::instance()->settings_manager;

		if ( current_user_can( 'manage_options' ) && $settings_manager->get_option_value( 'allow_edit_link_frontend' ) ) {
			$post_edit_link = '<div class="wptb-frontend-table-edit-link">'
			                  . '<a href="' . admin_url( 'admin.php?page=wptb-builder&table=' . $args['id'] ) . '">' . __( "Edit Table", 'wp-table-builder' ) . '</a></div>';
		}

		if ( $settings_manager->get_option_value( 'give_credits_to_wp_table_builder' ) ) {
			$post_give_credit .= '<div class="wptb-frontend-table-powered-by">'
			                     . '<small><i>Powered By </i></small>'
			                     . '<a href="https://wptablebuilder.com/" target="_blank">' . __( "WP Table Builder", 'wp-table-builder' )
			                     . '</a></div>';
		}

		if ( $post_edit_link != '' || $post_give_credit != '' ) {
			$after_table = '<div class="wptb-frontend-table-after">' . $post_edit_link . $post_give_credit . '</div>';
		}

		$html = sprintf( '<div class="wptb-table-container wptb-table-%1$d"><div class="wptb-table-container-matrix" id="wptb-table-id-%1$d" data-wptb-version="%4$s" data-wptb-pro-status="%5$s">%2$s</div></div>%3$s', esc_attr( $args['id'] ), $html, $after_table, esc_attr( get_plugin_data( NS\PLUGIN__FILE__ )['Version'] ), esc_attr( Addon_Manager::check_pro_status() ? 'true' : 'false' ) );

		$html = apply_filters( 'wp-table-builder/filter/table_html_shortcode', $html );

		return ( $html );
	}
}
