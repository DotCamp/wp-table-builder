<?php

namespace WP_Table_Builder\Inc\Admin\Managers\Table_Updates;

use \Wa72\HtmlPageDom\HtmlPageCrawler;
use WP_Table_Builder\Inc\Core\Init;

class Icon_Element
{
    public static $container = '.wptb-icon-container';
    public static $icon_element_wrapper;
    public static $table;

    public static function update(&$table)
    {
        static::$table = $table;
        $elements = $table->filter(static::$container);

        foreach ($elements as $el) {
            $el = HtmlPageCrawler::create($el);
            static::$icon_element_wrapper = $el->filter('.wptb-icon-wrapper')->first();

            static::update_single_icon($el);
            static::update_single_icon_link($el);
        }

        return static::$table;
    }

    public static function create_new_icons()
    {
        for ($i = 2; $i <= 5; $i++) {
            $icon = Init::instance()->get_icon_manager()->get_icon('star');
            // $icon = '<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 576 512"><path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg>';

            ob_start();
?>
            <span class="wptb-icon-link-target-<?php echo $i; ?>">
                <div class="wptb-icon wptb-icon-<?php echo $i; ?>" style="display: none;">
                    <?php echo $icon; ?>
                </div>
            </span>
        <?php
            $newElement = ob_get_clean();

            static::$icon_element_wrapper->append($newElement);
        }
    }

    public static function update_single_icon($element)
    {
        if (is_null(static::$icon_element_wrapper)) return;

        if ($element->filter('span')->count() > 0 || $element->filter('a')->count() > 0) return;

        $currentHtmlcontent = $element->filter('.wptb-icon')->first();
        $currentHtmlcontent->addClass('wptb-icon-1');

        ob_start();
        ?>
        <span class="wptb-icon-link-target-1">
            <?php echo $currentHtmlcontent->outerHtml(); ?>
        </span>
<?php
        $newHtmlContent = ob_get_clean();

        $currentHtmlcontent->replaceWith($newHtmlContent);

        static::create_new_icons();
    }

    public static function update_single_icon_link($element)
    {
        // var_dump($element->filter('a, span')->count());
        if ($element->filter('a, span')->count() !== 1) return;

        // $element->innerHTML = preg_replace('/\s{5,}/', '', $element->innerHTML);

        $anchor = $element->filter('a')->first();

        $anchor->addClass('wptb-icon-link-target-1');

        $anchor->filter('.wptb-icon')->first()->addClass('wptb-icon-1');

        static::create_new_icons();
    }
}
