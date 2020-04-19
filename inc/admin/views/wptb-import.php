<?php

use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

/**
 * Table Import Page
 */


/* import tables from CSV */
?>
<div class="wptb-importWrap">
    <div class="wptb-importCommonOptions">
        <table>
            <tbody>
            <tr>
                <td>
                    <input id="wptb-importTableResponsive" type="checkbox" name="wptb-importTableResponsive">
                    <label for="wptb-importTableResponsive" >Make Table Responsive</label>
                </td>
                <td>
                    <input id="wptb-topRowAsHeader" type="checkbox" name="wptb-topRowAsHeader">
                    <label for="wptb-topRowAsHeader">Top Row As Header</label>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</div>
<div class="wptb-importWrap">
    <h2><?php esc_html_e( 'Import Tables from CSV', 'wp-table-builder' ); ?></h2>
    <section id="wptb-importFormWrap">
        <form id="wptb-importForm" enctype='multipart/form-data' method='post'>
            <table style="min-width: 300px">
                <tbody>
                    <tr>
                        <td>
                            <input type="file" name='wptb-importFile' id="wptb-importFile" required/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <select id="wptb-csvDelimiter" name="wptb-csvDelimiter">
                                <option value=""></option>
                                <option value=";">; (semicolon)</option>
                                <option value=",">, (comma)</option>
                                <option value="tab">\t (tabulator)</option>
                            </select>
                            <label for="wptb-csvDelimiter"><?php esc_html_e( 'CSV Delimiter', 'wp-table-builder'); ?></label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input type="submit" name='wptb-importSubmit' class="button button-primary button-large" id="wptb-importSubmit" value="Import" />
                        </td>
                    </tr>
                </tbody>
            </table>

            <?php if ( isset( $_POST['wptb_import_submit'] ) ) : ?>
                <p style="font-size: 16px; color: red"><?php esc_html_e( 'File type not allowed.', 'wp-table-builder' ); ?></p>
            <?php endif; ?>
            <div class="wptb-importFormLoader wptb-loader" style="display:none"></div>
        </form>
    </section>
</div>

<hr>

<?php
/* import tables from other plugins */
?>
<div class="wptb-importWrap">
    <h2><?php esc_html_e( 'Import Tables from other Wordpress plugins', 'wp-table-builder' ); ?></h2>
    <div class="wptb-importFromPluginsContainer">
        <table style="min-width: 250px;">
            <tbody>
                <tr>
                    <td><h3 style="margin: 0px;"><?php esc_html_e( 'Table Press', 'wp-table-builder' ); ?></h3></td>
                    <td>
                        <button class="button button-primary button-large wptb-importFromPlugin" data-wptb-import-plugin="table-press"
                                data-name="<?php esc_attr_e( 'Importing Tables', 'wp-table-builder' ); ?>">
                            <?php esc_html_e( 'Import', 'wp-table-builder' ); ?>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <section id="wptb-importIframeSection">

    </section>

    <div class="wptb-importPBarContainer">
        <div class="wptb-importPBarProgress">
            <div class="wptb-nameProcessInBarProgress"></div>
            <div id="wptb-pBarPercent">
                <span>0%</span>
            </div>
        </div>
    </div>

    <div class="wptb-importedTablesSetting">
        <div class="wptb-importMessage wptb-importedTablesCount"><span>0</span> <?php esc_html_e( 'Tables Imported', 'wp-table-builder' ); ?></div>

        <button class="wptb-importTableReplaceShortcodes button button-primary button-large" style="display: none;"
                data-name="<?php esc_attr_e( 'Replacing Shortcodes', 'wp-table-builder' ); ?>">
            <?php esc_html_e( 'Replace Shortcode', 'wp-table-builder' ); ?>
        </button>

        <div class="wptb-importedTablesShortcodesList">
            <table>
                <thead>
                    <tr>
                        <th><input type="checkbox" name="shortcodesReplace" checked></th>
                        <th><h3>TablePress</h3></th>
                        <th><h3>WP Table Builder</h3></th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>

        <button class="wptb-importTableReplaceShortcodes button button-primary button-large" style="display: none;"
                data-name="<?php esc_attr_e( 'Replacing Shortcodes', 'wp-table-builder' ); ?>">
            <?php esc_html_e( 'Replace Shortcode', 'wp-table-builder' ); ?>
        </button>
    </div>

    <div class="wptb-importedTablesShortcodesReplaced">
        <div class="wptb-importMessage wptb-importedShortcodesReplaceCount"><span>0</span> <?php esc_html_e( 'Shorcodes replaced', 'wp-table-builder' ); ?></div>
    </div>
</div>