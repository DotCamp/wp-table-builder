<?php

namespace WP_Table_Builder\Inc\Admin\Managers\Table_Updates;

use \Wa72\HtmlPageDom\HtmlPageCrawler;

class Button_Element
{
    public static $container = '.wptb-button-container';
    public static $table;

    public static function update(&$table)
    {
        static::$table = $table;
        $elements = $table->filter(static::$container);

        foreach ($elements as $el) {
            $el = HtmlPageCrawler::create($el);
            static::add_size_class($el);
            static::add_link_target_class($el);
        }

        return static::$table;
    }

    public static function add_size_class($element)
    {
        if (!preg_match('/wptb-size-([A-Z]+)/i', $element->getAttribute('class'), $infArr)) return;

        $wptbSize = $infArr[0];
        $wptbSizeNew = strtolower($wptbSize);

        $element->removeClass($wptbSize);

        $wptbButtonWrapper = $element->filter('.wptb-button-wrapper')->first();
        if ($wptbButtonWrapper) {
            $wptbButtonWrapper->addClass($wptbSizeNew);
        }
    }

    public static function add_link_target_class($element)
    {
        $anchor = $element->filter('a')->first();

        if ($anchor->count() == 1 && !$anchor->getAttribute('class'))
            $anchor->addClass('wptb-link-target');
    }
}
