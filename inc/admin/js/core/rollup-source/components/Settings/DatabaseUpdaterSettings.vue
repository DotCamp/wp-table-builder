<template>
    <fragment>
        <menu-content :center="true">
            <div class="wptb-database-updater-settings">
                <div>
                    <div class="wptb-database-updater-header">
                        {{ strings.updaterDesc }}
                    </div>
                </div>
                <div class="wptb-database-updater-buttons">
                    <menu-button
                        @click="updateTables"
                        :disabled="isBusy() || allUpdated"
                    >
                        {{ strings.updateButton }}
                        <busy-rotate v-if="isBusy() && updating" />
                    </menu-button>
                    <menu-button
                        @click="revertTables"
                        :disabled="isBusy() || allReverted"
                    >
                        {{ strings.revertButton }}
                        <busy-rotate v-if="isBusy() && reverting" />
                    </menu-button>
                    <!-- <menu-button :disabled="buttonDisabledState">
                        {{ strings.resetUpdates }}
                        <busy-rotate />
                    </menu-button> -->
                </div>
            </div>
        </menu-content>
    </fragment>
</template>

<script>
import { Fragment } from "vue-fragment";
import MenuContent from "../MenuContent";
import MenuButton from "../MenuButton";
import SettingsMenuSection from "../../mixins/SettingsMenuSection";
import withMessage from "../../mixins/withMessage";
import BusyRotate from "../BusyRotate";

export default {
    mixins: [SettingsMenuSection, withMessage],
    components: {
        BusyRotate,
        MenuButton,
        MenuContent,
        Fragment,
    },
    data() {
        return {
            allUpdated: false,
            allReverted: true,
            updating: false,
            reverting: false,
        };
    },
    methods: {
        updateTables() {
            this.setBusy(true);
            this.updating = true;

            setTimeout(() => {
                this.allUpdated = true;
                this.allReverted = false;
                this.setBusy(false);
                this.updating = false;
            }, 5000);
        },
        revertTables() {
            this.setBusy(true);
            this.reverting = true;

            setTimeout(() => {
                this.allUpdated = false;
                this.allReverted = true;
                this.setBusy(false);
                this.reverting = false;
            }, 5000);
        },
        sendSavedStyles() {
            // set application to busy state
            this.setBusy(true);

            // prepare form data that will be sent with REST request
            const { ajaxUrl, nonce, action } = this.sectionData.security;
            const formData = new FormData();
            formData.append("action", action);
            formData.append("nonce", nonce);
            formData.append("styles", this.code);

            fetch(ajaxUrl, { method: "POST", body: formData })
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                    throw new Error(
                        `An error occurred while saving CSS code: ${res.statusText}`
                    );
                })
                .then((resp) => {
                    console.log("resp", resp);
                    if (resp.error) {
                        throw new Error(
                            `An error occurred while saving CSS code: ${resp.error}`
                        );
                    } else {
                        this.setMessage({ message: resp.message });
                        this.updateCachedCode();
                    }
                })
                .catch((err) => {
                    this.setMessage({
                        type: "error",
                        message: err.message,
                    });
                })
                .finally(() => {
                    // get application out from busy state
                    this.setBusy(false);
                });
        },
    },
};
</script>
