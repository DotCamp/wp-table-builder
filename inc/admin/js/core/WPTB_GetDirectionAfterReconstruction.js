/**
 *
 * @param {HTMLElement} table
 * @param {string} typeFirst
 * @param {strinig} typeSecond
 * @param {func} workFunction
 * @param {object} responsiveFront
 */
var WPTB_GetDirectionAfterReconstruction = function (table, typeFirst, typeSecond, verticalProp, responsiveFront) {

    let itemsPerHeader = 0;
    let tableMaxCols = table.maxCols;
    const switchMode = {};
    let type = [];
    if (responsiveFront && responsiveFront.getDirective(table)) {
        switchMode.switch = function (e) {
            const directives = responsiveFront.getDirective(table)

            let sizeRangeId = 'desktop';
            if (e && e.detail) {
                sizeRangeId = e.detail.sizeRangeId;
            }
            type = [typeFirst, 1];
            if (sizeRangeId !== 'desktop') {
                if (directives.hasOwnProperty('modeOptions')) {
                    const mode = directives.responsiveMode;
                    const modeOptions = directives.modeOptions[mode];

                    if (
                        modeOptions.hasOwnProperty('topRowAsHeader') &&
                        modeOptions.topRowAsHeader.hasOwnProperty(sizeRangeId) &&
                        modeOptions.topRowAsHeader[sizeRangeId]
                    ) {
                        if (
                            modeOptions.hasOwnProperty('cellStackDirection') &&
                            modeOptions.cellStackDirection.hasOwnProperty(sizeRangeId)
                        ) {
                            if (modeOptions.cellStackDirection[sizeRangeId] === 'row') {
                                type = [typeSecond, 2];
                                itemsPerHeader = tableMaxCols - 1;
                            } else if (modeOptions.cellStackDirection[sizeRangeId] === 'column') {
                                if (modeOptions.hasOwnProperty('cellsPerRow')) {
                                    itemsPerHeader = modeOptions.cellsPerRow[sizeRangeId];
                                }
                            }
                        }
                    } else {
                        itemsPerHeader = 0;
                    }
                }
            } else {
                itemsPerHeader = 0;
            }
            return { type, itemsPerHeader }
        };
    } else {
        switchMode.switch = function (e) {
            type = [typeFirst, 1];
            if (table.classList.contains('wptb-mobile-view-active')) {
                if (table.classList.contains('wptb-table-preview-head')) {
                    type = [typeSecond, 2];
                    if (type === verticalProp) {
                        itemsPerHeader = tableMaxCols - 1;
                    }
                }
                let newTable = table.parentNode.parentNode.querySelector('.wptb-preview-table-mobile');
                return { type, itemsPerHeader, newTable };
            }

            return { type, itemsPerHeader }
        };
    }

    return switchMode;
}
