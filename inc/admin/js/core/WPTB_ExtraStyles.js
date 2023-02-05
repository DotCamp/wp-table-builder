/**
 * Extra styles module to add custom css rules defined for individual tables.
 */
(function UMD(key, context, factory) {
    if (typeof module !== "undefined" && typeof exports === "object") {
        module.exports = factory();
    } else {
        // eslint-disable-next-line no-param-reassign
        context[key] = factory();
    }
    // eslint-disable-next-line no-restricted-globals
})("WPTB_ExtraStyles", self || global, () => {
    /**
     * Extra styles frontend manager.
     *
     * This component will be responsible for adding and maintaining extra styles defined for tables.
     *
     * @class
     */
    // eslint-disable-next-line camelcase
    function WPTB_ExtraStyles() {
        /**
         * Extra styles operation modes
         *
         * @type {Object}
         */
        this.modes = {
            builder: "builder",
            frontEnd: "frontEnd",
            block: "block",
        };

        /**
         * Base document for DOM operations.
         *
         * @type {Document}
         */
        this.baseDocument = document;

        /**
         * Current mode extra styles are operating on.
         *
         * @type {string}
         */
        this.currentMode = this.modes.builder;

        /**
         * General table styles.
         *
         * @type {string}
         */
        this.generalStyles = "";

        /**
         * HTML queries for table element in different plugin modes
         *
         * @type {Object}
         */
        const tableQueries = {
            [this.modes.builder]: ".wptb-table-setup .wptb-preview-table",
            [this.modes.block]: ".wptb-block-table-setup .wptb-preview-table",
            [this.modes.frontEnd]: ".wptb-table-container .wptb-preview-table",
        };

        /**
         * Format styles.
         *
         * @param {string} styles styles
         * @return {string} formatted styles
         */
        const formatStyles = (styles) => {
            // remove all newlines, comments and '!important' from style string to make it a one liner
            const cleaned = styles.replaceAll(
                /(\r?\n)|(\/\*.+?\*\/)|(\s*!important)/g,
                ""
            );

            // add '!important' to all rules to override default style rules
            return cleaned.replaceAll(";", " !important;");
        };

        /**
         * Reform style rules so they will only affect given table id.
         *
         * @param {number} prefix prefix string that will be added to all rules
         * @param {string} extraStyles extra styles
         * @return {string} new style properties prefixed with table id class
         */
        const prefixStyleRules = (prefix, extraStyles) => {
            // reformat styles into a suitable form for our regexp operations
            const formattedStyles = formatStyles(extraStyles);

            const splitStyles = formattedStyles.split("}");
            const prefixedStylesArray = [];

            // eslint-disable-next-line array-callback-return
            splitStyles.map((split) => {
                const regExp = new RegExp(/(.+?)\{/g);
                const matches = regExp.exec(split);

                if (matches) {
                    if (prefix === matches[1].trim()) {
                        prefixedStylesArray.push(split);
                    } else {
                        prefixedStylesArray.push(
                            split.replace(matches[1], `${prefix} ${matches[1]}`)
                        );
                    }
                }
            });

            return `${prefixedStylesArray.join("}")}}`;
        };

        /**
         * Apply general styles to document.
         *
         * @param {string} generalStyles general style rules
         * @param {Node} baseElement element to use as base
         */
        const applyGeneralStyles = (generalStyles, baseElement = null) => {
            const generalStylesheet = document.createElement("style");
            generalStylesheet.type = "text/css";
            generalStylesheet.id = "wptb-general-styles";

            if (!baseElement) {
                const head =
                    this.currentMode === this.modes.block
                        ? this.baseDocument
                        : this.baseDocument.querySelector("head");

                head.appendChild(generalStylesheet);
            } else {
                baseElement.insertAdjacentElement(
                    "beforebegin",
                    generalStylesheet
                );
            }
            const prefixedStyleRules = prefixStyleRules(
                generalStyles.parentPrefix,
                generalStyles.styles
            );
            generalStylesheet.appendChild(
                document.createTextNode(prefixedStyleRules)
            );
        };

        /**
         * Apply defined extra styles for given table element.
         *
         * @param {Element} tableElement table element
         */
        const applyExtraStyle = (tableElement) => {
            const extraStylesRaw = tableElement.dataset.wptbExtraStyles;
            const styleIdPrefix = "wptb-extra-styles-";

            if (extraStylesRaw) {
                const extraStyles = atob(extraStylesRaw);

                const [, tableId] = tableElement
                    .getAttribute("class")
                    .match(
                        /wptb-element-main-table_setting-(?:startedid-)?(\d+)/
                    );

                const styleId = styleIdPrefix + tableId;

                const head = this.baseDocument.querySelector("head");

                // since stylesheets are created for frontend only once at startup, checking document head for any created style object will work even with theme disabled tables which at builder, they are not inside a shadow-root
                let styleElement = head?.querySelector(`#${styleId}`);

                // if no style element is found, create one
                if (!styleElement) {
                    styleElement = document.createElement("style");
                    styleElement.type = "text/css";
                    styleElement.id = styleId;

                    const isThemeStylesDisabled =
                        tableElement.dataset.disableThemeStyles;

                    // if theme styles are disabled, it means our table is residing inside a shadow-root, place style element inside shadow-root instead of document head
                    if (
                        (isThemeStylesDisabled &&
                            this.currentMode === this.modes.frontEnd) ||
                        this.currentMode === this.modes.block
                    ) {
                        tableElement.insertAdjacentElement(
                            "beforebegin",
                            styleElement
                        );
                        if (
                            this.currentMode === this.modes.frontEnd &&
                            this.generalStyles
                        ) {
                            applyGeneralStyles(
                                this.generalStyles,
                                tableElement
                            );
                        }
                    } else {
                        head.appendChild(styleElement);
                    }
                }
                const uniqueClass = `.wptb-element-main-table_setting-${tableId}`;
                // reform style rules so they will only affect the table they are assigned to
                const prefixedStyles = prefixStyleRules(
                    uniqueClass,
                    extraStyles
                );

                // remove previous styles with updated ones
                styleElement.innerHTML = "";
                styleElement.appendChild(
                    document.createTextNode(prefixedStyles)
                );
            }
        };

        /**
         * Apply extra styles to all available tables on DOM.
         *
         * @param {string} mode operation mode to apply styles
         * @param {string} generalStyles general style rules
         * @param {Object} baseDocument base document for DOM operations
         */
        this.applyStyles = (
            mode = this.modes.frontEnd,
            generalStyles = null,
            baseDocument = document
        ) => {
            this.baseDocument = baseDocument;
            this.currentMode = mode;
            this.generalStyles = generalStyles;

            const allTables = Array.from(
                this.baseDocument.querySelectorAll(tableQueries[mode])
            );

            if (allTables) {
                allTables.map(applyExtraStyle);
            }

            // only apply general styles on client frontend if any general styles are defined
            if (
                (mode === this.modes.frontEnd || mode === this.modes.block) &&
                generalStyles
            ) {
                applyGeneralStyles(generalStyles);
            }
        };
    }

    // send a singleton instance of manager
    return new WPTB_ExtraStyles();
});
