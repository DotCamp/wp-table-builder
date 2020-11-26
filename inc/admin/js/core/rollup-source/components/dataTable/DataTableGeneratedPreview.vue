<template>
	<div
		v-show="visibility"
		:style="wrapperStyle"
		:class="{
			'wptb-data-table-generated-preview-bold': toggleStatus && heightHandleHover,
			'wptb-data-table-generated-preview-faster-transition': style.height !== savedHeight,
			'wptb-checkerboard-pattern': toggleStatus,
		}"
		class="wptb-data-table-generated-preview wptb-plugin-inset-shadow-md"
		:data-toggle="toggleStatus"
	>
		<div class="wptb-data-table-generated-inner-wrapper">
			<data-table-drag-handle
				@draggingStart="savedHeight = style.height"
				@dragging="handleHeightResize"
				@handleHover="heightHandleHover = arguments[0]"
				@draggingEnd="savedHeight = style.height"
			></data-table-drag-handle>
			<div class="wptb-data-table-generated-preview-toolbox">
				<number-postfix-buttons
					:input-class="['wptb-size-input', 'wptb-plugin-box-shadow-xl']"
					v-model="resizePercent"
					post-fix="%"
					:only-enter="true"
					:min="10"
					:max="100"
					:enableLimit="true"
				></number-postfix-buttons>
			</div>
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
			<div class="wptb-data-table-empty-preview" v-if="!targetTable">
				{{ translationM('emptyDataTablePreview') }}
			</div>
			<div
				v-else
				class="wptb-data-table-preview-main wptb-plugin-box-shadow-xl"
				:style="previewStyle"
				v-html="previewHtml"
			></div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import DataTableDragHandle from './DataTableDragHandle';
import withNativeTranslationStore from '../../mixins/withNativeTranslationStore';
import DataTableGenerator from '../../functions/DataTableGenerator';
import NumberPostfixButtons from '../NumberPostfixButtons';

export default {
	name: 'DataTableGeneratedPreview',
	mixins: [withNativeTranslationStore],
	components: { DataTableDragHandle, NumberPostfixButtons },
	data() {
		return {
			visibility: false,
			style: {
				height: 400,
			},
			visibleHeight: 10,
			toggleStatus: true,
			builderPanel: null,
			heightHandleHover: false,
			savedHeight: 200,
			busy: false,
			previewHtml: '',
			resizePercent: 100,
		};
	},
	watch: {
		targetTable: {
			handler(n) {
				this.generateDataTable(n);
			},
			deep: true,
		},
		getDataManager: {
			handler() {
				this.generateDataTable(this.targetTable);
			},
			deep: true,
		},
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
		previewStyle() {
			return {
				width: `${this.targetTable.getBoundingClientRect().width}px`,
				transform: `scale(${this.resizePercent / 100})`,
				transformOrigin: 'center top',
				transition: 'all 0.2s ease-out',
			};
		},
		...mapGetters(['getIcon', 'getBindings', 'parsedData', 'getDataManager']),
		...mapState(['targetTable']),
	},
	methods: {
		setComponentBusyState(state) {
			this.busy = state;
		},
		async generateDataTable(mainTable) {
			this.setComponentBusyState(true);
			const previewTable = await DataTableGenerator.generateDataTable(
				mainTable,
				this.getBindings,
				this.parsedData.values
			);

			this.previewHtml = previewTable.outerHTML;

			this.setComponentBusyState(false);
		},
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
