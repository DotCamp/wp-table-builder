<template>
    <div class="wptb-settings-button" :class="[{'disabled' : disabled} , type  ]" @click="handleClick">
        <slot></slot>
    </div>
</template>
<script>
    export default {
        props: {
            disabled: Boolean,
            type: {
                type: String,
                default: 'primary'
            }
        },
        methods: {
            handleClick() {
                this.$emit('click');
            }
        },
    }
</script>