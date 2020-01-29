<?php

namespace WP_Table_Builder\Inc\Admin;
use WP_Table_Builder as NS;

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
		add_filter( 'manage_wptb-tables_posts_columns', [ $this,'addHeader' ] );
		add_filter( 'post_row_actions', [ $this,'customizeActions'], 10, 2 );
		add_action( 'manage_wptb-tables_posts_custom_column' , [ $this,'addContent' ], 10, 2 );
        
        add_action( 'wp_head', array( $this, 'head_hook_css' ));
	}
    
    public function head_hook_css() {
        global $post;
        
        $content = $post->post_content;
        
        $css_text = self::look_shortcode_wptb( $content, '_wptb_table_elements_styles_frontend', 0 );
        
        if( $css_text ) {
            echo '<style>' . $css_text . '</style>';
        }
    }
    
    public static function look_shortcode_wptb( $content, $post_meta_key, $iter, $paramsIdWere ) {
        if( $iter < 5 ) {
            $pattern = get_shortcode_regex( array( 'wptb' ) );
            if ( preg_match_all( '/'. $pattern .'/s', $content, $matches ) ) {
                // Custom post type arguments, which can be filtered if needed
                $paramsAll = $matches[3];

                $css_text = '';
                if( ! $paramsIdWere ) $paramsIdWere = array();
                
                for( $i = 0; $i < count( $matches[3] ); $i++ ) {
                    $paramsArr = explode( ' id=', $matches[3][$i] );
                    if( $matches[2][$i] == 'wptb' ) {
                        $id = ( int )$paramsArr[1];
                        if( in_array( $id, $paramsIdWere ) ) continue;
                        array_push( $paramsIdWere, $id );
                        $css = get_post_meta( $id , $post_meta_key, true );
                        if( $css ) {
                            $css_text .= $css;
                        }
                    }

                    $new_shortcode = str_replace( ']' , ' internal_shortcodes_stop="1"]' , $matches[0][$i] );
                    $new_content = do_shortcode( $new_shortcode );
                    $iter += 1;
                    $css_text .= self::look_shortcode_wptb( $new_content, $post_meta_key, $iter, $paramsIdWere );
                }

                return $css_text;
            } else {
                return '';
            }
        } else {
            return '';
        }
    }

	function customizeActions( $actions, $post ) { 

    	if ( $post->post_type =="wptb-tables" ) {
    		unset( $actions['inline hide-if-no-js'] );
        	$actions['edit'] = '<a href="' . esc_url( menu_page_url( 'wptb-builder', false ) ) . '&table='.$post->ID.'">'. esc_html_e( 'Edit','wp-table-builder' ).'</a>';
		}
		
		return $actions;
		
	}

	function addHeader( $columns ) { 
	    $columns['shortcode'] = __( 'Shortcode', 'wp-table-builder' ); 

	    return array(
	        'cb' => '<input type="checkbox" />',
	        'title' => __( 'Title', 'wp-table-builder' ), 
	        'shortcode' => __( 'Shortcode', 'wp-table-builder' ),
	        'date' => __( 'Date', 'wp-table-builder' ),
	    );
	}

	// Add the data to the custom columns for the book post type:
	function addContent( $column, $post_id ) {
	    switch ( $column ) {

			case 'title' :  
				$post = get_post( $post_id );
	        	$title = $post->post_title;
	        	echo "$title";
	        	break;
			case 'shortcode' : 
				echo '<input class="wptb_shortcode" value="[wptb id='.$post_id.']" readonly style="border:none;display:inline;">'
                    . '<button onclick="event.preventDefault();var s=this.parentNode.getElementsByClassName(\'wptb_shortcode\')[0];s.select();document.execCommand(\'copy\');var elem = document.createElement(\'div\');elem.classList.add(\'notice\',\'notice-success\',\'is-dismissible\');elem.innerHTML = \'<p>Selected!</p><button onclick=\\\'var n = this.parentNode,p= n.parentNode;p.removeChild(n);\\\' type=\\\'button\\\' class=\\\'notice-dismiss\\\'><span class=\\\'screen-reader-text\\\'>Descartar este aviso.</span></button>\'; document.getElementsByClassName(\'wrap\')[0].prepend(elem);" class="button wptb-edit-button">Copy</button>'; 
				break;
				
	    }
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
				'label'               => 'WPTB Tables',
				'public'              => true,
				'exclude_from_search' => true,
				'show_ui'             => false,
				'show_in_admin_bar'   => false,
				'rewrite'             => false,
				'query_var'           => true,
				'can_export'          => false,
				'supports'            => array( 'title' ),
			)
		);

		// Register the post type
        register_post_type( 'wptb-tables', $args );
		add_shortcode( 'wptb', array( $this, 'get_table' ) );
    }

    public function get_table( $args ) { 
        do_action( 'wptb_frontend_enqueue_style' );
        do_action( 'wptb_frontend_enqueue_script' );
    	//$uniqueSequence = 't'.substr( md5(time()),0,8 );
    	$html = get_post_meta( $args['id'] , '_wptb_content_', true );
        //$html = json_decode( $html );
        
        if( ! isset( $args['internal_shortcodes_stop'] ) && $html ) {
            if( ! isset( $args['internal_shortcodes_nesting_number'] ) || $args['internal_shortcodes_nesting_number'] <= 5 ) {
                $pattern = get_shortcode_regex();
                
                if ( preg_match_all( '/'. $pattern .'/s', $html, $matches ) ) {

                    for( $i = 0; $i < count( $matches[0] ); $i++ ) {
                        $shortcode = $matches[0][$i];
                        if( $matches[2][$i] == 'wptb' ) {
                            $internal_shortcodes_nesting_number = $args['internal_shortcodes_nesting_number'] ? 
                                    $args['internal_shortcodes_nesting_number'] + 1 : 1;
                            $shortcode = str_replace( ']' , ' internal_shortcodes_nesting_number="' . $internal_shortcodes_nesting_number . '"]' , $matches[0][$i] );

                            $html = str_replace( $matches[0][$i] , $shortcode , $html );
                        }
                    }
                }
                
                $html = do_shortcode( $html );
            }
        }
        
        $post_edit_link;
        if( current_user_can( 'manage_options' ) ){
            $post_edit_link = '<div class="wptb-frontend-table-edit-link">'
                    . '<a href="' . admin_url( 'admin.php?page=wptb-builder&table=' . $args['id'] ) . '">' . __( "Edit Table", 'wp-table-builder' ) . '</a></div>';
        }
        $html = '<div class="wptb-table-container wptb-table-' . $args['id'] . '"><div class="wptb-table-container-matrix">' . $html . '</div></div>'. $post_edit_link;
        $html .= '<script>'
                . 'var wptbContainer = document.getElementsByClassName( "wptb-table-' . $args['id'] . '" );'
                . 'if( wptbContainer.length > 0 ) {'
                . '    wptbContainer = wptbContainer[0];'
                . '    var wptbPreviewTable = wptbContainer.getElementsByClassName( "wptb-preview-table" );'
                . '    if( wptbPreviewTable.length > 0 ) {'
                . '         wptbPreviewTable[0].classList.remove( "wptb-table-preview-static-indic" );'
                . '         wptbPreviewTable[0].style.display = "none";'
                . '    }'
                . '}'
                . '</script>';
    	return ( $html ); 
    }

}