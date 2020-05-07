<template>
  <div class="wptb-menu-popup-wrapper">
    <slot></slot>
    <div class="message">
      <div class="arrow"></div>
      <span v-html="message"></span>
    </div>
  </div>
</template>
<script>
export default {
  props: ['message'],
};
</script>
