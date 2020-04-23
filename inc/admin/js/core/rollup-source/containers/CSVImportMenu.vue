<template>
    <div>
        <drag-drop :texts="{hint: strings.fileDropHint , browse: strings.browse  }"></drag-drop>
        <div>
            <control-item v-for="field in fieldsData" :key="field.id" :field-data="field"
                          :model-bind="field.modelBind"></control-item>
        </div>
    </div>
</template>
<script>
    import DragDrop from '../components/DragDrop.vue';
    import ControlItem from "../components/ControlItem.vue";

    export default {
        components: {DragDrop, ControlItem},
        data() {
            return {
                settings: {
                    responsiveTables: false,
                    topRowAsHeader: false,
                    csvDelimiter: ',',
                },
                fieldsData: []
            }
        },
        mounted() {
            this.fieldsData.push(
                {
                    type: 'dropdown',
                    id: 'csvDelimiter',
                    modelBind: this.settings,
                    label: this.strings.csvDelimiter,
                    options: [{value: ',', label: ','}, {value: ';', label: ';'}]
                },
                {
                    type: 'checkbox',
                    id: 'responsiveTables',
                    modelBind: this.settings,
                    label: this.strings.tableResponsive
                },
                {type: 'checkbox', id: 'topRowAsHeader', modelBind: this.settings, label: this.strings.topRowHeader},
            );
        }
    }
</script>