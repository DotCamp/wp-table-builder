import Vue from 'vue';
import WhatIsNew from '../containers/WhatIsNew';

export default {
	name: 'WhatIsNew',
	handler: function whatIsNewComponent() {
		// eslint-disable-next-line camelcase
		const { whatIsNew } = wptb_admin_object;

		// only load component if associated data object is found
		if (whatIsNew) {
			const containerId = 'wptbWhatIsNew';
			const containerWrapper = document.createElement('div');
			containerWrapper.id = containerId;

			document.body.appendChild(containerWrapper);

			// parse version number from data object
			const versionNumber = Object.keys(whatIsNew)
				.filter((key) => {
					return Object.prototype.hasOwnProperty.call(whatIsNew, key);
				})
				.shift();

			const vueInstanceData = {
				version: versionNumber,
				notes: whatIsNew[versionNumber],
			};

			new Vue({
				data: vueInstanceData,
				components: { WhatIsNew },
				template: '<what-is-new :version="version" :notes="notes" ></what-is-new>',
			}).$mount(containerWrapper);
		}
	},
};
