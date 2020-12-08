/**
 * Notification manager view.
 */
import Vue from 'vue';
// eslint-disable-next-line camelcase
import WPTB_ControlsManager from '../functions/WPTB_ControlsManager';
import NotificationManagerApp from '../containers/NotificationManagerApp';
import createStore from '../stores/notificationManager';

export default {
	name: 'NotificationManager',
	handler: function notificationManagerJS(uniqueId) {
		// server send data for notification manager
		const data = WPTB_ControlsManager.getControlData(uniqueId);

		const store = createStore({ state: { ...data } });

		WPTB_NotificationManager.store = store;

		new Vue({
			data,
			store,
			components: { NotificationManagerApp },
			template: '<notification-manager-app :sound-enabled="options.soundEnabled"></notification-manager-app>',
		}).$mount(`#${data.id}`);
	},
};
