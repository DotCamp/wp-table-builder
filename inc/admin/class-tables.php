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
    	$html = get_post_meta( $args['id'] , '_wptb_content_', true );
        
        // prepating html encoding for looking for shortcodes using DOMDocument
        $html_encoding = mb_detect_encoding( $html );
        if( $html_encoding != 'UTF-8' ) {
            $html = mb_convert_encoding( $html, "UTF-8", $html_encoding );
        }
        
        $html = mb_convert_encoding( $html, 'HTML-ENTITIES', 'utf-8' );
        
        $dom = new \DOMDocument( '1.0', 'UTF-8' );
        $dom->validateOnParse = true;
        $dom->encoding="UTF-8";
        $dom->loadHTML( $html );
        $divs = $dom->getElementsByTagName( 'div' );
        $shortcodes = array();
        foreach ( $divs as $div ) {
            $classes = $div->getAttribute( 'class' );
            if ( strpos( $classes, 'wptb-shortcode-container' ) !== false ) {
                $div_outer_html = trim( $div->ownerDocument->saveHTML( $div ) );
                
                if( ! isset( $args['internal_shortcodes_stop'] ) && $div_outer_html ) {
                    $pattern = get_shortcode_regex();

                    if ( preg_match_all( '/'. $pattern .'/s', $div_outer_html, $matches ) ) {

                        for( $i = 0; $i < count( $matches[0] ); $i++ ) {
                            $shortcode = $matches[0][$i];
                            if( $matches[2][$i] == 'wptb' ) {

                                $shortcode = str_replace( ']' , ' internal_shortcodes_stop="1"]' , $matches[0][$i] );

                                $div_outer_html_new = str_replace( $matches[0][$i] , $shortcode , $div_outer_html );

                                $html = str_replace( $div_outer_html, $div_outer_html_new, $html );

                                $html = str_replace( $div_outer_html_new, do_shortcode( $div_outer_html_new ), $html );
                            } else {
                                $html = str_replace( $div_outer_html, do_shortcode( $div_outer_html ), $html );
                            }
                        }
                    }
                }
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