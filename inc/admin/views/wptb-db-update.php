<?php

use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Admin\Managers\Database_Updater;

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

?>
<div class="wptb-menu-page-wrapper">
    <h1>WPTB Database Updater Synthetic Benchmark</h1>
</div>
<div>
    <div>
        <p>Run benchmark on <input type="number" value="400" id="tables"> tables each with <input type="number" value="4" id="v1_icon"> v1 icons, <input type="number" value="4" id="v2_icon"> v2 icons, and <input type="number" value="5" id="images"> images.</p>
        <div style="margin: .5rem 0;">
            <button id="show_table" class="button button-primary">Display generated table</button>
            <button class="button button-primary" id="bench">Run benchmark on generated tables</button>
            <p style="display: inline-block;margin: 0.3rem 0.5rem;" id="result"></p>
        </div>
        <div style="margin: .5rem 0;">
            <button class="button button-primary" id="current">Run benchmark on tables from DB (<span id="num_tables"></span> tables)</button>
            <p style="display: inline-block;margin: 0.3rem 0.5rem;" id="current_result"></p>
        </div>
        <div id="table_display" style="margin: .5rem 0;"></div>
    </div>
    <?php
    // $database_updater = new Database_Updater;
    // $database_updater->load_tables();
    // $database_updater->print_tables(true);
    // $database_updater->update_all_tables();
    // print_r($database_updater->updated_tables);
    ?>
</div>

<script>
    bench.addEventListener("click", async () => {
        const t0 = performance.now();
        bench.disabled = true;
        result.innerText = "Running benchmark...";
        const res = await fetch(`/wp-admin/admin-ajax.php?action=wptb_synthetic_benchmark&tables=${tables.value}&icon1=${v1_icon.value}&icon2=${v2_icon.value}&images=${images.value}`);

        bench.disabled = false;

        if (!res.ok) {
            result.innerText = res.statusText;
            return;
        }

        const t1 = performance.now();
        result.innerText = `Benchmark complete: ${(t1 - t0)/1000}s`;

        console.log(await res.json());
    });

    current.addEventListener("click", async () => {
        const t0 = performance.now();
        current.disabled = true;
        current_result.innerText = "Running benchmark...";
        await fetch('/wp-admin/admin-ajax.php?action=update_all');
        const t1 = performance.now();

        current.disabled = false;
        current_result.innerText = `Update complete: ${(t1 - t0)/1000}s`;
    });

    show_table.addEventListener("click", async () => {
        const res = await fetch(`/wp-admin/admin-ajax.php?action=get_table_render&icon1=${v1_icon.value}&icon2=${v2_icon.value}&images=${images.value}`);
        const table = (await res.json());

        table_display.innerHTML = table;
    });

    (async () => {
        const res = await fetch('/wp-admin/admin-ajax.php?action=get_tables_num');
        const tables = await res.json();
        num_tables.innerText = tables;
    })();
</script>