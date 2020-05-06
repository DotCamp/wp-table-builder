<template>
  <div class="wptb-menu-export-wrapper">
    <div class="wptb-menu-export-card">
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
      <img :src="pluginInfo.plainArrow" />
      <img class="flip" :src="pluginInfo.plainArrow" />
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
      <a ref="filesave" style="display: none;">filesave</a>
      <div class="wptb-settings-button-container">
        <menu-button @click="getUserTables" :disabled="isBusy()">{{ getTranslation('refresh') }}</menu-button>
        <menu-button @click="exportTables" :disabled="exportDisabled">{{ strings.exportSection }}</menu-button>
      </div>
    </portal>
  </div>
</template>
<script>
import MenuButton from '../components/MenuButton';
import ControlItem from '../components/ControlItem';
import EmptyCover from '../components/EmptyCover';
import withMessage from '../mixins/withMessage';

export default {
  props: ['options', 'pluginInfo'],
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
    getSelectedIds() {
      const tempArray = [];

      Object.keys(this.selectedTables).map((t) => {
        if (Object.prototype.hasOwnProperty.call(this.selectedTables, t)) {
          if (this.selectedTables[t]) {
            tempArray.push(t);
          }
        }
      });

      return tempArray;
    },
    fieldLabel(field) {
      return field.post_title === '' ? `Table #${field.ID}` : field.post_title;
    },
    getUserTables() {
      const { ajaxUrl, fetchNonce, fetchAjaxAction } = this.options;

      const formData = new FormData();

      formData.append('nonce', fetchNonce);
      formData.append('action', fetchAjaxAction);

      this.setBusy();

      fetch(ajaxUrl, {
        method: 'POST',
        body: formData,
      })
        .then((r) => {
          if (r.ok) {
            return r.json();
          }
          throw new Error(this.getTranslation('an error occurred, try again later'));
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
    exportTables() {
      const { ajaxUrl, exportAjaxAction, exportNonce } = this.options;

      const formData = new FormData();
      formData.append('nonce', exportNonce);
      formData.append('action', exportAjaxAction);
      formData.append('ids', JSON.stringify(this.getSelectedIds()));

      this.setBusy();

      fetch(ajaxUrl, {
        method: 'POST',
        body: formData,
      })
        .then((r) => {
          if (r.ok) {
            const contentType = r.headers.get('content-type');
            if (contentType === 'application/octet-stream') {
              return r.blob();
            }
            return r.json();
          }
          throw new Error(this.getTranslation('an error occurred, try again later'));
        })
        .then((resp) => {
          if (resp.error) {
            throw new Error(resp.error);
          }

          const objectData = window.URL.createObjectURL(resp);
          const fileName = `wptb_export_${Date.now()}.zip`;

          this.$refs.filesave.href = objectData;
          this.$refs.filesave.download = fileName;
          this.$refs.filesave.click();

          window.URL.revokeObjectURL(objectData);
          this.resetSelections();
        })
        .catch((e) => {
          this.setMessage({ type: 'error', message: e });
        })
        .finally(() => {
          this.setBusy(false);
        });
    },
    resetSelections() {
      this.selectedTables = [];
    },
  },
};
</script>
