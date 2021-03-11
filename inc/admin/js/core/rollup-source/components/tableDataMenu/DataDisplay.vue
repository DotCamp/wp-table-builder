<template>
	<div class="wptb-table-data-content">
		{{ dataObject }}
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
	watch: {
		getEditorActiveId(n) {
			this.resetDataObject();
			if (n !== null) {
				this.fetchDataObject(n).then((resp) => {
					// TODO [erdembircan] remove for production
					console.log(resp);
				});
			}
		},
	},
	data() {
		return {
			dataObject: null,
		};
	},
	computed: {
		...mapGetters(['getEditorActiveId']),
	},
	methods: {
		resetDataObject() {
			this.dataObject = null;
		},
		...mapActions(['fetchDataObject']),
	},
};
</script>
