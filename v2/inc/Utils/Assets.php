<?php

namespace WPTableBuilder\Utils;
use WPTableBuilder\WPTableBuilder;

class Assets
{

    private const CDN_HOST = WPTB_PLUGIN_URL . '/v2';

    private $cdn_host = '';
    private $dev_url = '';

    private $manifest = false;
    private static $preloads = '';
    private static $modules = '';
    private static $data;

    public static function enqueue()
    {
        wp_enqueue_media();
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

        add_action('admin_footer', function () {

            $assets = new Assets(self::CDN_HOST, WPTB_PLUGIN_DIR . '/dist/.vite/manifest.json', WPTB_PLUGIN_DIR . '/tmp/.hotfile');

            self::$data = [
                'API_BASE' => rest_url('wp-table-builder'),
                'PLUGIN_URL' => WPTB_PLUGIN_URL,
                'ADMIN_URL' => admin_url('admin-ajax.php'),
                'IS_PRO' => WPTableBuilder::is_pro(),
                'TEST' => __("Create Table", "wptb"),
                'SECURITY_CODE' => wp_create_nonce('wptb-import-security-nonce'),
                'EXPORT_KEY' => wp_create_nonce('wptb_table_export_main_export'),
                'SETTINGS' => [
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
                ]
            ];

            $assets->register('src/wptb-common.ts');

            do_action('wptb_enqueue_pro_assets');

            $assets->register('src/index.tsx');

            echo '<script type="text/javascript">var WPTB_CFG = ' . json_encode(self::$data) . ';</script>';
            echo self::$preloads;
            echo self::$modules;

            $current_screen = get_current_screen();
            if (
                method_exists($current_screen, 'is_block_editor')
                && $current_screen->is_block_editor()
            ) {
                echo '<script type="module" src="' . self::CDN_HOST . '/build/index.js"></script>';
                echo '<link rel="stylesheet" type="text/css" href="' . self::CDN_HOST . '/build/editor.css"/>';
            }

        });

    }

    public function __construct($cdn_host, $manifest, $hotfile)
    {
        $this->cdn_host = $cdn_host;
        if (file_exists($hotfile)) {
            $this->dev_url = file_get_contents($hotfile);
            self::$modules .= '<script type="module">
                import RefreshRuntime from "' . $this->dev_url . '/@react-refresh"
                RefreshRuntime.injectIntoGlobalHook(window)
                window.$RefreshReg$ = () => {}
                window.$RefreshSig$ = () => (type) => type
                window.__vite_plugin_react_preamble_installed__ = true
                </script>';
            self::$modules .= '<script type="module" src="' . $this->dev_url . '/@vite/client"></script>';
        } else {
            if ($manifest) {
                $this->manifest = json_decode(file_get_contents($manifest), true);
            }
        }
    }

    public function register($file, $pre = false)
    {
        if (!$this->manifest) {
            self::$modules .= '<script type="module" src="' . $this->dev_url . '/' . $file . '"></script>';
            return;
        }
        if (!isset($this->manifest[$file])) {
            return;
        }
        $entry = $this->manifest[$file];
        if (isset($entry['has_loaded'])) {
            return;
        }
        if (isset($entry['css'])) {
            foreach ($entry['css'] as $css) {
                $this->enqueue_style($css);
            }
        }
        $entry['has_loaded'] = true;
        if (isset($entry['imports'])) {
            foreach ($entry['imports'] as $import) {
                $this->register($import, true);
            }
        }

        $url = $this->cdn_host . '/dist/' . $entry['file'];

        if ($pre) {
            self::$preloads .= '<link rel="modulepreload" href="' . $url . '"/>';
        } else {
            self::$modules .= '<script type="module" src="' . $url . '"></script>';
        }
    }

    public function enqueue_style($file)
    {
        wp_enqueue_style('wptb_' . $file, $this->cdn_host . '/dist/' . $file, [], WPTableBuilder::VERSION);
    }

}