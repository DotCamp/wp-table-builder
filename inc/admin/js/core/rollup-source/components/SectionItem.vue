<template>
    <div class="wptb-settings-section-item" @click="$emit('sectionchange', name)">
        {{name}}
    </div>
</template>
<script>
    export default {
        props: ['name']
    }
</script>