<template>
	<div class="wptb-control-tip-wrapper">
		<slot></slot>
		<tip-popup :message="message"></tip-popup>
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
	},
	components: { TipPopup },
};
</script>
