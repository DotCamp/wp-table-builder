<?php

namespace WPTableBuilder\Admin\Api;
use WP_REST_Response;

class ApiHandler
{

    const ROUTE_NAMESPACE = 'wp-table-builder/v1';

    public static function init()
    {
        add_action('rest_api_init', [self::class, 'register_routes']);
    }

    public static function register_routes()
    {
        register_rest_route(self::ROUTE_NAMESPACE, '/table', [
            'methods' => 'GET',
            'callback' => [GetHandler::class, 'get_table'],
        ]);
        register_rest_route(self::ROUTE_NAMESPACE, '/tables', [
            'methods' => 'GET',
            'callback' => [GetHandler::class, 'get_tables'],
        ]);

        register_rest_route(self::ROUTE_NAMESPACE, '/trash', [
            'methods' => 'POST',
            'callback' => [PostHandler::class, 'trash_table'],
        ]);

        register_rest_route(self::ROUTE_NAMESPACE, '/delete', [
            'methods' => 'POST',
            'callback' => [PostHandler::class, 'delete_permanently'],
        ]);

        register_rest_route(self::ROUTE_NAMESPACE, '/restore', [
            'methods' => 'POST',
            'callback' => [PostHandler::class, 'restore_table'],
        ]);

        register_rest_route(self::ROUTE_NAMESPACE, '/duplicate', [
            'methods' => 'POST',
            'callback' => [PostHandler::class, 'duplicate_table'],
        ]);

        register_rest_route(self::ROUTE_NAMESPACE, '/trash_bulk', [
            'methods' => 'POST',
            'callback' => [PostHandler::class, 'trash_table_bulk'],
        ]);

        register_rest_route(self::ROUTE_NAMESPACE, '/restore_bulk', [
            'methods' => 'POST',
            'callback' => [PostHandler::class, 'restore_table_bulk'],
        ]);
    }





}