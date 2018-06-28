<?php

use WP_Table_Builder as NS;

/**
 * Table Name and Structure Setuo
 */

 ?>

 <div class="wptb-name-setup">
    <span><?php echo __( 'Table Name', 'wp-table-builder' ); ?></span>
    <input type="text" name="" id="wptb-setup-name" placeholder="<?php echo __( 'Enter Table Name Here', 'wp-table-builder' ); ?>">
</div>
<div id="wpcd_fixed_toolbar">
</div>
<table class="wptb-table-generator">
    <tr>
        <td style="font-size: 20px"><?php echo __( 'Columns', 'wp-table-builder' ); ?></td>
        <td style="font-size: 20px"><?php echo __( 'Rows', 'wp-table-builder' ); ?></td>
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
            <button id="wptb-generate-table" class="wptb-generator-btn">
                <?php echo __( 'Generate', 'wp-table-builder' ); ?>
            </button>
        </td>
    </tr>
</table>
<div class="wptb-table-setup">

</div>