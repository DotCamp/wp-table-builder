<template>
	<component
		@valueChanged="$emit('valueChanged', $event)"
		:column-bindings="columnBindings"
		:is="elementExtraOptions"
	></component>
</template>

<script>
import IconExtraDataOptions from './IconExtraDataOptions';

export default {
	components: { IconExtraDataOptions },
	props: {
		elementType: {
			type: String,
			default: '',
		},
		columnBindings: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	computed: {
		elementExtraOptions() {
			let currentComponent = '';
			if (
				Object.keys(this.$options.components).includes(
					this.getElementExtraOptionComponentName(this.elementType)
				)
			) {
				currentComponent = this.getElementExtraOptionComponentName(this.elementType);
			}

			return currentComponent;
		},
	},
	methods: {
		getElementExtraOptionComponentName(elementType) {
			let componentName = '';

			if (elementType) {
				const capitalizedElementType = elementType
					.split('_')
					.map((part) => part[0].toUpperCase() + part.slice(1))
					.join('');

				// elements with extra data table options should follow name convention of ${elementTypeCapitalizedFirstLetters}ExtraDataOptions
				componentName = `${capitalizedElementType}ExtraDataOptions`;
			}
			return componentName;
		},
	},
};
</script>
