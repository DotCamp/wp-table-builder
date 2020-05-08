<template>
  <table class="wptb-menu-list-table">
    <thead>
      <tr>
        <td></td>
        <column-sort v-for="(label, i) in rowLabels" :label="label" :index="i" :key="label" @sort="sort"></column-sort>
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
</template>
<script>
import ColumnSort from './ColumnSort';

export default {
  props: ['rowLabels', 'rowData', 'modelBind'],
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
      this.innerRowData.sort((a, b) => {
        return (a.fieldDatas[index] > b.fieldDatas[index] ? -1 : 1) * direction;
      });
    },
  },
};
</script>
