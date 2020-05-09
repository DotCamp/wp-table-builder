<template>
  <div>
    <table class="wptb-menu-list-table">
      <thead>
        <tr>
          <td></td>
          <column-sort
            v-for="(label, i) in rowLabels"
            :label="label"
            :index="i"
            :key="label"
            @sort="sort"
          ></column-sort>
        </tr>
      </thead>
      <transition-group tag="tbody" name="wptb-fade" mode="out-in">
        <tr v-for="row in innerRowData" :key="row.ID">
          <td>
            <input :id="row.ID" type="checkbox" v-model="modelBind[row.ID]" />
          </td>
          <td v-for="data in row.fieldDatas" :key="data">
            <label :for="row.ID">{{ data }}</label>
          </td>
        </tr>
      </transition-group>
    </table>
  </div>
</template>
<script>
import ColumnSort from './ColumnSort';

export default {
  props: ['rowLabels', 'rowData', 'modelBind', 'sortType'],
  components: { ColumnSort },
  data() {
    return {
      innerRowData: [],
    };
  },
  watch: {
    rowData(n) {
      this.innerRowData = n;
    },
  },
  methods: {
    sort(index, direction) {
      const sortAlgs = {
        defaultSort(a, b) {
          let status = 0;
          const aData = a.fieldDatas[index].toLowerCase();
          const bData = b.fieldDatas[index].toLowerCase();

          if (aData < bData) {
            status = 1;
          }
          if (aData > bData) {
            status = -1;
          }

          return status * direction;
        },
        dateSort(a, b) {
          let status = 0;
          const aData = new Date(a.fieldDatas[index].toLowerCase()).getTime();
          const bData = new Date(b.fieldDatas[index].toLowerCase()).getTime();

          if (aData < bData) {
            status = 1;
          }
          if (aData > bData) {
            status = -1;
          }

          return status * direction;
        },
      };

      let currentAlg;
      const requestedType = this.sortType[index];

      if (!requestedType || !sortAlgs[`${requestedType}Sort`]) {
        currentAlg = sortAlgs.defaultSort;
      } else {
        currentAlg = sortAlgs[`${requestedType}Sort`];
      }

      this.innerRowData.sort(currentAlg);
    },
  },
};
</script>
