/**
 * Table background options menu.
 */
import Vue from "vue";
import { __ } from "@wordpress/i18n";
import merge from "deepmerge";
import TableBackgroundMenu from "../containers/TableBackgroundMenu";
import createStore from "../stores/backgroundMenu";
import { getMainBuilderTable } from "../functions";

export default {
    name: "BackgroundMenu",
    handler: (uniqueId) => {
        const extraStoreOptions = {
            state: {
                proStatus: WPTB_Store.get("proStatus"),
                strings: {
                    generalRow: __(
                        "general row color options",
                        "wp-table-builder"
                    ),
                    evenRow: __("even row background", "wp-table-builder"),
                    oddRow: __("odd row background", "wp-table-builder"),
                    headerBg: __("header background", "wp-table-builder"),
                    evenRowHover: __(
                        "even row hover background",
                        "wp-table-builder"
                    ),
                    oddRowHover: __(
                        "odd row hover background",
                        "wp-table-builder"
                    ),
                    headerHoverBg: __(
                        "header hover background",
                        "wp-table-builder"
                    ),
                    customSelection: __(
                        "custom selection color options",
                        "wp-table-builder"
                    ),
                    selectedCell: __(
                        "selected cell background",
                        "wp-table-builder"
                    ),
                    selectedRow: __(
                        "selected row background",
                        "wp-table-builder"
                    ),
                    selectedColumn: __(
                        "selected column background",
                        "wp-table-builder"
                    ),
                    mixedColumnColorMessage: __(
                        "There are cells with different color values on this column, applying column wide color values will override those.",
                        "wp-table-builder"
                    ),
                    emptySelectionMessage: __(
                        "Select a row/column/cell to change their background properties.",
                        "wp-table-builder"
                    ),
                    customColorSelectionFeatureName: __(
                        "Individual cell/row/column color",
                        "wp-table-builder"
                    ),
                    hoverBgFeatureName: __(
                        "Row hover background color",
                        "wp-table-builder"
                    ),
                },
            },
        };

        /**
         * Parse various store state values from table element.
         *
         * @param {HTMLElement} tableElement table element
         */
        function parseStateFromTable(tableElement) {
            const parsedFromTable = {
                options: {
                    general: {},
                },
            };

            // if no dataset is defined, use empty string to indicate an empty color for color picker
            const parsedGeneral = {
                headerBg: tableElement.dataset.wptbHeaderBackgroundColor || "",
                evenBg: tableElement.dataset.wptbEvenRowBackgroundColor || "",
                oddBg: tableElement.dataset.wptbOddRowBackgroundColor || "",
                headerHoverBg:
                    tableElement.dataset.wptbHeaderHoverBackgroundColor || "",
                evenHoverBg:
                    tableElement.dataset.wptbEvenRowHoverBackgroundColor || "",
                oddHoverBg:
                    tableElement.dataset.wptbOddRowHoverBackgroundColor || "",
            };

            parsedFromTable.options.general = Object.keys(parsedGeneral).reduce(
                (carry, item) => {
                    if (
                        Object.prototype.hasOwnProperty.call(
                            parsedGeneral,
                            item
                        )
                    ) {
                        const currentValue = parsedGeneral[item];
                        if (currentValue !== null && currentValue !== "") {
                            // eslint-disable-next-line no-param-reassign
                            carry[item] = currentValue;
                        }
                    }

                    return carry;
                },
                {}
            );

            return parsedFromTable;
        }

        extraStoreOptions.state = merge(
            extraStoreOptions.state,
            parseStateFromTable(getMainBuilderTable())
        );

        const store = createStore(extraStoreOptions);

        // make component store available for other js managers
        WPTB_BackgroundMenu.addStore(store);

        new Vue({
            store,
            components: { TableBackgroundMenu },
            template: "<table-background-menu></table-background-menu>",
        }).$mount(`#${uniqueId}`);
    },
};
