<?php

namespace WP_Table_Builder\Inc\Admin\Managers\Table_Updates;

use \Wa72\HtmlPageDom\HtmlPageCrawler;

class Empty_Anchor
{
    public static $container = 'a';
    public static $table;

    public static function update(&$table)
    {
        static::$table = $table;

        $elements = $table->filter(static::$container);

        foreach ($elements as $el) {
            $el = HtmlPageCrawler::create($el);
            static::convert_empty_link_to_span($el);
        }

        return $table;
    }

    public static function convert_empty_link_to_span($anchor_el)
    {
        if (!$anchor_el->getAttribute('href')) {
            ob_start();
?>
            <span <?php foreach (static::get_attrs($anchor_el->saveHTML()) as $attr) {
                        echo "$attr->name=\"$attr->value\"";
                    } ?>>
                <?php echo $anchor_el->html(); ?>
            </span>
<?php
            $span_el = ob_get_clean();

            $anchor_el->replaceWith($span_el);
        }
    }

    private static function get_attrs($crawler)
    {
        libxml_use_internal_errors(true);
        $dom = (new \DOMDocument);
        $dom->loadHTML($crawler);
        libxml_clear_errors();

        return $dom->getElementsByTagName('a')->item(0)->attributes;
    }
}
