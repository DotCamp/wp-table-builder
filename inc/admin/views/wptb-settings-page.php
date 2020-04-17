<?php

// abort at direct call
if ( ! defined( 'WPINC' ) ) {
	die;
}
?>
<div id="wptb-settings-page">
    <settings-app :fields-data="fieldsData" :settings="settings" inline-template>
        <div class="wptb-settings-wrapper">
            <form @submit.prevent="submitSettings" method="POST" action="options.php">
                <div class="wptb-settings-sections-wrapper">
                    <setting-section v-for="section in sections" @sectionchange="currentSection=$event" :name="section" :key="section" inline-template>
                        <div @click="$emit('sectionchange', name)">
                            {{name}}
                        </div>
                    </setting-section>
                </div>
                <div class="wptb-settings-fields-wrapper">
                    <setting-field v-for="field in currentFields" :key="field.id" :field-data="field"  inline-template>
                        <div>
                            <h2>{{fieldData.label}}</h2>
                            <div>
                                <div v-for="(v,k) in fieldData.options">
                                    <input :type="fieldData.type" :value="k" v-model="store[fieldData.id]">
                                    <label >{{v}}</label>
                                </div>
                            </div>
                        </div>
                    </setting-field>
                </div>
                <input type="submit">
            </form>
        </div>
    </settings-app>
</div>
