import WhatIsNewBase from './WhatIsNewBase';

export default {
	name: 'WhatIsNew',
	handler: function whatIsNewComponent() {
		// eslint-disable-next-line camelcase
		const { whatIsNew } = wptb_admin_object;

		WhatIsNewBase(whatIsNew);
	},
};
