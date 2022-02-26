<template>
	<tr>
		<td>
			<div :data-fix-status="fixStatus" class="wptb-fix-summary-column">
				{{ tableTitle | cap }}
			</div>
		</td>
		<td>
			<div :key="id" :data-fix-status="fixStatus" class="wptb-fix-summary-column">
				<icon class="icon-wrapper-parent" :extra-classes="['icon-wrapper']" :name="iconName"></icon>
			</div>
		</td>
	</tr>
</template>

<script>
import Icon from '$Components/Icon';

export default {
	props: {
		id: {
			type: String,
			required: true,
		},
		status: {
			type: Boolean,
			required: true,
		},
	},
	components: { Icon },
	computed: {
		fixStatus() {
			return JSON.stringify(this.status);
		},
		tableTitle() {
			return `${this.strings.table}#${this.id}`;
		},
		iconName() {
			return this.status ? 'check-circle' : 'times-circle';
		},
	},
};
</script>

<style scoped></style>
