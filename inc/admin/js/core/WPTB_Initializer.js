var WPTB_Initializer = function () {

    const MIN_COLUMNS = 1,
        MIN_ROWS = 1,
        MAX_COLUMNS = 30,
        MAX_ROWS = 30;

    var tableGenerator = document.body;
    columnsDecrementButton = tableGenerator.getElementsByClassName('wptb-input-number-decrement')[0],
            columnsIncrementButton = tableGenerator.getElementsByClassName('wptb-input-number-increment')[0],
            rowsDecrementButton = tableGenerator.getElementsByClassName('wptb-input-number-decrement')[1],
            rowsIncrementButton = tableGenerator.getElementsByClassName('wptb-input-number-increment')[1],
            columnsInput = document.getElementById('wptb-columns-number'),
            rowsInput = document.getElementById('wptb-rows-number');
    
    columnsDecrementButton.onclick = function () {
            if (columnsInput.value > MIN_COLUMNS) {
                    columnsInput.value--;
            }
    };

    columnsIncrementButton.onclick = function () {
            if (columnsInput.value < MAX_COLUMNS) {
                    columnsInput.value++;
            }
    };

    rowsDecrementButton.onclick = function () {
            if (rowsInput.value > MIN_ROWS) {
                    rowsInput.value--;
            }
    };

    rowsIncrementButton.onclick = function () {
            if (rowsInput.value < MAX_ROWS) {
                    rowsInput.value++;
            }
    };

    document.getElementById( 'wptb-generate-table' ).onclick = function (  ) {
            var columns = document.getElementById('wptb-columns-number').value,
                rows = document.getElementById('wptb-rows-number').value;

            //wptbTableStateSaveManager.tableStateClear();
            
            WPTB_Table(columns, rows);

            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
    }

    WPTB_Helper.registerSections(['elements', 'table_settings', 'options_group']);
    WPTB_Helper.setupSectionButtons();
    WPTB_Helper.activateSection('elements');
    WPTB_Helper.setupSidebarToggle('.wptb-panel-drawer-toggle');
    WPTB_Helper.setupPanelToggleButtons();
};
