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

        if (this.referenceObject !== null) {
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

        /**
         * Get cell element.
         *
         * @return {HTMLElement} cell element
         */
        this.getElement = () => {
            return this.element;
        };

        // create a new cell element if no cellElement argument is given with constructor function
        if (!cellElement) {
            this.element = document.createElement('td');
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
            if (this.referenceObject === null) {
                const valueToApply = this.getSpan(spanType) - value < 0 ? this.getSpan(spanType) : value;

                this.setAttribute(`${spanType}Span`, valueToApply);

                // calculate remaining cells amount to merge in this span type
                this.remainingSpans[spanType] = this.getSpan(spanType) - valueToApply;

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

            const remainingVal = this.referenceObject.remainingSpans[spanType];

            // no space left to put cell
            if (remainingVal === 0) {
                return false;
            }

            const valueToApply = remainingVal - value < 0 ? remainingVal : value;

            const remainingParentSpans = remainingVal - valueToApply;
            this.referenceObject.remainingSpans[spanType] = remainingParentSpans;

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
                            currentCellObject.mergedCells.row.push(referenceCell);
                            this.addToParsed(ri + sr, ci, referenceCell);
                        }
                    }
                    if (spanCol > 1) {
                        for (let sc = 1; sc < spanCol; sc += 1) {
                            const referenceCell = new CellObject(c, currentCellObject);
                            currentCellObject.mergedCells.column.push(referenceCell);
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
                return;
            }

            // get row colors if they are defined as datasets on table element
            const headerDatasetColor = this.tableElement.dataset.wptbHeaderBackgroundColor;
            const evenRowDatasetColor = this.tableElement.dataset.wptbEvenRowBackgroundColor;
            const oddRowDatasetColor = this.tableElement.dataset.wptbOddRowBackgroundColor;

            // header row color
            this.rowColors.header =
                headerDatasetColor !== undefined
                    ? headerDatasetColor
                    : rows[0].style.backgroundColor === ''
                    ? null
                    : rows[0].style.backgroundColor;

            // calculate needed number of rows to get even and odd row background colors
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
         * Append html element to a cached row.
         *
         * @param {HTMLElement} el element
         * @param {number} rowId if of row in row cache
         */
        this.appendElementToRow = (el, rowId) => {
            const cachedRow = this.rowCache[rowId];

            if (el && cachedRow) {
                cachedRow.appendChild(el);
            }
        };

        this.getParsedTable = () => {
            return this.parsedTable;
        };

        this.parseTable();

        return {
            addRow: this.addRow,
            clearTable: this.clearTable,
            getCell: this.getCell,
            appendElementToRow: this.appendElementToRow,
            el: this.tableElement,
            rowColors: this.rowColors,
            getParsedTable: this.getParsedTable,
        };
    }

    // default options for responsive class
    const responsiveClassDefaultOptions = {
        query: '.wptb-preview-table',
    };

    /**
     * Class for handling operations related to responsive functionalities of tables.
     *
     * @class
     * @param {Object} options options object
     */
    function ResponsiveFront(options = {}) {
        // merge default options with user sent options
        this.options = { ...responsiveClassDefaultOptions, ...options };

        this.elements = Array.from(document.querySelectorAll(this.options.query));

        this.elementObjects = this.elements.map((e) => {
            return {
                el: e,
                tableObject: new TableObject(e),
            };
        });

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
            const colCount = parsedTable.reduce((max, row) => Math.max(max, row.length), 0);

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
                        ...oldTable[r][c],
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
         * Build table in its default form.
         *
         * Default form of table is the layout it has in desktop breakpoint.
         *
         * @param {TableObject} tableObj table object
         */
        this.buildDefault = (tableObj) => {
            const parsedTable = tableObj.getParsedTable();
            const rows = parsedTable.length;
            const columns = parsedTable.reduce((max, row) => Math.max(max, row.length), 0);

            for (let r = 0; r < rows; r += 1) {
                const rowId = tableObj.addRow('', true, r).id;
                for (let c = 0; c < columns; c += 1) {
                    const tempCell = tableObj.getCell(r, c, true);

                    // only render cell if a valid cell is found and it is not a reference
                    if (tempCell && tempCell.referenceObject === null) {
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
            if (el && sizeRangeId) {
                el.dataset.wptbBreakpoint = sizeRangeId;
            }
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

        /**
         * Bind rebuilding of tables to window resize event.
         */
        this.bindRebuildToResize = () => {
            // eslint-disable-next-line @wordpress/no-global-event-listener
            window.addEventListener('resize', () => {
                this.rebuildTables();
            });
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
