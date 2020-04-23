<template>
    <div class="wptb-menu-file-drop" :class="eventClass" @dragenter.stop.prevent="dragActive=true"
         @dragleave.stop.prevent="dragActive=false" @drop.stop.prevent="handleDrop"
         @dragover.stop.prevent="dragActive=true">
        <transition name="wptb-fade" mode="out-in">
            <div v-if="dragActive" key="fileLogo" class="file-icon">
                <span class="dashicons dashicons-media-spreadsheet"></span>
            </div>
            <div v-else key="controls" class="wptb-flex wptb-flex-col wptb-flex-align-center">
                <div class="hint">{{texts.hint}}</div>
                <div>
                    <a>{{texts.browse}}</a>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    export default {
        props: ['texts'],
        data() {
            return {
                dragActive: false
            }
        },
        computed: {
            eventClass() {
                return this.dragActive ? 'dragenter' : '';
            }
        },
        methods: {
            handleDrop(event) {
                this.dragActive = true;
                const dt = event.dataTransfer;
                console.log(dt.files);
                this.dragActive = false;
            },
        }
    }
</script>