<template>
	<transition name="wptb-fade">
		<div
			v-show="componentVisibility"
			class="wptb-settings-row wptb-settings-middle-xs wptb-different-border-control-wrapper"
		>
			<table-cell-select
				:table="table"
				v-model="selectedCell"
				:cell-extra-styling="cellStyling"
				:repaint="repaintId"
			></table-cell-select>
			<range-input
				class="wptb-different-border-range-input"
				v-model="borderProps.currentBorderSize"
				post-fix="px"
				:label="translation('borderWidth')"
				:min="min"
				:max="max"
				:disabled="!controlsActive"
			></range-input>
			<cell-indicator :repaint="repaintId" :cell="selectedCell"></cell-indicator>
			<color-picker
				:label="translation('borderColor')"
				v-model="borderProps.currentBorderColor"
				:disabled="!controlsActive"
			></color-picker>
		</div>
	</transition>
</template>

<script>
import ControlBase from '$Mixins/ControlBase';
import TableCellSelect from '$Components/TableCellSelect';
import CellIndicator from '$Components/CellIndicator';
import RangeInput from '$Components/RangeInput';
import withTranslation from '$Mixins/withTranslation';
import ColorPicker from '$Components/ColorPicker';

export default {
	mixins: [ControlBase, withTranslation],
	components: { TableCellSelect, CellIndicator, RangeInput, ColorPicker },
	data() {
		return {
			table: null,
			hoveredCell: null,
			selectedCell: null,
			borderProps: {
				currentBorderSize: 0,
				currentBorderColor: '#000000',
			},
			repaintId: 0,
			min: 0,
			max: 50,
			controlsActive: false,
		};
	},
	watch: {
		borderProps: {
			handler(n) {
				if (this.selectedCell) {
					const { borderWidth, borderColor } = this.selectedCell.style;
					if (
						Number.parseInt(borderWidth, 10) !== n.currentBorderSize ||
						borderColor !== n.currentBorderColor
					) {
						this.selectedCell.style.borderWidth = `${n.currentBorderSize}px`;
						this.selectedCell.style.borderColor = `${n.currentBorderColor}`;
						this.repaintId += 1;
						this.setTableDirty(false);
					}
				}
			},
			deep: true,
		},
		selectedCell: {
			handler(n) {
				if (n) {
					const { borderWidth, borderColor } = n.style;
					this.$set(this.borderProps, 'currentBorderSize', Number.parseInt(borderWidth, 10));
					this.$set(this.borderProps, 'currentBorderColor', this.toHex(borderColor));
				}

				this.controlsActive = n !== null;
			},
			deep: true,
		},
	},
	mounted() {
		this.table = document.querySelector('.wptb-management_table_container .wptb-table-setup table');
	},
	methods: {
		/**
		 * Transform a decimal into its hexadecimal equal.
		 *
		 * @param {string} val value
		 * @return {string} changed hex value
		 */
		hexConvertor(val) {
			const hex = Number.parseInt(val, 10).toString(16);
			return hex.length === 1 ? `0${hex}` : hex;
		},
		toHex(rgbVal) {
			if (!rgbVal.startsWith('#') && rgbVal !== '') {
				const regExp = new RegExp(/rgb\(\s?(\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})\)/);
				if (regExp) {
					const [, red, green, blue] = regExp.exec(rgbVal);

					return `#${this.hexConvertor(red)}${this.hexConvertor(green)}${this.hexConvertor(blue)}`;
				}
			}
			return rgbVal;
		},
		cellStyling(cell) {
			const { borderWidth, borderStyle, borderColor } = cell.style;

			return {
				borderWidth,
				borderStyle,
				borderColor,
			};
		},
	},
};
</script>
