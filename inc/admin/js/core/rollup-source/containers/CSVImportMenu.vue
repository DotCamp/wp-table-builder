<template>
    <div>
        <drag-drop v-model="currentFile"
                   :texts="{hint: strings.fileDropHint , browse: strings.browse , clear: strings.clear }" :allowed-formats="['zip', 'csv', 'html', 'xml']"></drag-drop>
        <div>
            <control-item v-for="field in fieldsData" :key="field.id" :field-data="field"
                          :model-bind="field.modelBind"></control-item>
        </div>
        <portal to="footerButtons">
            <menu-button :disabled="currentFile === null" @click="importFromFile">{{strings.importSection}}
            </menu-button>
        </portal>
    </div>
</template>
<script>
    import DragDrop from '../components/DragDrop.vue';
    import ControlItem from "../components/ControlItem.vue";
    import MenuButton from "../components/MenuButton.vue";
    import {importFile} from '../functions/importOperations.js';

    export default {
        props: ['options'],
        components: {DragDrop, ControlItem, MenuButton},
        data() {
            return {
                settings: {
                    responsiveTables: false,
                    topRowAsHeader: false,
                    csvDelimiter: ',',
                },
                fieldsData: [],
                currentFile: null
            }
        },
        mounted() {
            this.fieldsData.push(
                {
                    type: 'dropdown',
                    id: 'csvDelimiter',
                    modelBind: this.settings,
                    label: this.strings.csvDelimiter,
                    options: [{value: ',', label: ', (comma)'}, {value: ';', label: '; (semicolon)'}, {
                        value: 'tab',
                        label: '\\t (tabular)'
                    }]
                },
                {
                    type: 'checkbox',
                    id: 'responsiveTables',
                    modelBind: this.settings,
                    label: this.strings.tableResponsive
                },
                {type: 'checkbox', id: 'topRowAsHeader', modelBind: this.settings, label: this.strings.topRowHeader},
            );
        },
        methods: {
            importFromFile() {
                if (this.currentFile !== null) {
                    importFile(this.currentFile, this.options.ajaxUrl, this.options.security_code, this.csvDelimiter);
                }
            }
        }
    }
</script>