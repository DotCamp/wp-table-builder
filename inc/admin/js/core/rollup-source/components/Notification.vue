<template>
	<div ref="wrapper" class="wptb-notification-wrapper" :id="`notification#${id}`" :style="style.wrapper">
		<div class="wptb-notification-icon" :style="style.icon">
			<div ref="svgWrap" class="wptb-notification-svg-wrapper" v-html="icons[type]"></div>
		</div>
		<div class="wptb-notification-message" v-html="message"></div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

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
	},
	data() {
		return {
			colors: {
				ok: getComputedStyle(document.documentElement).getPropertyValue('--wptb-plugin-green-500'),
				info: getComputedStyle(document.documentElement).getPropertyValue('--wptb-plugin-yellow-500'),
				error: getComputedStyle(document.documentElement).getPropertyValue('--wptb-plugin-red-600'),
				pro: getComputedStyle(document.documentElement).getPropertyValue('--wptb-plugin-logo-color'),
			},
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.slideFull(true);
		});
	},
	computed: {
		style() {
			const colorToUse = this.colors[this.type] || this.colors.ok;

			return {
				wrapper: {
					border: `1px solid ${colorToUse}`,
				},
				icon: {
					backgroundColor: colorToUse,
					outline: `5px solid ${colorToUse}`,
					color: '#FFFFFF',
				},
			};
		},
		...mapState(['icons']),
	},
	methods: {
		slideFull(direction) {
			setTimeout(() => {
				this.$refs.wrapper.style.transition = 'all 0.5s ease-out';
				this.$refs.wrapper.style.transform = `translateX(${(direction ? -1 : 1) * 100}%)`;

				this.$refs.wrapper.addEventListener('transitionend', ({ propertyName }) => {
					if (propertyName === 'transform') {
						this.$refs.wrapper.style.transition = 'unset';
					}
				});
			}, 100);
		},
	},
};
</script>
