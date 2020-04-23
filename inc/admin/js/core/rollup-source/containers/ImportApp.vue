<template>
    <div class="wptb-settings-wrapper">
        <menu-header :logo-src="pluginInfo.logo" :logo-alt="strings.logoAlt" :plugin-name="pluginInfo.pluginName">
            <a :href="pluginInfo.pluginHomepage">{{strings.homepage}}</a>
        </menu-header>
        <sections>
            <section-item :name="strings.importSection"></section-item>
        </sections>
        <div>
            <sections :child="true">
                <section-item @sectionchange="setSection" :current="currentSection" name="csv"></section-item>
                <section-item @sectionchange="setSection" :current="currentSection"
                              :name="strings.plugins"></section-item>
            </sections>
            <menu-content :center="true">
                <transition name="wptb-fade" mode="out-in">
                    <component class="wptb-flex wptb-flex-col wptb-flex-align-center" :is="currentTemplate">
                    </component>
                </transition>
            </menu-content>
        </div>
        <menu-footer>
            <menu-button>{{strings.importSection}}</menu-button>
        </menu-footer>
    </div>
</template>
<script>
    import MenuHeader from "../components/MenuHeader.vue";
    import Sections from "../components/Sections.vue";
    import SectionItem from "../components/SectionItem.vue";
    import MenuContent from "../components/MenuContent.vue";
    import MenuFooter from "../components/MenuFooter.vue";
    import MenuButton from "../components/MenuButton.vue";
    import CSVImportMenu from "../containers/CSVImportMenu.vue";
    import PluginsImportMenu from "../containers/PluginsImportMenu.vue";

    export default {
        props: ['pluginInfo'],
        components: {MenuHeader, Sections, SectionItem, MenuContent, MenuFooter, MenuButton},
        data() {
            return {
                currentSection: 'csv'
            }
        },
        methods: {
            setSection(name) {
                if (this.currentSection === name) {
                    return;
                }
                this.currentSection = name;
            }
        },
        computed: {
            currentTemplate() {
                return this.currentSection === 'csv' ? CSVImportMenu : PluginsImportMenu;
            }
        }
    }
</script>