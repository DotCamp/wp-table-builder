<?php

namespace WPTableBuilder;

use WPTableBuilder\Admin\Api\ApiHandler;
use WPTableBuilder\Blocks\Gutenberg;
use WPTableBuilder\Utils\Assets;
use WPTableBuilderPro\WPTableBuilderPro;

class WPTableBuilder
{

    const VERSION = '2.0.4';

    public static function init()
    {
        Assets::enqueue();
        ApiHandler::init();
        Gutenberg::init();

    }

    public static function is_pro()
    {
        return class_exists(WPTableBuilderPro::class) && WPTableBuilderPro::is_active();
    }


    public static function add_menu($menu_cap)
    {
        add_menu_page(
            'WP Table Builder',
            'WP Table Builder',
            $menu_cap,
            'wptb',
            [self::class, 'wptb_page'],
            'dashicons-editor-table',
            50
        );

        add_submenu_page(
            'wptb',
            __('WP Table Builder', 'wp-table-builder'),
            __('All Tables', 'wp-table-builder'),
            $menu_cap,
            'wptb',
            [self::class, 'wptb_page']
        );

        add_submenu_page(
            'wptb',
            __('WP Table Builder', 'wp-table-builder'),
            __('Add New', 'wp-table-builder'),
            $menu_cap,
            'wptb-create',
            [self::class, 'wptb_page']
        );

        add_submenu_page(
            '',
            __('WP Table Builder', 'wp-table-builder'),
            __('Builder', 'wp-table-builder'),
            $menu_cap,
            'wptb-builder',
            [self::class, 'wptb_page']
        );

        add_submenu_page(
            'wptb',
            __('WP Table Builder', 'wp-table-builder'),
            __('Import', 'wp-table-builder'),
            $menu_cap,
            'wptb-import',
            [self::class, 'wptb_page']
        );


        add_submenu_page(
            'wptb',
            __('WP Table Builder', 'wp-table-builder'),
            __('Export', 'wp-table-builder'),
            $menu_cap,
            'wptb-export',
            [self::class, 'wptb_page']
        );


        add_submenu_page(
            'wptb',
            __('WP Table Builder', 'wp-table-builder'),
            __('Settings', 'wp-table-builder'),
            'manage_options',
            'wptb-settings',
            [self::class, 'wptb_page']
        );
    }


    public static function wptb_page()
    {
        echo '<div id="wptb-app-root" class="wptb-app-root"></div>';
        Assets::print();
    }
}