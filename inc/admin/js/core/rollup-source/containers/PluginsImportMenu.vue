<template>
    <div>
        <menu-button :disabled="busy" v-for="plugin in supportedPlugins"
                     @click="handleImportFromPlugin(plugin)" :key="plugin">
            {{plugin}}
        </menu-button>

        <div id="wptb-importIframeSection" style="display: none"></div>
        <transition name="wptb-fade" mode="out-in">
            <div v-if="showImportedTables" class="wptb-flex wptb-flex-align-center wptb-flex-col">
                <div class="wptb-import-tables-wrapper">
                    <div class="wptb-import-tables-list" v-for="(value,key) in importedTables" :key="key">
                        <table class="wptb-import-table">
                            <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" @click="selectAllCheckbox(key)">
                                </th>
                                <th>
                                    {{key}}
                                </th>
                                <th>
                                    wp table builder
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <fragment v-for="row in value" :key="row[0]">
                                <tr>
                                    <td>
                                        <input type="checkbox" v-model="selectedReplaceRows" :value="row">
                                    </td>
                                    <td>
                                        {{row[0]}}
                                    </td>
                                    <td>
                                        {{row[1]}}
                                    </td>
                                </tr>

                            </fragment>
                            </tbody>
                        </table>
                    </div>
                </div>
                <menu-button :disabled="selectedReplaceRows.length === 0" size="small" @click="replaceShortcodes">
                    replace short codes
                </menu-button>
            </div>
        </transition>

        <!--        source code for import functionality is all over the place, makes it impossible to extract the business logic from the view one. this component, unfortunately appears to be a key component for business logic to work. this is the best workaround I found to make the business logic work-->
        <div class="wptb-importPBarContainer" style="visibility: hidden">
            <div class="wptb-importPBarProgress">
                <div class="wptb-nameProcessInBarProgress"></div>
                <div id="wptb-pBarPercent">
                    <span>0%</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {Fragment} from 'vue-fragment';
    import MenuButton from "../components/MenuButton.vue";
    import ImportOperations from "../functions/importOperations.js";

    export default {
        props: ['options'],
        components: {MenuButton, Fragment},
        data() {
            return {
                supportedPlugins: ['table-press'],
                fetching: false,
                busy: false,
                importedTables: {},
                selectedReplaceRows: []
            }
        },
        watch: {
            fetching(n) {
                this.$emit('fetching', n);
            }
        },
        mounted() {
            // general listener for successful operations
            document.addEventListener('table:imported:saved', ({detail}) => {
                this.$emit('messageUp', {
                    type: 'ok',
                    body: this.isDocumentEventPoorlyImplemented(detail) ? this.strings.operationSuccess : detail
                });
                this.setBusy(false);
            });

            // general listener for errors
            document.addEventListener('table:imported:error', ({detail}) => {
                this.$emit('messageUp', {
                    type: 'error',
                    body: this.isDocumentEventPoorlyImplemented(detail) ? this.strings.errorOccured : detail
                });
                this.setBusy(false);
            });

            // listener for import end
            document.addEventListener('table:imported:list', ({detail}) => {
                this.setBusy(false);
                this.importedTables = detail;
            });

            // listener for shortcode replace
            document.addEventListener('table:shortcode:replace', ({detail}) => {
                this.$emit('messageUp', {
                    type: 'ok',
                    body: `${this.strings.replacedShortcodes}: ${detail === true ? 0 : detail}`
                });
                this.setBusy(false);

            });
        },
        methods: {
            isDocumentEventPoorlyImplemented(val) {
                return typeof val === 'boolean';
            },
            handleImportFromPlugin(type) {
                const importOperations = ImportOperations({...this.options, type});

                this.setBusy();
                importOperations.importFromPlugin(type);
            },
            setBusy(val = true) {
                this.busy = val;
                this.fetching = val;
            },
            selectAllCheckbox(type) {
                if (this.selectedReplaceRows === this.importedTables[type]) {
                    this.selectedReplaceRows = [];
                } else {
                    this.selectedReplaceRows = this.importedTables[type];
                }
            },
            replaceShortcodes() {
                if (this.selectedReplaceRows.length === 0) {
                    return;
                }

                const replaceArray = this.selectedReplaceRows.map(row => {
                    return {search: row[0], replace: row[1]}
                });

                console.log(replaceArray);

                const importOperation = ImportOperations(this.options);

                this.setBusy();
                importOperation.replaceShortcodesAjax(replaceArray, true);

            }
        },
        computed: {
            showImportedTables() {
                const keys = Object.keys(this.importedTables).map(k => {
                    if (Object.prototype.hasOwnProperty.call(this.importedTables, k)) {
                        return k
                    }
                });

                return Array.isArray(keys) ? keys.length > 0 : false;
            },
        }
    }
</script>