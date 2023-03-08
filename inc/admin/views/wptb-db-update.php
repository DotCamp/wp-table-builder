<?php

use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Admin\Database_Updater;

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
        <button class="button button-primary" id="bench">Run benchmark</button>
        <p style="display: inline-block;margin: 0.3rem 0.5rem;" id="result"></p>
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
        await fetch(`http://127.0.0.1/wp-admin/admin-ajax.php?action=wptb_synthetic_benchmark&tables=${tables.value}&icon1=${v1_icon.value}&icon2=${v2_icon.value}&images=${images.value}`);
        const t1 = performance.now();

        bench.disabled = false;
        result.innerText = `Benchmark complete: ${(t1 - t0)/1000}s`;
    })
</script>