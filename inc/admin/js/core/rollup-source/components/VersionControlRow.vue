<template>
	<fragment>
		<div class="wptb-version-control-row-element wptb-version-control-row-label">{{ label }}</div>
		<div class="wptb-version-control-row-element wptb-version-control-row-slot">
			<slot></slot>
		</div>
	</fragment>
</template>

<script>
import { Fragment } from 'vue-fragment';

export default {
	props: {
		label: {
			type: String,
			default: 'row label',
		},
	},
	components: { Fragment },
};
</script>
