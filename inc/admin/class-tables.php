<?php

namespace WP_Table_Builder\Inc\Admin;

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

	function customizeActions( $actions,$post ) { 

    	if ( $post->post_type =="wptb-tables" ) {
    		unset( $actions['inline hide-if-no-js'] );
        	$actions['edit'] = '<a href="' . menu_page_url( 'wptb-builder',false) . '&table='.$post->ID.'">'.__('Edit','wptb').'</a>';
		}
		
		return $actions;
		
	}

	function addHeader($columns) { 
	    $columns['shortcode'] = __( 'Shortcode', 'wptb' ); 

	    return array(
	        'cb' => '<input type="checkbox" />',
	        'title' => __('Title'), 
	        'shortcode' => __('Shortcode'),
	        'date' => __('Date'),
	    );
	}

	// Add the data to the custom columns for the book post type:
	function addContent( $column, $post_id ) {
	    switch ( $column ) {

			case 'title' :  
				$post = get_post($post_id);
	        	$title = $post->post_title;
	        	echo "$title";
	        	break;
			case 'shortcode' : 
				echo '<input class="wptb_shortcode" value="[wptb id='.$post_id.']" readonly style="border:none;display:inline;"><button onclick="event.preventDefault();var s=this.parentNode.getElementsByClassName(\'wptb_shortcode\')[0];s.select();document.execCommand(\'copy\');var elem = document.createElement(\'div\');elem.classList.add(\'notice\',\'notice-success\',\'is-dismissible\');elem.innerHTML = \'<p>Selected!</p><button onclick=\\\'var n = this.parentNode,p= n.parentNode;p.removeChild(n);\\\' type=\\\'button\\\' class=\\\'notice-dismiss\\\'><span class=\\\'screen-reader-text\\\'>Descartar este aviso.</span></button>\'; document.getElementsByClassName(\'wrap\')[0].prepend(elem);" class="button wptb-edit-button">Copy</button>'; 
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
				'public'              => false,
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
		add_shortcode('wptb',array($this, 'get_table'));
        
    }

    public function get_table($args){  

    	$uniqueSequence = 't'.substr(md5(time()),0,8);
    	$html = get_post_meta($args['id'] , '_wptb_content_');
    	$code =  $html[0];
    	$code = preg_replace( '/\[tr\]/','<tr>', $code);
    	$code = preg_replace( '/\[\/tr\]/','</tr>', $code);

    	$code = preg_replace( '/\[td(\s+colspan\=\"(\d+)?\")(\s+rowspan\=\"(\d+)?\")\]/','<td colspan="$2" rowspan="$4">', $code);
    	$code = preg_replace( '/\[td(\s+rowspan\=\"(\d+)?\")\]/','<td rowspan="$2">', $code);
    	$code = preg_replace( '/\[td(\s+colspan\=\"(\d+)?\")\]/','<td colspan="$2">', $code);
    	$code = preg_replace( '/\[td\]/','<td>', $code);
    	$code = preg_replace( '/\[\/td\]/','</td>', $code);

    	$code = preg_replace( '/\[table\s+border\-color\=\"(rgb\((\d+\,\d+\,\d+)\))?\"\s+padding\=\"((\d+)px)?\"\s+inner\-border\=\"((\d+)px)?\"\s+outer\-border\=\"((\d+)px)?\"\s+data\-bg1\=\"(rgb\((\d+\,\d+\,\d+)\)|transparent)?\"\s+data\-bg2\=\"(rgb\((\d+\,\d+\,\d+)\)|transparent)?\"\s+data\-bg3\=\"(rgb\((\d+\,\d+\,\d+)\)|transparent)?\"\]/','<style type="text/css">#'.$uniqueSequence.'{border:$7px solid black;} #'.$uniqueSequence.' tr:nth-child(even) td{background-color:$11} #'.$uniqueSequence.' tr:nth-child(odd) td{background-color:$13} #'.$uniqueSequence.' tr:nth-child(1) td{background-color:$9} #'.$uniqueSequence.' td{border:$5px solid $1; padding:$3px;}</style><table id="'.$uniqueSequence.'">', $code);  
    	$code = preg_replace( '/\[\/table\]/','</table>', $code);

    	$code = preg_replace( '/\[text(\s+size\=\"(\d+px)?\")?(\s+color\=\"(rgb\((\d+\,\s?\d+\,\s?\d+)\))?\")?\]/','<span class="wptb-element-text-" style="font-size:$2;color:$4;">', $code);
    	$code = preg_replace( '/\[\/text\]/','</span>', $code);

    	$code = preg_replace( '/\[img\s+src\=\"([^\"]+)\"\s+width\=\"([0-9]+\%)\"\s+alt\=\"([a-zA-Z\s0-9]*)\"\s+alignment\=\"([a-z]*)\"\s+link\=\"([^\"]*)\"\s+newtab\=\"([\_a-z]+)\"\]/','<a href="$7" target="$10"><img class="$6-aligned" src="$1" target="$7" style="width:$4;" alt="$5"/></a>', $code);

    	$code = preg_replace( '/\[button\s+textcolor\=\"(rgb\(\d+\,\s?\d+\,\s?\d+\))?\"\s+color\=\"(rgb\(\d+\,\s?\d+\,\s?\d+\))?\"\s+size\=\"([A-Z]+)\"\s+alignment\=\"([\-a-z]*)\"\s+link\=\"([^\"]*)\"\s+newtab\=\"(\_[a-z]+)\"\]/','<a class="wptb-button $4-aligned wptb-size-$3" style="background-color:$2;color:$1;">', $code);
    	//
    	$code = preg_replace( '/\[\/button\]/','</a>', $code);
    	// href="$5" target="$8" 
    	$code = preg_replace( '/\[list\s+align\=\"([a-z\-]+)?\"\s+class\=\"([a-z]+)?\"\s+style\-type\=\"([a-z]+)?\"\]/','<ul class="$1-aligned-list $3-list">', $code);
    	$code = preg_replace( '/\[item\]/','<li>', $code);
    	$code = preg_replace( '/\[\/item\]/','</li>', $code);
    	$code = preg_replace( '/\[\/list\]/','</ul>', $code);
    	//die(var_dump($code));
    	return ($code); 
    }

}