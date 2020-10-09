<template>
	<div
		class="wptb-settings-row wptb-settings-middle-xs wptb-element-property"
		:class="uniqueId"
		:data-element="elemContainer"
	>
		<tag-cloud
			:label="translation('currentTags')"
			ribbon-operation-type="remove"
			:tags="selectedTags"
			@ribbonClick="handleRemove"
			:search-term="searchTerm"
		></tag-cloud>
		<tag-cloud
			:label="translation('availableTags')"
			ribbon-operation-type="add"
			:tags="filteredTagsLeft"
			@ribbonClick="handleAdd"
			:search-term="searchTerm"
		></tag-cloud>
		<tag-search :placeholder="translation('searchTags')" v-model="searchTerm"></tag-search>
		<tag-create
			:label="translation('createNewTag')"
			:name-string="translation('tagName')"
			:desc-string="translation('tagDesc')"
			:slug-string="translation('tagSlug')"
			@createTerm="createTerm"
			:all-tag-names="justTheNames"
		></tag-create>
	</div>
</template>

<script>
import ControlBase from '../mixins/ControlBase';
import withTranslation from '../mixins/withTranslation';
import TagCloud from '../components/TagCloud';
import TagSearch from '../components/TagSearch';
import TagCreate from '../components/TagCreate';

export default {
	components: { TagCreate, TagSearch, TagCloud },
	props: {
		availableTags: {
			type: Array,
			default: () => {
				return [];
			},
		},
		security: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	mixins: [ControlBase, withTranslation],
	data() {
		return {
			selectedTags: [],
			mountedAssign: false,
			searchTerm: '',
			innerTags: [],
		};
	},
	mounted() {
		document.addEventListener('wptb:save:before', this.beforeSave);

		this.$nextTick(() => {
			this.selectedTags = WPTB_ControlsManager.getControlData('ControlTag');
		});
		this.innerTags = Array.from(this.availableTags);
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
		justTheNames() {
			return this.innerTags.reduce((carry, tag) => {
				carry.push(tag.name);
				return carry;
			}, []);
		},
	},
	methods: {
		tagsLeft() {
			return this.innerTags.filter((t) => {
				return !this.selectedTags.some((s) => {
					return s.slug === t.slug;
				});
			});
		},
		handleAdd(slug) {
			this.selectedTags.push(this.innerTags.filter((t) => t.slug === slug)[0]);
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
		createTerm(termData, clearFormSignal, updateBusy) {
			const { nonce, action, ajaxUrl } = this.security.create;

			const formData = new FormData();
			formData.append('nonce', nonce);
			formData.append('action', action);
			formData.append('termData', JSON.stringify(termData));

			// set busy status to true for create component
			updateBusy(true);

			fetch(ajaxUrl, {
				method: 'POST',
				body: formData,
			})
				.then((r) => {
					if (r.ok) {
						return r.json();
					}
					throw new Error('an error occurred creating table term, refresh and try again');
				})
				.then((resp) => {
					if (resp.error) {
						throw new Error(resp.error);
					}

					this.$set(this, 'innerTags', resp.data.tags);
					clearFormSignal();
					updateBusy(false, true);
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.error(err);
					updateBusy(false, false);
				});
		},
	},
};
</script>
