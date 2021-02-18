<template>
	<div class="wptb-settings-messages">
		<busy-rotate v-if="withMessageData.busy"></busy-rotate>
		<transition name="wptb-fade">
			<span class="wptb-settings-message" :class="[withMessageData.type]" v-if="withMessageData.show">{{
				withMessageData.message
			}}</span>
		</transition>
	</div>
</template>
<script>
import withMessage from '../mixins/withMessage';
import BusyRotate from './BusyRotate';

export default {
	components: { BusyRotate },
	mixins: [withMessage],
};
</script>
