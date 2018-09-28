<?php

use WP_Table_Builder as NS;

/**
 * Table Name and Structure Setuo
 */

 ?>
<div class="wptb-messaging"></div>
<div class="wptb-name-setup">
    <span><?php echo __( 'Table Name', 'wp-table-builder' ); ?></span> <input id="wptb-setup-name" name="" placeholder="<?php echo __( 'Enter Table Name Here', 'wp-table-builder' ); ?>" type="text">
</div>
<div id="wpcd_fixed_toolbar"></div>
<nav class="table management bar" id="edit-bar">
    <ul>
        <li class="no-cell-action" id="wptb-add-end-column" title="Add column to the end">
            <svg height="36" width="48">
            <rect height="29" style="fill:#fff;stroke-width:2;stroke:#003;" width="30" x="3" y="3"></rect>
            <rect height="29" style="fill:#fff;stroke-width:2;stroke:#003;" width="4" x="36" y="3"></rect></svg>
        </li>
        <li class="no-cell-action" id="wptb-add-start-column" title="Add column to the start">
            <svg height="36" width="48">
            <rect height="29" style="fill:#fff;stroke-width:2;stroke:#003;" width="30" x="10" y="3"></rect>
            <rect height="29" style="fill:#fff;stroke-width:2;stroke:#003;" width="4" x="3" y="3"></rect></svg>
        </li>
        <li class="no-cell-action" id="wptb-add-start-row" title="Add row to the start">
            <svg height="36" width="48">
            <rect height="4" style="fill:#fff;stroke-width:2;stroke:#003;" width="37" x="3" y="3"></rect>
            <rect height="22" style="fill:#fff;stroke-width:2;stroke:#003;" width="37" x="3" y="10"></rect></svg>
        </li>
        <li class="no-cell-action" id="wptb-add-end-row" title="Add row to the start">
            <svg height="36" width="48">
            <rect height="22" style="fill:#fff;stroke-width:2;stroke:#003;" width="37" x="3" y="3"></rect>
            <rect height="4" style="fill:#fff;stroke-width:2;stroke:#003;" width="37" x="3" y="28"></rect></svg>
        </li>
        <li id="wptb-add-column-after" title="Add column after highlighted one">
            <svg height="36" width="48">
            <rect height="29" style="fill:#fff;stroke-width:2;stroke:#003;" width="20" x="3" y="3"></rect>
            <rect height="29" style="fill:#fff;stroke-width:2;stroke:#003;" width="4" x="26" y="3"></rect>
            <rect height="29" style="fill:#fff;stroke-width:2;stroke:#003;" width="9" x="33" y="3"></rect></svg>
        </li>
        <li id="wptb-add-column-before" title="Add column before highlighted one">
            <svg height="36" width="48">
            <rect height="29" style="fill:#fff;stroke-width:2;stroke:#003;" width="9" x="3" y="3"></rect>
            <rect height="29" style="fill:#fff;stroke-width:2;stroke:#003;" width="4" x="15" y="3"></rect>
            <rect height="29" style="fill:#fff;stroke-width:2;stroke:#003;" width="20" x="22" y="3"></rect></svg>
        </li>
        <li id="wptb-add-row-after" title="Add row after highlighted one&gt; &lt;svg width="></li>
        <li id="wptb-add-row-before" title="Add row before highlighted one">
            <svg height="36" width="48">
            <rect height="6" style="fill:#fff;stroke-width:2;stroke:#003;" width="37" x="3" y="3"></rect>
            <rect height="3" style="fill:#fff;stroke-width:2;stroke:#003;" width="37" x="3" y="13"></rect>
            <rect height="12" style="fill:#fff;stroke-width:2;stroke:#003;" width="37" x="3" y="20"></rect></svg>
        </li>
        <li class="multiple-select-action" id="wptb-merge-cells" title="Merge selected Cells">
            <svg height="36" width="48">
            <rect height="29" style="fill:#fff;stroke-width:2;stroke:#003;" width="37" x="3" y="3"></rect>
            <line stroke-dasharray="1 2" style="stroke:#000;stroke-width:2" x1="21" x2="21" y1="7" y2="32"></line>
            <line style="stroke:#000;stroke-width:2" x1="5" x2="18" y1="17" y2="17"></line>
            <line style="stroke:#000;stroke-width:2" x1="24" x2="37" y1="17" y2="17"></line>
            <polygon points="18,17 15,14 15,20" style="fill:#000;stroke:#000;stroke-width:0.5"></polygon>
            <polygon points="24,17 27,14 27,20" style="fill:#000;stroke:#000;stroke-width:0.5"></polygon></svg>
        </li>
        <li class="single-action" id="wptb-split-cell" title="Unmerge selected cell">
            <svg height="36" width="48">
            <rect height="29" style="fill:#fff;stroke-width:2;stroke:#003;" width="37" x="3" y="3"></rect>
            <line stroke-dasharray="1 2" style="stroke:#000;stroke-width:2" x1="21" x2="21" y1="7" y2="32"></line>
            <line style="stroke:#000;stroke-width:2" x1="5" x2="18" y1="17" y2="17"></line>
            <line style="stroke:#000;stroke-width:2" x1="24" x2="37" y1="17" y2="17"></line>
            <polygon points="5,17 8,14 8,20" style="fill:#000;stroke:#000;stroke-width:0.5"></polygon>
            <polygon points="37,17 34,14 34,20" style="fill:#000;stroke:#000;stroke-width:0.5"></polygon></svg>
        </li>
    </ul>
</nav>
<table class="wptb-table-generator">
    <tr>
        <td style="font-size: 20px"><?php echo __( 'Columns', 'wp-table-builder' ); ?></td>
        <td style="font-size: 20px"><?php echo __( 'Rows', 'wp-table-builder' ); ?></td>
    </tr>
    <tr>
        <td style="padding: 15px"><span class="wptb-input-number-decrement">–</span><input class="wptb-input-number" id="wptb-columns-number" max="10" min="1" type="text" value="1"><span class="wptb-input-number-increment">+</span></td>
        <td style="padding: 15px"><span class="wptb-input-number-decrement">–</span><input class="wptb-input-number" id="wptb-rows-number" max="10" min="1" type="text" value="1"><span class="wptb-input-number-increment">+</span></td>
    </tr>
    <tr>
        <td colspan="2"><button class="wptb-generator-btn" id="wptb-generate-table"><?php echo __( 'Generate', 'wp-table-builder' ); ?></button></td>
    </tr>
</table>
<div class="wptb-table-setup"></div>