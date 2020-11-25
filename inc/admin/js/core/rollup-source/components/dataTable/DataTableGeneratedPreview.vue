<template>
	<div
		v-show="visibility"
		:style="wrapperStyle"
		:class="{
			'wptb-data-table-generated-preview-bold': toggleStatus && heightHandleHover,
			'wptb-data-table-generated-preview-faster-transition': style.height !== savedHeight,
		}"
		class="wptb-data-table-generated-preview"
		:data-toggle="toggleStatus"
	>
		<div class="wptb-data-table-generated-inner-wrapper">
			<data-table-drag-handle
				@draggingStart="savedHeight = style.height"
				@dragging="handleHeightResize"
				@handleHover="heightHandleHover = arguments[0]"
				@draggingEnd="savedHeight = style.height"
			></data-table-drag-handle>
			<div
				ref="toggleButton"
				class="wptb-data-table-generated-preview-toggle"
				@click.prevent.capture="toggleStatus = !toggleStatus"
			>
				<div>{{ translationM('dataTablePreview') }}</div>
				<div
					v-html="getIcon('chevronRight')"
					class="wptb-data-table-preview-toggle-icon wptb-flex wptb-justify-content-center wptb-flex-align-center"
				></div>
			</div>
			<transition-group name="wptb-fade" mode="out-in">
				<div key="previewEmpty" class="wptb-data-table-empty-preview" v-show="!previewHtml">
					{{ translationM('emptyDataTablePreview') }}
				</div>
				<div key="preview" v-show="previewHtml" class="wptb-data-table-preview-main" v-html="previewHtml"></div>
			</transition-group>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import DataTableDragHandle from './DataTableDragHandle';
import withNativeTranslationStore from '../../mixins/withNativeTranslationStore';
import DataTableGenerator from '../../functions/DataTableGenerator';

export default {
	name: 'DataTableGeneratedPreview',
	mixins: [withNativeTranslationStore],
	components: { DataTableDragHandle },
	data() {
		return {
			visibility: false,
			style: {
				height: 200,
			},
			visibleHeight: 10,
			toggleStatus: false,
			builderPanel: null,
			heightHandleHover: false,
			savedHeight: 200,
			previewHtml: null,
		};
	},
	mounted() {
		this.$nextTick(() => {
			document.addEventListener('wptbSectionChanged', ({ detail }) => {
				this.visibility = this.calculateVisibility(detail);
			});
			this.visibility = this.calculateVisibility(WPTB_Helper.currentSection);

			this.builderPanel = document.querySelector('.wptb-builder-panel');
		});
	},
	computed: {
		wrapperStyle() {
			this.builderPanelCalculations();
			return {
				height: `${this.style.height}px`,
				bottom: `-${this.toggleStatus ? 0 : this.style.height - this.visibleHeight}px`,
			};
		},
		...mapGetters(['getIcon']),
	},
	methods: {
		calculateVisibility(section) {
			// sections where generated preview will be available and visible
			const allowedSections = ['elements', 'table_settings', 'options_group'];

			const status = allowedSections.includes(section);

			if (!status) {
				this.builderPanel.style.height = 0;
			} else {
				this.builderPanelCalculations();
			}

			return status;
		},
		builderPanelCalculations() {
			if (this.builderPanel) {
				this.builderPanel.style.height = this.toggleStatus ? `calc( 100% + ${this.style.height}px)` : 0;
			}
		},
		handleHeightResize(offset) {
			if (this.toggleStatus) {
				this.style.height = this.savedHeight + offset;
			}
		},
	},
};
</script>
