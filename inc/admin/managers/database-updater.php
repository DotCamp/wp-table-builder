<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder\Inc\Common\Traits\Init_Once;
use WP_Table_Builder\Inc\Common\Traits\Singleton_Trait;
use WP_Query;
use Gt\Dom\HTMLDocument;
use WP_Table_Builder\Inc\Admin\Managers\Table_Updates;

class Database_Updater
{
    use Singleton_Trait;
    use Init_Once;

    public static function init_process()
    {
        add_action("wp_ajax_update_all", array(__CLASS__, 'ajax_update_all_tables'));
        add_action("wp_ajax_get_tables_num", array(__CLASS__, 'ajax_num_tables'));
        add_action("wp_ajax_restore_tables", array(__CLASS__, 'ajax_restore_tables'));
    }

    public static function ajax_restore_tables()
    {
        static::restore_tables();
        wp_send_json_success();
    }

    public static function ajax_num_tables()
    {
        wp_send_json(wp_count_posts('wptb-tables')->draft);
    }

    public static function ajax_update_all_tables()
    {
        static::update_all_tables();
        wp_send_json_success();
    }

    public static function update_all_tables()
    {
        global $post;

        $args = array(
            'post_type' => 'wptb-tables',
            'posts_per_page' => -1
        );

        $query = new WP_Query($args);

        while ($query->have_posts()) {
            $query->the_post();
            $old_table = get_post_meta($post->ID, '_wptb_content_', true);
            static::create_backup($post->ID, $old_table);
            $newTable = static::update_table($old_table);
            update_post_meta($post->ID, '_wptb_content_', $newTable);
        }
        wp_reset_postdata();
    }

    public static function update_table($table)
    {
        $table = new HTMLDocument($table);

        Table_Updates\Image_Element::update($table);
        Table_Updates\Icon_Element::update($table);
        Table_Updates\Empty_Anchor::update($table);
        Table_Updates\Button_Element::update($table);

        return static::get_clean_table($table);
    }

    public static function create_backup($id, $old_table)
    {
        if (empty(get_post_meta($id, '_wptb_content_backup_', true)))
            update_post_meta($id, '_wptb_content_backup_', $old_table);
    }

    public static function restore_tables()
    {
        global $post;

        $args = array(
            'post_type' => 'wptb-tables',
            'posts_per_page' => -1
        );

        $query = new WP_Query($args);

        while ($query->have_posts()) {
            $query->the_post();
            $backup_table = get_post_meta($post->ID, '_wptb_content_backup_', true);

            if ($backup_table !== false) {
                update_post_meta($post->ID, '_wptb_content_', $backup_table);
                delete_post_meta($post->ID, '_wptb_content_backup_');
            }
        }
        wp_reset_postdata();
    }

    public static function get_clean_table($html_string)
    {
        return explode("</body>", explode("<body>", $html_string->__toString())[1])[0];
    }
}
