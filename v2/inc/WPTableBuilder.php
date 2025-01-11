<?php

namespace WPTableBuilder;

use WPTableBuilder\Admin\Api\ApiHandler;
use WPTableBuilder\Blocks\Gutenberg;
use WPTableBuilder\Utils\Assets;
use WPTableBuilderPro\WPTableBuilderPro;

class WPTableBuilder
{

    const VERSION = '1.0.0';

    public static function init()
    {
        Assets::enqueue();
        ApiHandler::init();
        Gutenberg::init();
        new self();

    }

    public static function is_pro()
    {
        return class_exists(WPTableBuilderPro::class) && WPTableBuilderPro::is_active();
    }

    public function __construct()
    {
        add_action('admin_menu', [$this, 'add_menu']);
    }

    public function add_menu()
    {
        add_menu_page(
            'WP Table Builder',
            'WPTB',
            'manage_options',
            'wptb-alt',
            [$this, 'wptb_page'],
            'dashicons-editor-table',
            50
        );

        add_submenu_page(
            'wptb-alt',
            __('WP Table Builder', 'wp-table-builder'),
            __('All Tables', 'wp-table-builder'),
            'manage_options',
            'wptb-alt-tables',
            [$this, 'wptb_page']
        );

        add_submenu_page(
            'wptb-alt',
            __('WP Table Builder', 'wp-table-builder'),
            __('Add New', 'wp-table-builder'),
            'manage_options',
            'wptb-alt-create',
            [$this, 'wptb_page']
        );

        add_submenu_page(
            'wptb-alt',
            __('WP Table Builder', 'wp-table-builder'),
            __('Builder', 'wp-table-builder'),
            'manage_options',
            'wptb-alt-builder',
            [$this, 'wptb_page']
        );

        add_submenu_page(
            'wptb-alt',
            __('WP Table Builder', 'wp-table-builder'),
            __('Import', 'wp-table-builder'),
            'manage_options',
            'wptb-alt-import',
            [$this, 'wptb_page']
        );


        add_submenu_page(
            'wptb-alt',
            __('WP Table Builder', 'wp-table-builder'),
            __('Export', 'wp-table-builder'),
            'manage_options',
            'wptb-alt-export',
            [$this, 'wptb_page']
        );
    }


    public function wptb_page()
    {
        echo '<div id="wptb-app-root" class="wptb-app-root"></div>';
    }
}