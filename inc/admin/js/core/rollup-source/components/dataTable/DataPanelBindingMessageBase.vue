<template>
	<transition name="wptb-fade">
		<panel-message-row v-show="visibility">{{ bindingTranslation }}</panel-message-row>
	</transition>
</template>

<script>
import PanelMessageRow from '../leftPanel/PanelMessageRow';

export default {
	components: { PanelMessageRow },
	props: {
		rowBinding: {
			type: Object,
			default: () => {
				return {};
			},
		},
		elementBinding: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	computed: {
		overrideBindingTranslation() {
			return '';
		},
		bindingTranslation() {
			return this.overrideBindingTranslation !== '' && this.overrideBindingTranslation
				? this.overrideBindingTranslation
				: '';
		},
		visibility() {
			return this.bindingTranslation !== '';
		}
	},
};
</script>

<style scoped></style>
