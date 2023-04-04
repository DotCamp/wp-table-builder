<?php

namespace WP_Table_Builder\Inc\Admin\Managers\Table_Updates;

use \Wa72\HtmlPageDom\HtmlPageCrawler;

class Image_Element
{
    public static $container = '.wptb-image-container';

    public static function update(&$table)
    {
        $elements = $table->filter(static::$container);

        foreach ($elements as $el) {
            $el = HtmlPageCrawler::create($el);
            static::add_class_to_link($el);
        }

        return $table;
    }

    public static function add_class_to_link($image_el)
    {
        $anchor = $image_el->filter('a')->first();

        if ($anchor->count == 1 && !$anchor->getAttribute('class')) {
            $anchor->addClass('wptb-link-target');
        }
    }
}
