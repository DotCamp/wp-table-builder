<template>
	<div class="wptb-existing-data-object-wrapper">
		<div class="wptb-existing-data-object-search">
			<search-input style="font-size: 90%;"></search-input>
		</div>
		<div class="wptb-existing-data-object-list">
			<table class="wptb-existing-data-object-table">
				<thead>
					<tr>
						<th>ID</th>
						<th>title</th>
						<th>type</th>
					</tr>
				</thead>
				<tbody>
					<existing-table-data-row
						v-for="{ ID, post_title, type } in dataObjectsList"
						:key="ID"
						:id="ID"
						:title="post_title"
						:type="type"
					></existing-table-data-row>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import ExistingTableDataRow from './ExistingTableDataRow';
import SearchInput from '../SearchInput';

export default {
	components: { SearchInput, ExistingTableDataRow },
	data() {
		return {
			dataObjectsList: [],
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.getSimpleDataObjects()
				.then((resp) => {
					this.dataObjectsList = resp;
				})
				.catch(() => {
					// do nothing
				});
		});
	},
	methods: {
		...mapActions(['getSimpleDataObjects']),
	},
};
</script>
