<template>
	<div class="wptb-tag-control-search-wrapper">
		<div class="wptb-tag-control-search-input">
			<input
				class="wptb-tag-control-search"
				type="text"
				v-model.trim="innerSearchTerm"
				:placeholder="placeholder"
			/>
			<div v-if="innerSearchTerm !== ''" class="wptb-tag-control-search-clear" @click.prevent="clearSearch">
				x
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		searchTerm: {
			type: String,
			default: '',
		},
		placeholder: {
			type: String,
			default: '',
		},
	},
	model: {
		prop: '',
		event: 'termUpdate',
	},
	data() {
		return {
			innerSearchTerm: '',
		};
	},
	watch: {
		searchTerm() {
			this.innerSearchTerm = this.searchTerm;
		},
		innerSearchTerm() {
			this.$emit('termUpdate', this.innerSearchTerm);
			this.$emit('termUpdate', this.innerSearchTerm);
		},
	},
	methods: {
		clearSearch() {
			this.innerSearchTerm = '';
		},
	},
};
</script>
