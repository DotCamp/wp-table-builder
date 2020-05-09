<template>
	<div class="wptb-settings-messages">
		<span v-if="withMessageData.busy" class="dashicons dashicons-image-rotate wptb-settings-fetching"></span>
		<transition name="wptb-fade">
			<span class="wptb-settings-message" :class="[withMessageData.type]" v-if="withMessageData.show">{{
				withMessageData.message
			}}</span>
		</transition>
	</div>
</template>
<script>
import withMessage from '../mixins/withMessage';

export default {
	mixins: [withMessage],
};
</script>
