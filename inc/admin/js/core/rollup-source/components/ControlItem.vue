<template>
    <div>
        <div v-if="isType('multiCheckbox')">
            <div class="wptb-setting-control-row" v-for="(v,k) in fieldData.options">
                <input type="checkbox" :value="k" v-model="store[fieldData.id]">
                <label>{{v}}</label>
            </div>
        </div>
    </div>
</template>
<script>
    import withStore from "../mixins/withStore.js";

    export default {
        props: ['fieldData'],
        mixins: [withStore],
        methods: {
            isType(type) {
                return this.fieldData.type === type;
            }
        }
    }
</script>