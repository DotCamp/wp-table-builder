<?php

namespace WP_Table_Builder\Inc\Admin;

use DOMDocument;
use WP_Table_Builder\Inc\Core\Init;
use WP_Query;
use Gt\Dom\HTMLDocument;

// require plugin_dir_path( __FILE__) . "vendor/autoloader.php";

class Database_Updater
{
    public function __construct()
    {
        add_action("wp_ajax_start_update", array($this, 'get_updated_tables'));
    }

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

        $args = array(
            'post_type' => 'wptb-tables',
        );

        $query = new WP_Query($args);

        $result = [];

        while ($query->have_posts()) {
            $query->the_post();
            // $result[] = $this->update_table(get_post_meta($post->ID, '_wptb_content_', true));
            $result[] = get_post_meta($post->ID, '_wptb_content_', true);
        }
        wp_reset_postdata();

        for ($i = 0; $i < 1000; $i++) {
            $this->update_table($result[2]);
        }

        wp_send_json_success(['data' => $result]);
    }

    public function update_table($table)
    {
        $newTable = $this->update_image_element($table);
        $newTable = $this->update_icon_element($newTable);

        return $newTable;
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

        $newTable = $this->get_clean_table($newTable);

        return $newTable;
    }

    public function update_icon_element($table)
    {
        $newTable = new HTMLDocument($table);

        $icon_els = $newTable->querySelectorAll('.wptb-icon-container');

        foreach ($icon_els as $element) {
            $iconElementWrapper = $element->querySelector('.wptb-icon-wrapper');

            if (!(!is_null($element->querySelector('span')) || !is_null($element->querySelector('a'))) && !is_null($iconElementWrapper)) {
                $linkTargetElement = $newTable->createElement('span');
                $linkTargetElement->classList->add('wptb-icon-link-target-1');

                $currentHtmlcontent = $element->querySelector('.wptb-icon');
                $currentHtmlcontent->classList->add('wptb-icon-1');

                $iconElementWrapper->removeChild($currentHtmlcontent);
                $iconElementWrapper->appendChild($linkTargetElement);
                $linkTargetElement->appendChild($currentHtmlcontent);

                for ($i = 2; $i <= 5; $i++) {
                    $linkTargetElement = $newTable->createElement('span');
                    $linkTargetElement->classList->add("wptb-icon-link-target-$i");

                    $iconElementWrapper->appendChild($linkTargetElement);

                    $icon = Init::instance()->get_icon_manager()->get_icon('star');

                    $linkTargetElement->innerHTML = "<div class='wptb-icon-$i' style='display: none;'>$icon</div>";

                    // icon->classList->add("wptb-icon-$i");
                    // icon->style->setProperty("display", "none");
                }
            }
        }

        $newTable = $this->get_clean_table($newTable);

        return $newTable;
    }

    public function get_clean_table($html_string)
    {
        return explode("</body>", explode("<body>", $html_string->__toString())[1])[0];
    }
}
