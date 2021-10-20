/**
 * Assign icon manager to global space.
 *
 * @param {string} key global key
 * @param {Object} context global context
 * @param {Function} factory factory function
 */
(function assignToGlobal(key, context, factory) {
	// eslint-disable-next-line no-param-reassign
	context[key] = factory();
	// eslint-disable-next-line no-restricted-globals
})('WPTB_IconManager', self || global, function iconManager() {
	/**
	 * Frontend icon manager for WPTB builder.
	 *
	 * @param {Object} list all icon list
	 * @class
	 */
	function IconManager(list) {
		if (!list) {
			throw new Error('no icon list is defined for WPTB_IconManager instance');
		}
		const iconList = list;

		/**
		 * Cached icons.
		 *
		 * @type {Object}
		 */
		const cachedIcons = {};

		/**
		 * Prepare an icon with a wrapper.
		 *
		 * @param {string} iconSvgString string representation of icon
		 * @param {Array | string | null} extraClass name of extra class[es] to apply to icon wrapper
		 * @param {boolean} stringifiedVersion get stringified html version of icon
		 * @return {HTMLDivElement} created icon wrapper
		 */
		const prepareIcon = (iconSvgString, extraClass = null, stringifiedVersion = false) => {
			const iconWrapper = document.createElement('div');

			// if an extra class is defined, add it to icon wrapper
			if (extraClass) {
				if (!Array.isArray(extraClass)) {
					// eslint-disable-next-line no-param-reassign
					extraClass = [extraClass];
				}

				// eslint-disable-next-line array-callback-return
				extraClass.map((eClass) => {
					iconWrapper.classList.add(eClass);
				});
			}

			iconWrapper.innerHTML = iconSvgString;

			return stringifiedVersion ? iconWrapper.outerHTML : iconWrapper;
		};

		/**
		 * Get a cached icon.
		 *
		 * @param {string} iconName name of the icon
		 * @param {string | Array | null} extraClass extra class name[s] to add to icon wrapper
		 * @param {boolean | null} getStringifiedVersion get stringified version of the icon
		 * @return {null | Element} Prepared cached icon or null if no cached version is found
		 */
		const getCachedIcon = (iconName, extraClass = null, getStringifiedVersion = false) => {
			if (cachedIcons[iconName]) {
				return prepareIcon(cachedIcons[iconName], extraClass, getStringifiedVersion);
			}
			return null;
		};

		/**
		 * Add an icon to cache.
		 *
		 * @param {string} iconName name of the icon to be stored
		 * @param {string} stringifiedIcon stringified version of the icon
		 */
		const addToCache = (iconName, stringifiedIcon) => {
			cachedIcons[iconName] = stringifiedIcon;
		};

		/**
		 * Get a list of all available icons.
		 *
		 * @return {Object} icon list
		 */
		this.getIconList = () => {
			return iconList;
		};

		/**
		 * Get an icon.
		 *
		 * Icons sent with this function are wrapped with a 'div' element.
		 *
		 * @param {string} iconName name of the icon
		 * @param {string | Array | null} extraClass extra class[es] to add to icon wrapper
		 * @param {boolean} getStringifiedVersion get stringified version of icon
		 * @return {Promise<void>} a Promise that will be resolved when icon is fetched from server
		 */
		this.getIcon = (iconName, extraClass = null, getStringifiedVersion = false) => {
			// eslint-disable-next-line consistent-return
			return new Promise((res, rej) => {
				// if cached version is found, return that version
				const cachedIcon = getCachedIcon(iconName, extraClass, getStringifiedVersion);
				if (cachedIcon) {
					return res(cachedIcon);
				}

				if (iconList[iconName]) {
					return fetch(iconList[iconName])
						.then((resp) => {
							if (resp.ok) {
								return resp.text();
							}
							throw new Error(`an error occurred while fetching icon [${iconName}]`);
						})
						.then((iconString) => {
							if (iconString.error) {
								throw new Error(`an error occurred while fetching icon [${iconName}]`);
							}

							// add icon to cache
							addToCache(iconName, iconString);

							return res(prepareIcon(iconString, extraClass, getStringifiedVersion));
						})
						.catch((err) => {
							return rej(new Error(err));
						});
				}
				return rej(new Error(`no icon found with the given name of [${iconName}]`));
			});
		};
		this.getIconUrl = (iconName) => {
			let iconUrl = null;

			if (iconList[iconName]) {
				iconUrl = iconList[iconName];
			}

			return iconUrl;
		};
	}

	// eslint-disable-next-line no-restricted-globals
	const context = self || global;
	if (context.wptb_admin_object) {
		return new IconManager(wptb_admin_object.iconManager);
	}

	return null;
});
