<template>
	<transition name="wptb-fade">
		<div v-if="isVisible" :style="mainStyle" ref="dataTableMain" class="wptb-data-table-main">
			<data-screen-handler></data-screen-handler>
		</div>
	</transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import DataScreenHandler from '../components/DataScreenHandler';

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
	components: { DataScreenHandler },
	data() {
		return {
			extraPadding: 0,
		};
	},
	mounted() {
		// change component visibility depending on section changes on builder
		document.addEventListener('wptbSectionChanged', ({ detail }) => {
			this.setComponentVisibility(detail === this.sectionName);
		});

		// change component visibility based on current active section
		this.setComponentVisibility(WPTB_Helper.getCurrentSection() === this.sectionName);

		// set startup screen
		this.setCurrentScreen('DataSourceSelection');
	},
	methods: {
		...mapActions(['setComponentVisibility', 'setCurrentScreen']),
	},
	computed: {
		/**
		 * Style for main app component.
		 *
		 * @return {Object} style
		 */
		mainStyle() {
			return {
				marginTop: `${this.headerHeight + this.extraPadding}px`,
				height: `calc( 100% - ${this.headerHeight + this.extraPadding}px)`,
			};
		},
		...mapGetters(['isVisible']),
	},
};
</script>
