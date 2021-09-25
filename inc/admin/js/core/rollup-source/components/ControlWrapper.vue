<template>
	<transition name="wptb-fade" mode="out-in">
		<fragment>
			<span v-show="visibility">
				<slot></slot>
			</span>
			<input
				v-if="compatibilityMode"
				class="wptb-element-property"
				type="text"
				:class="uniqueId"
				:data-element="elemContainer"
				style="display: none"
				:value="mainValue"
				disabled="true"
			/>
		</fragment>
	</transition>
</template>

<script>
import { Fragment } from 'vue-fragment';

export default {
	props: {
		visibility: {
			type: Boolean,
			default: true,
		},
		compatibilityMode: {
			type: Boolean,
			default: false,
		},
		uniqueId: {
			type: String,
			default: '',
		},
		elemContainer: {
			type: String,
			default: '',
		},
		mainValue: {
			type: null,
		},
	},
	components: { Fragment },
};
</script>
