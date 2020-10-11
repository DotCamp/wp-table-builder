<template>
	<div class="wptb-tag-control-cloud-wrapper wptb-tag-control-create-wrapper">
		<p class="wptb-settings-item-title">{{ label }}</p>
		<div class="wptb-tag-control-create-controls-wrapper">
			<label for="new_tag_name" class="wptb-tag-control-create-control-label">{{ nameString }}</label>
			<input id="new_tag_name" class="wptb-tag-control-search" type="text" v-model.trim="formData.name" />
			<!--      @deprecated-->
			<!--			<label for="new_tag_slug" class="wptb-tag-control-create-control-label">{{ slugString }}</label>-->
			<!--			<input id="new_tag_slug" class="wptb-tag-control-search" type="text" v-model.trim="formData.slug" />-->
			<!--			<label for="new_tag_desc" class="wptb-tag-control-create-control-label">{{ descString }}</label>-->
			<!--			<input id="new_tag_desc" class="wptb-tag-control-search" type="text" v-model.trim="formData.description" />-->
			<div v-if="busy" class="wptb-tag-control-busy dashicons dashicons-update-alt"></div>
			<div v-if="status" data-status="positive" class="wptb-tag-control-status dashicons dashicons-yes"></div>
			<div
				v-if="status === false"
				data-status="negative"
				class="wptb-tag-control-status dashicons dashicons-warning"
			></div>
			<div class="wptb-tag-control-create-button" :data-disabled="disabled" @click.prevent="handleCreate">
				{{ createString }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		label: {
			type: String,
			default: 'Create new tag',
		},
		nameString: {
			type: String,
			default: 'name',
		},
		slugString: {
			type: String,
			default: 'slug',
		},
		descString: {
			type: String,
			default: 'description',
		},
		createString: {
			type: String,
			default: 'create',
		},
		allTagNames: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			formData: {
				name: '',
				slug: '',
				description: '',
			},
			disabled: true,
			busy: false,
			status: null,
		};
	},
	watch: {
		'formData.name': {
			handler() {
				this.handleButtonDisable();
			},
		},
		status() {
			setTimeout(() => {
				this.$set(this, 'status', null);
			}, 3000);
		},
	},
	mounted() {
		this.handleButtonDisable();
	},
	methods: {
		handleButtonDisable() {
			const { name } = this.formData;

			if (name === '') {
				this.disabled = true;
			} else {
				this.disabled = this.allTagNames.includes(name);
			}
		},
		updateCompState(busyVal, resultVal = null) {
			this.$set(this, 'disabled', busyVal);
			this.$set(this, 'busy', busyVal);
			this.$set(this, 'status', resultVal);
		},
		clearFormData() {
			// eslint-disable-next-line array-callback-return
			Object.keys(this.formData).map((k) => {
				if (Object.prototype.hasOwnProperty.call(this.formData, k)) {
					this.$set(this.formData, k, '');
				}
			});
		},
		handleCreate() {
			const bindedClear = this.clearFormData.bind(this);
			const bindedBusy = this.updateCompState.bind(this);
			this.$emit('createTerm', this.formData, bindedClear, bindedBusy);
		},
	},
};
</script>
