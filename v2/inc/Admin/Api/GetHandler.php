<?php

namespace WPTableBuilder\Admin\Api;
use WP_Query;
use WP_REST_Response;

class GetHandler
{
    public static function get_table($req)
    {
        $id = absint($req->get_param('id'));
        $post = get_post($id);
        $table = get_post_meta($id, '_wptb_content_', true);
        $name = $post?->post_title;
        return new WP_REST_Response(compact('table', 'name'));
    }

    public static function get_tables($request)
    {
        $page = isset($request['page']) ? (int) $request['page'] : 1;
        $per_page = isset($request['per_page']) ? (int) $request['per_page'] : 10;
        $search_term = isset($request['search']) ? sanitize_text_field($request['search']) : '';
        $sort_by = isset($request['sort_by']) ? sanitize_text_field($request['sort_by']) : 'id';
        $sort_order = isset($request['sort_order']) ? strtoupper(sanitize_text_field($request['sort_order'])) : 'DESC';


        $sort_order = in_array($sort_order, ['ASC', 'DESC']) ? $sort_order : 'DESC';
        $sort_by = in_array($sort_by, ['ID', 'title', 'date', 'modified']) ? $sort_order : 'ID';

        $page = max(1, $page);
        $per_page = min(max(5, $per_page), 30);

        $status = isset($request['status']) && $request['status'] == 'trash' ? 'trash' : 'draft';

        $except = false;
        if (isset($request['except'])) {
            $except = sanitize_text_field($request['except']);
            if (preg_match('/[^0-9,]/', $except)) {
                $except = false;
            }
        }


        $args = [
            'post_type' => 'wptb-tables',
            'posts_per_page' => $per_page,
            'paged' => $page,
            'post_status' => $status,
            'orderby' => $sort_by,
            'order' => $sort_order,
        ];

        add_filter('posts_where', function ($where, $query) use ($search_term, $except) {
            global $wpdb;
            if (!empty($search_term)) {
                $where .= $wpdb->prepare(" AND {$wpdb->posts}.post_title LIKE %s", '%' . $wpdb->esc_like($search_term) . '%');
            }

            if ($except) {
                $where .= $wpdb->prepare(" AND {$wpdb->posts}.ID NOT IN ($except)");
            }

            return $where;
        }, 10, 2);

        $query = new WP_Query($args);

        $post_data = [];

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();

                $post_data[] = [
                    'id' => get_the_ID(),
                    'title' => get_the_title(),
                    'date' => get_the_date('h:i A, d M, Y'),
                    'modified' => get_the_modified_date('h:i A, d M, Y'),
                ];
            }
            wp_reset_postdata();
        }

        $total_pages = $query->max_num_pages;
        $total_count = $query->found_posts;

        return [
            'posts' => $post_data,
            'total_count' => $total_count,
            'total_pages' => $total_pages,
            'current_page' => $page,
            'per_page' => $per_page,
        ];
    }
}