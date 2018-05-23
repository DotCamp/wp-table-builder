<?php

use WP_Table_Builder as NS;

/**
 * Table Name and Structure Setuo
 */

 ?>

 <div class="wptb-name-setup">
    <span>Table Name</span>
    <input type="text" name="" id="wptb-setup-name" placeholder="Enter Table Name Here">
</div>
<table class="wptb-table-generator">
    <tr>
        <td style="font-size: 20px">Columns</td>
        <td style="font-size: 20px">Rows</td>
    </tr>
    <tr>
        <td style="padding: 15px">
            <span class="wptb-input-number-decrement">–</span><input class="wptb-input-number" id="wptb-columns-number" type="text" value="1" min="1" max="10"><span class="wptb-input-number-increment">+</span>
        </td>
        <td style="padding: 15px">
            <span class="wptb-input-number-decrement">–</span><input class="wptb-input-number" id="wptb-rows-number" type="text" value="1" min="1" max="10"><span class="wptb-input-number-increment">+</span>
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <button id="wptb-generate-table" class="wptb-generator-btn">Generate</button>
        </td>
    </tr>
</table>
<div class="wptb-table-setup">

</div>