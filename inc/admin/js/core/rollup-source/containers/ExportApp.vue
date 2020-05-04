<template>
  <div class="wptb-menu-export-wrapper">
    <div class="wptb-menu-export-card wptb-menu-overflow-auto">
      <div class="wptb-menu-export-control-title">{{ getTranslation('your tables') }}</div>
      <div class="wptb-menu-export-controls-wrapper">
        <transition-group name="wptb-fade" tag="div">
          <control-item
            v-for="table in remainingTables"
            :field-data="{ type: 'checkbox', id: table.ID, label: fieldLabel(table) }"
            :model-bind="selectedTables"
            :key="table.ID"
          ></control-item>
        </transition-group>
      </div>
      <empty-cover v-show="!userTables.length > 0">
        {{ getTranslation('no tables found') }}
      </empty-cover>
    </div>
    <div class="wptb-menu-export-middle-section">
      <i>middle section</i>
    </div>
    <div class="wptb-menu-export-card">
      <div class="wptb-menu-export-control-title" style="text-align: end;">{{ getTranslation('selected tables') }}</div>
      <div class="wptb-menu-export-controls-wrapper">
        <transition-group name="wptb-fade" tag="div">
          <control-item
            v-for="table in parsedSelectedTables"
            :field-data="{ type: 'checkbox', id: table.ID, label: fieldLabel(table) }"
            :model-bind="selectedTables"
            :key="table.ID"
          ></control-item>
        </transition-group>
      </div>
      <empty-cover v-show="isSelectedEmpty()">
        {{ getTranslation('no table selected') }}
      </empty-cover>
    </div>
    <portal to="footerButtons">
      <div class="wptb-settings-button-container">
        <menu-button @click="getUserTables" :disabled="isBusy()">{{ getTranslation('refresh') }}</menu-button>
        <menu-button @click="" :disabled="exportDisabled">{{ strings.exportSection }}</menu-button>
      </div>
    </portal>
  </div>
</template>
<script>
import { __ } from '@wordpress/i18n';
import MenuButton from '../components/MenuButton';
import ControlItem from '../components/ControlItem';
import EmptyCover from '../components/EmptyCover';
import withMessage from '../mixins/withMessage';

export default {
  props: ['options'],
  mixins: [withMessage],
  components: { MenuButton, ControlItem, EmptyCover },
  data() {
    return {
      userTables: [],
      selectedTables: {},
    };
  },
  mounted() {
    this.getUserTables();
  },
  computed: {
    remainingTables() {
      return this.userTables.filter((t) => {
        return !this.selectedTables[t.ID];
      });
    },
    parsedSelectedTables() {
      return this.userTables.filter((t) => {
        return this.selectedTables[t.ID];
      });
    },
    exportDisabled() {
      return this.isBusy() || this.isSelectedEmpty();
    },
  },
  methods: {
    isSelectedEmpty() {
      return (
        !Object.keys(this.selectedTables).filter((t) => {
          if (Object.prototype.hasOwnProperty.call(this.selectedTables, t)) {
            return this.selectedTables[t];
          }
          return false;
        }).length > 0
      );
    },
    getTranslation(text) {
      return __(text, this.options.textDomain);
    },
    fieldLabel(field) {
      return field.post_title === '' ? `Table #${field.ID}` : field.post_title;
    },
    getUserTables() {
      const { ajaxUrl, exportNonce, exportAjaxAction } = this.options;

      const formData = new FormData();

      formData.append('nonce', exportNonce);
      formData.append('action', exportAjaxAction);

      this.setBusy();

      fetch(ajaxUrl, {
        method: 'POST',
        body: formData,
      })
        .then((r) => {
          if (r.ok) {
            return r.json();
          }
          throw new Error(__('an error occurred, try again later', this.options.textDomain));
        })
        .then((resp) => {
          if (resp.error) {
            throw new Error(resp.error);
          }
          this.userTables = resp.data.userTables;
        })
        .catch((e) => {
          this.setMessage({ type: 'error', message: e });
        })
        .finally(() => {
          this.setBusy(false);
        });
    },
  },
};
</script>
