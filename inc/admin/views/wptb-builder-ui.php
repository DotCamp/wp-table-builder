<?php 

use WP_Table_Builder as NS;

?>

<div class="wptb-admin-container">
    <div class="wptb-header">
        <div class="wptb-logo">
            <img src="<?php echo NS\WP_TABLE_BUILDER_URL . 'assets/images/1.png' ?>" alt="">
        </div>
        <div class="wptb-right">
            <div class="wptb-close">
                <a href="<?php echo admin_url('admin.php?page=wptb-overview'); ?>"><span class="dashicons dashicons-no" style="font-size: 30px; width: 30px; height: 30px;"></span></a>
            </div>
        </div>
    </div>
    <div class="wptb-container">
        <div class="wptb-left-panel">
            <div class="wptb-elements-section">
                <ul class="wptb-tabs wptb-clear">

                    <li class="wptb-tab" id="add-elements">
                        <a href="#" class="active">
                            Add Elements
                        </a>
                    </li>

                    <li class="wptb-tab" id="element-options">
                        <a href="#">
                            Element Options
                        </a>
                    </li>

                </ul>
                <div class="add-elements wptb-tab-content">
                    <div class="wptb-elements-container">
                        <div class="wptb-element left">
                            Text
                        </div>
                        <div class="wptb-element right">
                            Image
                        </div>
                        <div class="wptb-element left">
                            Button
                        </div>
                        <div class="wptb-element right">
                            List
                        </div>
                    </div>
                </div>

                <div id="element-options" class="wptb-tab-content" style="display: none;">
                    Elements Options Goes Here
                </div>
            </div>
            <div class="wptb-settings-section">
                <div class="wptb-settings-dropdown">
                    Table Settings
                </div>
                <p>Settings Items will go here</p>
            </div>
        </div>
        <div class="wptb-builder-panel">
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