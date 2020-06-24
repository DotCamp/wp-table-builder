<template>
	<div class="wptb-screen-size-slider-wrapper" :class="{ 'wptb-drag-active': isDragging }" ref="sliderWrapper">
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
				@click="slide"
				>{{ name }}</slider-stop
			>
		</div>
	</div>
</template>
<script>
import SliderStop from './SliderStop';
import SliderFill from './SliderFill';
import SliderArrow from './SliderArrow';

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
	},
	components: { SliderStop, SliderFill, SliderArrow },
	data() {
		return {
			min: 0,
			max: 100,
			currentVal: 0,
			isDragging: false,
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
	},
	methods: {
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
		 * @param {Number} val value
		 * @returns {number} percent
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
		 * @param {boolean} floor floor the value to nearest integet
		 * @returns {number} limited value
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
		 * @returns {boolean} is active
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
