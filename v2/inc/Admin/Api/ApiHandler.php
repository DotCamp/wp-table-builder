<?php

namespace WPTableBuilder\Admin\Api;

class ApiHandler
{

    const ROUTE_NAMESPACE = 'wp-table-builder/v1';

    public static function init()
    {
        add_action('rest_api_init', [self::class, 'register_routes']);
    }

    public static function register_routes()
    {
        TableGet::register(self::ROUTE_NAMESPACE);
        TablePost::register(self::ROUTE_NAMESPACE);
        Tags::register(self::ROUTE_NAMESPACE);
    }


    public static function response($data, $status = 200) {
        return new \WP_REST_Response($data, $status, [
            'Content-Type' => 'application/json',
            'Cache-Control' => 'no-cache',
        ]);
    }

}