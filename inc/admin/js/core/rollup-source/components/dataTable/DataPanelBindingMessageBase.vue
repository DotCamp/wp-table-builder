<template>
	<transition name="wptb-fade">
		<panel-message-row v-show="visibility" :message="bindingTranslation"></panel-message-row>
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
			return this.overrideBindingTranslation;
		},
		visibility() {
			return this.bindingTranslation !== '';
		},
	},
	methods: {
		emphasize(value) {
			return `<span class="wptb-data-panel-message-emphasize">${value}</span>`;
		},
	},
};
</script>
