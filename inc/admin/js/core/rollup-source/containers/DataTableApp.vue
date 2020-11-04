<template>
	<div :style="mainStyle" ref="dataTableMain" class="wptb-data-table-main">
		<i>data table main</i>
	</div>
</template>

<script>
export default {
	props: {
		sectionName: {
			type: String,
			required: true,
		},
		headerHeight: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			extraPadding: 10,
		};
	},
	mounted() {},
	computed: {
		mainStyle() {
			return {
				paddingTop: `${this.headerHeight + this.extraPadding}px`,
			};
		},
	},
};
</script>
