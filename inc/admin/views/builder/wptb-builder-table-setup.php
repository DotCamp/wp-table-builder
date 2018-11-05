<?php

use WP_Table_Builder as NS;

/**
 * Table Name and Structure Setuo
 */

 ?>
<div class="wptb-messaging"> 
</div>
<div class="wptb-name-setup">
    <span><?php echo __( 'Table Name', 'wp-table-builder' ); ?></span>
    <input type="text" name="" id="wptb-setup-name" placeholder="<?php echo __( 'Enter Table Name Here', 'wp-table-builder' ); ?>">
</div>
<div id="wpcd_fixed_toolbar">
</div>
<nav class="table management bar" id="edit-bar">
  <ul>
    <li  class="no-cell-action visible" id="wptb-add-end-column" title="Add column to the end">
      <svg width="48" height="36">
        <rect x="3" y="3" width="30" height="29" style="fill:#fff;stroke-width:2;stroke:#003;"/>
        <rect x="36" y="3" width="4" height="29" style="fill:#fff;stroke-width:2;stroke:#003;"/>
      </svg>
    </li>
    <li  class="no-cell-action visible" id="wptb-add-start-column" title="Add column to the start">
      <svg width="48" height="36">
        <rect x="10" y="3" width="30" height="29" style="fill:#fff;stroke-width:2;stroke:#003;"/>
        <rect x="3" y="3" width="4" height="29" style="fill:#fff;stroke-width:2;stroke:#003;"/>
      </svg>
    </li>
    <li  class="no-cell-action visible" id="wptb-add-start-row" title="Add row to the start">
      <svg width="48" height="36">
        <rect x="3" y="3" width="37" height="4" style="fill:#fff;stroke-width:2;stroke:#003;"/>
        <rect x="3" y="10" width="37" height="22" style="fill:#fff;stroke-width:2;stroke:#003;"/>
      </svg>
    </li>
    <li  class="no-cell-action  visible" id="wptb-add-end-row" title="Add row to the start">
      <svg width="48" height="36">
        <rect x="3" y="3" width="37" height="22" style="fill:#fff;stroke-width:2;stroke:#003;"/>
        <rect x="3" y="28" width="37" height="4" style="fill:#fff;stroke-width:2;stroke:#003;"/>
      </svg>
    </li>
  <li class="single-action" id="wptb-add-column-after" title="Add column after highlighted one">
      <svg width="48" height="36">
        <rect x="3" y="3" width="20" height="29" style="fill:#fff;stroke-width:2;stroke:#003;"/>
        <rect x="26" y="3" width="4" height="29" style="fill:#fff;stroke-width:2;stroke:#003;"/>
        <rect x="33" y="3" width="9" height="29" style="fill:#fff;stroke-width:2;stroke:#003;"/>
      </svg>
    </li>
    <li class="single-action" id="wptb-add-column-before" title="Add column before highlighted one">
      <svg width="48" height="36">
        <rect x="3" y="3" width="9" height="29" style="fill:#fff;stroke-width:2;stroke:#003;"/>
        <rect x="15" y="3" width="4" height="29" style="fill:#fff;stroke-width:2;stroke:#003;"/>
        <rect x="22" y="3" width="20" height="29" style="fill:#fff;stroke-width:2;stroke:#003;"/>
      </svg>
    </li>
    <li class="single-action" id="wptb-add-row-after" title="Add row after highlighted one">
      <svg width="48" height="36"">
        <rect x="3" y="3" width="37" height="12" style="fill:#fff;stroke-width:2;stroke:#003;"/>
        <rect x="3" y="19" width="37" height="3" style="fill:#fff;stroke-width:2;stroke:#003;"/>
        <rect x="3" y="26" width="37" height="6" style="fill:#fff;stroke-width:2;stroke:#003;"/>
      </svg>
    </li>
    <li class="single-action" id="wptb-add-row-before" title="Add row before highlighted one">
      <svg width="48" height="36">
        <rect x="3" y="3" width="37" height="6" style="fill:#fff;stroke-width:2;stroke:#003;"/>
        <rect x="3" y="13" width="37" height="3" style="fill:#fff;stroke-width:2;stroke:#003;"/>
        <rect x="3" y="20" width="37" height="12" style="fill:#fff;stroke-width:2;stroke:#003;"/>
      </svg>
    </li>
    <li class="multiple-select-action" id="wptb-merge-cells" class="multiple-select-action" title="Merge selected Cells">
      <svg width="48" height="36">
        <rect x="3" y="3" width="37" height="29" style="fill:#fff;stroke-width:2;stroke:#003;"/>  
        <line x1="21" y1="7" x2="21" y2="32" style="stroke:#000;stroke-width:2" stroke-dasharray="1 2" />
        <line x1="5" y1="17" x2="18" y2="17" style="stroke:#000;stroke-width:2"  />
        <line x1="24" y1="17" x2="37" y2="17" style="stroke:#000;stroke-width:2"  />
        <polygon points="18,17 15,14 15,20" style="fill:#000;stroke:#000;stroke-width:0.5" />
		<polygon points="24,17 27,14 27,20" style="fill:#000;stroke:#000;stroke-width:0.5" /> 
      </svg>
    </li>
    <li class="single-action" id="wptb-split-cell" class="single-action" title="Unmerge selected cell">
      <svg width="48" height="36">
        <rect x="3" y="3" width="37" height="29" style="fill:#fff;stroke-width:2;stroke:#003;"/>  
        <line x1="21" y1="7" x2="21" y2="32" style="stroke:#000;stroke-width:2" stroke-dasharray="1 2" />
        <line x1="5" y1="17" x2="18" y2="17" style="stroke:#000;stroke-width:2"  />
        <line x1="24" y1="17" x2="37" y2="17" style="stroke:#000;stroke-width:2"  />
        <polygon points="5,17 8,14 8,20" style="fill:#000;stroke:#000;stroke-width:0.5" />
        <polygon points="37,17 34,14 34,20" style="fill:#000;stroke:#000;stroke-width:0.5" />
      </svg>
    </li>
    <li class="single-action" id="wptb-delete-column" title="Delete highlighted column">
        <svg width="48" height="36">
          <rect x="3" y="3" width="20" height="29" style="fill:#fff;stroke-width:2;stroke:#003;"/>
          <rect x="26" y="3" width="4" height="29" style="fill:#fff;stroke-width:2;stroke:#ea4335 !important;"/>
          <rect x="33" y="3" width="9" height="29" style="fill:#fff;stroke-width:2;stroke:#003;"/>
        </svg>
    </li> 
    <li class="single-action" id="wptb-delete-row" title="Delete highlighted row">
        <svg width="48" height="36"">
          <rect x="3" y="3" width="37" height="12" style="fill:#fff;stroke-width:2;stroke:#003;"/>
          <rect x="3" y="19" width="37" height="3" style="fill:#fff;stroke-width:2;stroke:#ea4335 !important;"/>
          <rect x="3" y="26" width="37" height="6" style="fill:#fff;stroke-width:2;stroke:#003;"/>
        </svg>
    </li>
  </ul>
</nav>
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