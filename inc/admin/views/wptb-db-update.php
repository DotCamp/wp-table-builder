<?php

use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Admin\Database_Updater;

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

?>
<div class="wptb-menu-page-wrapper">WPTB Database Updater</div>
<div>
    <ul>
        <?php
        // echo "starting update";
        // for ($i = 0; $i < 1000; $i++) {
        //     $tables = (new Database_Updater())->get_updated_tables();
        // }
        // echo "<br>update complete";
        // (new Database_Updater())->get_updated_tables();
        ?>
        <button id="test-button">Start update</button>
    </ul>
</div>

<script>
    document.querySelector("#test-button").addEventListener("click", async () => {
        const x = await fetch("http://127.0.0.1/wp-admin/admin-ajax.php?action=start_update");
        console.log(x);
        console.log((await x.json()).data);
    })
</script>