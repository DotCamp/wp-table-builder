<template>
	<div ref="wrapper" class="main-save-button-wrapper" :data-disabled="!dirtyStatus">
		<div class="save-btn wptb-settings-section-item static-active">
			<div class="inner-button" @click.prevent.stop.capture="startSaveOperation">{{ saveButtonLabel }}</div>
			<div class="save-button-down" @click.prevent.stop.capture="handleCaretDown">
				<icon :name="slide ? 'caret-up' : 'caret-down'"></icon>
			</div>
		</div>
		<div ref="slideWrapper" class="save-button-extra-options-wrapper" :data-slide="slide">
			<div
				class="extra-save-button"
				@click.prevent.stop.capture="innerSetSaveType(innerSaveOperationTypes.TABLE)"
			>
				{{ getTranslation('table') }}
			</div>
			<div>
				<pro-overlay feature-name="template" :target="overlayTargetTypes.PARENT"></pro-overlay>
				<div
					@click.prevent.stop.capture="innerSetSaveType(innerSaveOperationTypes.TEMPLATE)"
					class="extra-save-button"
				>
					{{ getTranslation('template') }}
				</div>
			</div>
		</div>
		<div class="wptb-busy">
			<div class="wptb-busy-circle"></div>
			<div class="wptb-busy-circle"></div>
			<div class="wptb-busy-circle"></div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { saveOperationTypes } from '$Stores/builderStore/modules/app';
import Icon from '$Components/Icon';
import ProOverlay, { targetTypes } from '$Containers/ProOverlay';

export default {
	components: { ProOverlay, Icon },
	data: () => ({
		slide: false,
    dirtyStatus: true
	}),
	mounted() {
		this.$nextTick(() => {
			this.assignSize();
			this.preparationsForSaveType();
		});
	},
	watch: {
		currentSaveType() {
			this.$nextTick(() => {
				this.assignSize();
				this.preparationsForSaveType();
			});
		},
	},
	computed: {
		overlayTargetTypes: () => targetTypes,
		...mapGetters('app', ['currentSaveType']),
		...mapGetters({
			getTranslation: 'getTranslation',
		}),
		innerSaveOperationTypes: () => saveOperationTypes,
		saveButtonLabel() {
			const translationMap = {
				[saveOperationTypes.TABLE]: 'saveTable',
				[saveOperationTypes.TEMPLATE]: 'saveTemplate',
			};
			return this.getTranslation(translationMap[this.currentSaveType]);
		},
	},
	methods: {
		preparationsForSaveType() {
			const targetTable = this.$refs.wrapper.ownerDocument.querySelector('.wptb-table-setup .wptb-preview-table');

			if (targetTable) {
				switch (this.currentSaveType) {
					case saveOperationTypes.TABLE:
						delete targetTable.dataset.wptbPrebuiltTable;
						break;
					case saveOperationTypes.TEMPLATE:
						targetTable.dataset.wptbPrebuiltTable = 1;
						break;
					default:
						break;
				}
			}
		},
		startSaveOperation(e) {
			if (this.dirtyStatus && !this.slide) {
				WPTB_Helper.saveTable(e);
			}

			this.closeSlide();
		},
		toggleSlide() {
			this.slide = !this.slide;
		},
		closeSlide() {
			this.slide = false;
		},
		innerSetSaveType(saveOperationType) {
			this.setSaveType(saveOperationType);
			this.toggleSlide();
		},
		assignSize() {
			const { wrapper, slideWrapper } = this.$refs;

			wrapper.style.width = null;
			slideWrapper.style.width = null;

			const { width: wrapperWidth } = wrapper.getBoundingClientRect();
			const { width: slideWrapperWidth } = slideWrapper.getBoundingClientRect();

			const targetElement = wrapperWidth > slideWrapperWidth ? slideWrapper : wrapper;
			targetElement.style.width = `${Math.max(wrapperWidth, slideWrapperWidth)}px`;
		},
		handleCaretDown() {
			if (this.dirtyStatus) {
				this.toggleSlide();
			}
		},
		...mapMutations('app', ['setSaveType']),
	},
};
</script>
