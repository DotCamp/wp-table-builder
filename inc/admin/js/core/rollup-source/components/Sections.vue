<template>
	<div>
		<div ref="wrapper" class="wptb-settings-sections-wrapper" :class="{ child }">
			<section-item
				v-for="item in getItems"
				:name="item.id"
				:label="item.label"
				:key="item.id"
				@sectionchange="handleSectionChange"
				@activeSectionElement="handleActiveSectionElement"
				:current="innerCurrentSection"
				:disabled="disabled"
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
		items: null,
		currentSection: String,
		disabled: {
			type: Boolean,
			default: false,
		},
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
	computed: {
		getItems() {
			const { items } = this;
			return Object.keys(items)
				.reduce((carry, item) => {
					if (Object.prototype.hasOwnProperty.call(items, item)) {
						carry.push({ priority: 0, ...items[item], id: item });
					}
					return carry;
				}, [])
				.sort((a, b) => {
					if (a.id === 'general' || b.id === 'general') {
						return a.id === 'general' ? -1 : 1;
					}
					return b.priority - a.priority;
				});
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
