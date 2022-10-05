/**
 * Disable emoji->image conversion.
 *
 * @param {boolean} status whether conversion is disabled or not
 */
function EmojiConversionDisabler(status) {
	const targetTable = WPTB_Helper.getPluginTables();
	if (status && targetTable && !Array.isArray(targetTable)) {
		const options = { childList: true, subtree: true };

		/**
		 * Observer callback.
		 *
		 * @param {Array<MutationRecord>} mutationList mutation list
		 */
		const observeCallback = (mutationList) => {
			// eslint-disable-next-line array-callback-return
			mutationList.map(({ addedNodes }) => {
				Array.from(addedNodes).map((addedElement) => {
					if (addedElement.nodeName.toLowerCase() === 'p') {
						addedElement.classList.add('wp-exclude-emoji');
					}
				});
			});
		};
		const observer = new MutationObserver(observeCallback);

		observer.observe(targetTable, options);
	}
}

// eslint-disable-next-line @wordpress/no-global-event-listener
document.addEventListener('wptb:table:generated', () => {
	EmojiConversionDisabler(WPTB_Store.getters.getSetting('emojiConversionDisablerStatus'));
});
