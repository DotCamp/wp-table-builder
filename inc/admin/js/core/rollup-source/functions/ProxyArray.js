/**
 * Proxy array which you can hook into changes.
 *
 * @param {Array} defaultArray default array to use as base
 * @class
 */
function ProxyArray(defaultArray = []) {
	// supported module events
	const supportedEvents = ['set'];

	// events waiting at que, keys for event name, values are array of handler functions assigned to it
	const eventQue = {};

	/**
	 * Internal logic for adding events.
	 *
	 * @private
	 *
	 * @param {string} eventName event name
	 * @param {Function} handler event handler
	 */
	const addToEventQue = (eventName, handler) => {
		if (typeof handler === 'function') {
			if (supportedEvents.includes(eventName)) {
				if (!Object.prototype.hasOwnProperty.call(eventQue, eventName)) {
					eventQue[eventName] = [];
				}

				eventQue[eventName].push(handler);
			} else {
				throw new Error(`[ProxyArray]: event name of ${eventName} is not supported`);
			}
		} else {
			throw new Error(`[ProxyArray]: provided handler is not a function`);
		}
	};

	/**
	 * Call event subscribers.
	 *
	 * @param {string} eventName event name
	 * @param {any} value event value
	 */
	const callSubscribers = (eventName, value) => {
		if (Object.prototype.hasOwnProperty.call(eventQue, eventName)) {
			// eslint-disable-next-line array-callback-return
			eventQue[eventName].map((handler) => {
				handler(value);
			});
		}
	};

	/**
	 * Attach a listener to proxy array events.
	 *
	 * @public
	 *
	 * @param {string} eventName event name
	 * @param {Function} handler event handler
	 */
	const on = (eventName, handler) => {
		addToEventQue(eventName, handler);
	};

	/**
	 * Remove a listener from module events.
	 *
	 * @public
	 *
	 * @param {string} eventName event name
	 * @param {Function} handler event handler
	 */
	const removeListener = (eventName, handler) => {
		if (supportedEvents.includes(eventName)) {
			if (Object.prototype.hasOwnProperty.call(eventQue, eventName)) {
				const handlerIndex = eventQue[eventName].indexOf(handler);

				if (handlerIndex >= 0) {
					eventQue[eventName].splice(handlerIndex, 1);
				}
			}
		}
	};

	// initialize proxy
	const proxy = new Proxy(defaultArray, {
		set(target, property, value, receiver) {
			const setStatus = Reflect.set(target, property, value, receiver);
			callSubscribers('set', value);

			return setStatus;
		},
	});

	// define 'on' property for proxy
	Object.defineProperty(proxy, 'on', {
		configurable: false,
		enumerable: false,
		value: on,
		writable: false,
	});

	// define 'removeListener' property for proxy
	Object.defineProperty(proxy, 'removeListener', {
		configurable: false,
		enumerable: false,
		value: removeListener,
		writable: false,
	});

	return proxy;
}

/**
 * @module ProxyArray
 */
export default ProxyArray;
