<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Common\Traits\Init_Once;
use WP_Table_Builder\Inc\Common\Traits\Singleton_Trait;
use WP_Query;
use Gt\Dom\HTMLDocument;
use WP_Table_Builder\Inc\Admin\Managers\Table_Updates;

class Database_Updater
{
    use Singleton_Trait;
    use Init_Once;

    const TABLE_META_KEY = '_wptb_content_';
    const BACKUP_META_KEY = '_wptb_content_backup_';
    const SOLID_BACKUP_META_KEY = '_wptb_content_solid_backup_';

    public static function init_process()
    {
        add_action("wp_ajax_update_all", array(__CLASS__, 'ajax_update_all_tables'));
        add_action("wp_ajax_get_tables_num", array(__CLASS__, 'ajax_num_tables'));
        add_action("wp_ajax_restore_tables", array(__CLASS__, 'ajax_restore_tables'));
        add_action("wp_ajax_restore_solid_tables", array(__CLASS__, 'ajax_restore_solid_tables'));
    }

    public static function ajax_restore_solid_tables()
    {
        static::restore_tables_from_backup(true);
        wp_send_json_success();
    }

    public static function ajax_restore_tables()
    {
        static::restore_tables_from_backup();
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

    public static function load_tables($meta_key = static::TABLE_META_KEY)
    {
        global $post;

        $args = array(
            'post_type' => 'wptb-tables',
            'posts_per_page' => -1
        );

        $query = new WP_Query($args);

        $tables = [];

        while ($query->have_posts()) {
            $query->the_post();
            $tables[$post->ID] = get_post_meta($post->ID, $meta_key, true);
        }
        wp_reset_postdata();

        return $tables;
    }

    public static function update_all_tables()
    {
        $tables = static::load_tables();

        if (get_option('wptb_solid_backups') == false) static::create_solid_table_backups();

        foreach ($tables as $id => $old_table) {
            $version = static::get_table_version($old_table);

            if ($version !== NS\PLUGIN_VERSION) {
                static::create_table_backup($id, $old_table);
                $newTable = static::update_table($old_table);
                update_post_meta($id, '_wptb_content_', $newTable);
            }
        }
    }

    public static function get_table_version($table)
    {
        if (preg_match('/data-wptb-version="([\d.]*)"/', $table, $matches))
            return $matches[1];
    }

    public static function update_table($table)
    {
        $table = new HTMLDocument($table);

        Table_Updates\Image_Element::update($table);
        Table_Updates\Icon_Element::update($table);
        Table_Updates\Empty_Anchor::update($table);
        Table_Updates\Button_Element::update($table);

        static::update_table_version($table);

        return static::get_clean_table($table);
    }

    public static function update_table_version(&$table)
    {
        $table->querySelector('table')->setAttribute('wptb-table-version', NS\PLUGIN_VERSION);
        return $table;
    }

    public static function create_table_backup($id, $old_table)
    {
        if (empty(get_post_meta($id, static::BACKUP_META_KEY, true)))
            update_post_meta($id, static::BACKUP_META_KEY, $old_table);
    }

    public static function create_solid_table_backups()
    {
        $tables = static::load_tables();

        foreach ($tables as $id => $table) {
            update_post_meta($id, static::SOLID_BACKUP_META_KEY, $table);
        }

        add_option('wptb_solid_backups', true);
    }

    public static function restore_tables_from_backup($solid = false)
    {
        $key = ($solid) ? static::SOLID_BACKUP_META_KEY : static::BACKUP_META_KEY;

        $tables = static::load_tables($key);

        foreach ($tables as $id => $backup_table) {
            if ($backup_table == false || $backup_table == "") continue;

            update_post_meta($id, '_wptb_content_', $backup_table);

            if (!$solid)
                delete_post_meta($id, static::BACKUP_META_KEY);
        }
        wp_reset_postdata();
    }

    public static function get_clean_table($dom)
    {
        return explode("</body>", explode("<body>", $dom->__toString())[1])[0];
        // return $dom->querySelector('body')->innerHTML;
    }
}
