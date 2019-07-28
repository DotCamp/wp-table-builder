<?php

namespace WP_Table_Builder\Inc\Core;
use WP_Table_Builder\Inc\Common\Helpers;

/**
 * Show preview table 
 *
 * @link       http://wptablebuilder.com/
 * @since      1.0.1
 *
 * @author     Imtiaz Rayhan
 */


class Preview {
    
    /**
	 * Instance to instantiate object.
	 *
     * @since 1.0.1
     * 
	 * @var $instance
	 */
	protected static $instance;
    
    /**
	 * Table data.
	 *
	 * @since 1.0.1
	 *
	 * @var array
	 */
	public $table_data;
    
    /**
     * Singleton pattern, making only one instance of the class.
     *
     * @since 1.0.1
     */
    public static function instance() {
        if ( ! isset( self::$instance ) ) {
            $className      = __CLASS__;
            self::$instance = new $className;
        }

        return self::$instance;
    }
    
    /**
	 * Constructor.
	 *
	 * @since 1.0.1
	 */
    private function __construct() {
        
        if ( ! $this->is_preview_page() ) {
			return;
		}
        
        $this->hooks();
        
    }
    
    
    /**
	 * Check if the current page request meets the requirements for the table preview page.
	 *
	 * @since 1.0.1
	 *
	 * @return bool
	 */
	public function is_preview_page() {

		// if this is a preview page, then continue
		if ( empty( $_GET['wptb_table_preview'] ) ) {
			return false;
		}

		// if the user is authorized and if user rights are valid 
		if ( ! is_user_logged_in() || ! Helpers::wptb_current_user_can() ) {
			return false;
		}
        
        $this->table_data = $this->get_table_data( absint( $_GET['wptb_table_preview'] ) );
        
        // Check if the form is available
        if ( empty( $this->table_data ) ) {
			return false;
		}

		return true;
        
	}
    
    public function get_table_data( $id ) {
        
		if ( false === $id ) {
			return false;
		}
        
        if ( ! empty( $id ) ) {
			$post = get_post( $id );
            
            $post = ! empty( $post ) && 'wptb-tables' === $post->post_type && get_post_meta( $id, '_wptb_content_', true ) ? $post : false;
		}
        
        if ( empty( $post ) ) {
			return false;
		}

		return $post;
        
    }
    
    
    /**
	 * Adds functions to event handlers and filtering functions 
     * for displaying necessary content.
	 *
	 * @since 1.0.1
	 */
	public function hooks() {

		add_action( 'pre_get_posts', array( $this, 'pre_get_posts' ) );

		add_filter( 'the_title', array( $this, 'the_title' ), 100 );

		add_filter( 'the_content', array( $this, 'the_content' ), 999 );

		add_filter( 'get_the_excerpt', array( $this, 'the_content' ), 999 );

		add_filter( 'template_include', array( $this, 'template_include' ) );

		add_filter( 'post_thumbnail_html', '__return_empty_string' );
        
	}
    
    /**
	 * Modify query, limit for one post.
	 *
	 * @since 1.0.1
	 *
	 * @param $query The WP_Query instance.
	 */
	public function pre_get_posts( $query ) {
        
		if ( ! is_admin() && $query->is_main_query() ) {
			$query->set( 'posts_per_page', 1 );
		}
        
	}

	/**
	 * Change page title for table preview
	 *
	 * @since 1.0.1
	 *
	 * @param string $title Page title.
	 *
	 * @return string
	 */
	public function the_title() {
        
        $title = sprintf(
            esc_html__( '%s Preview', 'wp-table-builder' ),
            ! empty( $this->table_data->post_title ) ? sanitize_text_field( $this->table_data->post_title ) : esc_html__( 'Table', 'wp-table-builder' )
        );
        
		return $title;
        
	}

	/**
	 * Change page content for table preview.
	 *
	 * @since 1.0.1
	 *
	 * @return string
	 */
	public function the_content() {

		$content = esc_html__( 'This is a preview of your table. This page is not publicly accessible.', 'wp-table-builder' );
        
		$content .= do_shortcode( '[wptb id="' . absint( $this->table_data->ID ) . '"]' );

		return $content;
        
	}

	/**
	 * Forced inclusion of page templates.
	 *
	 * @since 1.0.1
	 *
	 * @return array
	 */
	public function template_include() {

		return locate_template( array( 'page.php', 'single.php', 'index.php' ) );
        
	}
    
}
