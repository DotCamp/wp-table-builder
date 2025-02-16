<?php

define('WPTB_PLUGIN_DIR', __DIR__);
define('WPTB_PLUGIN_FILE', __FILE__);
define('WPTB_PLUGIN_URL', plugins_url('', WPTB_PLUGIN_FILE_LEGACY));

require_once __DIR__ . '/vendor/autoload.php';

add_action('init', [
    \WPTableBuilder\WPTableBuilder::class,
    'init'
]);