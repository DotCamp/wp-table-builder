<?php

namespace WP_Table_Builder\Inc\Admin\Managers\Table_Updates;

class Empty_Anchor
{
    public static $container = 'a';
    public static $table;

    public static function update(&$table)
    {
        static::$table = $table;

        $elements = $table->querySelectorAll(static::$container);

        foreach ($elements as $el) {
            static::convert_empty_link_to_span($el);
        }

        return $table;
    }

    public static function convert_empty_link_to_span($anchor_el)
    {
        if (!$anchor_el->href) {
            $span = static::$table->createElement('span');

            foreach ($anchor_el->attributes as $attr) {
                $span->setAttribute($attr->name, $attr->value);
            }

            $span->innerHTML = $anchor_el->innerHTML;

            $anchor_el->replaceWith($span);
        }
    }
}
