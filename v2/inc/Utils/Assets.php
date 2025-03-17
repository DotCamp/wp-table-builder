<?php

namespace WPTableBuilder\Utils;
use WPTableBuilder\WPTableBuilder;

class Assets
{

    private const CDN_HOST = WPTB_PLUGIN_URL . '/v2';


    public static function enqueue()
    {
        add_action('enqueue_block_editor_assets', function() {
            self::print(true);
        });
    }


    public static function print($gutenberg = false){
        wp_enqueue_media();

        self::enqueue_config();
        self::enqueue_i18n();

        $assets = new AssetLoader(self::CDN_HOST, WPTB_PLUGIN_DIR . '/dist/vite/manifest.json', WPTB_PLUGIN_DIR . '/tmp/.hotfile');

        $assets->register('src/wptb-common.ts');
        $assets->register_style('wptb-v2-editor-style', 'src/editor.scss');
        $assets->register_style('wptb-v2-frontend-style', 'src/styles.scss');

        do_action('wptb_enqueue_pro_assets');

        if ($gutenberg) {
            $assets->register_path('build/index.js');
            $assets->register_style_path('wptb-v2-gutenberg-style','build/editor.css');
        } else {
            $assets->register('src/index.tsx');
            AssetLoader::enqueue_styles();
        }

        echo AssetLoader::get_scripts();
    }

    public static function enqueue_config()
    {
        $data = [
            'API_BASE' => rest_url('wp-table-builder'),
            'PLUGIN_URL' => WPTB_PLUGIN_URL,
            'HOME_URL' => home_url(),
            'ADMIN_URL' => admin_url('admin-ajax.php'),
            'IS_PRO' => WPTableBuilder::is_pro(),
            'TEST' => __("Create Table", "wptb"),
            'SECURITY_CODE' => wp_create_nonce('wptb-import-security-nonce'),
            'EXPORT_KEY' => wp_create_nonce('wptb_table_export_main_export'),
            'SETTINGS' => [
                'is_authorized'=> current_user_can('manage_options'),
                'version' => WPTableBuilder::VERSION,
                'general' => get_option('wp_table_builder_settings'),
                'table_style' => get_option('wptb-general-styles'),
                'lazy_load' => get_option('wptb_lazy_load'),
                'lazy_load_pro' => get_option('wptb_lazy_load_pro'),
                'nonce' => [
                    'general' => wp_create_nonce('wp_table_builder_settings'),
                    'styles' => wp_create_nonce('wptb-general-styles'),
                    'version' => wp_create_nonce('version_control_manager'),
                    'lazy_load' => wp_create_nonce('wptb_lazy_load'),
                ],
            ],
            'NONCE' => [
                'wp_rest' => wp_create_nonce('wp_rest'),
                'table' => wp_create_nonce('wptb_nonce_table'),
                'preview' => wp_create_nonce('wptb_nonce_table_preview'),
                'create_term' => wp_create_nonce('wptb_create_term'),
            ]

        ];

        echo '<script type="text/javascript">var WPTB_CFG = ' . json_encode($data) . ';</script>';
    }

    public static function enqueue_i18n()
    {
        load_plugin_textdomain('wp-table-builder', false, 'wp-table-builder/v2/languages');
        wp_register_script(
            'wptb-i18n',
            self::CDN_HOST . '/dist/wptb-i18n.js',
            ['wp-i18n']
        );

        wp_set_script_translations('wptb-i18n', 'wp-table-builder', WPTB_PLUGIN_DIR . '/languages');
        add_action('admin_enqueue_scripts', function () {
            wp_enqueue_script('wptb-i18n');
        });
    }

}