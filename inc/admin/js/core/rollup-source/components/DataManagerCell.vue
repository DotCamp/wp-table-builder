<template>
	<div @mouseenter="handleHover" @click.prevent.capture="handleClick">
		<input class="wptb-data-manager-cell-input" :placeholder="placeHolder" type="text" :value="value" />
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: null,
			default: 0,
		},
		placeHolder: {
			type: String,
			default: 'enter data',
		},
		row: {
			type: Number,
			default: 0,
		},
		column: {
			type: Number,
			default: 0,
		},
	},
	methods: {
		handleHover() {
			this.$emit('cellHover', this.row, this.column);
		},
		handleClick() {
			this.$emit('cellClick', this.row, this.column);
		},
	},
};
</script>
