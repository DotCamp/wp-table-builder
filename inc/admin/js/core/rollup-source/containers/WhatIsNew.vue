<template>
	<transition name="wptb-fade" appear @after-leave="closeWindow">
		<div class="wptb-what-is-new-container" v-if="windowVisibility">
			<div class="wptb-what-is-new-window">
				<div class="wptb-what-is-new-header">
					<div class="wptb-what-is-new-header-version">
						<span class="wptb-what-is-new-header-text-icon" v-html="icons.lightbulb"></span> Version
						{{ version }}
					</div>
					<div
						class="wptb-what-is-new-header-close"
						@click="setWindowVisibility(false)"
						v-html="icons.times"
					></div>
				</div>
				<div class="wptb-what-is-new-content">content</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	props: {
		notes: {
			type: Array,
			default: () => {
				return [];
			},
		},
		version: {
			type: String,
			default: '1.0.0',
		},
	},
	data() {
		return {
			icons: {
				lightbulb: null,
				times: null,
			},
			windowVisibility: true,
		};
	},
	async mounted() {
		this.icons.lightbulb = await WPTB_IconManager.getIcon('lightbulb', null, true);

		this.icons.times = await WPTB_IconManager.getIcon('times', null, true);
	},
	methods: {
		closeWindow() {
			// remove mounted element
			this.$root.$el.remove();
			// destroy main vue instance
			this.$root.$destroy();
		},
		setWindowVisibility(state) {
			this.windowVisibility = state;
		},
	},
};
</script>
