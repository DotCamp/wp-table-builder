<template>
    <div class="wptb-settings-sections-wrapper" :class="{child}">
        <slot></slot>
    </div>
</template>
<script>
    export default {
        props: {
            child: {
                type: Boolean,
                default: false
            }
        },
    }
</script>