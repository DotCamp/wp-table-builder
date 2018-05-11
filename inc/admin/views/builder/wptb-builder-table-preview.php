<?php

/**
 * Table Structure Preview
 */

?>

    <style>

        .wptb-preview-table {
            margin-top: 30px;
            max-width: 880px;
            width: 100%
        }

        td:empty::before {
            content: 'Cell';
            display: block;
            padding: 15px;
            font-weight: normal;
            font-size: 80%;
            text-align: center;
        }

        td:empty {
            border: 1px dashed #969fa6;
        }

        .wptb-table-head td:empty::before {
            content: 'Header';
        }
    </style>
    
    <table class="wptb-preview-table">
        <thead>
            <tr class="wptb-table-head">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>