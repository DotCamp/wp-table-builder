/**
 * Notification manager view.
 */
import Vue from 'vue';
// eslint-disable-next-line camelcase
import WPTB_ControlsManager from '../functions/WPTB_ControlsManager';
import NotificationManagerApp from '../containers/NotificationManagerApp';
import store from '../stores/notificationManager';

export default {
	name: 'NotificationManager',
	handler: function notificationManagerJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData(uniqueId);

		new Vue({
			data,
			store,
			components: { NotificationManagerApp },
			template: '<notification-manager-app></notification-manager-app>',
		}).$mount(`#${data.id}`);
	},
};
