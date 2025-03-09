<?php

namespace WPTableBuilder\Admin;

class Authorization {
    public static function can_edit() {
        $allowed = get_option('wptb_allowed_roles', [
            'administrator',
        ]);
        $user = wp_get_current_user();
        $common = array_intersect($allowed, $user->roles);
        return sizeof($common) > 0;
    }
}