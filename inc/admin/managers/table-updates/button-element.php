<?php

namespace WP_Table_Builder\Inc\Admin\Managers\Table_Updates;

class Button_Element
{
    public static $container = '.wptb-button-container';
    public static $table;

    public static function update($table)
    {
        static::$table = $table;
        $elements = $table->querySelectorAll(static::$container);

        foreach ($elements as $el) {
            static::add_size_class($el);
            static::add_link_target_class($el);
        }

        return static::$table;
    }

    public static function add_size_class($element)
    {
        $infArr = [];

        if (!preg_match('/wptb-size-([A-Z]+)/i', $element->className, $infArr)) return;

        $wptbSize = $infArr[0];
        $wptbSizeNew = strtolower($wptbSize);

        $element->classList->remove($wptbSize);

        $wptbButtonWrapper = $element->querySelector('.wptb-button-wrapper');
        if ($wptbButtonWrapper) {
            $wptbButtonWrapper->classList->add($wptbSizeNew);
        }
    }

    public static function add_link_target_class($element)
    {
        $anchor = $element->querySelector('a');
        if (is_null($anchor) || !$anchor->className) return;

        $anchor->className = 'wptb-link-target';
    }
}
