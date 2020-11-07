<!--
Tab grouped panel section component.

This is the improved version of the normal version where showing tab related components are handled by component.

* v-model enabled
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
			<slot :current-tab="currentTab"></slot>
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
		},
	},
	model: {
		prop: 'currentTab',
		event: 'tabClicked',
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
