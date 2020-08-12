<template>
	<div
		class="wptb-settings-row wptb-settings-middle-xs wptb-element-property"
		:class="uniqueId"
		:data-element="elemContainer"
	>
		<div class="wptb-settings-space-between">
			<p class="wptb-settings-item-title">{{ label }}</p>
			<div class="wptb-named-toggle-control-wrapper">
				<named-toggle-active-indicator :ref-element="activeElement"></named-toggle-active-indicator>
				<named-toggle-item
					v-for="(v, k) in items"
					:title="v"
					:id="k"
					:key="k"
					:active="isItemActive(k)"
					@activateItem="activateItem"
				></named-toggle-item>
			</div>
		</div>
	</div>
</template>
<script>
import ControlBase from '../mixins/ControlBase';
import NamedToggleItem from '../components/NamedToggleItem';
import NamedToggleActiveIndicator from '../components/NamedToggleActiveIndicator';

export default {
	components: { NamedToggleActiveIndicator, NamedToggleItem },
	props: {
		items: {
			type: Object,
			default: () => {
				return {
					item: 'item',
				};
			},
		},
	},
	mixins: [ControlBase],
	data() {
		return {
			activeElement: null,
		};
	},
	mounted() {
		this.assignDefaultValue();
	},
	watch: {
		elementMainValue(n) {
			this.setAllValues(n);
			this.generateChangeEvent(n);
			this.setTableDirty(true);
		},
	},
	methods: {
		isItemActive(id) {
			return this.elementMainValue === id;
		},
		activateItem(id, refElement) {
			this.elementMainValue = id;
			this.activeElement = refElement;
		},
	},
};
</script>
