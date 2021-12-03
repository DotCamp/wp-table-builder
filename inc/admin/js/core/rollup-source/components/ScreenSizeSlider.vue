<template>
	<div
		:key="repaintId"
		class="wptb-screen-size-slider-wrapper"
		:class="{ 'wptb-drag-active': isDragging }"
		ref="sliderWrapper"
	>
		<div class="wptb-screen-size-slider-empty">
			<slider-arrow
				:position-percentage="translateIntoPercent(limitToRange(currentVal))"
				@arrowDrag="handleArrowDrag"
				@arrowDragEnd="isDragging = false"
			></slider-arrow>
			<slider-fill :amount="translateIntoPercent(limitToRange(currentVal))"></slider-fill>
			<slider-stop
				v-for="({ name, width }, key) in stops"
				:active="isStopActive(width)"
				:key="key"
				:value="translateIntoPercent(width)"
				:raw-value="width"
				:stop-id="key"
				@click="slide"
				:enableBreakpointCustomization="enableBreakpointCustomization"
				@breakpointChange="handleBreakpointChange"
				:disabled="isBreakpointDisabled(key)"
				>{{ directives.relativeWidth === 'window' ? name : `${width}px` }}
			</slider-stop>
		</div>
	</div>
</template>
<script>
import SliderStop from '$Components/SliderStop';
import SliderFill from '$Components/SliderFill';
import SliderArrow from '$Components/SliderArrow';

export default {
	props: {
		stops: Object,
		// with endPadding, slider will ignore min/max values and calculate those with the supplied stops by adding/subtracting this endPadding prop
		endPadding: {
			type: Number,
			default: 0,
		},
		modelVal: {
			type: Number,
			default: 0,
		},
		enableBreakpointCustomization: {
			type: Boolean,
			default: false,
		},
	},
	components: { SliderStop, SliderFill, SliderArrow },
	data() {
		return {
			min: 0,
			max: 100,
			currentVal: 0,
			isDragging: false,
			// minimum size between breakpoints to avoid them overlap or share the same breakpoint size
			minSizeBetweenBreakpoints: 100,
			repaintId: 0,
		};
	},
	beforeMount() {
		this.calculateMinMax();
	},
	watch: {
		currentVal() {
			this.$emit('slide', this.currentVal);
		},
		modelVal(n) {
			this.currentVal = Math.floor(n);
		},
		'directives.relativeWidth': {
			handler() {
				this.repaintId += 1;
			},
			deep: true,
		},
	},
	methods: {
		isBreakpointDisabled(breakpointId) {
			return this.directives.modeOptions[this.directives.responsiveMode].disabled[breakpointId];
		},
		handleBreakpointChange(newSize, breakpointId) {
			const breakpointObj = this.directives.breakpoints;
			if (breakpointObj[breakpointId]) {
				const sortedIds = Object.keys(breakpointObj).sort((a, b) => {
					return breakpointObj[a].width - breakpointObj[b].width;
				});

				// limit assigning a higher or lower value then the changed breakpoints logical place
				const currentIndex = sortedIds.indexOf(breakpointId);

				const minSibling = sortedIds[currentIndex - 1];
				const maxSibling = sortedIds[currentIndex + 1];

				if (minSibling) {
					if (breakpointObj[minSibling].width >= newSize) {
						// eslint-disable-next-line no-param-reassign
						newSize = breakpointObj[minSibling].width + this.minSizeBetweenBreakpoints;
					}
				}
				if (maxSibling) {
					if (breakpointObj[maxSibling].width <= newSize) {
						// eslint-disable-next-line no-param-reassign
						newSize = breakpointObj[maxSibling].width - this.minSizeBetweenBreakpoints;
					}
				}

				breakpointObj[breakpointId].width = newSize;
				this.calculateMinMax();
				this.repaintId += 1;
			} else {
				throw new Error(`no breakpoint found with the given ID: [${breakpointId}]`);
			}
		},
		/**
		 * Calculate min/max values for the current slider.
		 */
		calculateMinMax() {
			const sortedValues = Object.values(this.stops).sort((a, b) => (b.width - a.width) * -1);

			this.min = sortedValues[0].width - this.endPadding;
			this.max = sortedValues[sortedValues.length - 1].width + this.endPadding;

			this.currentVal = sortedValues[sortedValues.length - 1].width;
		},
		/**
		 * Translate the supplied value into percentage within the context of min/max values of slider.
		 *
		 * @param {number} val value
		 * @return {number} percent
		 */
		translateIntoPercent(val) {
			const range = this.max - this.min;
			return ((val - this.min) * 100) / range;
		},
		slide(val) {
			this.currentVal = val;
		},
		handleArrowDrag(e) {
			this.isDragging = true;

			const { sliderWrapper } = this.$refs;
			const { left, width } = sliderWrapper.getBoundingClientRect();

			// relative position of arrow to the slider
			const relativePosition = e.clientX - left;
			const range = this.max - this.min;

			// value limited to range of min-max values
			const offsetVal = (relativePosition * range) / width;

			// floor the value to nearest integer
			this.currentVal = this.limitToRange(this.min + offsetVal);
		},
		/**
		 * Limit given value to min/max values.
		 *
		 * @param {number} val value
		 * @param {boolean} floor floor the value to nearest integer
		 * @return {number} limited value
		 */
		limitToRange(val, floor = false) {
			let tempVal = val;

			if (val < this.min) {
				tempVal = this.min;
			}
			if (val > this.max) {
				tempVal = this.max;
			}

			if (floor) {
				tempVal = Math.floor(tempVal);
			}

			return tempVal;
		},
		/**
		 * Calculate if given value represents the active section of the responsive range.
		 *
		 * @param {number} val value
		 * @return {boolean} is active
		 */
		isStopActive(val) {
			if (this.currentVal >= val) {
				const smallerVals = Object.values(this.stops).filter((s) => s <= this.currentVal);

				return smallerVals.every((s) => s <= val);
			}
			return false;
		},
	},
};
</script>
