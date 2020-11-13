<template>
	<fragment>
		<panel-dropdown-control
			:label="translationM('csvDelimiter') | cap"
			:options="deLimiterOptions"
			v-model="delimiter"
		></panel-dropdown-control>
		<panel-button-control @buttonClick="showDataManagerTabGroup('csv')" v-if="!isSourceDataCreated">{{
			translationM('createYourData') | cap
		}}</panel-button-control>
	</fragment>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import PanelDropdownControl from './PanelDropdownControl';
import PanelButtonControl from './PanelButtonControl';
import withNativeTranslationStore from '../mixins/withNativeTranslationStore';

export default {
	components: { PanelDropdownControl, PanelButtonControl },
	mixins: [withNativeTranslationStore],
	data() {
		return {
			deLimiterOptions: {
				comma: this.translationM('commaDelimiter'),
			},
		};
	},
	computed: {
		delimiter: {
			get() {
				return this.$store.state.dataSource.setup.csv.controls.delimiter;
			},
			set(n) {
				this.$store.commit('updateCsvDelimiter', n);
			},
		},
		...mapGetters(['isSourceDataCreated']),
	},
	methods: {
		...mapMutations(['showDataManagerTabGroup']),
	},
};
</script>
