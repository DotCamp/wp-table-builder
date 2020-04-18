<?php

use WP_Table_Builder as NS;

// abort at direct call
if ( ! defined( 'WPINC' ) ) {
	die;
}

$wptb_text_domain = NS\PLUGIN_TEXT_DOMAIN;
$plugin_homepage = get_plugin_data( NS\PLUGIN__FILE__ )['PluginURI'];
$plugin_name = get_plugin_data( NS\PLUGIN__FILE__ )['Name'];

?>
<div id="wptb-settings-page">
    <settings-app :fields-data="fieldsData" :settings="settings" inline-template>
        <div class="wptb-settings-wrapper">
            <div class="wptb-settings-header">
                <div class="wptb-settings-brand">
                    <img src="<?php echo esc_attr( NS\WP_TABLE_BUILDER_URL . 'assets/images/wptb-logo.png' ); ?>" alt="<?php esc_attr_e('wptb plugin logo', $wptb_text_domain); ?>">
                    <span class="wptb-settings-header-name">
                        <?php echo esc_html($plugin_name); ?>
                    </span>
                </div>
                <div class="wptb-settings-links">
                    <a href="<?php echo esc_attr( $plugin_homepage ); ?>"><?php esc_html_e( 'homepage', $wptb_text_domain ); ?></a>
                </div>
            </div>
            <div class="wptb-settings-sections-wrapper">
                <setting-section v-for="section in sections" @sectionchange="currentSection=$event" :name="section"
                                 :key="section" inline-template>
                    <div class="wptb-settings-section-item" @click="$emit('sectionchange', name)">
                        {{name}}
                    </div>
                </setting-section>
            </div>
            <div class="wptb-settings-controls-wrapper">
                        <setting-field v-for="field in currentFields" :key="field.id" :field-data="field"
                                       inline-template>
                            <div class="wptb-setting-control">
                                <div class="title">{{fieldData.label}}</div>
                                <div v-if="isType('multiCheckbox')">
                                    <div class="wptb-setting-control-row" v-for="(v,k) in fieldData.options">
                                        <input type="checkbox" :value="k" v-model="store[fieldData.id]">
                                        <label>{{v}}</label>
                                    </div>
                                </div>
                            </div>
                        </setting-field>
            </div>
            <div class="wptb-settings-footer">
                <div class="wptb-settings-messages">
                    <span v-if="fetching" class="dashicons dashicons-image-rotate wptb-settings-fetching"></span>
                    <span class="wptb-settings-message" :class="[fetchMessage.type]" v-if="fetchMessage.show">{{fetchMessage.message}}</span>
                </div>
                <div class="wptb-settings-button-container">
                    <div class="wptb-settings-button danger" :class="{disabled:!canSubmit}" @click="resetStore"><?php esc_html_e('revert', $wptb_text_domain); ?></div>
                    <div class="wptb-settings-button primary" :class="{disabled: !canSubmit}" @click.prevent="submitSettings"><?php esc_html_e('submit', $wptb_text_domain); ?></div>
                </div>
            </div>
        </div>
    </settings-app>
</div>
