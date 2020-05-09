<!--Table row element with a builtin sort functionality-->
<template>
	<td @click.prevent="sort">
		{{ label }}
	</td>
</template>
<script>
export default {
	props: ['label', 'index'],
	data() {
		return {
			currentDirection: 1,
		};
	},
	methods: {
		/**
		 * Main sort function
		 */
		sort() {
			this.currentDirection *= -1;
			this.$emit('sort', this.index, this.currentDirection);
		},
	},
};
</script>
