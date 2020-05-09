<template>
	<div>
		<div ref="wrapper" class="wptb-settings-sections-wrapper" :class="{ child }">
			<section-item
				v-for="item in items"
				:name="item"
				:key="item"
				@sectionchange="handleSectionChange"
				@activeSectionElement="handleActiveSectionElement"
				:current="innerCurrentSection"
			></section-item>
			<active-section-indicator
				:relative-parent="$refs.wrapper"
				:active-item="activeSectionElement"
			></active-section-indicator>
		</div>
		<slot></slot>
	</div>
</template>
<script>
import SectionItem from './SectionItem';
import ActiveSectionIndicator from './ActiveSectionIndicator';

export default {
	model: {
		prop: 'currentSection',
		event: 'updateSection',
	},
	props: {
		child: {
			type: Boolean,
			default: false,
		},
		items: Array,
		currentSection: String,
	},
	components: { SectionItem, ActiveSectionIndicator },
	data() {
		return {
			innerCurrentSection: '',
			activeSectionElement: null,
		};
	},
	mounted() {
		this.innerCurrentSection = this.currentSection || this.items[0];
	},
	watch: {
		innerCurrentSection(n) {
			this.$emit('updateSection', n);
		},
	},
	methods: {
		handleSectionChange(val) {
			this.innerCurrentSection = val;
		},
		handleActiveSectionElement(el) {
			this.activeSectionElement = el;
		},
	},
};
</script>
