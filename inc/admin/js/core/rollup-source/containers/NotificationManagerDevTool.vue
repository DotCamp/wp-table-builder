<template>
	<div ref="mainWrapper" class="wptb-notification-manager-dev-tool-wrapper">
		<div class="wptb-nm-devtool-header">
			Notification Manager Dev Tool
		</div>
		<div class="wptb-nm-devtool-selection">
			<notification-manager-dev-select
				label="Type"
				v-model="notificationObject.type"
				:options="types"
			></notification-manager-dev-select>
			<notification-manager-dev-select
				label="Queue"
				v-model="notificationObject.queue"
				:options="queue"
			></notification-manager-dev-select>
			<notification-manager-dev-select
				label="Reveal"
				v-model="notificationObject.reveal"
				:options="reveal"
			></notification-manager-dev-select>
			<notification-manager-dev-select
				label="Dismiss"
				v-model="notificationObject.dismiss"
				:options="dismiss"
			></notification-manager-dev-select>
		</div>
		<div class="wptb-nm-devtool-message">
			<input type="text" placeholder="notification message" v-model="notificationObject.message" />
		</div>
		<div class="wptb-nm-devtool-submit">
			<menu-button @click="notify" size="small">Notify</menu-button>
		</div>
	</div>
</template>

<script>
import MenuButton from '../components/MenuButton';
import NotificationManagerDevSelect from '../components/NotificationManagerDevSelect';

export default {
	components: { NotificationManagerDevSelect, MenuButton },
	props: {
		queue: Object,
		types: Object,
		reveal: Object,
		dismiss: Object,
		sendNotification: Function,
	},
	data() {
		return {
			notificationObject: {
				type: 'pro',
				queue: 'wait',
				message: 'sample message',
				reveal: 'full',
				dismiss: 'click',
			},
		};
	},
	mounted() {
		this.$nextTick(() => {
			const wrapper = this.$refs.mainWrapper;
			const { height } = wrapper.getBoundingClientRect();
			wrapper.style.top = `calc( 50% - ${height / 2}px)`;
		});
	},
	methods: {
		notify() {
			this.sendNotification(this.notificationObject);
		},
	},
};
</script>

<style scoped></style>
