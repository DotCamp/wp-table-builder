<?php

use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

/**
 * Table Import Page
 */

?>

<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />

<div class="wptb-importWrap" style="display: none;">
    <h2><?php esc_html_e( 'Import Tables from CSV', 'wp-table-builder' ); ?></h2>
    <section id="wptb-importFormWrap">
        <form id="wptb-importForm" enctype='multipart/form-data' method='post'>
            <p>
                <?php esc_html_e( 'Here you can import tables from a CSV file. Select the file you want to import, then click on Next.', 'wp-table-builder' ); ?>
            </p>

            <div>
                <input type="file" name='wptb-importFile' id="wptb-importFile" required/>
            </div>
            <select id="wptb-csvDelimiter" name="wptb-csvDelimiter">
                <option value=";">; (semicolon)</option>
                <option value=",">, (comma)</option>
                <option value="tab">\t (tabulator)</option>
            </select>
            <div>
                <input type="submit" name='wptb-importSubmit' class="button button-primary button-large" id="wptb-importSubmit" value="Import" />
            </div>

            <?php if ( isset( $_POST['wptb_import_submit'] ) ) : ?>
                <p style="font-size: 16px; color: red"><?php esc_html_e( 'File type not allowed.', 'wp-table-builder' ); ?></p>
            <?php endif; ?>
            <div class="wptb-importFormLoader wptb-loader" style="display:none"></div>
        </form>
    </section>
</div>
<!--    <hr>-->
<div class="wptb-importWrap">
    <h2><?php esc_html_e( 'Import Tables from other Wordpress plugins', 'wp-table-builder' ); ?></h2>
    <div class="wptb-importFromPluginsContainer">
        <table style="min-width: 500px;">
            <tbody>
                <tr>
                    <td><h3 style="margin: 0px;"><?php esc_html_e( 'Table Press', 'wp-table-builder' ); ?></h3></td>
                    <td>
                        <input id="wptb-importTableResponsive" type="checkbox" name="wptb-importTableResponsive">
                        <label for="wptb-importTableResponsive" >Make Table Responsive</label>
                    </td>
                    <td>
                        <input id="wptb-topRowAsHeader" type="checkbox" name="wptb-topRowAsHeader">
                        <label for="wptb-topRowAsHeader">Top Row As Header</label>
                    </td>
                    <td>
                        <button class="button button-primary button-large wptb-importFromPlugin" data-wptb-import-plugin="table-press">
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
            <div id="wptb-pBarPercent">
                <span>0%</span>
            </div>
        </div>
    </div>

    <div class="wptb-importedTablesSetting">
        <div class="wptb-importMessage wptb-importedTablesCount"><span>0</span> <?php esc_html_e( 'Tables Imported', 'wp-table-builder' ); ?></div>
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
        <button id="wptb-importTableReplaceShortcodes" class="button button-primary button-large" style="display: none;">
            <?php esc_html_e( 'Replace', 'wp-table-builder' ); ?>
        </button>
    </div>

    <div class="wptb-importedTablesShortcodesReplaced">
        <div class="wptb-importMessage wptb-importedShortcodesReplaceCount"><span>0</span> <?php esc_html_e( 'Shorcodes replaced', 'wp-table-builder' ); ?></div>
    </div>
</div>