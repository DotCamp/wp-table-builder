<?php

namespace WP_Table_Builder\Inc\Admin;

use WP_Table_Builder as NS;
use WP_Query;

class Database_Updater {
	public static function get_tables($table_status = 'draft' ) {

		global $post;

		$params = array( 'post_type' => 'wptb-tables');

		$params = apply_filters( 'wp-table-builder/get_tables_args', $params );

		$loop   = new WP_Query( $params );
		$result = [];
		while ( $loop->have_posts() ) {
			$loop->the_post();
			$result[] = $post;
		}

		if ( ! empty( $result ) ) {
			wp_reset_postdata();
		}

		return $result;
	}
}