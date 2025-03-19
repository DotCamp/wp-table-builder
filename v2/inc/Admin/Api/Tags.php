<?php

namespace WPTableBuilder\Admin\Api;

use WPTableBuilder\Admin\Authorization;

class Tags
{

    const TAX_ID = 'table_tags';

    public static function register($apiBase)
    {
        register_rest_route($apiBase, '/tags', [
            'methods' => 'GET',
            'callback' => [self::class, 'get_tags'],
            'permission_callback' => [Authorization::class, 'can_edit'],
        ]);
    }

    public static function get_tags()
    {
        $terms = get_terms([
            'taxonomy' => static::TAX_ID,
            'hide_empty' => false,
        ]);

        $tags = [];
        foreach ($terms as $term) {
            $tags[$term->term_id] = $term->name;
        }

        return ApiHandler::response([
            'tags' => $tags,
        ]);
    }
}