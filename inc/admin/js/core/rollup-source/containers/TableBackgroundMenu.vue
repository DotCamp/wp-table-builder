<template>
	<transition name="wptb-fade">
		<div v-if="visibility" class="wptb-background-menu">
			<section-group-collapse :start-collapsed="false">
				<color-picker label="header color"></color-picker>
			</section-group-collapse>
		</div>
	</transition>
</template>

<script>
import SectionGroupCollapse from '../components/leftPanel/SectionGroupCollapse';
import ColorPicker from '../components/ColorPicker';

export default {
	components: { ColorPicker, SectionGroupCollapse },
	data() {
		return {
			visibility: true,
		};
	},
	mounted() {
		this.$nextTick(() => {
			document.addEventListener('wptbSectionChanged', ({ detail }) => {
				this.visibility = detail === 'background_menu';
			});
		});
	},
};
</script>
