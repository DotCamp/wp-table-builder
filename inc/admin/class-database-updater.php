<?php

namespace WP_Table_Builder\Inc\Admin;

use DOMDocument;
use WP_Query;
use Gt\Dom\HTMLDocument;

// require plugin_dir_path( __FILE__) . "vendor/autoloader.php";

class Database_Updater
{
    public function get_old_tables()
    {

        global $post;

        $params = array('post_type' => 'wptb-tables');

        $params = apply_filters('wp-table-builder/get_tables_args', $params);

        $loop   = new WP_Query($params);
        $result = [];
        while ($loop->have_posts()) {
            $loop->the_post();
            $table = get_post_meta($post->ID, '_wptb_content_', true);
            $result[] = $table;
        }

        if (!empty($result)) {
            wp_reset_postdata();
        }

        return $result;
    }

    public function get_updated_tables()
    {
        global $post;

        $params = array('post_type' => 'wptb-tables');

        $params = apply_filters('wp-table-builder/get_tables_args', $params);

        $loop   = new WP_Query($params);
        $result = [];
        while ($loop->have_posts()) {
            $loop->the_post();
            $table = $this->update_table(get_post_meta($post->ID, '_wptb_content_', true));
            $result[] = $table;
        }

        if (!empty($result)) {
            wp_reset_postdata();
        }

        return $result;
    }

    public function update_table($table)
    {
        $table = $this->update_image_element($table);
        return $table;
    }

    public function update_image_element($table)
    {
        $newTable = new HTMLDocument($table);

        $image_els = $newTable->querySelectorAll('.wptb-image-container');

        foreach ($image_els as $image_el) {
            $anchor = $image_el->querySelector("a");

            if (!is_null($anchor) && !$anchor->className) {
                $anchor->classList->add("wptb-link-target");
            }
        }

        $newTable = $this->toString($newTable);

        return $newTable;
    }

    public function toString($html_string)
    {
        return explode("</body>", explode("<body>", $html_string->__toString())[1])[0];
    }
}
