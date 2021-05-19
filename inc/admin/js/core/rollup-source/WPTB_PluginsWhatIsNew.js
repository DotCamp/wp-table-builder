import WhatIsNew from './mountPoints/WhatIsNewBase';

// add click listener to what-is-new buttons
document.addEventListener('DOMContentLoaded', () => {
	// eslint-disable-next-line array-callback-return
	Array.from(document.querySelectorAll('#wptb-what-is-new')).map((el) => {
		el.addEventListener('click', () => {
			if (wptbPluginsWin && wptbPluginsWin.notes) {
				WhatIsNew(wptbPluginsWin.notes);
			}
		});
	});
});
