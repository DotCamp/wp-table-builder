<template>
	<div class="wptb-settings-footer">
		<message-display :busy="messageBusy" :message="messageBody" :show="messageShow" :type="messageType">
		</message-display>
		<div class="wptb-settings-button-container">
			<menu-button style="visibility: hidden;">dummy</menu-button>
			<slot></slot>
		</div>
	</div>
</template>
<script>
import MessageDisplay from './MessageDisplay.vue';
import MenuButton from './MenuButton';

export default {
	props: ['messageType', 'messageShow', 'messageBody', 'messageBusy'],
	components: { MessageDisplay, MenuButton },
};
</script>
