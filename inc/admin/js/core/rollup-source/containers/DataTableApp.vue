<template>
	<div :style="mainStyle" ref="dataTableMain" v-if="isVisible" class="wptb-data-table-main">
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
			isVisible: false,
			extraPadding: 10,
		};
	},
	mounted() {
		document.addEventListener('wptbSectionChanged', ({ detail }) => {
			this.isVisible = detail === this.sectionName;
		});
		this.isVisible = WPTB_Helper.getCurrentSection() === this.sectionName;
	},
	computed: {
		mainStyle() {
			return {
				paddingTop: `${this.headerHeight + this.extraPadding}px`,
			};
		},
	},
};
</script>
