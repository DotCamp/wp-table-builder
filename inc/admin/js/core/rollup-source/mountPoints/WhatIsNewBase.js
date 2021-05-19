import Vue from 'vue';
import WhatIsNew from '../containers/WhatIsNew';

/**
 * What is new component initialization function.
 *
 * @param {Object} whatIsNew what is new data
 */
const whatIsNewBase = (whatIsNew) => {
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
};

/**
 * @module whatIsNewBase
 */
export default whatIsNewBase;
