<template>
	<div class="wptb-size2-control-container">
		<div class="wptb-settings-item-header wptb-text-transform-cap">
			{{ label }}
		</div>
		<div class="wptb-settings-row wptb-settings-middle-xs wptb-size2-control-input-wrapper">
			<size2-control-column :title="translation('width')">
				<input type="number" v-model="size.width" />
			</size2-control-column>
			<size2-control-column>
				<div
					:title="aspectLocked ? strings.aspectLocked : strings.aspectUnlocked"
					class="wptb-size2-aspect-icon wptb-svg-inherit-color"
					:data-wptb-linked="aspectLocked"
					v-html="linkIcon"
					@click.prevent="toggleAspectLock"
				></div>
			</size2-control-column>
			<size2-control-column :title="translation('height')">
				<input :disabled="aspectLocked" type="number" v-model="size.height" />
			</size2-control-column>
			<size2-control-column>
				<select class="wptb-size2-unit-dropdown" v-model="size.unit">
					<option value="px">px</option>
					<option value="%">%</option>
				</select>
			</size2-control-column>
		</div>
	</div>
</template>

<script>
import withTranslation from '../mixins/withTranslation';
import Size2ControlColumn from './Size2ControlColumn';

export default {
	components: { Size2ControlColumn },
	props: {
		label: {
			type: String,
			default: 'Size Control',
		},
		strings: {
			type: Object,
			default: () => {
				return {};
			},
		},
		size: {
			type: Object,
			default: () => {
				return {
					width: 0,
					height: 0,
					unit: 'px',
				};
			},
		},
	},
	mixins: [withTranslation],
	data() {
		return {
			icons: {
				link: '',
				unlink: '',
			},
			aspectLocked: true,
			aspectRatio: 1,
		};
	},
	mounted() {
		this.$nextTick(() => {
			WPTB_IconManager.getIcon('link', 'wptb-svg-inherit-color', true).then((icon) => {
				this.icons.link = icon;
			});

			WPTB_IconManager.getIcon('unlink', 'wptb-svg-inherit-color', true).then((icon) => {
				this.icons.unlink = icon;
			});
		});
	},
	computed: {
		linkIcon() {
			return this.icons[this.aspectLocked ? 'link' : 'unlink'];
		},
	},
	methods: {
		toggleAspectLock() {
			this.aspectLocked = !this.aspectLocked;
		},
	},
};
</script>
