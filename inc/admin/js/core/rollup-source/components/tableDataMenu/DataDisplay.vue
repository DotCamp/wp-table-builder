<template>
	<fragment>
		<div class="wptb-table-data-content" style="font-size: 90% !important;">
			<pre>
		{{ dataObject }}
    </pre
			>
		</div>
		<portal to="footerButtons">
			<div v-if="getEditorActiveId !== null" class="wptb-table-data-menu-footer-buttons-container">
				<menu-button type="danger">{{ translationM('revert') }}</menu-button>
				<menu-button>{{ translationM('save') }}</menu-button>
			</div>
		</portal>
	</fragment>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import MenuButton from '../MenuButton';

export default {
	components: { MenuButton },
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
