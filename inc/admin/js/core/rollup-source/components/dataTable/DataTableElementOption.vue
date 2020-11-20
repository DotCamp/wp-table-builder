<template>
	<section-group-collapse section-id="dataTableElementOption" :label="translation('collapseSectionHeader')">
		<i>
			test control
		</i>
	</section-group-collapse>
</template>

<script>
import { mapGetters } from 'vuex';
import SectionGroupCollapse from '../leftPanel/SectionGroupCollapse';

export default {
	components: { SectionGroupCollapse },
	data() {
		return {
			currentElement: null,
		};
	},
	mounted() {
		document.addEventListener('element:controls:active:global', ({ detail: element }) => {
			if (element.getAttribute('class').includes('wptb-ph-element')) {
				this.currentElement = element;
				console.log(element);
			}
		});
	},
	computed: {
		...mapGetters(['translation']),
	},
};
</script>
