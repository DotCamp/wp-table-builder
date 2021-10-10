<template>
	<div class="wptb-multi-checkbox-wrapper">
		<div class="wptb-settings-item-header wptb-text-transform-cap" :data-wptb-text-disabled="disabled">
			{{ label }}
		</div>
		<div class="wptb-settings-row wptb-settings-middle-xs">
			<div
				class="wptb-settings-checkbox-row"
				:data-wptb-checked="isChecked(key)"
				v-for="(label, key) in checkboxes"
				:key="key"
			>
				<div>
					<input
						class="wptb-multi-checkbox-item"
						:id="key"
						type="checkbox"
						:value="key"
						v-model="selectedValues"
					/>
				</div>
				<label :for="key">{{ label }}</label>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		label: {
			type: String,
			default: 'Multi checkbox',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		checkboxes: {
			type: Object,
			default: () => {},
		},
		values: {
			type: Array,
			default: () => [],
		},
	},
	model: {
		prop: 'values',
		event: 'valueChanged',
	},
	data() {
		return {
			selectedValues: [],
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.selectedValues = [...this.values];
		});
	},
	watch: {
		selectedValues: {
			handler(n, o) {
				if (JSON.stringify(n) !== JSON.stringify(o)) {
					this.$emit('valueChanged', n);
				}
			},
			deep: true,
		},
		values: {
			handler(n) {
				this.selectedValues = [...n];
			},
			deep: true,
		},
	},
	methods: {
		isChecked(key) {
			return this.selectedValues.includes(key);
		},
	},
};
</script>
