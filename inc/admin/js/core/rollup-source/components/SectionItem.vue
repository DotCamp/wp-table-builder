<template>
    <div class="wptb-settings-section-item" :class="{disabled:!isActive}" @click="$emit('sectionchange', name)">
        {{name}}
    </div>
</template>
<script>
    export default {
        props: ['name', 'current'],
        computed: {
            isActive() {
                if (this.current !== undefined) {
                    return this.current === this.name;
                }
                return true;
            }
        }
    }
</script>