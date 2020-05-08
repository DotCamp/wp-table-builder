<template>
  <div class="wptb-menu-export-wrapper">
    <div class="wptb-menu-export-card">
      <div class="wptb-menu-export-control-title">{{ getTranslation('all tables') }}</div>
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
      <div class="arrow-holder">
        <img
          @click.prevent="selectAll"
          :src="pluginInfo.plainArrow"
          :title="getTranslation('select all')"
          :alt="getTranslation('arrow')"
        />
      </div>
      <div>
        <control-item
          :field-data="exportTypeControlOptions"
          :model-bind="this"
          class="wptb-flex wptb-flex-align-center wptb-flex-justify-center"
        >
          <pop-up :message="exportTypeDescription">?</pop-up>
        </control-item>
      </div>
      <div class="arrow-holder flip">
        <img
          @click.prevent="deselectAll"
          :src="pluginInfo.plainArrow"
          :title="getTranslation('deselect all')"
          :alt="getTranslation('arrow')"
        />
      </div>
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
      <a ref="filesave" style="display: none;" :download="filename">_filesave</a>
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
import PopUp from '../components/PopUp';
import withMessage from '../mixins/withMessage';

export default {
  props: ['options', 'pluginInfo'],
  mixins: [withMessage],
  components: { PopUp, MenuButton, ControlItem, EmptyCover },
  data() {
    return {
      userTables: [],
      selectedTables: {},
      exportType: 'CSV',
      exportTypeControlOptions: {
        id: 'exportType',
        type: 'dropdown',
        label: 'export type',
        options: [
          { label: 'csv', value: 'CSV' },
          { label: 'xml', value: 'XML' },
        ],
      },
      filename: '',
    };
  },
  mounted() {
    this.getUserTables();
  },
  computed: {
    exportTypeDescription() {
      const descriptions = {
        csvDescription: `<b>CSV:</b> ${this.getTranslation(
          'only text content of your tables will be exported, ideal for usage within other apps/plugins'
        )}`,
        xmlDescription: `<b>XML:</b> ${this.getTranslation(
          'an exact copy of your tables will be exported, ideal for backup and share your tables with your other WordPress sites that uses WP Table Builder'
        )}`,
      };

      return this.getTranslation(descriptions[`${this.exportType.toLowerCase()}Description`]);
    },
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
    selectAll() {
      const allSelectedObject = {};
      // eslint-disable-next-line array-callback-return
      this.userTables.map((t) => {
        allSelectedObject[t.ID] = true;
      });

      this.selectedTables = { ...this.selectedTables, ...allSelectedObject };
    },
    deselectAll() {
      this.selectedTables = {};
    },
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

      // eslint-disable-next-line array-callback-return
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
    /**
     * Parse content-disposition header to extract filename property
     *
     * @param {string} headerString content-disposition header
     * @returns {string} extracted filename
     *
     * @throws Error an error will be thrown on no match
     */
    parseFilename(headerString) {
      const regex = new RegExp(/filename="(.+\..+)"/, 'g');
      const results = regex.exec(headerString);
      if (results === null) {
        throw new Error(this.getTranslation('invalid file name header'));
      }
      return results[1];
    },
    /**
     * Main logic for exporting table/s
     */
    exportTables() {
      const { ajaxUrl, exportAjaxAction, exportNonce } = this.options;

      const formData = new FormData();
      formData.append('nonce', exportNonce);
      formData.append('action', exportAjaxAction);
      formData.append('ids', JSON.stringify(this.getSelectedIds()));
      formData.append('export_type', this.exportType);

      this.setBusy();

      fetch(ajaxUrl, {
        method: 'POST',
        body: formData,
      })
        .then((r) => {
          if (r.ok) {
            const contentType = r.headers.get('content-type');

            if (contentType === 'application/octet-stream') {
              this.filename = this.parseFilename(r.headers.get('content-disposition'));
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

          this.$refs.filesave.href = objectData;
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
