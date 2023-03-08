<?php

namespace WP_Table_Builder\Inc\Admin;

use DOMDocument;
use WP_Table_Builder\Inc\Core\Init;
use WP_Query;
use Gt\Dom\HTMLDocument;

// require plugin_dir_path( __FILE__) . "vendor/autoloader.php";

class Database_Updater
{
    public $old_tables = [];
    public $updated_tables = [];

    public function __construct()
    {
        add_action("wp_ajax_update_all", array($this, 'ajax_update_all_tables'));
        add_action("wp_ajax_simulate_update", array($this, 'ajax_simulate_update'));
        add_action("wp_ajax_wptb_synthetic_benchmark", array($this, 'ajax_run_synthetic_benchmark'));
    }

    public function ajax_run_synthetic_benchmark()
    {
        $n = $_REQUEST['tables'];
        $icon1 = $_REQUEST['icon1'];
        $icon2 = $_REQUEST['icon2'];
        $images = $_REQUEST['images'];

        ob_start();
?>
        <table class="wptb-preview-table wptb-element-main-table_setting-14" style="border: 1px solid rgb(209, 209, 209);" data-reconstraction="1" data-wptb-table-tds-sum-max-width="263" data-wptb-cells-width-auto-count="2" data-wptb-table-directives="eyJpbm5lckJvcmRlcnMiOnsiYWN0aXZlIjoiYWxsIiwiYm9yZGVyV2lkdGgiOiIxIiwiYm9yZGVyUmFkaXVzZXMiOnsiYWxsIjpmYWxzZX19fQ==" data-wptb-horizontal-scroll-status="false" data-wptb-extra-styles="LyogRW50ZXIgeW91ciBjdXN0b20gQ1NTIHJ1bGVzIGhlcmUgKi8=" data-wptb-first-column-sticky="false" data-wptb-pro-pagination-top-row-header="true" data-wptb-rows-per-page="3" data-wptb-pro-search-top-row-header="true" data-wptb-searchbar-position="left" role="table" data-table-columns="2">
            <tbody data-global-font-color="#4A5568" data-global-link-color="#4A5568" data-global-font-size="15px">
                <tr class="wptb-row">
                    <?php for ($i = 0; $i < $icon1; $i++) : ?>
                        <td class="wptb-cell wptb-ondragenter" data-y-index="0" data-x-index="0" style="border: 1px solid rgb(209, 209, 209);" data-wptb-css-td-auto-width="true">
                            <div class="wptb-icon-container wptb-ph-element wptb-element-icon-1" style="padding: 0px; margin: 0px;">
                                <div class="wptb-icon-wrapper" style="text-align: center;"> <a>
                                        <div class="wptb-icon" style="width: 25px; height: 25px; fill: rgb(74, 85, 104);" data-wptb-icon-src="star"><svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 576 512">
                                                <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z">
                                                </path>
                                            </svg></div>
                                    </a> </div>
                            </div>
                        </td>
                    <?php endfor; ?>
                    <?php for ($i = 0; $i < $icon2; $i++) : ?>
                        <td class="wptb-cell" data-y-index="0" data-x-index="0" style="border: 1px solid rgb(209, 209, 209);" data-wptb-css-td-auto-width="true">
                            <div class="wptb-icon-container wptb-ph-element wptb-element-icon-1" style="padding: 0px; margin: 0px;">
                                <div class="wptb-icon-wrapper" style="text-align: center;">
                                    <div class="wptb-icon" style="width: 25px; height: 25px; fill: rgb(74, 85, 104);" data-wptb-icon-src="star"><svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 576 512">
                                            <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z">
                                            </path>
                                        </svg></div>
                                </div>
                            </div>
                        </td>
                    <?php endfor; ?>
                    <?php for ($i = 0; $i < $images; $i++) : ?>
                        <td class="wptb-cell wptb-ondragenter" data-y-index="0" data-x-index="0" style="border: 1px solid rgb(209, 209, 209);" data-wptb-css-td-auto-width="true">
                            <div class="wptb-image-container wptb-ph-element wptb-element-image-1 wptb-ondragenter">
                                <div class="wptb-image-wrapper"> <a style="display: block; width: 70%; float: none;"><img src="//127.0.0.1/wp-content/uploads/2023/03/alo.png" style="width: 100%;" class="wptb-image-element-target" title="" width="359" height="291"></a> </div>
                            </div>
                        </td>
                    <?php endfor; ?>
                </tr>
            </tbody>
        </table>
        <?php

        $table = ob_get_clean();

        for ($i = 0; $i < $n; $i++) {
            $this->update_table($table);
        }

        wp_send_json_success();
    }

    public function ajax_update_all_tables()
    {
        $this->load_tables();
        $this->update_all_tables();
        wp_send_json_success();
    }

    public function ajax_simulate_update()
    {
        $this->load_tables();
        $this->simulate_update();
        wp_send_json_success();
    }

    public function load_tables()
    {
        global $post;

        $args = array(
            'post_type' => 'wptb-tables',
        );

        $query = new WP_Query($args);

        $this->old_tables = [];

        while ($query->have_posts()) {
            $query->the_post();
            $this->old_tables[] = get_post_meta($post->ID, '_wptb_content_', true);
        }
        wp_reset_postdata();
    }

    public function update_all_tables()
    {
        $this->updated_tables = [];

        foreach ($this->old_tables as $table) {
            $this->update_table($table);
        }
    }

    public function print_tables($old = false)
    {
        $tables = $old ? $this->old_tables : $this->updated_tables;

        foreach ($tables as $table) : ?>
            <div>
                <?= esc_html($table) ?>
            </div>
<?php
        endforeach;
    }

    public function echo_tables($old = false)
    {
        $tables = $old ? $this->old_tables : $this->updated_tables;

        foreach ($tables as $table) {
            echo $table;
        }
    }

    public function simulate_update($n = 100)
    {
        if (isset($_REQUEST['n'])) {
            $n = $_REQUEST['n'];
        }

        for ($i = 0; $i < $n; $i++) {
            foreach ($this->old_tables as $table) {
                $this->update_table($table);
            }
        }
    }

    public function update_table($table)
    {
        $table = new HTMLDocument($table);

        $newTable = $this->update_image_element($table);
        $newTable = $this->update_icon_element($newTable);

        $newTable = $this->get_clean_table($newTable);

        $this->updated_tables[] = $newTable;
    }

    public function update_image_element($table)
    {
        $image_els = $table->querySelectorAll('.wptb-image-container');

        foreach ($image_els as $image_el) {
            $anchor = $image_el->querySelector("a");

            if (!is_null($anchor) && !$anchor->className) {
                $anchor->classList->add("wptb-link-target");
            }
        }

        return $table;
    }

    public function update_icon_element($table)
    {
        $icon_els = $table->querySelectorAll('.wptb-icon-container');

        foreach ($icon_els as $element) {
            $iconElementWrapper = $element->querySelector('.wptb-icon-wrapper');

            $createNewIcons = function () use ($table, $iconElementWrapper) {
                for ($i = 2; $i <= 5; $i++) {
                    $linkTargetElement = $table->createElement('span');
                    $linkTargetElement->classList->add("wptb-icon-link-target-$i");

                    $iconElementWrapper->appendChild($linkTargetElement);

                    $icon = Init::instance()->get_icon_manager()->get_icon('star');

                    $linkTargetElement->innerHTML = "<div class='wptb-icon-$i' style='display: none;'>$icon</div>";
                }
            };

            (function () use ($table, $element, $iconElementWrapper, $createNewIcons) {
                if (!is_null($element->querySelector('span')) || !is_null($element->querySelector('a'))) return;

                if (is_null($iconElementWrapper)) return;

                $linkTargetElement = $table->createElement('span');
                $linkTargetElement->classList->add('wptb-icon-link-target-1');

                $currentHtmlcontent = $element->querySelector('.wptb-icon');
                $currentHtmlcontent->classList->add('wptb-icon-1');

                $iconElementWrapper->removeChild($currentHtmlcontent);
                $iconElementWrapper->appendChild($linkTargetElement);
                $linkTargetElement->appendChild($currentHtmlcontent);

                $createNewIcons();
            })();

            (function () use ($element, $table, $iconElementWrapper, $createNewIcons) {
                $anchor = $element->querySelector('a');

                if (is_null($anchor)) return;

                $newElement = $anchor->href
                    ? $table->createElement('a')
                    : $table->createElement('span');
                $newElement->classList->add('wptb-icon-link-target-1');

                $oldIcon = $element->querySelector('.wptb-icon');
                $oldIconName = $oldIcon->dataset->wptbIconSrc;
                $oldStyles = $oldIcon->getAttribute('style');

                $iconElementWrapper->removeChild($element->querySelector('a'));
                $iconElementWrapper->appendChild($newElement);

                $icon = Init::instance()->get_icon_manager()->get_icon($oldIconName);

                $newElement->innerHTML = "<div class='wptb-icon-1' style='$oldStyles'>$icon</div>";

                if ($anchor->href) $newElement->href = $anchor->href;

                $createNewIcons();
            })();
        }

        return $table;
    }

    public function get_clean_table($html_string)
    {
        return explode("</body>", explode("<body>", $html_string->__toString())[1])[0];
    }
}
