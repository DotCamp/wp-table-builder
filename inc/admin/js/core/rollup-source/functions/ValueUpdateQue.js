/**
 * Value update que handler.
 *
 * @param {ProxyArray} controlBases control bases array. Always make sure this array is supplied as a reference.
 * @class
 */
function ValueUpdateQue(controlBases) {
	/**
	 * Array to hold value updates in queue.
	 */
	const queue = [];

	/**
	 * Main update process.
	 */
	const updateProcess = () => {
		let { length } = queue;

		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < length; i++) {
			const [elementId, controlId, value, propertyName] = queue[i];

			try {
				// eslint-disable-next-line array-callback-return,no-loop-func
				controlBases.map((base) => {
					const { elemContainer, name: cId } = base.$root.$data;

					if (elemContainer === elementId && controlId === cId) {
						// only update value if its property key is present
						if (Object.prototype.hasOwnProperty.call(base.$data, propertyName)) {
							// eslint-disable-next-line no-param-reassign
							base.$data[propertyName] = value;

							queue.splice(i, 1);

							i -= 1;
							length = queue.length;
							throw new Error('shortcut');
						}
					}
				});
			} catch (e) {
				// do nothing
			}
		}
	};

	/**
	 * Add value update operation to que.
	 *
	 * @public
	 *
	 * @param {string} elementId element control id
	 * @param {string} controlId element control id
	 * @param {any} value control value
	 * @param {string} property property name to update
	 */
	this.addToUpdateQue = (elementId, controlId, value, property = 'elementMainValue') => {
		queue.push([elementId, controlId, value, property || 'elementMainValue']);
		updateProcess();
	};

	/**
	 * Initialize module.
	 *
	 * @private
	 */
	const init = () => {
		controlBases.on('set', () => {
			updateProcess();
		});
	};

	init();
}

/**
 * @module ValueUpdateQue
 */
export default ValueUpdateQue;
