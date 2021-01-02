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
			<section-group-collapse :label="translationM('customSelection')" :start-collapsed="false">
				<panel-plain-message v-if="currentSelection.item === null">
					<i>{{ translationM('emptySelectionMessage') }}</i>
				</panel-plain-message>
				<div v-else>
					<color-picker
						@colorChanged="setSelectedBackground"
						:color="backgroundBuffer.color"
						:label="translationM('selectedCell')"
					></color-picker>
				</div>
			</section-group-collapse>
		</div>
	</transition>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import SectionGroupCollapse from '../components/leftPanel/SectionGroupCollapse';
import ColorPicker from '../components/ColorPicker';
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';
import PanelPlainMessage from '../components/leftPanel/PanelPlainMessage';

export default {
	components: { PanelPlainMessage, ColorPicker, SectionGroupCollapse },
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
		...mapGetters(['generalOptions', 'currentSelection', 'types']),
	},
	methods: {
		setSelectedBackground(color) {
			this.backgroundBuffer.color = color;

			const { item } = this.currentSelection;

			if (item) {
				item.dataset.wptbOwnBgColor = color;
				item.style.backgroundColor = color;
				this.markTableDirty();
			}
		},
		...mapMutations(['setGeneralOption', 'markTableDirty']),
	},
};
</script>
