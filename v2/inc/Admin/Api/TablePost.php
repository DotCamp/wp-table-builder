<?php

namespace WPTableBuilder\Admin\Api;
use WPTableBuilder\Admin\Authorization;

class TablePost
{
    public static function register($apiBase)
    {
        register_rest_route($apiBase, '/trash', [
            'methods' => 'POST',
            'callback' => [self::class, 'trash_table'],
            'permission_callback' => [Authorization::class, 'can_edit'],
        ]);

        register_rest_route($apiBase, '/delete', [
            'methods' => 'POST',
            'callback' => [self::class, 'delete_permanently'],
            'permission_callback' => [Authorization::class, 'can_edit'],
        ]);

        register_rest_route($apiBase, '/restore', [
            'methods' => 'POST',
            'callback' => [self::class, 'restore_table'],
            'permission_callback' => [Authorization::class, 'can_edit'],
        ]);

        register_rest_route($apiBase, '/duplicate', [
            'methods' => 'POST',
            'callback' => [self::class, 'duplicate_table'],
            'permission_callback' => [Authorization::class, 'can_edit'],
        ]);

        register_rest_route($apiBase, '/trash_bulk', [
            'methods' => 'POST',
            'callback' => [self::class, 'trash_table_bulk'],
            'permission_callback' => [Authorization::class, 'can_edit'],
        ]);

        register_rest_route($apiBase, '/restore_bulk', [
            'methods' => 'POST',
            'callback' => [self::class, 'restore_table_bulk'],
            'permission_callback' => [Authorization::class, 'can_edit'],
        ]);
    }

    private static function duplicate_table_internal($id)
    {
        global $wpdb;
        $post = get_post($id);
        if (!$post) {
            return 404;
        }

        $id_new = wp_insert_post([
            'post_title' => sanitize_text_field($post->post_title),
            'post_content' => '',
            'post_type' => 'wptb-tables',
            'post_status' => 'draft'
        ]);
        $table = get_post_meta($id, '_wptb_content_', true);

        $table_new = add_post_meta($id_new, '_wptb_content_', $table);

        if ($id_new && $table_new) {
            wp_update_post([
                'ID' => $id_new,
                'post_title' => str_replace(' (ID #' . $id . ')', '', get_the_title($id_new) . ' (ID #' . $id_new . ')'),
                'post_content' => '',
                'post_type' => 'wptb-tables',
                'post_status' => 'draft'
            ]);

            return
                [
                    'id' => $id_new,
                    'title' => get_the_title($id_new),
                    'date' => get_the_date('h:i A, d M, Y'),
                    'modified' => get_the_modified_date('h:i A, d M, Y'),
                ]
            ;
        }

        return 500;
    }
    public static function duplicate_table($request)
    {
        $data = $request->get_json_params();
        if (!isset($data['id'])) {
            return ApiHandler::response(['message' => 'Table ID is required.'], 400);
        }

        $id = absint($data['id']);

        $duplicated = self::duplicate_table_internal($id);
        if ($duplicated) {
            return [
                'message' => 'Table duplicated successfully.',
                'posts' => [
                    $duplicated
                ]
            ];
        }

        return ApiHandler::response(['message' => 'Failed to duplicate table.'], 500);
    }

    public static function trash_table($req)
    {
        $id = absint($req->get_json_params()['id'] ?? 0);
        if (get_post_type($id) === 'wptb-tables') {
            wp_trash_post($id);
            return [
                'message' => 'Table trashed successfully.',
            ];
        }
        return ApiHandler::response(['message' => 'Table not found.'], 404);
    }
    public static function restore_table($req)
    {
        $id = absint($req->get_json_params()['id'] ?? 0);
        if (get_post_type($id) === 'wptb-tables') {
            wp_untrash_post($id);
            return [
                'message' => 'Table restored successfully.',
            ];
        }
        return ApiHandler::response(['message' => 'Table not found.'], 404);
    }

    public static function delete_permanently($req)
    {
        $id = absint($req->get_json_params()['id'] ?? 0);
        if (get_post_type($id) === 'wptb-tables') {
            wp_delete_post($id);
            return [
                'message' => 'Table deleted permanently.',
            ];
        }
        return ApiHandler::response(['message' => 'Table not found.'], 404);
    }

    public static function duplicate_table_bulk($request)
    {
        global $wpdb;
        $json = $request->get_json_params();
        $post_ids = $json['ids'] ?? [];
        $wpdb->query('START TRANSACTION');
        $posts = [];
        foreach ($post_ids as $post_id) {
            $dup = self::duplicate_table_internal($post_id);
            if (!is_array($dup)) {
                $wpdb->query('ROLLBACK');
                return ApiHandler::response(['message' => 'Failed to duplicate table.'], $dup);
            }
            $posts[] = $dup;
        }
        $wpdb->query('COMMIT');
        return ApiHandler::response([
            'message' => 'Table(s) duplicated successfully.',
            'posts' => $posts
        ]);
    }

    public static function trash_table_bulk($req)
    {
        global $wpdb;
        $json = $req->get_json_params();
        $post_ids = $json['ids'] ?? [];
        $wpdb->query('START TRANSACTION');
        foreach ($post_ids as $id) {
            if (!get_post_type($id) === 'wptb-tables') {
                $wpdb->query('ROLLBACK');
                return ApiHandler::response(['message' => 'Failed to trash table(s).']);
            }
            wp_trash_post($id);
        }
        $wpdb->query('COMMIT');
        return ApiHandler::response([
            'message' => 'Table(s) trashed successfully.',
        ]);
    }

    public static function restore_table_bulk($req)
    {
        global $wpdb;
        $json = $req->get_json_params();
        $post_ids = $json['ids'] ?? [];
        $wpdb->query('START TRANSACTION');
        foreach ($post_ids as $id) {
            if (!get_post_type($id) === 'wptb-tables') {
                $wpdb->query('ROLLBACK');
                return ApiHandler::response(['message' => 'Failed to restore table(s).']);
            }
            wp_untrash_post($id);
        }
        $wpdb->query('COMMIT');
        return ApiHandler::response([
            'message' => 'Table(s) restored successfully.',
        ]);
    }
}