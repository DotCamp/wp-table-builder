<template>
	<div class="wptb-size-input-wrapper">
		<select v-model="currentSizeCompare">
			<option value="responsive">Responsive</option>
			<option v-for="(value, key) in compareSizes" :key="key" :value="key"> {{ key }}</option>
		</select>
		<number-postfix-input
			class="wptb-size-input"
			v-model="innerSize"
			post-fix=" px"
			:only-enter="true"
		></number-postfix-input>
	</div>
</template>
<script>
import NumberPostfixInput from './NumberPostfixInput';

export default {
	props: ['size', 'compareSizes'],
	components: { NumberPostfixInput },
	model: {
		prop: 'size',
		event: 'sizeChanged',
	},
	data() {
		return {
			innerSize: 0,
			currentSizeCompare: 'responsive',
		};
	},
	watch: {
		/**
		 * Watch the size prop sent from parent component.
		 */
		size(n) {
			this.innerSize = n;
			this.decideCompareSize(n);
		},
		/**
		 * Watch innerSize property
		 * This property is being used for internally to compliment v-model system of Vue
		 */
		innerSize(n) {
			// check for empty input element, and reset the value to 0 in that case
			if (n === '') {
				this.innerSize = 0;
				return;
			}
			this.$emit('sizeChanged', Number.parseInt(n, 10));
		},
		/**
		 * Emit associated width value with the key selected from select element.
		 */
		currentSizeCompare(n) {
			if (n === 'Responsive') {
				return;
			}
			if (Object.keys(this.compareSizes).includes(n)) {
				this.innerSize = this.compareSizes[n];
			}
		},
	},
	methods: {
		/**
		 * Decide which compare size fits size changed and sent from parent component.
		 *
		 * @param {number} val value
		 */
		decideCompareSize(val) {
			this.currentSizeCompare = 'responsive';

			// eslint-disable-next-line array-callback-return
			Object.keys(this.compareSizes).map((s) => {
				if (Object.prototype.hasOwnProperty.call(this.compareSizes, s)) {
					if (this.compareSizes[s] === val) {
						this.currentSizeCompare = s;
					}
				}
			});
		},
	},
};
</script>
