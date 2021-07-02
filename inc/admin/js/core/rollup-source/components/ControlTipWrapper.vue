<template>
	<div class="wptb-control-tip-wrapper" :disabled="disabled">
		<slot></slot>
		<tip-popup :disabled="disabled" :message="message"></tip-popup>
	</div>
</template>

<script>
import TipPopup from './TipPopup';

export default {
	props: {
		message: {
			type: String,
			default: '',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	components: { TipPopup },
};
</script>
