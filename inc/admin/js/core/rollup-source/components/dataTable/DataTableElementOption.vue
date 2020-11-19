<template>
	<div>
		<i>element data option</i>
	</div>
</template>

<script>
export default {
	name: 'DataTableElementOption',
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
};
</script>
