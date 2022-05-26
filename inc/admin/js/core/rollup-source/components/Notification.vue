<template>
	<div
		@click="handleNotificationClick"
		ref="wrapper"
		class="wptb-notification-wrapper wptb-plugin-filter-box-shadow-md"
		:id="`notification#${id}`"
		:style="style.wrapper"
	>
		<div ref="icon" class="wptb-notification-icon" :style="style.icon">
			<div
				:key="lengthRepaint"
				v-if="queueLengthVisibility"
				class="wptb-notification-queue-length"
				:style="style.length"
			>
				{{ queueLength }}
			</div>
			<div v-if="type !== 'pro'" class="wptb-notification-svg-wrapper" v-html="icons[type]"></div>
			<img v-else class="wptb-notification-svg-wrapper" :src="icons.pro" />
		</div>
		<div ref="filler" class="wptb-notification-filler" :style="style.filler"></div>
		<div ref="message" class="wptb-notification-message" v-html="message" :style="style.message"></div>
	</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
	props: {
		id: {
			type: Number,
			default: 0,
		},
		message: {
			type: String,
			default: 'Default notification message',
		},
		type: {
			type: String,
			default: 'normal',
		},
		queue: {
			type: String,
			default: 'wait',
		},
		reveal: {
			type: String,
			default: 'full',
		},
		dismiss: {
			type: String,
			default: 'timed',
		},
	},
	data() {
		return {
			colors: {
				ok: getComputedStyle(document.documentElement).getPropertyValue('--wptb-plugin-green-500'),
				info: getComputedStyle(document.documentElement).getPropertyValue('--wptb-plugin-yellow-500'),
				error: getComputedStyle(document.documentElement).getPropertyValue('--wptb-plugin-red-600'),
				pro: getComputedStyle(document.documentElement).getPropertyValue('--wptb-plugin-logo-color'),
			},
			fullyRevealed: false,
			lengthRepaint: 0,
			timeoutId: null,
		};
	},
	watch: {
		fullyRevealed(n) {
			if (n && this.dismiss === 'timed') {
				setTimeout(() => {
					this.slideBack();
				}, this.autoDismissTime);
			}
		},
		queueLength() {
			this.lengthRepaint += 1;
		},
	},
	mounted() {
		this.$nextTick(() => {
			// eslint-disable-next-line no-unused-expressions
			this.reveal === 'full' ? this.slideFull(true) : this.slideIcon(true);
		});
	},
	computed: {
		style() {
			const colorToUse = this.colors[this.type] || this.colors.ok;

			return {
				filler: {
					borderColor: colorToUse,
				},
				icon: {
					backgroundColor: colorToUse,
					color: '#FFFFFF',
				},
				message: {
					borderColor: colorToUse,
				},
				length: {
					backgroundColor: colorToUse,
				},
			};
		},
		queueLengthVisibility() {
			return this.queue === 'wait' && this.queueLength > 0;
		},
		...mapState(['icons', 'autoDismissTime']),
		...mapGetters(['queueLength']),
	},
	methods: {
		...mapActions(['removeNotification']),
		slideBase(amount, direction = true) {
			return new Promise((resolve) => {
				this.timeoutId = setTimeout(() => {
					if (this.$refs.wrapper) {
						this.$refs.wrapper.style.transition = 'all 0.3s ease-out';
						this.$refs.wrapper.style.transform = `translateX(calc( ${direction ? -1 : 1} * ${amount} ))`;

						this.$refs.wrapper.addEventListener('transitionend', ({ propertyName }) => {
							if (propertyName === 'transform') {
								this.$refs.wrapper.style.transition = 'unset';
								resolve();
							}
						});
					}
				}, 100);
			});
		},
		slideBack() {
			this.slideBase('0px', 1).then(() => {
				// remove notification from store after hidden
				this.removeNotification(this.id);
			});
		},
		slideFull() {
			this.slideBase('100%').then(() => {
				this.fullyRevealed = true;
			});
		},
		slideIcon() {
			const iconWrapper = this.$refs.icon;
			const messageWrapper = this.$refs.message;
			const { filler } = this.$refs;
			const { width } = iconWrapper.getBoundingClientRect();
			const { borderLeftWidth } = getComputedStyle(messageWrapper);
			const { width: fillerWidth } = filler.getBoundingClientRect();

			this.slideBase(`${width + Number.parseInt(fillerWidth, 10) + Number.parseInt(borderLeftWidth, 10)}px`);
		},
		handleNotificationClick() {
			if (this.fullyRevealed) {
				this.slideBack();
			} else if (this.reveal === 'icon') {
				this.slideFull();
			}
		},
	},
};
</script>
