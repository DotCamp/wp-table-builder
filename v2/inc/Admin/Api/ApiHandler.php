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
        GetHandler::register(self::ROUTE_NAMESPACE);
        PostHandler::register(self::ROUTE_NAMESPACE);
    }





}