<?php

namespace WP_Table_Builder\Inc\Core;
use WP_Table_Builder\Inc\Common\Helpers;
use WP_Table_Builder as NS;

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
		if ( empty( $_GET['post_type'] ) && empty( $_GET['p'] ) ) {
			return false;
		} elseif ( sanitize_text_field( $_GET['post_type'] ) !== 'wptb-tables' ) {
            return false;
        }

		// if the user is authorized and if user rights are valid 
		if ( ! is_user_logged_in() || ! Helpers::wptb_current_user_can() ) {
			return false;
		}
        
        $this->table_data = $this->get_table_data( absint( $_GET['p'] ) );
        
        // Check if the form is available
        if ( empty( $this->table_data ) ) {
			return false;
		}
        
        // Check nonce
        $nonce = sanitize_text_field( $_GET['_wpnonce'] );
        if ( ! $nonce || ! wp_verify_nonce( $nonce, 'wptb_nonce_table_preview' ) && ! wp_verify_nonce( $nonce, 'wptb_nonce_table' ) ) {
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
            $nonce = sanitize_text_field( $_GET['_wpnonce'] );
            if( $nonce && wp_verify_nonce( $nonce, 'wptb_nonce_table' ) ) {
                $post = ! empty( $post ) && 'wptb-tables' === $post->post_type && get_post_meta( $id, '_wptb_content_', true ) ? $post : false;
            } else if( $nonce && wp_verify_nonce( $nonce, 'wptb_nonce_table_preview' ) ) {
                $time_over = false;
                $preview_id = absint( $_GET['preview_id'] );
                $preview_id_meta = get_post_meta( $id, '_wptb_preview_id_', true );
                $ts = absint( $_GET['ts'] );
                if( ! $ts ) {
                    $ts = 1;
                } else {
                    if( $ts < 10 ) {
                        $ts += 1;
                    } else {
                        $time_over = true;
                    }
                } 
                
                if( $preview_id_meta != $preview_id && ! $time_over ) {
                    echo '<div style="display:table; width:100%; height:100%;">'
                    . '<div style="display:table-cell; width:100%; vertical-align:middle; text-align:center;"><img src="' . wp_normalize_path( NS\WP_TABLE_BUILDER_URL . 'inc/admin/views/builder/icons/icon-128x128.png' ) . '">'
                    . '<p>' . __( 'Generating preview...', 'wp-table-builder' ) . '</p></div>'
                    . '</div>';
                    echo '<script>setTimeout( function() {'
                    . 'let newHref = new URL( "' . get_site_url() . $_SERVER['REQUEST_URI'] . '" );'
                    . 'newHref.searchParams.set( "ts", ' . $ts . ' );'
                    . 'window.location.href=newHref.toString();'
                    . '} , 1000 );</script>';
                    die();
                }
                
                $post = ! empty( $post ) && 'wptb-tables' === $post->post_type && get_post_meta( $id, '_wptb_content_preview_', true ) ? $post : false;
            }
            
		}
        
        if ( empty( $post ) ) {
			return false;
		}

		return $post;
        
    }
    
    function head_hook_css() {
        // Check nonce
        $nonce = sanitize_text_field( $_GET['_wpnonce'] );
        
        if( $nonce && wp_verify_nonce( $nonce, 'wptb_nonce_table' ) ) {
            $css_text = get_post_meta( absint( $this->table_data->ID ) , '_wptb_table_elements_styles_frontend', true );
        } else if( $nonce && wp_verify_nonce( $nonce, 'wptb_nonce_table_preview' ) ) {
            $css_text = get_post_meta( absint( $this->table_data->ID ) , '_wptb_table_elements_styles_preview_', true );
        }

        echo '<style>' . $css_text . '</style>';
    }
    
    
    /**
	 * Adds functions to event handlers and filtering functions 
     * for displaying necessary content.
	 *
	 * @since 1.0.1
	 */
	public function hooks() {
        
        add_action( 'wp_head', array( $this, 'head_hook_css' ) );

		add_action( 'pre_get_posts', array( $this, 'pre_get_posts' ) );

		add_filter( 'the_title', array( $this, 'the_title' ), 100 );

		add_filter( 'the_content', array( $this, 'the_content' ), 999 );

		add_filter( 'get_the_excerpt', array( $this, 'the_content' ), 999 );

		//add_filter( 'template_include', array( $this, 'template_include' ) );

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
	public function the_title( $title ) {
        
        if( ( is_singular( 'post' ) || is_singular( 'page' ) ) && in_the_loop() ) {
            $title = sprintf(
                esc_html__( '%s Preview', 'wp-table-builder' ),
                ! empty( $this->table_data->post_title ) ? sanitize_text_field( $this->table_data->post_title ) : esc_html__( 'Table', 'wp-table-builder' )
            );
        }
        
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
        
        do_action( 'wptb_frontend_enqueue_style' );
        do_action( 'wptb_frontend_enqueue_script' );
        
        // Check nonce
        $nonce = sanitize_text_field( $_GET['_wpnonce'] );
        if( $nonce && wp_verify_nonce( $nonce, 'wptb_nonce_table' ) ) {
            $content .= get_post_meta( absint( $this->table_data->ID ) , '_wptb_content_', true );
        } else if( $nonce && wp_verify_nonce( $nonce, 'wptb_nonce_table_preview' ) ) {
            $content .= get_post_meta( absint( $this->table_data->ID ) , '_wptb_content_preview_', true );
        }
        
        $content = '<div class="wptb-table-container wptb-table-' . absint( $this->table_data->ID ) . '">'
                . '<div class="wptb-table-container-matrix">' . $content . '</div>'
                . '</div>';
        $content .= '<script>'
                . 'var wptbContainer = document.getElementsByClassName( "wptb-table-' . absint( $this->table_data->ID ) . '" );'
                . 'if( wptbContainer.length > 0 ) {'
                . '    wptbContainer = wptbContainer[0];'
                . '    var wptbPreviewTable = wptbContainer.getElementsByClassName( "wptb-preview-table" );'
                . '    wptbPreviewTable[0].classList.remove( "wptb-table-preview-static-indic" );'
                . '    wptbPreviewTable[0].style.display = "none";'
                . '}'
                . '</script>';

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

		return locate_template( array( 'single.php', 'singular.php', 'index.php' ) );
        
	}
    
}
