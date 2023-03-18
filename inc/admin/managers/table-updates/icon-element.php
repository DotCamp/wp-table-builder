<?php

namespace WP_Table_Builder\Inc\Admin\Managers\Table_Updates;

use WP_Table_Builder\Inc\Core\Init;

class Icon_Element
{
    public static $container = '.wptb-icon-container';
    public static $icon_element_wrapper;
    public static $table;

    public static function update(&$table)
    {
        static::$table = $table;
        $elements = $table->querySelectorAll(static::$container);

        foreach ($elements as $el) {
            static::$icon_element_wrapper = $el->querySelector('.wptb-icon-wrapper');

            static::update_single_icon($el);
            static::update_single_icon_link($el);
        }

        return static::$table;
    }

    public static function create_new_icons()
    {
        for ($i = 2; $i <= 5; $i++) {
            $linkTargetElement = static::$table->createElement('span');
            $linkTargetElement->classList->add("wptb-icon-link-target-$i");

            static::$icon_element_wrapper->appendChild($linkTargetElement);

            $icon = Init::instance()->get_icon_manager()->get_icon('star');

            $linkTargetElement->innerHTML = "<div class='wptb-icon-$i' style='display: none;'>$icon</div>";
        }
    }

    public static function update_single_icon($element)
    {
        if (!is_null($element->querySelector('span')) || !is_null($element->querySelector('a'))) return;

        if (is_null(static::$icon_element_wrapper)) return;

        $linkTargetElement = static::$table->createElement('span');
        $linkTargetElement->classList->add('wptb-icon-link-target-1');

        $currentHtmlcontent = $element->querySelector('.wptb-icon');
        $currentHtmlcontent->classList->add('wptb-icon-1');

        static::$icon_element_wrapper->removeChild($currentHtmlcontent);
        static::$icon_element_wrapper->appendChild($linkTargetElement);
        $linkTargetElement->appendChild($currentHtmlcontent);

        static::create_new_icons();
    }

    public static function update_single_icon_link($element)
    {
        if ($element->querySelectorAll('a, span')->length !== 1) return;

        $anchor = $element->querySelector('a');

        $anchor->classList->add('wptb-icon-link-target-1');

        $iconEl = $anchor->querySelector('.wptb-icon');
        $iconEl->classList->add("wptb-icon-1");

        static::create_new_icons();
    }
}
