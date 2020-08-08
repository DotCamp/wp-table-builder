<template>
	<div class="wptb-settings-row wptb-settings-middle-xs">
		<div class="wptb-settings-space-between">
			<p class="wptb-settings-item-title">{{ label }}</p>
			<div class="wptb-control-media-button-wrapper">
				<div
					class="wptb-control-media-select-button"
					:style="{ backgroundImage: previewImageUrl }"
					@click="open"
				></div>
				<div class="wptb-control-media-clear-button" @click.capture="resetImg">
					<span class="dashicons dashicons-dismiss"></span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import ControlBase from '../mixins/ControlBase';

export default {
	mixins: [ControlBase],
	props: {
		mediaAttr: {
			type: Object,
			required: false,
			default: () => {
				return {
					title: 'Media Select',
					button: {
						text: 'Select',
					},
					multiple: false,
				};
			},
		},
	},
	data() {
		return {
			frame: null,
		};
	},
	mounted() {
		this.assignDefaultValue();
	},
	watch: {
		elementMainValue(n) {
			this.setAllValues(n);

			this.setTableDirty(true);
		},
	},
	computed: {
		previewImageUrl() {
			return `url("${this.elementMainValue}")`;
		},
	},
	methods: {
		open() {
			if (this.frame) {
				this.frame.open();
			} else {
				this.frame = wp.media(this.mediaAttr);

				this.frame.on('select', () => {
					const { url } = this.frame.state().get('selection').first().toJSON();

					this.elementMainValue = url;
				});

				this.frame.open();
			}
		},
		resetImg() {
			this.elementMainValue = '';
		},
	},
};
</script>
