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
        $html = '<div class="wptb-table-container wptb-table-' . $args['id'] . '"><div class="wptb-table-container-matrix">' . $html . '</div></div>';
        $html .= '<script>'
                . 'var wptbContainer = document.getElementsByClassName( "wptb-table-' . $args['id'] . '" );'
                . 'if( wptbContainer.length > 0 ) {'
                . '    wptbContainer = wptbContainer[0];'
                . '    var wptbPreviewTable = wptbContainer.getElementsByClassName( "wptb-preview-table" );'
                . '    wptbPreviewTable[0].classList.remove( "wptb-table-preview-static-indic" );'
                . '    wptbPreviewTable[0].style.display = "none";'
                . '}'
                . '</script>';
    	return ( $html ); 
    }

}