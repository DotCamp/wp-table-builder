<template>
	<div class="wptb-search-input-wrapper">
		<input
			:disabled="disabled"
			class="wptb-search-input-element"
			type="text"
			v-model="searchTerm"
			:placeholder="placeholder"
		/>
		<div
			v-if="clearButtonVisibility"
			:data-disabled="disabled"
			class="wptb-search-input-clear"
			@click.prevent="clearSearch"
		>
			X
		</div>
	</div>
</template>

<script>
export default {
	props: {
		placeholder: {
			type: String,
			default: '',
		},
		value: {
			type: String,
			default: '',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	model: {
		prop: 'value',
		event: 'valueChanged',
	},
	data() {
		return {
			searchTerm: this.value,
		};
	},
	mounted() {},
	watch: {
		searchTerm(n) {
			this.$emit('valueChanged', n.trim());
		},
		value(n) {
			this.searchTerm = n.trim();
		},
	},
	computed: {
		clearButtonVisibility() {
			return this.searchTerm !== '';
		},
	},
	methods: {
		clearSearch() {
			if (!this.disabled) {
				this.searchTerm = '';
			}
		},
	},
};
</script>
