<template>
    <div class="wptb-settings-messages">
        <span v-if="busy" class="dashicons dashicons-image-rotate wptb-settings-fetching"></span>
        <transition name="wptb-fade">
            <span class="wptb-settings-message" :class="[type]" v-if="show">{{message}}</span>
        </transition>
    </div>
</template>
<script>
    export default {
        props: ['type', 'show', 'message', 'busy']
    }
</script>