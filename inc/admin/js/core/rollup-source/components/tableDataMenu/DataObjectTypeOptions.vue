<template>
	<div>
		<component v-if="optionsVisibility" :is="currentComponent"> </component>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import EditorCsvOptions from './EditorCsvOptions';

export default {
	components: { EditorCsvOptions },
	computed: {
		currentComponent() {
			return `Editor${
				this.getCurrentDataObjectType[0].toUpperCase() + this.getCurrentDataObjectType.slice(1)
			}Options`;
		},
		optionsVisibility() {
			return (
				this.getCurrentDataObjectType !== null &&
				Object.keys(this.$options.components).includes(this.currentComponent)
			);
		},
		...mapGetters(['getCurrentDataObjectType']),
	},
};
</script>
