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
		 * Get an icon.
		 *
		 * Icons sent with this function are wrapped with a 'div' element.
		 *
		 * @param {string} iconName name of the icon
		 * @param {string} extraClass extra class to add to icon wrapper
		 * @return {Promise<void>} a Promise that will be resolved when icon is fetched from server.
		 */
		this.getIcon = (iconName, extraClass = null) => {
			// eslint-disable-next-line consistent-return
			return new Promise((res, rej) => {
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

							const iconWrapper = document.createElement('div');
							// if an extra class is defined, add it to icon wrapper
							if(extraClass){
								iconWrapper.classList.add(extraClass);
							}
							iconWrapper.innerHTML = iconString;

							return res(iconWrapper);
						})
						.catch((err) => {
							return rej(new Error(err));
						});
				}
				return rej(new Error(`no icon found with the given name of [${iconName}]`));
			});
		};
	}

	// return singleton icon manager instance
	return new IconManager(wptb_admin_object.iconManager);
});
