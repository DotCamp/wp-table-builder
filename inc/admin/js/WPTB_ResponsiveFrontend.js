/**
 * Responsive class assignment for frontend operations.
 *
 * This file can be used as an UMD.
 */
(function assignToGlobal(key, context, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    } else {
        // eslint-disable-next-line no-param-reassign
        context[key] = factory();
    }
    // eslint-disable-next-line no-restricted-globals
})('WPTB_ResponsiveFrontend', self || global, () => {
    /**
     * Log a message to console.
     *
     * @param {string} message message to be logged
     * @param {string} type console log type (e.g info, warn, error)
     * @throws An error will be given for invalid type value
     */
    function logToConsole(message, type = 'log') {
        if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            if (console[type]) {
                // eslint-disable-next-line no-console
                console[type](`[WPTB]: ${message}`);
            } else {
                throw new Error(`no logging type found with given type value of [${type}]`);
            }
        }
    }

    /**
     * Object implementation for cell element operations.
     * If an empty cellElement parameter is given, a fresh cell element will be created.
     *
     * @param {HTMLElement | null} cellElement cell element
     * @param {null | CellObject} reference main cell object if the current cell is a reference to that cell in cases like merged cells
     * @class
     */
    function CellObject(cellElement, reference = null) {
        // cell element
        this.element = cellElement;

        this.referenceObject = reference;

        // variable for deciding part of merged cells to be visible or not
        this.mergedRenderStatus = true;

        // connected merged cell references
        this.mergedCells = {
            row: [],
            column: [],
        };

        /**
         * Get merged render status.
         *
         * @return {boolean} render status
         */
        this.getMergedRenderStatus = () => {
            return this.mergedRenderStatus;
        };

        /**
         * Set merged render status.
         *
         * @param {boolean} status render status
         */
        this.setMergedRenderStatus = (status) => {
            this.mergedRenderStatus = status;
        };

        /**
         * Add merged cells.
         *
         * @param {string} mergeType merge type
         * @param {CellObject} cellObj cell object instance
         */
        this.addToMergedCells = (mergeType, cellObj) => {
            this.mergedCells[mergeType].push(cellObj);
        };

        /**
         * Determine if current cell is a reference to a main cell.
         *
         * @return {boolean} a reference or not
         */
        this.isReference = () => {
            return this.referenceObject !== null;
        };

        if (this.isReference()) {
            this.element = cellElement.cloneNode(true);
        }

        // modifications object
        // this object will keep track of the modifications that has done to the cell to make sure we can roll them back to their original values
        this.modifications = {};

        // spans object for cell's original merge values
        this.spans = {
            row: 1,
            col: 1,
        };

        this.remainingSpans = {
            row: 0,
            col: 0,
        };

        /**
         * Cache cell element's original span values.
         *
         * @private
         */
        this.cacheSpanValues = () => {
            // eslint-disable-next-line array-callback-return
            Object.keys(this.spans).map((k) => {
                if (Object.prototype.hasOwnProperty.call(this.spans, k)) {
                    const defaultVal = this.spans[k];

                    this.spans[k] = this.element.getAttribute(`${k}Span`) || defaultVal;
                }
            });
        };

        this.cacheSpanValues();

        /**
         * Get original span value of cell object.
         *
         * @param {string} spanType span type, available values are row-column
         * @param {boolean} fromElement instead of original value, get the assigned span value from HTMLElement itself
         * @throws An error will be given for invalid span type
         */
        this.getSpan = (spanType, fromElement = false) => {
            const spanVal = fromElement ? this.getElement().getAttribute(`${spanType}Span`) : this.spans[spanType];
            if (spanVal) {
                return spanVal;
            }
            throw new Error(`no span value found with the given type of [${spanType}]`);
        };

        this.getRemainingSpans = (spanType) => {
            return this.remainingSpans[spanType];
        };

        this.setRemainingSpans = (spanType, value) => {
            this.remainingSpans[spanType] = value;
        };

        /**
         * Get cell element.
         *
         * @return {HTMLElement} cell element
         */
        this.getElement = () => {
            return this.element;
        };

        /**
         * Create a cell element.
         *
         * @private
         * @return {HTMLTableDataCellElement} created cell element
         */
        this.createCellElement = () => {
            return document.createElement('td');
        };

        // create a new cell element if no cellElement argument is given with constructor function
        if (!cellElement) {
            this.element = this.createCellElement();
        }

        /**
         * Add attribute to cell element.
         *
         * This function have the ability to add/remove attributes from cell element.
         * All attributes modified with this function will be cached with their before value for an easy reset on demand.
         *
         * @param {string} attributeKey attribute name in camelCase format, for sub-keys, use dot object notation
         * @param {any} attributeValue attribute value
         * @param {boolean} [append=false] append the value or replace it
         * @param {string} [glue=,] glue to join attribute value if append option is enabled
         */
        this.setAttribute = (attributeKey, attributeValue, append = false, glue = ',') => {
            let defaultVal = this.getElement()[attributeKey];

            // if attribute value is a function or an object, it means we pulled a whole declaration instead of only inline attribute values, in that case, use getAttribute to get only inline values related to that attribute
            if (typeof defaultVal === 'function' || typeof defaultVal === 'object') {
                defaultVal = this.getElement().getAttribute(attributeKey);
            }

            // if there is already a default value defined, use that instead
            if (this.modifications[attributeKey]) {
                defaultVal = this.modifications[attributeKey].default;
            }

            let currentVal = defaultVal;

            // join attributes
            if (append) {
                currentVal += `${currentVal}${glue}${attributeValue}`;
            } else {
                currentVal = attributeValue;
            }

            this.modifications[attributeKey] = {
                value: currentVal,
                default: defaultVal,
            };

            this.getElement()[attributeKey] = currentVal;
        };

        /**
         * Set row/colspan for cell.
         *
         * @param {string} spanType span type
         * @param {number} value value to assign to span
         * @return {boolean} if any space left to render the element
         */
        this.setSpan = (spanType, value) => {
            // working on main cell
            if (!this.isReference()) {
                const valueToApply = this.getSpan(spanType) - value < 0 ? this.getSpan(spanType) : value;

                this.setAttribute(`${spanType}Span`, valueToApply);

                // calculate remaining cells amount to merge in this span type
                this.setRemainingSpans(spanType, this.getSpan(spanType) - valueToApply);

                // set visibility of connected merge group cells to false to not render them since we added necessary span values to main cell which will leak into their position
                for (let mc = 0; mc < valueToApply - 1; mc += 1) {
                    if (this.mergedCells[spanType] && this.mergedCells[spanType][mc]) {
                        this.mergedCells[spanType][mc].setMergedRenderStatus(false);
                    }
                }

                return true;
            }
            // working on reference

            if (!this.getMergedRenderStatus()) {
                return false;
            }

            const remainingVal = this.referenceObject.getRemainingSpans(spanType);

            // no space left to put cell
            if (remainingVal === 0) {
                return false;
            }

            const valueToApply = remainingVal - value < 0 ? remainingVal : value;

            const remainingParentSpans = remainingVal - valueToApply;
            this.referenceObject.setRemainingSpans(spanType, remainingParentSpans);

            this.setAttribute(`${spanType}Span`, valueToApply);

            // change render status of remaining connected merge cells
            if (remainingParentSpans !== 0) {
                const totalConnectedCells = this.referenceObject.mergedCells[spanType].length;
                const startIndex = totalConnectedCells - remainingVal + 1;
                const endIndex = startIndex + valueToApply - 1;

                for (let mc = startIndex; mc < endIndex; mc += 1) {
                    this.mergedCells[spanType][mc].setMergedRenderStatus(false);
                }
            }

            return true;
        };

        /**
         * Reset a modified attribute to its default value
         *
         * @param {string} attributeKey attribute name
         */
        this.resetAttribute = (attributeKey) => {
            if (this.modifications[attributeKey]) {
                this.getElement()[attributeKey] = this.modifications[attributeKey].default;
                this.modifications[attributeKey] = undefined;
            }
        };

        /**
         * Reset all modified attributes of cell element to their default values.
         */
        this.resetAllAttributes = () => {
            // eslint-disable-next-line array-callback-return
            Object.keys(this.modifications).map((k) => {
                if (Object.prototype.hasOwnProperty.call(this.modifications, k)) {
                    this.resetAttribute(k);
                }
            });
        };

        return {
            getElement: this.getElement,
            el: this.element,
            setAttribute: this.setAttribute,
            resetAllAttributes: this.resetAllAttributes,
            getSpan: this.getSpan,
            setSpan: this.setSpan,
            getRemainingSpans: this.getRemainingSpans,
            setRemainingSpans: this.setRemainingSpans,
            isReference: this.isReference,
            addToMergedCells: this.addToMergedCells,
            mergedCells: this.mergedCells,
            setMergedRenderStatus: this.setMergedRenderStatus,
            getMergedRenderStatus: this.getMergedRenderStatus,
        };
    }

    CellObject.spanTypes = { row: 'row', column: 'col' };

    /**
     * Object implementation for table element operations.
     *
     * @param {HTMLElement} tableEl table element
     * @return {Object} instance
     * @class
     */
    function TableObject(tableEl) {
        /**
         * Table element.
         *
         * @private
         * @type {HTMLElement}
         */
        this.tableElement = tableEl;

        /**
         * Parsed table object.
         *
         * @private
         * @type {Array}
         */
        this.parsedTable = [];

        /**
         * An array of created table rows elements that are id'd according to their index in array.
         *
         * @type {Array}
         */
        this.rowCache = [];

        /**
         * Original table elements minus the cells.
         *
         * @type {Object}
         * @private
         */
        this.originals = { rows: [] };

        /**
         * Row colors of original table.
         *
         * @type {{even: string, header: string, odd: string}}
         */
        this.rowColors = {
            header: null,
            even: null,
            odd: null,
        };

        /**
         * Add cell to parsed array.
         *
         * @private
         * @param {number} r row id
         * @param {number} c column id
         * @param {CellObject} cellObject cell object to add to parsed array
         */
        this.addToParsed = (r, c, cellObject) => {
            if (!this.parsedTable[r]) {
                this.parsedTable[r] = [];
            }

            this.parsedTable[r][c] = cellObject;
        };

        /**
         * Assign table cells into row and column numbers.
         *
         * @private
         */
        this.parseTable = () => {
            const rows = Array.from(this.tableElement.querySelectorAll('tr'));

            // filter rows who are marked as ignored
            rows.filter((rowEl) => {
                return rowEl.dataset.wptbResponsiveIgnore !== 'true';
                // eslint-disable-next-line array-callback-return
            }).map((r, ri) => {
                // cache original rows for future use
                this.originals.rows.push(r);

                const cells = Array.from(r.querySelectorAll('td'));

                let currentIndex = 0;
                // eslint-disable-next-line array-callback-return
                cells.map((c, ci) => {
                    const currentCellObject = new CellObject(c);
                    this.addToParsed(ri, currentIndex, currentCellObject);
                    currentIndex += 1;

                    const spanRow = currentCellObject.getSpan(CellObject.spanTypes.row);
                    const spanCol = currentCellObject.getSpan(CellObject.spanTypes.column);

                    if (spanRow > 1) {
                        for (let sr = 1; sr < spanRow; sr += 1) {
                            const referenceCell = new CellObject(c, currentCellObject);
                            currentCellObject.addToMergedCells('row', referenceCell);
                            this.addToParsed(ri + sr, ci, referenceCell);
                        }
                    }
                    if (spanCol > 1) {
                        for (let sc = 1; sc < spanCol; sc += 1) {
                            const referenceCell = new CellObject(c, currentCellObject);
                            currentCellObject.addToMergedCells('column', referenceCell);
                            this.addToParsed(ri, currentIndex, referenceCell);
                            currentIndex += 1;
                        }
                    }
                });
            });
            this.parseRowColors(rows);
        };

        /**
         * Parse row colors of original table for futures uses.
         *
         * @param {Array<HTMLElement>} rows html row elements
         * @private
         */
        this.parseRowColors = (rows) => {
            if (!rows || rows.length <= 0) {
                logToConsole('no rows are found to parse their colors', 'error');
            }

            // get row colors if they are defined as datasets on table element
            const headerDatasetColor = this.tableElement.dataset.wptbHeaderBackgroundColor;
            const evenRowDatasetColor = this.tableElement.dataset.wptbEvenRowBackgroundColor;
            const oddRowDatasetColor = this.tableElement.dataset.wptbOddRowBackgroundColor;

            // header row color
            this.rowColors.header =
                // eslint-disable-next-line no-nested-ternary
                headerDatasetColor !== undefined
                    ? headerDatasetColor
                    : rows[0].style.backgroundColor === ''
                    ? null
                    : rows[0].style.backgroundColor;

            // calculate needed number of rows to get even and odd row background colors
            // eslint-disable-next-line no-nested-ternary
            const rowsNeeded = rows.length / 3 >= 1 ? 0 : rows.length === 1 ? 2 : (rows.length - 1) % 2;

            // create additional rows and add them to table to get their row background colors since table row count may be lower to get even/odd rows
            for (let rn = 0; rn < rowsNeeded; rn += 1) {
                const tempRow = document.createElement('tr');

                this.tableElement.querySelector('tbody').appendChild(tempRow);
                rows.push(tempRow);
            }

            // even & odd row colors
            // dataset colors have priority over colors gathered from computed row styles
            this.rowColors.even = evenRowDatasetColor || getComputedStyle(rows[1]).backgroundColor;
            this.rowColors.odd = evenRowDatasetColor ? oddRowDatasetColor : getComputedStyle(rows[2]).backgroundColor;

            // remove created rows from DOM
            for (let r = 0; r < rowsNeeded; r += 1) {
                rows[rows.length - (r + 1)].remove();
            }
        };

        /**
         * Add a row to the table.
         *
         * @param {Array} classList an array of class names to be added to row
         * @param {boolean} fromOriginals use rows from original table instead of creating a new one
         * @param {number} originalIndex original row index
         */
        this.addRow = (classList, fromOriginals = false, originalIndex = 0) => {
            if (!Array.isArray(classList)) {
                // eslint-disable-next-line no-param-reassign
                classList = [classList];
            }

            const tableBody = this.tableElement.querySelector('tbody');
            let tempRow;

            if (!fromOriginals) {
                const range = document.createRange();
                range.setStart(tableBody, 0);
                // eslint-disable-next-line prefer-destructuring
                tempRow = range.createContextualFragment(`<tr class="${classList.join(' ')}"></tr>`).childNodes[0];
            } else {
                tempRow = this.originals.rows[originalIndex];
            }

            // add row to table body
            tableBody.appendChild(tempRow);

            // cache row for future use
            this.rowCache.push(tempRow);

            return { el: tempRow, id: this.rowCache.length - 1 };
        };

        /**
         * Clear the contents of table element.
         */
        this.clearTable = () => {
            // clear row cache
            this.rowCache = [];

            // clear children of `tbody` element
            this.tableElement.querySelector('tbody').innerHTML = '';
        };

        /**
         * Get row element from cache.
         *
         * @param {number} id row id
         * @return {null|HTMLElement} row element if present or null if not
         */
        this.getRow = (id) => {
            if (this.rowCache[id]) {
                return this.rowCache[id];
            }

            // eslint-disable-next-line no-console
            logToConsole(`no row with id [${id}] found in the cache.`, 'warn');
            return null;
        };

        /**
         * Get maximum number of rows available at table.
         *
         * @return {number} maximum amount of rows
         */
        this.maxRows = () => {
            return this.parsedTable.length;
        };

        /**
         * Get the number of maximum available column count in the table.
         *
         * @param {boolean} mergedHeader if header is merged or not
         * @return {number} maximum available column count
         */
        this.maxColumns = (mergedHeader) => {
            if (mergedHeader) {
                return this.parsedTable[0].length;
            }

            return this.parsedTable.reduce((p, c) => {
                if (c.length > p) {
                    // eslint-disable-next-line no-param-reassign
                    p = c.length;
                }

                return p;
            }, 0);
        };

        /**
         * Get the table cell at specified row-column location.
         *
         * As in arrays, row and column numbering starts from number 0.
         *
         * @param {number} r row number
         * @param {number} c column number
         * @param {boolean} returnObject return object instead of HTMLElement
         * @return {HTMLElement | null | CellObject} element if address is possible, null if not
         */
        this.getCell = (r, c, returnObject = false) => {
            try {
                if (this.parsedTable[r][c]) {
                    if (returnObject) {
                        return this.parsedTable[r][c];
                    }
                    return this.parsedTable[r][c].el;
                }
            } catch (e) {
                // eslint-disable-next-line no-console
                logToConsole(`no cell found at the given address of [${r}-${c}]`, 'warn');
                return null;
            }
            // eslint-disable-next-line no-console
            logToConsole(`no cell found at the given address of [${r}-${c}]`, 'warn');
            return null;
        };

        /**
         * Get cells at a given row.
         *
         * @param {number} rowId row id
         * @param {boolean} returnObj return an array of CellObject instead
         * @return {Array} cells in row
         */
        this.getCellsAtRow = (rowId, returnObj = false) => {
            const cells = [];
            for (let c = 0; c < this.maxColumns(); c += 1) {
                const tempCell = this.getCell(rowId, c, returnObj);
                if (tempCell) {
                    cells.push(tempCell);
                }
            }
            return cells;
        };

        /**
         * Get cells at a given column.
         *
         * @param {number} columnId column id
         * @param {boolean} returnObj return an array of CellObject instead
         * @return {Array} cells in row
         */
        this.getCellsAtColumn = (columnId, returnObj = false) => {
            const cells = [];
            for (let c = 0; c < this.maxColumns(); c += 1) {
                const tempCell = this.getCell(c, columnId, returnObj);
                if (tempCell) {
                    cells.push(tempCell);
                }
            }
            return cells;
        };

        /**
         * Append the cell with given ids to a cached row
         *
         * @param {number} cellRowId cell row id
         * @param {number} cellColumnId cell column id
         * @param {number} rowId id of row in row cache
         */
        this.appendToRow = (cellRowId, cellColumnId, rowId) => {
            const cachedRow = this.getRow(rowId);
            const cell = this.getCell(cellRowId, cellColumnId, true);

            if (cell && cachedRow) {
                cachedRow.appendChild(cell.getElement());
            }
            return cell;
        };

        /**
         * Append html element to a cached row.
         *
         * @param {HTMLElement} el element
         * @param {number} rowId if of row in row cache
         */
        this.appendElementToRow = (el, rowId) => {
            const cachedRow = this.getRow(rowId);

            if (el && cachedRow) {
                cachedRow.appendChild(el);
            }
        };

        /**
         * Add cell object to a cached row.
         *
         * @param {CellObject} cellObj cell object
         * @param {number} rowId row id
         */
        this.appendObjectToRow = (cellObj, rowId) => {
            const cachedRow = this.getRow(rowId);
            if (cellObj && cachedRow) {
                cachedRow.appendChild(cellObj.getElement());
            }
        };

        this.getParsedTable = () => {
            return this.parsedTable;
        };

        this.parseTable();

        return {
            maxRows: this.maxRows,
            maxColumns: this.maxColumns,
            addRow: this.addRow,
            clearTable: this.clearTable,
            getCell: this.getCell,
            appendToRow: this.appendToRow,
            appendElementToRow: this.appendElementToRow,
            appendObjectToRow: this.appendObjectToRow,
            getCellsAtRow: this.getCellsAtRow,
            getCellsAtColumn: this.getCellsAtColumn,
            el: this.tableElement,
            rowColors: this.rowColors,
            getParsedTable: this.getParsedTable,
        };
    }

    // default options for responsive class
    const responsiveClassDefaultOptions = {
        query: '.wptb-preview-table',
        defaultClasses: ['wptb-plugin-responsive-base'],
        bindToResize: false,
    };

    /**
     * Class for handling operations related to responsive functionalities of tables.
     *
     * @class
     * @param {Object} options options object
     */
    function ResponsiveFront(options = {}) {
        // merge default options with user sent options
        // this.options = { ...responsiveClassDefaultOptions, ...options };
        this.options = { ...responsiveClassDefaultOptions, ...options };

        this.elements = Array.from(document.querySelectorAll(this.options.query));

        this.elementObjects = this.elements.map((e) => {
            return {
                el: e,
                tableObject: new TableObject(e),
            };
        });

        /**
         * Whether given element's background is transparent or not.
         *
         * @param {HTMLElement} element html element
         * @return {boolean} transparent or not
         */
        const isBackgroundTransparent = (element) => {
            let status = false;
            if (element.style.backgroundColor) {
                const regexp = new RegExp(/^rgba\(\s?0\s?,\s?0\s?,\s?0\s?,\s?0\s?\)$/g);

                status = element.style.backgroundColor.match(regexp) !== null;
            }

            return status;
        };

        /**
         * Bind rebuilding of tables to window resize event.
         */
        this.bindRebuildToResize = () => {
            // eslint-disable-next-line @wordpress/no-global-event-listener
            window.addEventListener('resize', () => {
                this.rebuildTables();
            });
        };

        /**
         * Get responsive directives of table element.
         *
         * @private
         * @param {HTMLElement} el table element
         * @return {Object | null} JSON representation of the directive element, if not available, null will be returned
         */
        this.getDirective = (el) => {
            const directiveString = el.dataset.wptbResponsiveDirectives;

            if (!directiveString) {
                return null;
            }

            return JSON.parse(atob(directiveString));
        };

        /**
         * Add default classes to rebuilt tables.
         *
         * This classes are added to lay out a base style for the responsive table.
         *
         * @param {HTMLElement} el table element
         */
        this.addDefaultClasses = (el) => {
            el.classList.add(this.options.defaultClasses);
        };

        /**
         * Remove default classes from target table.
         *
         * @param {HTMLElement} el table element
         */
        this.removeDefaultClasses = (el) => {
            el.classList.remove(this.options.defaultClasses);
        };

        /**
         * Scroll operation related adjustments to responsive process.
         *
         * @param {Node} tableElement table element
         * @param {boolean} revertToOriginal revert to original state
         */
        const scrollOperations = (tableElement, revertToOriginal) => {
            const scrollFunctionalityStatus = tableElement.dataset.wptbHorizontalScrollStatus;

            if (scrollFunctionalityStatus) {
                const matrixContainer = tableElement.parentNode;
                if (revertToOriginal) {
                    const storedMaxWidth = tableElement.dataset.wptbTableContainerMaxWidth;

                    matrixContainer.style.width = `${storedMaxWidth}px`;
                } else {
                    matrixContainer.style.width = '';
                }
            }
        };

        /**
         * Rebuild table in auto mode.
         *
         * Main characteristic of auto mode is table is rebuilt by stacking rows/columns on top of each other, leaving minimal effort from user to create a responsive table at breakpoints.
         *
         * @param {HTMLElement} tableEl table element
         * @param {string} sizeRange range id for current screen size
         * @param {Object} autoOption mode options
         * @param {TableObject} tableObj table object
         */
        this.autoBuild = (tableEl, sizeRange, autoOption, tableObj) => {
            // base options
            const direction = autoOption.cellStackDirection[sizeRange];
            // eslint-disable-next-line prefer-destructuring
            const topRowAsHeader = autoOption.topRowAsHeader[sizeRange];
            const cellsPerRow = autoOption.cellsPerRow[sizeRange];

            // new options
            const staticTopRow = autoOption.staticTopRow ? autoOption.staticTopRow[sizeRange] : false;
            const repeatMergedHeader =
                // check for undefined for backward compatibility of older tables
                /* eslint-disable no-nested-ternary */
                autoOption.repeatMergedHeader === undefined || autoOption.repeatMergedHeader[sizeRange] === true
                    ? topRowAsHeader
                        ? autoOption.repeatMergedHeader
                            ? autoOption.repeatMergedHeader[sizeRange]
                            : true
                        : false
                    : false;
            /* eslint-enable no-nested-ternary */

            tableObj.clearTable();

            if (sizeRange === 'desktop') {
                scrollOperations(tableEl, true);
                this.buildDefault(tableObj);
                this.removeDefaultClasses(tableEl);
            } else {
                scrollOperations(tableEl, false);
                this.autoDirectionBuild(
                    tableObj,
                    direction,
                    topRowAsHeader,
                    staticTopRow,
                    cellsPerRow,
                    repeatMergedHeader,
                );
                this.addDefaultClasses(tableEl);
            }
        };

        /**
         * Convert TableObject's parsed data to Cell structure for transformation.
         *
         * @param {TableObject} tableObj table object
         * @return {Array<Array<Object>>} parsed table as Cell[][]
         */
        this.convertTableObjectToCells = (tableObj) => {
            const parsedTable = tableObj.getParsedTable();

            const rowCount = parsedTable.length;
            const colCount = tableObj.maxColumns();

            const tableRec = {};
            const futColInit = {};

            for (let i = 0; i < rowCount; i++) {
                const row = parsedTable[i];
                tableRec[i] = tableRec[i] || {};
                let col = futColInit[i] || 0;
                for (let j = 0; j < row.length; j++) {
                    const cell = row[j];

                    const colSpan = cell.el.colSpan;
                    const rowSpan = cell.el.rowSpan;

                    tableRec[i][col] = {
                        value: cell,
                        rowSpan,
                        colSpan,
                        hidden: false,
                        col: col,
                        row: i,
                        shadow: false,
                        originalRow: i,
                        originalCol: col,
                    };

                    if (colSpan > 1 || rowSpan > 1) {
                        for (let l = 0; l < rowSpan; l++) {
                            for (let k = 0; k < colSpan; k++) {
                                if (l === 0 && k === 0) continue;
                                tableRec[i + l] = tableRec[i + l] || {};
                                tableRec[i + l][col + k] = {
                                    rowSpan: 1,
                                    colSpan: 1,
                                    hidden: true,
                                    col: col + k,
                                    row: i + l,
                                    shadow: false,
                                    originalRow: i + l,
                                    originalCol: col + k,
                                };
                            }
                        }
                    }

                    if (rowSpan > 1 && col === 0) {
                        for (let l = 1; l < rowSpan; l++) {
                            futColInit[i + l] = colSpan;
                        }
                    }

                    col += colSpan;
                }
            }
            const finalTable = [];
            for (let i = 0; i < rowCount; i++) {
                const row = [];
                for (let j = 0; j < colCount; j++) {
                    row.push(tableRec[i][j]);
                }
                finalTable.push(row);
            }
            
            return finalTable;
        };

        /**
         * Transform table according to configuration.
         *
         * @param {Array<Array<Object>>} table parsed table as Cell[][]
         * @param {Object} config transformation configuration
         * @return {Array<Array<Object>>} transformed table
         */
        this.transformTable = (table, config) => {
            const { transpose, repeatFirst, columnCount } = config;
            if (transpose) {
                const newTable = Array.from({ length: table[0].length }, () => []);
                for (let r = 0; r < table[0].length; r++) {
                    for (let c = 0; c < table.length; c++) {
                        newTable[r][c] = table[c][r];
                        const rowSpan = newTable[r][c].rowSpan;
                        const colSpan = newTable[r][c].colSpan;
                        newTable[r][c].rowSpan = colSpan;
                        newTable[r][c].colSpan = rowSpan;
                    }
                }
                table = newTable;
            }

            const oldTable = table;
            table = [];

            for (let r = 0; r < oldTable.length; r++) {
                const row = [];
                for (let c = 0; c < oldTable[r].length; c++) {
                    row.push({
                        ...oldTable[r][c]
                    });
                }
                table.push(row);
            }

            if (columnCount >= table[0].length) {
                return table;
            }

            const heads = {};
            let loopInit = 0;

            const isHeadActive = repeatFirst && table.length > 1;

            if (isHeadActive) {
                let maxColspan = 0;
                loopInit = 1;
                table.forEach((cells, idx) => {
                    const cell = cells[0];
                    heads[idx] = {
                        cell,
                        colspan: cell.colSpan,
                    };
                    maxColspan = Math.max(maxColspan, cell.colSpan);
                });
                if (maxColspan >= columnCount) {
                    return table;
                }
            }

            const subRowOfRow = {};

            for (let r = 0; r < table.length; r++) {
                if (!isHeadActive) {
                    subRowOfRow[r] = { filled: 0, rows: [[]] };
                } else {
                    subRowOfRow[r] = { filled: heads[r].colspan, rows: [[heads[r].cell]] };
                }
            }

            for (let r = 0; r < table.length; r++) {
                const cells = table[r];
                const subRowObj = subRowOfRow[r];
                let subRow = subRowObj.rows[0];
                for (let c = loopInit; c < cells.length; c++) {
                    const cell = cells[c];
                    subRow.push(cell);

                    const colspan = cell.colSpan;
                    const left = columnCount - subRowOfRow[r].filled;
                    const spaceUsed = Math.min(colspan, left);
                    if (spaceUsed === 0) {
                        console.log('Space used is 0');
                    }
                    subRowObj.filled += 1;
                    if (spaceUsed < colspan) {
                        cell.colSpan = spaceUsed;
                        const fillerProps = {
                            ...cell,
                            colSpan: colspan - spaceUsed,
                            rowSpan: cell.rowSpan,
                            hidden: false,
                            shadow: true,
                        };
                        table[r][c + spaceUsed] = fillerProps;
                    }

                    if (subRow.length === columnCount) {
                        subRow = [];
                        subRowObj.filled = 0;
                        subRowObj.rows.push(subRow);
                        if (isHeadActive) {
                            subRowObj.filled = heads[r].colspan;
                            subRow.push(heads[r].cell);
                        }
                    }
                }
            }

            const isEdgeRow = {};
            const newTable = [];

            const subRowCount = subRowOfRow[0].rows.length;
            for (let sr = 0; sr < subRowCount; sr++) {
                for (let r = 0; r < table.length; r++) {
                    const subRow = subRowOfRow[r].rows[sr];
                    if (subRow.length > 1 || !isHeadActive) {
                        newTable.push(subRow);
                    }
                    if (newTable.length % table.length === 0 && newTable.length > 0) {
                        isEdgeRow[newTable.length - 1] = true;
                    }
                }
            }
            return newTable;
        };

        /**
         * Build table from Cell structure.
         *
         * @param {Array<Array<Object>>} tableData transformed table data
         * @param {TableObject} tableObj table object for building
         */
        this.buildTableFromCells = (tableData, tableObj) => {
            console.log(tableObj);
            for (let i = 0; i < tableData.length; i++) {
                const rowObj = tableObj.addRow('wptb-row');
                for (let j = 0; j < tableData[i].length; j++) {
                    const cellData = tableData[i][j];
                    if (cellData.hidden) {
                        continue;
                    }
                    
                    let cellEl = cellData.value?.el;
                    if (!cellEl) {
                        cellEl = document.createElement('td');
                    } else {
                        cellEl = cellEl.cloneNode(true);
                        if (cellData.shadow) {
                            cellEl.innerHTML = '';
                        }
                        let bg = cellEl.style.backgroundColor || cellEl.style.background;
                        if (cellData.originalRow === 0) {
                            bg ||= tableObj.rowColors.header || tableObj.rowColors.odd;
                        } else if (cellData.originalRow % 2 === 0) {
                            bg ||= tableObj.rowColors.even;
                        } else {
                            bg ||= tableObj.rowColors.odd;
                        }
                        cellEl.style.backgroundColor = bg;
                    }
                    cellEl.colSpan = cellData.colSpan;
                    cellEl.rowSpan = cellData.rowSpan;
                    tableObj.appendElementToRow(cellEl, rowObj.id);
                }
            }
        };

        /**
         * Rebuild table with a direction to read cells.
         *
         * Direction in question in here is either by row or column:
         * * row: cells will be read row by row, in each row starting from the first column
         * * column: cells will be read column by column, in each column starting from the first row of the table
         *
         * @param {TableObject} tableObj table object
         * @param {string} direction direction to read cells, possible options [row, column]
         * @param {boolean} topRowAsHeader use top row as header
         * @param {boolean} staticTopRow use top row as static
         * @param {number} cellsPerRow cells per row
         * @param {boolean} repeatMergedHeader repeat merged top header if top row as header option is enabled
         */
        this.autoDirectionBuild = (
            tableObj,
            direction,
            topRowAsHeader = false,
            staticTopRow = false,
            cellsPerRow = 1,
            repeatMergedHeader = true,
        ) => {
            // Build transform configuration
            const transformConfig = {
                transpose: direction !== 'column',
                repeatFirst: topRowAsHeader,
                columnCount: cellsPerRow + (topRowAsHeader ? 1 : 0),
            };

            // Convert TableObject's parsed data to Cell structure for transformation
            const parsedTable = this.convertTableObjectToCells(tableObj);

            // Transform the table according to configuration
            const transformedTable = this.transformTable(parsedTable, transformConfig);

            // Build the new table from transformed cells
            this.buildTableFromCells(transformedTable, tableObj);
        };

        /**
         * Build table with top row assigned as header.
         *
         * @param {TableObject} tableObj table object
         * @param {string} direction cell stack direction, possible options are [row, column]
         * @param {number} itemsPerHeader items bound to each header element
         * @param {boolean} repeatMergedHeader repeat merged header
         */
        this.headerBuild = (tableObj, direction, itemsPerHeader = 1, repeatMergedHeader = true) => {
            const stackedAsColumn = direction === 'column';

            // row count
            const rows = tableObj.maxRows();
            // column count
            const columns = tableObj.maxColumns();

            const rowBorderStyle = '3px solid gray';

            // stack direction is column
            if (stackedAsColumn) {
                // cells at header
                // applying header row color to cells
                tableObj.getCellsAtColumn(0, true).map((h, r) => {
                    h.resetAllAttributes();
                    if (!h.el.style.backgroundColor || isBackgroundTransparent(h.el)) {
                        const colorIndex = r % 2 === 0 ? 'even' : 'odd';
                        h.setAttribute('style', `background-color: ${tableObj.rowColors[colorIndex]}`, true, ';');
                    }
                    return h;
                });

                // Calculate number of groups needed
                const dataColumns = columns - 1; // excluding header column
                const numberOfGroups = Math.ceil(dataColumns / itemsPerHeader);

                // Create groups
                for (let groupIndex = 0; groupIndex < numberOfGroups; groupIndex++) {
                    const startColumn = 1 + groupIndex * itemsPerHeader;
                    const endColumn = Math.min(startColumn + itemsPerHeader, columns);

                    // For each row, create a new row in the output table
                    for (let r = 0; r < rows; r += 1) {
                        const rowObj = tableObj.addRow('wptb-row');

                        // Add header cell (column 0) to each row
                        const headerCell = tableObj.getCell(r, 0, true);
                        if (headerCell && !headerCell.isReference()) {
                            const clonedHeaderCell = headerCell.getElement().cloneNode(true);
                            tableObj.appendElementToRow(clonedHeaderCell, rowObj.id);
                        }

                        // Add data cells for this group
                        for (let c = startColumn; c < endColumn; c += 1) {
                            const cell = tableObj.getCell(r, c, true);
                            if (cell && !cell.isReference()) {
                                // Reset cell attributes
                                cell.resetAllAttributes();
                                cell.setAttribute('style', 'width: 100% !important', true, ';');
                                cell.setAttribute('colSpan', 1);
                                cell.setAttribute('rowSpan', 1);

                                // Apply row color
                                if (!cell.el.style.backgroundColor || isBackgroundTransparent(cell.el)) {
                                    const colorIndex = r % 2 === 0 ? 'even' : 'odd';
                                    cell.setAttribute(
                                        'style',
                                        `background-color: ${tableObj.rowColors[colorIndex]}`,
                                        true,
                                        ';',
                                    );
                                }

                                tableObj.appendElementToRow(cell.getElement(), rowObj.id);
                            }
                        }

                        // Clear row background to let cell colors show
                        rowObj.el.style.backgroundColor = '#ffffff00';
                    }
                }
            } else {
                // stack direction is row
                // number of headers that will be created
                let headerCount = Math.ceil((rows - 1) / itemsPerHeader);

                // in a situation where no cells are bind to header, only render header
                headerCount = headerCount === 0 ? 1 : headerCount;

                let currentOriginalRow = 1;

                for (let hc = 0; hc < headerCount; hc += 1) {
                    for (let c = 0; c < columns; c += 1) {
                        const rowObj = tableObj.addRow('wptb-row');

                        if (hc > 0 && c === 0) {
                            rowObj.el.style.borderTop = rowBorderStyle;
                        }

                        if (repeatMergedHeader || hc === 0) {
                            const headerCellObject = tableObj.getCell(0, c, true);
                            // const clonedHeaderCell = headerCells[c]?.el.cloneNode(true);

                            if (!headerCellObject.isReference()) {
                                const clonedHeaderCell = headerCellObject.el.cloneNode(true);

                                // apply header row color to header cell
                                clonedHeaderCell.style.backgroundColor = `${tableObj.rowColors.header} !important`;
                                tableObj.appendElementToRow(clonedHeaderCell, rowObj.id);

                                if (
                                    !clonedHeaderCell.style.backgroundColor ||
                                    isBackgroundTransparent(clonedHeaderCell)
                                ) {
                                    clonedHeaderCell.style.backgroundColor = `${
                                        getComputedStyle(rowObj.el).backgroundColor
                                    }`;
                                    if (clonedHeaderCell.style.backgroundColor)
                                        clonedHeaderCell.style.backgroundColor += ' !important';
                                }

                                if (!repeatMergedHeader) {
                                    clonedHeaderCell.setAttribute('rowSpan', columns * headerCount);
                                } else {
                                    clonedHeaderCell.setAttribute('rowSpan', clonedHeaderCell.getAttribute('colSpan'));
                                }

                                clonedHeaderCell.setAttribute('colSpan', 1);
                            }
                        }

                        // clear out row color to override row color with cell colors
                        rowObj.el.style.backgroundColor = '#ffffff00';

                        for (let r = 0; r < itemsPerHeader; r += 1) {
                            if (currentOriginalRow + r >= rows) {
                                break;
                            }

                            // const currentCell = tableObj.appendToRow(currentOriginalRow + r, c, rowObj.id);
                            const currentCell = tableObj.getCell(currentOriginalRow + r, c, true);

                            if (currentCell) {
                                currentCell.resetAllAttributes();

                                let cellAddStatus = true;

                                const rowSpan = currentCell.getSpan(CellObject.spanTypes.row);
                                const colSpan = currentCell.getSpan(CellObject.spanTypes.column);

                                if (rowSpan > 1 || colSpan > 1) {
                                    const remainingItems = itemsPerHeader - r;

                                    const currentRowSpan = Math.min(rowSpan, remainingItems);

                                    cellAddStatus = currentCell.setSpan(CellObject.spanTypes.row, currentRowSpan);

                                    const rS = currentCell.el.getAttribute('rowSpan');
                                    const cS = currentCell.el.getAttribute('colSpan');

                                    // switch span values
                                    currentCell.setAttribute('rowSpan', cS);
                                    currentCell.setAttribute('colSpan', rS);

                                    currentCell.setMergedRenderStatus(true);
                                }
                                if (cellAddStatus) {
                                    // color index for the cell, this will be used to reflect table row colors to cells. currently, grouping up the same items with the same color code
                                    let colorIndex = (currentOriginalRow + r + hc) % 2 === 0 ? 'even' : 'odd';

                                    // for better visuals and distinction for tables with 1 item per header, using this calculation for color index
                                    if (itemsPerHeader === 1) {
                                        colorIndex = currentOriginalRow % 2 === 0 ? 'even' : 'odd';
                                    }

                                    if (
                                        !currentCell.el.style.backgroundColor ||
                                        isBackgroundTransparent(currentCell.el)
                                    ) {
                                        currentCell.setAttribute(
                                            'style',
                                            `background-color: ${tableObj.rowColors[colorIndex]}`,
                                            true,
                                            ';',
                                        );
                                    }
                                    tableObj.appendObjectToRow(currentCell, rowObj.id);
                                }
                            }
                        }
                    }
                    currentOriginalRow += itemsPerHeader;
                }
            }
        };

        /**
         * Build table in its default form.
         *
         * Default form of table is the layout it has in desktop breakpoint.
         *
         * @param {TableObject} tableObj table object
         */
        this.buildDefault = (tableObj) => {
            const rows = tableObj.maxRows();
            const columns = tableObj.maxColumns();

            for (let r = 0; r < rows; r += 1) {
                const rowId = tableObj.addRow('', true, r).id;
                for (let c = 0; c < columns; c += 1) {
                    const tempCell = tableObj.getCell(r, c, true);

                    // only render cell if a valid cell is found and it is not a reference
                    if (tempCell && !tempCell.isReference()) {
                        // reset all modified attributes of cell to their default values
                        tempCell.resetAllAttributes();
                        tableObj.appendElementToRow(tempCell.getElement(), rowId);
                    }
                }
            }
        };

        /**
         * Calculate range id for given size value.
         *
         * @param {number} val value
         * @param {Object} stops an object containing stop ids as keys and respective sizes as values
         * @return {string} range id
         */
        this.calculateRangeId = (val, stops) => {
            // eslint-disable-next-line prefer-destructuring
            const sortedStops = Object.keys(stops).sort((a, b) => stops[a].width - stops[b].width);

            let rangeId = sortedStops[0];

            // eslint-disable-next-line array-callback-return
            sortedStops.map((s) => {
                if (val >= stops[s].width) {
                    rangeId = s;
                }
            });

            return rangeId;
        };

        /**
         * Add html related indicators for responsive operation.
         *
         * @param {Node} tableElement target table element
         * @param {string} breakpointId current breakpoint for responsive process
         */
        const htmlResponsiveIndicators = (tableElement, breakpointId) => {
            if (tableElement && breakpointId) {
                // eslint-disable-next-line no-param-reassign
                tableElement.dataset.wptbBreakpoint = breakpointId;
            }
        };

        /**
         * Status of responsive enabled property.
         *
         * This property is the main switch whether to continue responsive operations or not. For breakpoint related enabled statuses, related properties should be checked
         *
         * @param {Object} directive table responsive directive
         * @return {boolean} responsive enabled status
         */
        const isMainResponsiveEnabled = (directive) => {
            return directive ? directive.responsiveEnabled : false;
        };

        /**
         * Whether current responsive breakpoint enabled for responsive operations.
         *
         * @param {Object} directive table responsive directive
         * @param {number} size relative size
         */
        const isCurrentBreakpointEnabled = (directive, size) => {
            const sizeRangeId = this.calculateRangeId(size, directive.breakpoints);

            if (sizeRangeId === 'desktop') {
                return false;
            }

            const mode = directive.responsiveMode;
            const modeOptions = directive.modeOptions[mode];

            return modeOptions.disabled && !modeOptions.disabled[sizeRangeId];
        };

        /**
         * Rebuild table according to its responsive directives.
         *
         * @private
         * @param {HTMLElement} el table element
         * @param {number} size size in pixels
         * @param {TableObject} tableObj table object instance
         * @throws An error will be given for invalid mode name
         */
        this.rebuildTable = (el, size, tableObj) => {
            const directive = this.getDirective(el);
            if (!directive) {
                return;
            }
            if (!isMainResponsiveEnabled(directive)) {
                // this.buildDefault(tableObj);
                return;
            }

            const mode = directive.responsiveMode;

            // main build logic for different responsive modes should be named in the format of `{modeName}Build` to automatically call the associated function from here
            const buildCallable = this[`${mode}Build`];

            if (!size) {
                // eslint-disable-next-line no-param-reassign
                size = el.getBoundingClientRect().width;
            }

            const sizeRangeId = this.calculateRangeId(size, directive.breakpoints);

            if (!buildCallable) {
                throw new Error(`No build mode named as [${mode}] found.`);
            }
            const modeOptions = directive.modeOptions[mode];

            // if current breakpoint is disabled, render default table instead
            if (!isCurrentBreakpointEnabled(directive, size)) {
                tableObj.clearTable();
                this.buildDefault(tableObj);
                this.removeDefaultClasses(el);
            } else {
                buildCallable.call(this, el, sizeRangeId, modeOptions, tableObj);
            }

            // eslint-disable-next-line no-undef
            WPTB_RecalculateIndexes(el);
            const tabEvent = new CustomEvent('table:rebuilt', {
                detail: {
                    sizeRangeId,
                    topRowAsHeader: directive.modeOptions[mode].topRowAsHeader,
                },
            });
            el.dispatchEvent(tabEvent);

            // add html indicators to target table
            htmlResponsiveIndicators(el, sizeRangeId);
        };

        /**
         * Calculate inner size which will be used to decide breakpoint operations.
         *
         * @param {HTMLTableElement} tableElement table element
         * @return {number} inner size width
         */
        const calculateInnerSize = (tableElement) => {
            let innerSize = document.body.clientWidth;

            const directives = this.getDirective(tableElement);

            // calculate size according to relative width directive
            if (directives && directives.relativeWidth) {
                switch (directives.relativeWidth) {
                    case 'window':
                        // eslint-disable-next-line no-param-reassign
                        innerSize = document.body.clientWidth;
                        break;
                    case 'container':
                        // get the size of the container table is in
                        // eslint-disable-next-line no-param-reassign
                        innerSize = tableElement.parentNode.parentNode.parentNode.clientWidth;
                        break;
                    default:
                        // eslint-disable-next-line no-param-reassign
                        innerSize = document.body.clientWidth;
                        break;
                }
            }

            return innerSize;
        };

        /**
         * Rebuild tables with the given screen size.
         *
         * @param {number} size screen size
         */
        this.rebuildTables = (size) => {
            // eslint-disable-next-line array-callback-return
            this.elementObjects.map((o) => {
                let innerSize = size;
                if (!size) {
                    // eslint-disable-next-line no-param-reassign
                    innerSize = calculateInnerSize(o.el);
                }
                this.rebuildTable(o.el, innerSize, o.tableObject);
            });
        };

        /**
         * Get range id for target table.
         *
         * @param {HTMLTableElement} tableElement target table element
         */
        this.calculateRangeIdFromTable = (tableElement) => {
            const directives = this.getDirective(tableElement);
            const innerSize = calculateInnerSize(tableElement);

            return this.calculateRangeId(innerSize, directives.breakpoints);
        };

        /**
         * Check if current breakpoint is enabled for responsive operations.
         *
         * @param {HTMLTableElement} tableElement table element
         */
        this.isResponsiveEnabledForCurrentBreakpoint = (tableElement) => {
            const tableDirectives = this.getDirective(tableElement);

            return (
                tableDirectives &&
                isMainResponsiveEnabled(tableDirectives) &&
                isCurrentBreakpointEnabled(tableDirectives, calculateInnerSize(tableElement))
            );
        };

        if (this.options.bindToResize) {
            this.bindRebuildToResize();
        }

        /**
         * Get cached table element object.
         *
         * @param {number} tableId table id to look for
         * @return {null | Object} table element object
         */
        this.getTableElementObject = (tableId) => {
            const [filteredObjects] = this.elementObjects.filter(({ el }) => {
                const matrixWrapper = el.parentNode;

                const regex = new RegExp(/^wptb-table-id-(\d+)$/);
                const matches = regex.exec(matrixWrapper.getAttribute('id'));

                return matches && matches[1] && Number.parseInt(matches[1], 10) === tableId;
            });

            return filteredObjects;
        };

        /**
         * Hide/show target row element for responsive calculations.
         *
         * @param {HTMLTableRowElement} rowElement row element
         * @param {boolean} status status
         */
        this.markRowForResponsive = (rowElement, status) => {
            // eslint-disable-next-line no-param-reassign
            rowElement.dataset.wptbResponsiveIgnore = JSON.stringify(status);
        };

        return {
            rebuildTables: this.rebuildTables,
            rebuildTable: this.rebuildTable,
            getDirective: this.getDirective,
            calculateRangeId: this.calculateRangeId,
            calculateRangeIdFromTable: this.calculateRangeIdFromTable,
            isResponsiveEnabledForCurrentBreakpoint: this.isResponsiveEnabledForCurrentBreakpoint,
            getTableElementObject: this.getTableElementObject,
            markRowForResponsive: this.markRowForResponsive,
            calculateInnerSize,
            TableObject,
        };
    }

    return ResponsiveFront;
});
