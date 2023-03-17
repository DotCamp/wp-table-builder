<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder\Inc\Common\Traits\Init_Once;
use WP_Table_Builder\Inc\Common\Traits\Singleton_Trait;
use WP_Query;
use Gt\Dom\HTMLDocument;
use WP_Table_Builder\Inc\Admin\Managers\Table_Updates;

class Database_Updater
{
    use Singleton_Trait;
    use Init_Once;

    public static $old_tables = [];
    public static $updated_tables = [];

    public static function init_process()
    {
        add_action("wp_ajax_update_all", array(__CLASS__, 'ajax_update_all_tables'));
        add_action("wp_ajax_simulate_update", array(__CLASS__, 'ajax_simulate_update'));
        add_action("wp_ajax_get_table_render", array(__CLASS__, 'ajax_get_table_render'));
        add_action("wp_ajax_get_tables_num", array(__CLASS__, 'ajax_num_tables'));
        add_action("wp_ajax_wptb_synthetic_benchmark", array(__CLASS__, 'ajax_run_synthetic_benchmark'));
    }

    public static function ajax_num_tables()
    {
        wp_send_json(wp_count_posts('wptb-tables')->draft);
    }

    public static function ajax_update_all_tables()
    {
        static::load_tables();
        static::update_all_tables();
        wp_send_json_success();
    }

    public function ajax_simulate_update()
    {
        static::load_tables();
        static::simulate_update();
        wp_send_json_success();
    }

    public static function load_tables()
    {
        global $post;

        $args = array(
            'post_type' => 'wptb-tables',
            'posts_per_page' => -1
        );

        $query = new WP_Query($args);

        static::$old_tables = [];

        while ($query->have_posts()) {
            $query->the_post();
            static::$old_tables[$post->ID] = get_post_meta($post->ID, '_wptb_content_', true);
        }
        wp_reset_postdata();
    }

    public static function update_all_tables()
    {
        static::$updated_tables = [];

        foreach (static::$old_tables as $table) {
            static::update_table($table);
        }
    }

    public static function update_table($table)
    {
        $table = new HTMLDocument($table);

        $table = Table_Updates\Image_Element::update($table);
        $table = Table_Updates\Icon_Element::update($table);
        $table = Table_Updates\Empty_Anchor::update($table);
        $table = Table_Updates\Button_Element::update($table);

        $table = static::get_clean_table($table);

        static::$updated_tables[] = $table;
    }

    public static function get_clean_table($html_string)
    {
        return explode("</body>", explode("<body>", $html_string->__toString())[1])[0];
    }

    public static function ajax_get_table_render()
    {
        wp_send_json(static::generate_table());
    }

    public static function generate_table()
    {
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
                                <div class="wptb-image-wrapper"> <a style="display: block; width: 70%; float: none;"><img src="https://images.unsplash.com/photo-1664825455771-136f0ea03299?iauto=format&fit=crop&w=870&q=80" style="width: 100%;" class="wptb-image-element-target" title="" width="359" height="291"></a> </div>
                            </div>
                        </td>
                    <?php endfor; ?>
                </tr>
            </tbody>
        </table>
        <?php

        return ob_get_clean();
    }

    public static function ajax_run_synthetic_benchmark()
    {
        $n = $_REQUEST['tables'];

        $table = static::generate_table();

        for ($i = 0; $i < $n; $i++) {
            static::update_table($table);
        }

        wp_send_json_success();
    }

    public static function print_tables($old = false)
    {
        $tables = $old ? static::$old_tables : static::$updated_tables;

        foreach ($tables as $table) : ?>
            <div>
                <?= esc_html($table) ?>
            </div>
<?php
        endforeach;
    }

    public static function echo_tables($old = false)
    {
        $tables = $old ? static::$old_tables : static::$updated_tables;

        foreach ($tables as $table) {
            echo $table;
        }
    }

    public static function simulate_update($n = 100)
    {
        if (isset($_REQUEST['n'])) {
            $n = $_REQUEST['n'];
        }

        for ($i = 0; $i < $n; $i++) {
            foreach (static::$old_tables as $table) {
                static::update_table($table);
            }
        }
    }
}
