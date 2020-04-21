<template>
    <div class="wptb-settings-footer">
        <message-display :busy="messageBusy" :message="messageBody" :show="messageShow" :type="messageType">
        </message-display>
        <div class="wptb-settings-button-container">
            <slot></slot>
        </div>
    </div>
</template>
<script>
    import MessageDisplay from "./MessageDisplay.vue";

    export default {
        props: ['messageType', 'messageShow', 'messageBody', 'messageBusy'],
        components: {MessageDisplay}
    }
</script>