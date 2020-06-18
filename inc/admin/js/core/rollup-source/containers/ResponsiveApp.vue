<template>
	<transition name="wptb-fade">
		<div v-if="isVisible" class="wptb-builder-responsive">
			<div class="wptb-responsive-menu-tools">
				<screen-size-slider
					:end-padding="sliderPadding"
					:stops="sizeStops"
					@slide="handleSizeSlideChange"
					:model-val="currentSize"
				></screen-size-slider>
				<size-input v-model="currentSize" :compare-sizes="compareSizes"></size-input>
			</div>
			<div class="wptb-responsive-builder-main">
				<responsive-toolbox
					:size-range="{ name: screenSizes[currentSizeRangeName].name, id: currentSizeRangeName }"
				></responsive-toolbox>
				<table-clone
					:clone="isVisible"
					:clone-query="cloneQuery"
					:table-directives="currentDirectives"
					@tableCloned="tableCloned"
					@directivesCopied="directivesCopied"
				></table-clone>
				<transition name="wptb-fade">
					<div v-if="!directives.responsiveEnabled" class="wptb-responsive-disabled-table-overlay"></div>
				</transition>
			</div>
		</div>
	</transition>
</template>
<script>
/* eslint-disable camelcase */

import TableClone from '../components/TableClone';
import ScreenSizeSlider from '../components/ScreenSizeSlider';
import SizeInput from '../components/SizeInput';
import ResponsiveToolbox from '../components/ResponsiveToolbox';
import WPTB_ResponsiveFrontend from '../../../WPTB_ResponsiveFrontend';
import DeBouncer from '../functions/DeBouncer';

export default {
	props: {
		cloneQuery: {
			type: String,
			required: true,
		},
		screenSizes: Object,
		compareSizes: Object,
	},
	components: { TableClone, ScreenSizeSlider, SizeInput, ResponsiveToolbox },
	data() {
		return {
			isVisible: true,
			currentSize: 0,
			currentDirectives: null,
			currentSizeRangeName: 'desktop',
			sliderPadding: 20,
			sizeStops: {},
			responsiveFrontend: null,
		};
	},
	watch: {
		directives: {
			handler() {
				this.currentDirectives = this.encodeResponsiveDirectives();
			},
			deep: true,
		},
		currentSize(n) {
			const previousRangeName = this.currentSizeRangeName;
			this.currentSizeRangeName = this.calculateSizeRangeName(n);

			if (previousRangeName !== this.currentSizeRangeName) {
				DeBouncer(
					'currentSize',
					() => {
						this.responsiveFrontend.rebuildTables(this.currentSize);
					},
					2000
				);
			}
		},
	},
	beforeMount() {
		// calculate slider size stops before mounting the component
		this.sizeStops = this.sliderSizeStops();
	},
	mounted() {
		// add a listener to section change event to hide/show component
		document.addEventListener('wptbSectionChanged', (e) => {
			this.isVisible = e.detail === 'table_responsive_menu';
		});
	},
	methods: {
		// handler for `tableCloned` event of `TableClone` component. Mainly will be used to set up `WPTB_ResponsiveFrontend` class
		tableCloned() {
			this.responsiveFrontend = new WPTB_ResponsiveFrontend({ query: '.wptb-builder-responsive table' });
		},
		// handler for event that signals end of directive copy operation to table on DOM
		directivesCopied() {
			this.responsiveFrontend.rebuildTables(this.currentSize);
		},
		/**
		 * Recreate an object compatible with screen-size-slider component.
		 *
		 * This function will reduce the screen sizes object sent from backend to be compatible with screen-size-slider component
		 *
		 * @returns {object} reformatted slider size object
		 */
		sliderSizeStops() {
			const normalizedStops = Object.keys(this.screenSizes).reduce((p, c) => {
				if (Object.prototype.hasOwnProperty.call(this.screenSizes, c)) {
					// eslint-disable-next-line no-param-reassign
					p[this.screenSizes[c].name] = this.screenSizes[c].width;
				}
				return p;
			}, {});

			// add stops to directives
			// eslint-disable-next-line vue/no-side-effects-in-computed-properties
			this.directives.stops = normalizedStops;

			return normalizedStops;
		},
		/**
		 * Find out the range key name for the size value
		 *
		 * @param {number} val size value
		 * @return {string} range key name
		 */
		calculateSizeRangeName(val) {
			const mainObject = this.screenSizes;

			const ranges = Object.keys(mainObject)
				.filter((s) => {
					if (Object.prototype.hasOwnProperty.call(mainObject, s)) {
						return mainObject[s].width <= val + this.sliderPadding;
					}
					return false;
				})
				.sort((a, b) => {
					return mainObject[a].width - mainObject[b].width;
				});

			if (ranges.length === 0) {
				return 'mobile';
			}

			return ranges[ranges.length - 1];
		},
		handleSizeSlideChange(e) {
			this.currentSize = e;
		},
		/**
		 * Encode responsive directives.
		 *
		 * @returns {String} base64 string representation of directives
		 */
		encodeResponsiveDirectives() {
			const stringifiedDirectives = JSON.stringify(this.directives);

			return btoa(stringifiedDirectives);
		},
		/**
		 * Decode responsive directives.
		 *
		 * @param {String} val
		 * @returns {String} decoded value
		 */
		decodeResponsiveDirectives(val) {
			return atob(val);
		},
	},
};
</script>
