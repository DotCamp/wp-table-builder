/**
 * IIFE for background menu setup.
 */
(function wptbBackgroundMenuSetup() {
	/**
	 * Background menu component.
	 *
	 * @class
	 */
	function BackgroundMenu() {
		// whether setup operation done or not
		this.initialized = false;

		/**
		 * Initialize hook for component.
		 */
		this.init = () => {
			document.addEventListener('wptbSectionChanged', ({ detail }) => {
				// only run setup once
				if (!this.initialized && detail === 'background_menu') {
					WPTB_ControlsManager.callControlScript('BackgroundMenu', 'wptb-background-menu');
					this.initialized = true;
				}
			});
		};
	}

	// initialize background menu component
	new BackgroundMenu().init();
})();
