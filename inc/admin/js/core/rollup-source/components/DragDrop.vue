<!--Drag and Drop Component-->
<template>
	<div
		class="wptb-menu-file-drop"
		:class="eventClass"
		@dragenter.stop.prevent="dragActive = true"
		@dragleave.stop.prevent="dragActive = false"
		@drop.stop.prevent="handleDrop"
		@dragover.stop.prevent="dragActive = true"
	>
		<transition name="wptb-fade" mode="out-in">
			<div v-if="dragActive" key="fileLogo" class="file-icon">
				<span class="dashicons dashicons-media-spreadsheet"></span>
			</div>
			<div v-else key="controls">
				<transition name="wptb-fade" mode="out-in">
					<div
						v-if="currentFile === null"
						class="wptb-flex wptb-flex-col wptb-flex-align-center"
						key="selection"
					>
						<div class="hint">{{ texts.hint }}</div>
						<div class="supported wptb-text-transform-none">({{ allowedFormats.join(', ') }})</div>
						<div>
							<a @click.prevent="openFileSelect">{{ texts.browse }}</a>
							<input @change="handleFileSelect" ref="fileSelect" type="file" style="display: none;" />
						</div>
					</div>
					<div v-else key="selected" class="wptb-flex wptb-flex-col wptb-flex-align-center">
						<div class="file">{{ currentFile.name }}</div>
						<div>
							<a @click.prevent="clearCurrentFile">{{ texts.clear }}</a>
						</div>
					</div>
				</transition>
			</div>
		</transition>
	</div>
</template>
<script>
export default {
	props: ['texts', 'file', 'allowedFormats'],
	model: {
		prop: 'file',
		event: 'fileChanged',
	},
	data() {
		return {
			dragActive: false,
			currentFile: null,
		};
	},
	mounted() {
		this.currentFile = this.file;
	},
	watch: {
		currentFile(n) {
			this.$emit('fileChanged', n);
		},
		file(n) {
			this.currentFile = n;
		},
	},
	computed: {
		eventClass() {
			return this.dragActive ? 'dragenter' : '';
		},
	},
	methods: {
		handleDrop(event) {
			this.dragActive = true;
			const dt = event.dataTransfer;
			if (dt.files[0]) {
				if (this.isTypeAllowed(dt.files[0])) {
					[this.currentFile] = dt.files;
				}
			}
			this.dragActive = false;
		},
		isTypeAllowed(fileName) {
			const extension = fileName.name.split('.').pop();
			return this.allowedFormats.includes(extension);
		},
		openFileSelect() {
			this.$refs.fileSelect.click();
		},
		handleFileSelect(e) {
			if (e.target.files.length > 0 && this.isTypeAllowed(e.target.files[0])) {
				[this.currentFile] = e.target.files;
			}
		},
		clearCurrentFile() {
			this.currentFile = null;
		},
	},
};
</script>
