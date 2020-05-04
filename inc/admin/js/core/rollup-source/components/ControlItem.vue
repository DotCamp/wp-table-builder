<template>
  <div>
    <div v-if="isType('multiCheckbox')">
      <div class="wptb-setting-control-row" v-for="(v, k) in fieldData.options" :key="v">
        <input :id="fieldData.id" type="checkbox" :value="k" v-model="modelBind[fieldData.id]" />
        <label :for="fieldData.id">{{ v }}</label>
      </div>
    </div>
    <div v-else-if="isType('checkbox')">
      <div class="wptb-setting-control-row">
        <input :id="fieldData.id" type="checkbox" v-model="modelBind[fieldData.id]" />
        <label :for="fieldData.id">{{ fieldData.label }}</label>
      </div>
    </div>
    <div v-else-if="isType('dropdown')">
      <div class="wptb-setting-control-row">
        <select :id="fieldData.id" v-model="modelBind[fieldData.id]">
          <option v-for="o in fieldData.options" :value="o.value" :key="o.label">
            {{ o.label }}
          </option>
        </select>
        <label :for="fieldData.id">{{ fieldData.label }}</label>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['fieldData', 'modelBind'],
  methods: {
    isType(type) {
      return this.fieldData.type === type;
    },
  },
};
</script>
