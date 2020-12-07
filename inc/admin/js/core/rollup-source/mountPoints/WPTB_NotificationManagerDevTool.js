/**
 * Notification manager dev tools.
 */
import Vue from 'vue';
// eslint-disable-next-line camelcase
import WPTB_ControlsManager from '../functions/WPTB_ControlsManager';
import NotificationManagerDevTool from '../containers/NotificationManagerDevTool';

export default {
	name: 'NotificationManagerDevTool',
	handler: function notificationManagerJS(uniqueId) {
		const data = WPTB_ControlsManager.getControlData(uniqueId);

		new Vue({
			data,
			components: { NotificationManagerDevTool },
			template:
				'<notification-manager-dev-tool :reveal="reveal" :queue="queue" :types="types" :send-notification="sendNotification" :dismiss="dismiss"></notification-manager-dev-tool>',
		}).$mount(`#${data.mountId}`);
	},
};
