<template>
	<div ref="mainWrapper" class="wptb-notification-manager-dev-tool-wrapper">
		<div class="wptb-nm-devtool-header">
			Notification Manager Dev Tool
		</div>
		<div class="wptb-nm-devtool-selection">
			<div class="wptb-nm-devtool-input">
				<div>Type</div>
				<select v-model="currentType">
					<option v-for="(v, k) in types" :key="k" :value="v">{{ v }}</option>
				</select>
			</div>
			<div class="wptb-nm-devtool-input">
				<div>Queue</div>
				<select v-model="currentQueue">
					<option v-for="(v, k) in queue" :key="k" :value="v">{{ v }}</option>
				</select>
			</div>
			<div class="wptb-nm-devtool-input">
				<div>Reveal</div>
				<select v-model="currentReveal">
					<option v-for="(v, k) in reveal" :key="k" :value="v">{{ v }}</option>
				</select>
			</div>
		</div>
		<div class="wptb-nm-devtool-message">
			<input type="text" placeholder="notification message" v-model="message" />
		</div>
		<div class="wptb-nm-devtool-submit">
			<menu-button @click="notify" size="small">Notify</menu-button>
		</div>
	</div>
</template>

<script>
import MenuButton from '../components/MenuButton';

export default {
	components: { MenuButton },
	props: {
		queue: Object,
		types: Object,
		reveal: Object,
		sendNotification: Function,
	},
	data() {
		return {
			currentType: 'ok',
			currentQueue: 'wait',
			message: 'sample message',
			currentReveal: 'full',
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
			this.sendNotification(this.message, this.currentType, this.currentQueue);
		},
	},
};
</script>

<style scoped></style>
