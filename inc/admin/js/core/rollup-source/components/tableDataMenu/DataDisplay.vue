<template>
	<div class="wptb-table-data-content" style="font-size: 90% !important;">
		<pre>
		{{ dataObject }}
    </pre
		>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
	watch: {
		getEditorActiveId(n) {
			this.resetDataObject();
			if (n !== null) {
				this.fetchDataObject(n)
					.then((resp) => {
						this.dataObject = resp;
					})
					.catch(() => {
						// do nothing
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
