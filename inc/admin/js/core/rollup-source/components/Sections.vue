<template>
  <div>
    <div class="wptb-settings-sections-wrapper" :class="{ child }">
      <section-item
        v-for="item in items"
        :name="item"
        @sectionchange="handleSectionChange"
        :current="innerCurrentSection"
      ></section-item>
    </div>
    <slot></slot>
  </div>
</template>
<script>
import SectionItem from './SectionItem';

export default {
  model: {
    prop: 'currentSection',
    event: 'updateSection',
  },
  props: {
    child: {
      type: Boolean,
      default: false,
    },
    items: Array,
    currentSection: String,
  },
  components: { SectionItem },
  data() {
    return {
      innerCurrentSection: '',
    };
  },
  mounted() {
    this.innerCurrentSection = this.currentSection || this.items[0];
  },
  watch: {
    innerCurrentSection(n) {
      this.$emit('updateSection', n);
    },
  },
  methods: {
    handleSectionChange(val) {
      this.innerCurrentSection = val;
    },
  },
};
</script>
