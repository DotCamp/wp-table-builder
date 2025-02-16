<template>
  <div class="wptb-switch-v2">
    <button
      type="button"
      class="static-active wptb-button-grey wptb-switch-v2-btn wptb-settings-section-item"
      @click="switchToNewBuilder"
    >
      New Builder
      <div class="wptb-busy" style="opacity: 1" v-if="isChanging">
        <div class="wptb-busy-circle"></div>
        <div class="wptb-busy-circle"></div>
        <div class="wptb-busy-circle"></div>
      </div>
    </button>
  </div>
</template>

<script>
export default {
  data: () => ({
    isChanging: false,
  }),
  methods: {
    async switchToNewBuilder() {
      if (this.isChanging) {
        return;
      }
      this.isChanging = true;
      try {
        const fd = new FormData();
        fd.append("nonce", wptb_admin_object.general_nonce);
        fd.append("action", "wptb_toggle_legacy_builder");
        const res = await fetch(wptb_admin_object.ajaxurl, {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) {
          return;
        }
        if (data.error) {
          return;
        }
        window.location.reload();
      } catch (_) {
        // Empty
      }
      this.isChanging = false;
    },
  },
};
</script>
