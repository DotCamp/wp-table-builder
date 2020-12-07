<template>
	<div ref="mainWrapper" class="wptb-notification-manager">
		<notification
			v-for="{ id, message, type, queue, reveal, dismiss } in notificationsOnDisplay"
			:id="id"
			:message="message"
			:type="type"
			:queue="queue"
			:reveal="reveal"
			:dismiss="dismiss"
			:key="id"
		></notification>
		<audio ref="audio" :src="sounds.ding"></audio>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import Notification from '../components/Notification';

export default {
	components: { Notification },
	watch: {
		notificationsOnDisplay: {
			handler() {
				this.calculatePosition();
			},
			deep: true,
		},
	},
	computed: mapState(['notificationsOnDisplay', 'sounds']),
	mounted() {
		this.$store.subscribeAction((action) => {
			if (action.type === 'addNotification') {
				setTimeout(() => {
					this.$refs.audio.play();
				}, 100);
			}
		});
	},
	methods: {
		calculatePosition() {
			const { mainWrapper } = this.$refs;
			const { height } = mainWrapper.getBoundingClientRect();

			mainWrapper.style.top = `calc( 50% - ${height / 2}px )`;
		},
	},
};
</script>
