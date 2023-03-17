<?php

namespace WP_Table_Builder\Inc\Admin\Managers\Table_Updates;

class Image_Element
{
    public static $container = '.wptb-image-container';

    public static function update($table)
    {
        $elements = $table->querySelectorAll(static::$container);

        foreach ($elements as $el) {
            static::add_class_to_link($el);
        }

        return $table;
    }

    public static function add_class_to_link($image_el)
    {
        $anchor = $image_el->querySelector('a');

        if (!is_null($anchor) && !$anchor->className) {
            $anchor->classList->add('wptb-link-target');
        }

        return $image_el;
    }
}
