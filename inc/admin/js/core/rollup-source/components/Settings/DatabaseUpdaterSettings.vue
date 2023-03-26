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
                        <busy-rotate v-if="updating" />
                    </menu-button>
                    <menu-button
                        @click="revertTables"
                        :disabled="isBusy() || allReverted"
                    >
                        {{ strings.revertButton }}
                        <busy-rotate v-if="reverting" />
                    </menu-button>
                    <menu-button
                        @click="redoUpdates"
                        :disabled="isBusy() || allReverted"
                    >
                        Redo Updates
                    </menu-button>
                    <menu-button
                        type="danger"
                        @click="resetTables"
                        :disabled="isBusy()"
                    >
                        {{ strings.resetUpdates }}
                    </menu-button>
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
        async updateTables() {
            this.updating = true;

            try {
                const { message } = await this.sendAJAXReq("update");
                this.allUpdated = true;
                this.allReverted = false;
                this.setMessage({ message: message });
            } catch (e) {
                this.setMessage({
                    type: "error",
                    message: `An error occurred while updating tables: ${e.message}`,
                });
            }

            this.updating = false;
        },
        async revertTables() {
            this.reverting = true;

            try {
                const { message } = await this.sendAJAXReq("revert");
                this.allUpdated = false;
                this.allReverted = true;
                this.setMessage({ message: message });
            } catch (e) {
                this.setMessage({
                    type: "error",
                    message: `An error occurred while reverting tables: ${e.message}`,
                });
            }

            this.reverting = false;
        },
        async redoUpdates() {
            await this.revertTables();
            await this.updateTables();
        },
        async resetTables() {
            await this.sendAJAXReq("solid");

            this.allUpdated = false;
            this.allReverted = true;
        },
        async sendAJAXReq(req) {
            this.setBusy(true);

            const { ajaxUrl, nonce, action } = this.sectionData.security;
            const formData = new FormData();
            formData.append("action", action);
            formData.append("nonce", nonce);
            formData.append("req", req);

            const res = await fetch(ajaxUrl, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                this.setBusy(false);
                throw new Error(res.statusText);
            }

            const resp = await res.json();

            if (resp.error) {
                this.setBusy(false);
                throw new Error(resp.error);
            }

            return resp;
        },
    },
    mounted() {
        const { allUpdated, allReverted } = this.sendAJAXReq("info");
        this.allUpdated = allUpdated;
        this.allReverted = allReverted;
    },
};
</script>
