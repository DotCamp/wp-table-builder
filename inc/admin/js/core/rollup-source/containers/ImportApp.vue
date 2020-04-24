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
                    <component class="wptb-flex wptb-flex-col wptb-flex-align-center" :is="currentTemplate"
                               :options="options" @messageUp="setMessage" @fetching="handleFetch">
                    </component>
                </transition>
            </menu-content>
        </div>
        <menu-footer :message-busy="message.busy" :message-body="message.body" :message-show="message.show" :message-type="message.type">
            <portal-target name="footerButtons">
            </portal-target>
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
        props: ['pluginInfo', 'options'],
        components: {MenuHeader, Sections, SectionItem, MenuContent, MenuFooter, MenuButton},
        data() {
            return {
                currentSection: 'csv',
                message: {
                    show: false,
                    busy: false,
                    body: '',
                    type: 'ok',
                    intId: -1
                }
            }
        },
        methods: {
            setSection(name) {
                if (this.currentSection === name) {
                    return;
                }
                this.currentSection = name;
            },
            setMessage(options) {
                this.message.body = options.body;
                this.message.type = options.type;
                this.message.show = true;

                clearInterval(this.message.intId);

                this.message.intId = setInterval(() => {
                    this.message.show = false
                }, 5000);
            },
            handleFetch(val){
                this.message.busy = val;
            }
        },
        computed: {
            currentTemplate() {
                return this.currentSection === 'csv' ? CSVImportMenu : PluginsImportMenu;
            }
        }
    }
</script>