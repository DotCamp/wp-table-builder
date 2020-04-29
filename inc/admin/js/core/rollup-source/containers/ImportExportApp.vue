<template>
    <div class="wptb-settings-wrapper">
        <menu-header :logo-src="pluginInfo.logo" :logo-alt="strings.logoAlt" :plugin-name="pluginInfo.pluginName">
            <a :href="pluginInfo.pluginHomepage">{{strings.homepage}}</a>
        </menu-header>
        <sections>
            <section-item :name="strings.importSection"></section-item>
        </sections>
        <div class="wptb-menu-overflow-auto">
            <menu-button @click="setMessage({message: 'working'})">message test</menu-button>

        </div>
        <menu-footer>
            <menu-button style="visibility: hidden">dummy</menu-button>
            <portal-target name="footerButtons">
            </portal-target>
        </menu-footer>
    </div>
</template>
<script>
    import MenuHeader from "../components/MenuHeader";
    import Sections from "../components/Sections";
    import SectionItem from "../components/SectionItem";
    import MenuFooter from "../components/MenuFooter";
    import MenuButton from "../components/MenuButton";
    import withMessage from '../mixins/withMessage';

    export default {
        props: ['pluginInfo', 'options'],
        mixins: [withMessage],
        components: {MenuHeader, MenuButton, SectionItem, Sections, MenuFooter}

    }
</script>