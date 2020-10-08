<template>
	<div
		class="wptb-settings-row wptb-settings-middle-xs wptb-element-property"
		:class="uniqueId"
		:data-element="elemContainer"
	>
		<div class="wptb-tag-control-cloud-wrapper">
			<p class="wptb-settings-item-title">{{ translation('currentTags') }}</p>
			<div class="wptb-tag-control-cloud">
				<tag-ribbon
					@click="handleRemove"
					v-for="tag in selectedTags"
					:name="tag.name"
					:slug="tag.slug"
					:key="tag.slug"
					button-operation-type="remove"
				></tag-ribbon>
				<div v-if="selectedTags.length === 0" class="wptb-tag-control-cloud-empty">
					{{ translation('empty') }}
				</div>
			</div>
		</div>
		<div class="wptb-tag-control-cloud-wrapper">
			<p class="wptb-settings-item-title">{{ translation('availableTags') }}</p>
			<div class="wptb-tag-control-cloud">
				<tag-ribbon
					@click="handleAdd"
					v-for="tag in filteredTagsLeft"
					:name="tag.name"
					:slug="tag.slug"
					:key="tag.slug"
					button-operation-type="add"
					:search-term="searchTerm"
				></tag-ribbon>
				<div v-if="filteredTagsLeft.length === 0" class="wptb-tag-control-cloud-empty">
					{{ translation('empty') }}
				</div>
			</div>
		</div>
		<div class="wptb-tag-control-search-wrapper">
			<div class="wptb-tag-control-search-input">
				<input
					class="wptb-tag-control-search"
					type="text"
					v-model.trim="searchTerm"
					:placeholder="translation('searchTags')"
				/>
				<div v-if="searchTerm !== ''" class="wptb-tag-control-search-clear" @click.prevent="searchTerm = ''">
					x
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ControlBase from '../mixins/ControlBase';
import withTranslation from '../mixins/withTranslation';
import TagRibbon from '../components/TagRibbon';

export default {
	components: { TagRibbon },
	props: {
		availableTags: {
			type: Array,
			default: () => {
				return [];
			},
		},
	},
	mixins: [ControlBase, withTranslation],
	data() {
		return {
			selectedTags: [],
			mountedAssign: false,
			searchTerm: '',
		};
	},
	mounted() {
		document.addEventListener('wptb:save:before', this.beforeSave);

		this.$nextTick(() => {
			this.selectedTags = WPTB_ControlsManager.getControlData('ControlTag');
		});
	},
	watch: {
		selectedTags: {
			handler() {
				if (!this.mountedAssign) {
					this.mountedAssign = true;
				} else {
					WPTB_ControlsManager.setControlData('ControlTag', this.selectedTags);
					new WPTB_TableStateSaveManager().tableStateSet();
				}
			},
			deep: true,
		},
	},
	computed: {
		filteredTagsLeft() {
			return this.tagsLeft().filter((t) => {
				return t.name.toLowerCase().includes(this.searchTerm);
			});
		},
	},
	methods: {
		tagsLeft() {
			return this.availableTags.filter((t) => {
				return !this.selectedTags.some((s) => {
					return s.slug === t.slug;
				});
			});
		},
		handleAdd(slug) {
			this.selectedTags.push(this.availableTags.filter((t) => t.slug === slug)[0]);
		},
		handleRemove(slug) {
			this.selectedTags = this.selectedTags.filter((t) => {
				return t.slug !== slug;
			});
		},
		beforeSave({ detail }) {
			if (typeof detail === 'object') {
				// eslint-disable-next-line no-param-reassign
				detail.tags = JSON.stringify(
					this.selectedTags.map((t) => {
						return t.term_id;
					})
				);
			}
		},
	},
};
</script>
