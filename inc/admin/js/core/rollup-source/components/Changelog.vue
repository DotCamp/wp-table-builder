<template>
	<div class="wptb-version-control-changelog wptb-unselectable" v-html="getVersionChangelog"></div>
</template>

<script>
export default {
	props: {
		rawChangelog: {
			type: String,
			default: 'changelog',
		},
		version: {
			type: String,
			default: '1.0.0',
		},
	},
	data() {
		return {
			parsedChangelog: {},
		};
	},
	mounted() {
		const wrapper = document.createElement('div');
		wrapper.innerHTML = this.rawChangelog;

		const versionWrappers = Array.from(wrapper.querySelectorAll('h4'));
		const changelogWrappers = Array.from(wrapper.querySelectorAll('ul'));

		// eslint-disable-next-line array-callback-return
		versionWrappers.map((v, i) => {
			const version = v.textContent;

			this.parsedChangelog[version] = changelogWrappers[i] !== undefined ? changelogWrappers[i].outerHTML : '';
		});
	},
	computed: {
		getVersionChangelog() {
			if (this.parsedChangelog[this.version]) {
				return this.prepareHeader(this.version) + this.parsedChangelog[this.version];
			}
			return this.prepareHeader(`no changelog found for version${this.version}`);
		},
	},
	methods: {
		prepareHeader(htmlContent) {
			return `<h4 style="text-align: center;">${htmlContent}</h4>`;
		},
	},
};
</script>
