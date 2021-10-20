<template>
	<div class="wptb-size2-control-container">
		<div class="wptb-settings-item-header-include-right wptb-text-transform-cap">
			<div class="wptb-settings-space-between">
				<div>
					{{ label }}
				</div>
				<div
					@click.prevent="resetToOriginalSize"
					:title="translation('resetToOriginal')"
					class="wptb-settings-generic-icon wptb-svg-inherit-color wptb-settings-reset-size2-control"
					v-html="icons['undo-alt']"
				></div>
			</div>
		</div>
		<div class="wptb-settings-row wptb-settings-middle-xs wptb-size2-control-input-wrapper">
			<size2-control-column :title="translation('width')">
				<input min="1" type="number" v-model="size.width" />
			</size2-control-column>
			<size2-control-column>
				<div
					:title="aspectLocked ? strings.aspectLocked : strings.aspectUnlocked"
					class="wptb-size2-aspect-icon wptb-svg-inherit-color"
					:data-wptb-linked="aspectLocked"
					v-html="linkIcon"
					@click.prevent="toggleAspectLock"
				></div>
			</size2-control-column>
			<size2-control-column :title="translation('height')">
				<input min="1" :disabled="aspectLocked" type="number" v-model="size.height" />
			</size2-control-column>
			<size2-control-column>
				<select class="wptb-size2-unit-dropdown" v-model="size.unit">
					<option :key="key" v-for="(value, key) in availableUnits" :value="value">{{ value }}</option>
				</select>
			</size2-control-column>
			<div class="wptb-size-control-aspect-ratio-info-container">
				{{ translation('originalAspectRatio') | cap }}:
				<span style="font-weight: bold">{{ humanReadableAspectRatio }}</span>
			</div>
		</div>
	</div>
</template>

<script>
import withTranslation from '$Mixins/withTranslation';
import withIcons from '$Mixins/withIcons';
import Size2ControlColumn from '$Components/Size2ControlColumn';

export default {
	components: { Size2ControlColumn },
	props: {
		aspectRatio: {
			type: Number,
			default: 1,
		},
		label: {
			type: String,
			default: 'Size Control',
		},
		strings: {
			type: Object,
			default: () => {
				return {};
			},
		},
		size: {
			type: Object,
			default: () => {
				return {
					width: 0,
					height: 0,
					unit: 'px',
				};
			},
		},
		originals: {
			type: Object,
			default: () => {
				return {
					width: 0,
					height: 0,
				};
			},
		},
	},
	mixins: [withTranslation, withIcons(['link', 'unlink', 'undo-alt'])],
	data() {
		return {
			aspectLocked: true,
			fractionDigits: 0,
			mountedState: false,
			availableUnits: {
				percent: '%',
				pixel: 'px',
			},
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.mountedState = true;
		});
	},
	watch: {
		originals: {
			handler() {
				this.calculatePreciseValues();
			},
			deep: true,
		},
		size: {
			handler() {
				this.calculatePreciseValues();
			},
			deep: true,
		},
		'size.width': {
			handler() {
				this.size.height = this.calculateHeight();
			},
		},
		'size.unit': {
			handler(n) {
				if (this.mountedState) {
					this.convertToUnit(n);
				}
			},
		},
		aspectLocked(n) {
			if (n) {
				this.size.height = this.calculateHeight();
			}
		},
	},
	computed: {
		humanReadableAspectRatio() {
			return this.aspectRatio.toFixed(2);
		},
		linkIcon() {
			return this.icons[this.aspectLocked ? 'link' : 'unlink'];
		},
	},
	methods: {
		currentUnitCheck(unit) {
			return this.size.unit === unit;
		},
		calculateHeight() {
			let calculatedHeight = this.size.height;
			if (this.aspectLocked && this.aspectRatio !== 0) {
				calculatedHeight = this.toFixed(
					this.currentUnitCheck(this.availableUnits.percent)
						? this.size.width
						: this.size.width / this.aspectRatio
				);
			}

			return calculatedHeight;
		},
		toggleAspectLock() {
			this.aspectLocked = !this.aspectLocked;
		},
		resetToOriginalSize() {
			this.size.width = this.currentUnitCheck(this.availableUnits.pixel) ? this.originals.width : 100;
			this.size.height = this.currentUnitCheck(this.availableUnits.pixel) ? this.originals.height : 100;
		},
		toFixed(val) {
			return val.toFixed ? val.toFixed(this.fractionDigits) : val;
		},
		convertToUnit(unitType) {
			if (unitType === '%') {
				this.size.width = this.toFixed((this.size.width / this.originals.width) * 100);

				if (!this.aspectLocked) {
					this.size.height = this.toFixed((this.size.height / this.originals.height) * 100);
				}
			} else {
				this.size.width = this.toFixed((this.originals.width / 100) * this.size.width);

				if (!this.aspectLocked) {
					this.size.height = this.toFixed((this.originals.height / 100) * this.size.height);
				}
			}
		},
		calculatePreciseValues() {
			const precise = {
				width: this.size.width,
				height: this.size.height,
				unit: 'px',
			};

			if (this.currentUnitCheck(this.availableUnits.percent)) {
				precise.width = this.toFixed((this.originals.width / 100) * this.size.width);
				precise.height = this.toFixed((this.originals.height / 100) * this.size.height);
			}

			this.$emit('sizeUpdate', {
				raw: { ...this.size },
				precise,
			});
		},
	},
};
</script>
