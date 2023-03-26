<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Common\Traits\Singleton_Trait;
use WP_Query;
use Gt\Dom\HTMLDocument;
use WP_Table_Builder\Inc\Admin\Managers\Table_Updates;
use WP_Table_Builder\Inc\Common\Traits\Ajax_Response;

class Database_Updater
{
    use Singleton_Trait;
    use Ajax_Response;

    const TABLE_META_KEY = '_wptb_content_';
    const BACKUP_META_KEY = '_wptb_content_backup_';
    const SOLID_BACKUP_META_KEY = '_wptb_content_solid_backup_';

    const DATABASE_UPDATER_OPTION_NAME = 'wptb-database-updater';

    public static function init()
    {
        add_action("wp_ajax_update_all", array(__CLASS__, 'ajax_update_all_tables'));
        add_action("wp_ajax_get_tables_num", array(__CLASS__, 'ajax_num_tables'));
        add_action("wp_ajax_restore_tables", array(__CLASS__, 'ajax_restore_tables'));
        add_action("wp_ajax_restore_solid_tables", array(__CLASS__, 'ajax_restore_solid_tables'));
        add_action('wp_ajax_' . static::DATABASE_UPDATER_OPTION_NAME, [__CLASS__, 'handle_request']);
        add_filter('wp-table-builder/filter/settings_manager_frontend_data', [__CLASS__, 'settings_menu_data']);
    }

    public static function settings_menu_data($settings_data)
    {
        $extra_style_strings = [
            'updaterDesc'  => esc_html__('Update the tables in you database to the latest version.', 'wp-table-builder'),
            'updateButton' => esc_html__('Update all tables', 'wp-table-builder'),
            'revertButton' => esc_html__('Roll back update', 'wp-table-builder'),
            'resetUpdates' => esc_html__('Reset Updates (Restore solid tables)', 'wp-table-builder'),
        ];

        // add translation strings to script
        $settings_data['strings'] = array_merge($settings_data['strings'], $extra_style_strings);

        // security related data for general styles
        $security = [
            'ajaxUrl' => get_admin_url(null, 'admin-ajax.php'),
            'nonce'   => wp_create_nonce(static::DATABASE_UPDATER_OPTION_NAME),
            'action'  => static::DATABASE_UPDATER_OPTION_NAME,
        ];

        $settings_data['sectionsData']['databaseUpdater'] = [
            'label'    => esc_html__('database updater', 'wp-table-builder'),
        ];

        // add general styles related data to admin settings menu frontend
        $settings_data['data']['databaseUpdater'] = ['security' => $security];

        return $settings_data;
    }

    public static function handle_request()
    {
        $instance = static::get_instance();
        if (!(current_user_can('manage_options') && check_admin_referer(static::DATABASE_UPDATER_OPTION_NAME, 'nonce') && isset($_POST['req']))) {
            $instance->set_error(esc_html__('You are not authorized to use this ajax endpoint.'));
        }

        if ($_POST['req'] === 'update') {
            static::update_all_tables();
            $instance->set_message(esc_html__('All tables updated', 'wp-table-builder'));
        }
        if ($_POST['req'] === 'revert') {
            static::restore_tables_from_backup();
            $instance->set_message(esc_html__('All tables restored', 'wp-table-builder'));
        }
        if ($_POST['req'] === 'solid') {
            static::restore_tables_from_backup(true);
            $instance->set_message(esc_html__('All original tables restored', 'wp-table-builder'));
        }
        if ($_POST['req'] === 'status') {
            $instance->append_response_data(get_option('wptb_db_migrated'), 'all_updated');
        }

        $instance->send_json();
    }

    public static function load_tables($meta_key = self::TABLE_META_KEY)
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

        update_option('wptb_db_migrated', true);
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
        $el = $table->querySelector('table');
        if (is_null($el)) return;

        $el->setAttribute('wptb-table-version', NS\PLUGIN_VERSION);
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

        update_option('wptb_solid_backups', true);
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

        update_option('wptb_db_migrated', false);
    }

    public static function get_clean_table($dom)
    {
        return explode("</body>", explode("<body>", $dom->__toString())[1])[0];
        // return $dom->querySelector('body')->innerHTML;
    }
}
