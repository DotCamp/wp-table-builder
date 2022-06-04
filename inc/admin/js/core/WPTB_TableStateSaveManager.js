const WPTB_TableStateSaveManager = function () {
	this.tableStateSet = (generate) => {
		if (generate && window.wptbTableStateSaving && Array.isArray(window.wptbTableStateSaving)) {
			return;
		}

		// get table setup
		let wptbTableSetup = document.getElementsByClassName('wptb-table-setup');
		let wptbPreviewTable = '';
		if (wptbTableSetup.length > 0) {
			wptbTableSetup = wptbTableSetup[0];

			wptbPreviewTable = wptbTableSetup.querySelector('.wptb-preview-table');
		} else {
			wptbTableSetup = '';
		}

		// check if a global array doesn't exist with saved versions of the table
		// them create it
		if (!window.wptbTableStateSaving && !Array.isArray(window.wptbTableStateSaving)) {
			window.wptbTableStateSaving = [];
		}

		// remove the extra part of the array after changing the table
		// when it is showed in the not last modified version
		if (window.wptbTableStateSaving.length > window.wptbTableStateNumberShow) {
			window.wptbTableStateSaving = window.wptbTableStateSaving.slice(0, window.wptbTableStateNumberShow + 1);
		}

		// add new state of table
		let wptbNewTableSetup = '';
		if (wptbTableSetup) {
			wptbNewTableSetup = wptbTableSetup.cloneNode(true);
			const wptbHighlighted = wptbNewTableSetup.getElementsByClassName('wptb-highlighted');
			for (let i = 0; i < wptbHighlighted.length; i++) {
				wptbHighlighted[i].classList.remove('wptb-highlighted');
			}
			const wptbDirectlyhovered = wptbNewTableSetup.getElementsByClassName('wptb-directlyhovered');
			for (let i = 0; i < wptbDirectlyhovered.length; i++) {
				wptbDirectlyhovered[i].classList.remove('wptb-directlyhovered');
			}
			const mceContentBodys = wptbNewTableSetup.querySelectorAll('.mce-content-body');
			if (mceContentBodys.length > 0) {
				for (let k = 0; k < mceContentBodys.length; k++) {
					mceContentBodys[k].classList.remove('mce-content-body');
				}
			}
			const dataMceStyle = wptbNewTableSetup.querySelectorAll('[data-mce-style]');
			if (dataMceStyle.length > 0) {
				for (let k = 0; k < dataMceStyle.length; k++) {
					dataMceStyle[k].removeAttribute('data-mce-style');
				}
			}
			const mceIds = wptbNewTableSetup.querySelectorAll('[id^=mce_]');
			if (mceIds.length > 0) {
				for (let k = 0; k < mceIds.length; k++) {
					mceIds[k].removeAttribute('id');
				}
			}
		}

		let cssForTdsWidthAutoValue = '';
		const { head } = document;
		if (head) {
			const cssForTdsWidthAuto = head.querySelector('style[data-wptb-td-auto-width="true"]');
			if (cssForTdsWidthAuto) {
				cssForTdsWidthAutoValue = cssForTdsWidthAuto.innerHTML;
			}
		}

		let wptbTableTitle = '';
		const wptbSetupName = document.getElementById('wptb-setup-name');
		if (wptbSetupName) wptbTableTitle = wptbSetupName.value;

		window.wptbTableStateSaving.push([wptbNewTableSetup, cssForTdsWidthAutoValue, wptbTableTitle]);

		// set new number of state which is showed now
		window.wptbTableStateNumberShow = window.wptbTableStateSaving.length - 1;

		// make undo arrow active when the table was changed
		if (window.wptbTableStateSaving.length - 1 > 0) {
			let wptbUndo = document.getElementsByClassName('wptb-undo');
			if (wptbUndo.length > 0) {
				wptbUndo = wptbUndo[0];

				wptbUndo.classList.remove('wptb-undoredo-disabled');
			}
		}

		// make redo arrow not active when the table was changed
		let wptbRedo = document.getElementsByClassName('wptb-redo');
		if (wptbRedo.length > 0) {
			wptbRedo = wptbRedo[0];

			wptbRedo.classList.add('wptb-undoredo-disabled');
		}

		const wptbSaveBtn = document.querySelector('.main-save-button-wrapper .save-btn');
		if (wptbSaveBtn) {
			if (
				(!wptbSaveBtn.dataset.wptbTableStateNumberSave && window.wptbTableStateNumberShow == 0) ||
				window.wptbTableStateNumberShow == wptbSaveBtn.dataset.wptbTableStateNumberSave ||
				!wptbPreviewTable
			) {
				// wptbSaveBtn.classList.add('wptb-save-disabled');
				// wptbSaveBtn.classList.remove('active');

				WPTB_Store.commit('setTableClean');
			} else {
				// wptbSaveBtn.classList.remove('wptb-save-disabled');
				// wptbSaveBtn.classList.add('active');

				WPTB_Store.commit('setTableDirty');
			}
		}
	};

	this.tableStateGet = (datawptbUndoredo) => {
		if (datawptbUndoredo && window.wptbTableStateSaving && window.wptbTableStateSaving.length > 0) {
			// changes the number of the state which displays now
			if (datawptbUndoredo == 'undo') {
				if (window.wptbTableStateNumberShow > 0) {
					window.wptbTableStateNumberShow--;
				} else {
					return false;
				}
			} else if (datawptbUndoredo == 'redo') {
				if (window.wptbTableStateNumberShow < window.wptbTableStateSaving.length) {
					window.wptbTableStateNumberShow++;
				} else {
					return false;
				}
			}

			// add or delete class "wptb-undoredo-disabled" for undo button
			let wptbUndo = document.getElementsByClassName('wptb-undo');
			if (wptbUndo.length > 0) {
				wptbUndo = wptbUndo[0];

				if (window.wptbTableStateNumberShow == 0) {
					if (wptbUndo) {
						wptbUndo.classList.add('wptb-undoredo-disabled');
					}
				} else if (window.wptbTableStateNumberShow > 0) {
					if (wptbUndo) {
						wptbUndo.classList.remove('wptb-undoredo-disabled');
					}
				}
			}

			// add or delete class "wptb-undoredo-disabled" for redo button
			let wptbRedo = document.getElementsByClassName('wptb-redo');
			if (wptbRedo.length > 0) {
				wptbRedo = wptbRedo[0];

				if (window.wptbTableStateNumberShow == window.wptbTableStateSaving.length - 1) {
					if (wptbRedo) {
						wptbRedo.classList.add('wptb-undoredo-disabled');
					}
				} else if (window.wptbTableStateNumberShow < window.wptbTableStateSaving.length - 1) {
					if (wptbRedo) {
						wptbRedo.classList.remove('wptb-undoredo-disabled');
					}
				}
			}

			// add or delete class "wptb-save-disabled" for save button
			const wptbSaveBtn = document.querySelector('.main-save-button-wrapper .save-btn');
			if (wptbSaveBtn) {
				if (
					(!wptbSaveBtn.dataset.wptbTableStateNumberSave && window.wptbTableStateNumberShow == 0) ||
					window.wptbTableStateNumberShow == wptbSaveBtn.dataset.wptbTableStateNumberSave
				) {
					// wptbSaveBtn.classList.add('wptb-save-disabled');
					// wptbSaveBtn.classList.remove('active');

					WPTB_Store.commit('setTableClean');
				} else {
					// wptbSaveBtn.classList.add('active');
					// wptbSaveBtn.classList.remove('wptb-save-disabled');

					WPTB_Store.commit('setTableDirty');
				}
			}

			// load necessary saved table state
			let wptbTableSetup = document.getElementsByClassName('wptb-table-setup');
			if (wptbTableSetup.length > 0) {
				wptbTableSetup = wptbTableSetup[0];

				// wptbTableSetup.outerHTML = '';
				if (window.wptbTableStateSaving[window.wptbTableStateNumberShow]) {
					if (
						window.wptbTableStateSaving[window.wptbTableStateNumberShow][0] &&
						typeof window.wptbTableStateSaving[window.wptbTableStateNumberShow][0] === 'object'
					) {
						if ('outerHTML' in window.wptbTableStateSaving[window.wptbTableStateNumberShow][0]) {
							wptbTableSetup.outerHTML =
								window.wptbTableStateSaving[window.wptbTableStateNumberShow][0].outerHTML;
						}
					}

					const wptbTableSetupNew = document.querySelector('.wptb-table-setup');
					if (wptbTableSetupNew && wptbTableSetupNew.children.length == 0) {
						// document.getElementsByClassName('wptb-table-generator')[0].style.display = 'table';
						// wptbSaveBtn.classList.add('wptb-save-disabled');
						// wptbSaveBtn.classList.remove('active');

						WPTB_Store.commit('setTableClean');
					} else {
						// document.getElementsByClassName('wptb-table-generator')[0].style.display = 'none';
					}

					// add or change or delete style element in the head for table cells who have auto width
					const { head } = document;
					if (head) {
						const cssForTdsWidthAutoOld = head.querySelector('style[data-wptb-td-auto-width="true"]');
						if (cssForTdsWidthAutoOld) {
							head.removeChild(cssForTdsWidthAutoOld);
						}

						if (window.wptbTableStateSaving[window.wptbTableStateNumberShow][1]) {
							const cssForTdsWidthAuto = document.createElement('style');
							cssForTdsWidthAuto.setAttribute('data-wptb-td-auto-width', true);
							cssForTdsWidthAuto.innerHTML =
								window.wptbTableStateSaving[window.wptbTableStateNumberShow][1];
							head.appendChild(cssForTdsWidthAuto);
						}
					}

					// change value of table title field
					const wptbSetupName = document.getElementById('wptb-setup-name');
					if (typeof window.wptbTableStateSaving[window.wptbTableStateNumberShow][2] !== 'undefined') {
						if (wptbSetupName)
							wptbSetupName.value = window.wptbTableStateSaving[window.wptbTableStateNumberShow][2];
					}
				}

				let body = document.getElementsByTagName('body');
				if (body.length > 0) {
					body = body[0];
				}

				WPTB_Helper.elementOptionsPanelClear();
				WPTB_LeftPanel();

				const wptbLeftScrollPanelCellSetting = document.getElementById('wptb-left-scroll-panel-cell-settings');
				if (wptbLeftScrollPanelCellSetting) {
					wptbLeftScrollPanelCellSetting.classList.remove('visible');
				}
			}
		}
	};

	this.tableStateClear = function () {
		window.wptbTableStateSaving = window.wptbTableStateSaving.slice(0, 1);
		window.wptbTableStateNumberShow = 0;

		const wptbSaveBtn = document.querySelector('.main-save-button-wrapper .save-btn');
		if (wptbSaveBtn) {
			wptbSaveBtn.removeAttribute('data-wptb-table-state-number-save');
		}

		let wptbUndo = document.getElementsByClassName('wptb-undo');
		if (wptbUndo.length > 0) {
			wptbUndo = wptbUndo[0];

			wptbUndo.classList.add('wptb-undoredo-disabled');
		}

		let wptbRedo = document.getElementsByClassName('wptb-redo');
		if (wptbRedo.length > 0) {
			wptbRedo = wptbRedo[0];

			wptbRedo.classList.add('wptb-undoredo-disabled');
		}

		WPTB_Store.commit('setTableClean');
	};
};
