/**
 * Disable emoji->image conversion.
 *
 * @param {boolean} status whether conversion is disabled or not
 */
function EmojiConversionDisabler(status) {
// TODO [ErdemBircan] remove for production
console.log(status)	;
	if (status) {
		// TODO [ErdemBircan] remove for production
		console.log('emoji conversion preventer loaded');
	}
}

// eslint-disable-next-line @wordpress/no-global-event-listener
document.addEventListener('wptb:table:generated', () => {
	EmojiConversionDisabler(WPTB_Store.getters.getSetting('emojiConversionDisablerStatus'));
});
