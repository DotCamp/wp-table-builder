<!--
Tab grouped panel section component.

* Events emitted
**	- tabClicked - fired when a tab header is clicked
		@returns clicked tab id
-->
<template>
	<div class="wptb-section-group-tabbed wptb-plugin-box-shadow-md wptb-plugin-width-full">
		<div class="wptb-panel-toggle wptb-section-group-tabbed-header">
			<div class="header">{{ header }}</div>
		</div>
		<div class="wptb-section-group-tabbed-tabs-buttons">
			<div
				v-for="(name, id) in tabs"
				class="wptb-settings-section-item static-active"
				:key="id"
				:class="{ active: isActiveTab(id), disabled: !isActiveTab(id) }"
				@click.prevent.capture="handleTabClick(id)"
			>
				{{ name }}
			</div>
		</div>
		<div class="wptb-section-group-tab-content">
			<slot></slot>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		header: {
			type: String,
			default: 'Tab Header',
		},
		// tabs object, keys for tab ids, values for translated tab names
		tabs: {
			type: Object,
			default: () => {
				return {
					default: 'Default',
				};
			},
		},
		// id of currentTab
		currentTab: {
			type: String,
			default: 'default',
		},
	},
	methods: {
		// decide if the tab is active based on current active tab property
		isActiveTab(tabId) {
			return this.currentTab === tabId;
		},
		handleTabClick(tabId) {
			this.$emit('tabClicked', tabId);
		},
	},
};
</script>
