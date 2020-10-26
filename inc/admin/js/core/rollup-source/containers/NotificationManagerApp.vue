<template>
	<div ref="mainWrapper" class="wptb-notification-manager">
		<notification
			v-for="{ id, message, type, queue, reveal } in notificationsOnDisplay"
			:id="id"
			:message="message"
			:type="type"
			:queue="queue"
			:reveal="reveal"
			:key="id"
		></notification>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import Notification from '../components/Notification';

export default {
	components: { Notification },
	watch: {
		notificationsOnDisplay() {
			this.calculatePosition();
		},
	},
	computed: mapState(['notificationsOnDisplay']),
	methods: {
		calculatePosition() {
			const { mainWrapper } = this.$refs;
			const { height } = mainWrapper.getBoundingClientRect();

			mainWrapper.style.top = `calc( 50% - ${height / 2}px )`;
		},
	},
};
</script>
