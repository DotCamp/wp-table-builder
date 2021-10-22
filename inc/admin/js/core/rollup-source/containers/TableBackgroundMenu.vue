<template>
	<transition name="wptb-fade">
		<div v-show="visibility" class="wptb-background-menu">
			<section-group-collapse :label="translationM('generalRow')" :start-collapsed="false">
				<color-picker
					:color="generalOptions('headerBg')"
					@colorChanged="setGeneralOption({ subKey: 'headerBg', value: $event })"
					:label="translationM('headerBg')"
				></color-picker>
				<color-picker
					@colorChanged="setGeneralOption({ subKey: 'evenBg', value: $event })"
					:color="generalOptions('evenBg')"
					:label="translationM('evenRow')"
				></color-picker>
				<color-picker
					@colorChanged="setGeneralOption({ subKey: 'oddBg', value: $event })"
					:color="generalOptions('oddBg')"
					:label="translationM('oddRow')"
				></color-picker>
			</section-group-collapse>
			<section-group-collapse v-if="proStatus" :label="translationM('customSelection')" :start-collapsed="false">
				<panel-plain-message v-if="currentSelection.item === null">
					<i>{{ translationM('emptySelectionMessage') }}</i>
				</panel-plain-message>
				<div v-else>
					<color-picker
						@colorChanged="setSelectedBackground"
						:color="backgroundBuffer.color"
						:label="customColorControlLabel"
					></color-picker>
					<panel-message-row
						v-if="columnMixedMessageVisibility"
						:message="translationM('mixedColumnColorMessage')"
					></panel-message-row>
				</div>
			</section-group-collapse>
		</div>
	</transition>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
import SectionGroupCollapse from '$Components/leftPanel/SectionGroupCollapse';
import ColorPicker from '$Components/ColorPicker';
import withNativeTranslationStore from '$Mixins/withNativeTranslationStore';
import PanelPlainMessage from '$Components/leftPanel/PanelPlainMessage';
import PanelMessageRow from '$Components/leftPanel/PanelMessageRow';

export default {
	components: { PanelMessageRow, PanelPlainMessage, ColorPicker, SectionGroupCollapse },
	mixins: [withNativeTranslationStore],
	data() {
		return {
			visibility: true,
			backgroundBuffer: {
				color: '',
			},
		};
	},
	watch: {
		currentSelection: {
			handler(n) {
				const { type, item } = n;

				let colorVal = '';
				if (item !== null) {
					switch (type) {
						case this.types.selected.cell:
							// get color value from cell dataset attribute
							colorVal = item.dataset.wptbOwnBgColor || '';
							break;
						case this.types.selected.row:
							// get color value from row dataset attribute
							colorVal = item.dataset.wptbBgColor || '';
							break;
						case this.types.selected.column:
							colorVal = this.columnItemSharesColor(item) ? item[0].dataset.wptbOwnBgColor || '' : '';
							break;
						default:
							break;
					}
				}

				this.backgroundBuffer.color = colorVal;
			},
			deep: true,
		},
	},
	mounted() {
		this.$nextTick(() => {
			document.addEventListener('wptbSectionChanged', ({ detail }) => {
				this.visibility = detail === 'background_menu';
			});
		});
	},
	computed: {
		customColorControlLabel() {
			const currentType = this.currentSelection.type;

			switch (currentType) {
				case this.types.selected.cell:
					return this.translationM('selectedCell');
				case this.types.selected.row:
					return this.translationM('selectedRow');
				case this.types.selected.column:
					return this.translationM('selectedColumn');
				default:
					return '';
			}
		},
		columnMixedMessageVisibility() {
			const { type, item } = this.currentSelection;
			if (type === this.types.selected.column) {
				return !this.columnItemSharesColor(item);
			}

			return false;
		},
		...mapGetters(['generalOptions', 'currentSelection', 'types']),
		...mapState(['proStatus']),
	},
	methods: {
		columnItemSharesColor(columnItems) {
			const colorToCheck = getComputedStyle(columnItems[0]).backgroundColor;

			const allSameColor = columnItems.every((a) => {
				return getComputedStyle(a).backgroundColor === colorToCheck;
			});

			return allSameColor;
		},
		setSelectedBackground(color) {
			this.backgroundBuffer.color = color;

			let { item, type } = this.currentSelection;

			if (item) {
				// eslint-disable-next-line default-case
				switch (type) {
					case this.types.selected.cell:
						item.dataset.wptbOwnBgColor = color;
						break;
					case this.types.selected.row:
						item.dataset.wptbBgColor = color;
						break;
					case this.types.selected.column:
						// for column type, item value is stored as an array
						// eslint-disable-next-line array-callback-return
						item.map((cell) => {
							// eslint-disable-next-line no-param-reassign
							cell.dataset.wptbOwnBgColor = color;
						});
						break;
				}

				// eslint-disable-next-line no-const-assign
				item = Array.isArray(item) ? item : [item];

				// eslint-disable-next-line array-callback-return
				item.map((a) => {
					// eslint-disable-next-line no-param-reassign
					a.style.backgroundColor = color;
				});

				WPTB_BackgroundMenu.applyOptions();
				this.markTableDirty();

				this.repaintMessage += 1;
			}
		},
		...mapMutations(['setGeneralOption', 'markTableDirty']),
	},
};
</script>
