<?php 

use WP_Table_Builder as NS;

/**
 * Table Builde UI
 */

?>

<div class="wptb-admin-container">
    
    <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-builder-header.php'; ?>

    <div class="wptb-container">
        
        <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-builder-left-panel.php'; ?>  
        
        <div class="wptb-builder-panel">

            <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-builder-table-setup.php'; ?>  

            <div class="wrapper">
                <table class="wptb-table" style="text-align: center">
                    <thead>
                        <tr class="wptb-row wptb-table-header green">
                            <th class="wptb-cell">Rank</th>
                            <th class="wptb-cell">Plugin</th>
                            <th class="wptb-cell">Our Rating</th>
                            <th class="wptb-cell">Price</th>
                            <th class="wptb-cell">Download</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="wptb-row">
                            <td class="wptb-cell">1</td>
                            <td class="wptb-cell">WP Table Builder</td>
                            <td class="wptb-cell">5 Stars</td>
                            <td class="wptb-cell">Free</td>
                            <td class="wptb-cell"><button style="padding: 10px">Download</button></td>
                        </tr>
                        <tr class="wptb-row">
                            <td class="wptb-cell">2</td>
                            <td class="wptb-cell">TablePress</td>
                            <td class="wptb-cell">5 Stars</td>
                            <td class="wptb-cell">Free</td>
                            <td class="wptb-cell"><button style="padding: 10px">Download</button></td>
                        </tr>
                        <tr class="wptb-row">
                            <td class="wptb-cell">3</td>
                            <td class="wptb-cell">Table Maker</td>
                            <td class="wptb-cell">4 Stars</td>
                            <td class="wptb-cell">$19.99</td>
                            <td class="wptb-cell"><button style="padding: 10px">Buy</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>