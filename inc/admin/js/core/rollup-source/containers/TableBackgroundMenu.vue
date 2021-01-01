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
				<panel-plain-message v-show="currentSelection === null">
					<i>{{ translationM('emptySelectionMessage') }}</i>
				</panel-plain-message>
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
			currentSelection: null,
		};
	},
	mounted() {
		this.$nextTick(() => {
			document.addEventListener('wptbSectionChanged', ({ detail }) => {
				this.visibility = detail === 'background_menu';
			});
		});
	},
	computed: {
		...mapGetters(['generalOptions']),
	},
	methods: {
		...mapMutations(['setGeneralOption']),
	},
};
</script>
