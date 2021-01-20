(function UMD(key, context, factory) {
	if (typeof module !== 'undefined' && typeof exports === 'object') {
		module.exports = factory();
	} else {
		// eslint-disable-next-line no-param-reassign
		context[key] = factory();
	}
	// eslint-disable-next-line no-restricted-globals
})('WPTB_Logger', self || global, () => {
	const format = '%c WP Table Builder %c {message} ';
	const brandStyle =
		'border-radius:5px 0 0 5px; background-color: #3299D1; padding: 3px; color: #FFF; font-weight: bold;';
	const messageStyle = 'background-color: {bgColor} ; padding: 3px; color: #FFF; border-radius: 0 5px 5px 0;';

	/**
	 * Background colors for message.
	 *
	 * Add color property keys keeping in mind that internal function to use that colors will select them based on type of message, ie 'normal' color property for normal messages and 'error' color property for error message types.
	 *
	 * @type {Object}
	 */
	const bgColors = {
		normal: '#48BB78',
	};

	return {
		/**
		 * Prepare format for incoming message.
		 *
		 * @param {string} message message to be used
		 * @return {string} prepared message
		 */
		prepareMessage(message) {
			return format.replace('{message}', message);
		},
		/**
		 * Prepare style of message.
		 *
		 * @param {string} messageType message type
		 * @return {string} prepared style
		 */
		prepareMessageStyle(messageType = 'normal') {
			let keyName = 'normal';

			if (bgColors[messageType]) {
				keyName = messageType;
			}

			return messageStyle.replace('{bgColor}', bgColors[keyName]);
		},
		/**
		 * Normal log function.
		 *
		 * @param {string} message message string
		 */
		log(message) {
			// eslint-disable-next-line no-console
			console.log(this.prepareMessage(message), brandStyle, this.prepareMessageStyle('normal'));
		},
	};
});
