<template>
	<div class="wptb-generate-menu">
		<div class="wptb-generate-menu-header">
			<input ref="search" class="wptb-generate-search" type="text" placeholder="Search(/ to focus)" />
		</div>
		<div class="wptb-generate-menu-listing">
			<i></i>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		version: {
			type: String,
			default: 'normal',
		},
	},
	mounted() {
		window.addEventListener('keyup', (e) => {
			if (e.key !== undefined && e.key === '/') {
				this.focusToSearch();
			} else if (e.keyCode !== undefined && e.keyCode === 191) {
				this.focusToSearch();
			}
		});
	},
	methods: {
		focusToSearch() {
			this.$refs.search.focus();
		},
	},
};
</script>
