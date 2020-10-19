assignToGlobal('WPTB_ControlShortcutManager', () => {
	function ControlShortcutManager() {
		const controlSectionIdSuffix = '_section-group-start';

		/**
		 * Find the parent of an element with a match to supplied callback function.
		 *
		 * @param {HTMLElement} child element to check its parents.
		 * @param {Function} compareCallback compare callback with an argument of current parent
		 * @return {Function|HTMLElement} found parent or function to start the iteration one level up
		 */
		const findAtParents = (child, compareCallback) => {
			const currentParent = child.parentNode;
			if (currentParent.nodeName === 'BODY') {
				return null;
			}

			if (compareCallback(currentParent)) {
				return currentParent;
			}
			return findAtParents(currentParent, compareCallback);
		};

		/**
		 * Scroll element into view.
		 *
		 * @param {HTMLElement} element element
		 */
		const scrollElementToView = (element) => {
			element.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
		};

		/**
		 * Show control group.
		 *
		 * @param {string} controlSectionId control section id.
		 */
		this.showControlSection = (controlSectionId) => {
			const fullId = `#${controlSectionId}${controlSectionIdSuffix}`;
			const controlSection = document.querySelector(fullId);

			if (controlSection) {
				const menuSection = findAtParents(controlSection, (parent) => {
					// find menu section
					return parent.dataset.wptbSection;
				});

				// find section name of the menu and activate it
				const section = menuSection.dataset.wptbSection;
				WPTB_Helper.activateSection(section);

				// open section group if it is closed
				const isClosed = controlSection.getAttribute('class').includes('wptb-panel-toggle-content');

				const panelToggle = controlSection.querySelector('.wptb-panel-toggle');

				// if section is closed, open and then scroll into view
				if (isClosed) {
					const eventName = `${controlSectionId}:section:toggle`;

					// signal to make sure any toggle event outside of manager will not scroll element to view
					let signal = true;
					document.addEventListener(eventName, () => {
						if (signal) {
							scrollElementToView(panelToggle);
							signal = false;
						}
					});

					panelToggle.click();
				} else {
					scrollElementToView(panelToggle);
				}
			}
		};
	}

	return new ControlShortcutManager();
});
