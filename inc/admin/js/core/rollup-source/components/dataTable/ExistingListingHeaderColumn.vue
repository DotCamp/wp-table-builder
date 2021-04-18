<template>
	<th>
		<div
			class="wptb-existing-listing-header-column"
			@mouseenter="sortVisibility = true"
			@mouseleave="sortVisibility = false"
			@click.prevent="handleColumnClick"
		>
			<div class="wptb-existing-listing-slot-wrapper">
				<slot></slot>
			</div>
			<div :style="sortVisibilityStyle" class="wptb-existing-listing-sort-wrapper">
				<sort
					ref="sortComponent"
					:id="id"
					:up-icon="$store.getters.getIcon('caretUp')"
					v-if="sortEnabled"
					@sort="handleSort"
					:disabled="$store.getters.busyStatus"
				></sort>
			</div>
		</div>
	</th>
</template>

<script>
import { mapGetters } from 'vuex';
import Sort from './Sort';

export default {
	props: {
		sortEnabled: {
			type: Boolean,
			default: true,
		},
		id: {
			type: String,
			required: true,
		},
	},
	components: { Sort },
	data() {
		return {
			sortVisibility: false,
		};
	},
	computed: {
		sortVisibilityStyle() {
			return {
				visibility: this.sortVisibility ? 'visible' : 'collapse',
			};
		},
		...mapGetters(['busyStatus']),
	},
	methods: {
		handleColumnClick() {
			this.$refs.sortComponent.handleClick();
		},
		handleSort(colId, direction) {
			this.$emit('sort', colId, direction);
		},
	},
};
</script>
