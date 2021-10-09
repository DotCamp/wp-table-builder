<template>
	<control-wrapper
		:compatibility-mode="true"
		:visibility="componentVisibility"
		:elem-container="elemContainer"
		:main-value="elementMainValue"
		:unique-id="uniqueId"
	>
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
	</control-wrapper>
</template>
<script>
import ControlWrapper from '../components/ControlWrapper';
import ControlBase from '../mixins/ControlBase';
import NamedToggleItem from '../components/NamedToggleItem';
import NamedToggleActiveIndicator from '../components/NamedToggleActiveIndicator';

export default {
	components: { NamedToggleActiveIndicator, NamedToggleItem, ControlWrapper },
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
			this.basicValueUpdate(n, true);
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
