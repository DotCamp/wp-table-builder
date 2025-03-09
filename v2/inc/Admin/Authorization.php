<?php

namespace WPTableBuilder\Admin;

class Authorization
{
    public static function can_edit()
    {
        $options = get_option('wp_table_builder_settings', []);
        if (isset($options['allowed_roles']) && is_array($options['allowed_roles'])) {
            $allowed = $options['allowed_roles'];
        } else {
            $allowed = ['administrator'];
        }
        $user = wp_get_current_user();
        $common = array_intersect($allowed, $user->roles);
        return sizeof($common) > 0;
    }
}