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

    // columnsDecrementButton.onclick = function () {
    //         if (columnsInput.value > MIN_COLUMNS) {
    //                 columnsInput.value--;
    //         }
    // };
    //
    // columnsIncrementButton.onclick = function () {
    //         if (columnsInput.value < MAX_COLUMNS) {
    //                 columnsInput.value++;
    //         }
    // };
    //
    // rowsDecrementButton.onclick = function () {
    //         if (rowsInput.value > MIN_ROWS) {
    //                 rowsInput.value--;
    //         }
    // };
    //
    // rowsIncrementButton.onclick = function () {
    //         if (rowsInput.value < MAX_ROWS) {
    //                 rowsInput.value++;
    //         }
    // };

    // document.getElementById( 'wptb-generate-table' ).onclick = function (  ) {
    //         var columns = document.getElementById('wptb-columns-number').value,
    //             rows = document.getElementById('wptb-rows-number').value;
    //
    //         //wptbTableStateSaveManager.tableStateClear();
    //
    //         WPTB_Table(columns, rows);
    //
    //         let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
    //         wptbTableStateSaveManager.tableStateSet();
    // }

    // register and setup section buttons
    WPTB_Helper.registerSections(['elements', 'table_settings', 'cell_settings', 'options_group' , 'table_responsive_menu', 'manage_cells', 'background_menu']);
    WPTB_Helper.setupSectionButtons();

    // activate elements section for startup
    WPTB_Helper.activateSection('elements');

    // side bar toggle setup
    WPTB_Helper.setupSidebarToggle('.wptb-panel-toggle-section .wptb-panel-drawer-icon');

    // setup panel sections that have the ability to be toggled on/off
    WPTB_Helper.setupPanelToggleButtons();

    // setup responsive menu both at left and builder panel
    new WptbResponsive('table_responsive_menu', 'wptbResponsiveApp', '.wptb-builder-content');

    // get builder section from url parameter for easy switch at page load
    WPTB_Helper.getSectionFromUrl();

    // automatically show element controls when dropped to table
    WPTB_Helper.showControlsOnElementMount();

    // show elements list menu on left panel on removing elements from table
    WPTB_Helper.showElementsListOnRemove();

    // block tinyMCE from activation at manage cells menu
	WPTB_Helper.blockTinyMCE();

    // initialize header toolbox
    new WPTB_HeaderToolbox('.wptb-plugin-header-toolbar').init();

    // redirect active menu to elements after closing manage cells menu
    document.addEventListener('wp-table-builder/table-edit-mode/closed', () => {
        WPTB_Helper.activateSection('elements');
    })

    WPTB_Helper.calledByBlock();

    // call what-is-new component
    WPTB_ControlsManager.callControlScript('WhatIsNew');

    // initialize notification manager
    WPTB_NotificationManager.init();

    // call table embed
    WPTB_ControlsManager.callControlScript('TableEmbed', 'wptb-embed-modal');

	// start up extra styles for builder and make connections to necessary hooks
	document.addEventListener('wptb:table:generated', () => {
		WPTB_ExtraStyles.applyStyles(WPTB_ExtraStyles.modes.builder);

		// subscribe to table settings changes to update extra styles
		WPTB_ControlsManager.subscribeToControl(
			'extraStyles',
			'extraTableStyles',
			() => {
				WPTB_ExtraStyles.applyStyles(WPTB_ExtraStyles.modes.builder);
			},
			true
		);
	});

    // call table embed
    WPTB_ControlsManager.callControlScript('SaveButton', 'saveButton');

    // @deprecated
    // // add scroll operation calculations to window
    // new WPTB_RowMove().attachScrollOperationCalculations();
};
