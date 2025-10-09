<?php

use WP_Table_Builder as NS;

/**
 * Table Builder UI
 */

?>


<div id="wptb_builder" class="wptb-admin-container">

  <div class="wptb-container">
    <div class="wptb_legacy_warning">
      <div class="wptb_legacy_warning_content">
        <div class="wptb_legacy_warning_icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 20H22L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
            <path d="M12 9V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <path d="M12 17H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
        <div class="wptb_legacy_warning_text">
          <h3>Legacy Builder Deprecation Notice</h3>
          <p>
            You are using the legacy builder. We are phasing out the legacy builder and will be removing it in the
            future.
            Please upgrade to the new builder to continue receiving updates and support.
          </p>
        </div>
        <div class="wptb_legacy_warning_actions">
          <button class="wptb_legacy_warning_button_button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 17L17 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M7 7H17V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            Switch to new builder
          </button>
          <button class="wptb_legacy_warning_close" title="Dismiss warning">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            Keep using legacy builder
          </button>
        </div>
      </div>

    </div>
    <div class="wptb_legacy_content">
      <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-builder-left-panel.php'; ?>

      <div class="wptb-builder-panel">
        <div class="wptb-builder-header">
          <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-builder-header.php'; ?>
          <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-header-toolbox.php'; ?>
        </div>
        <div class="wptb-builder-content">
          <?php require_once NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/wptb-builder-table-setup.php'; ?>
        </div>
        <?php do_action('wp-table-builder/action/wptb-builder-view'); ?>
      </div>
    </div>

  </div>

  <!-- after html -->
  <?php echo do_action('wp_table_builder:html_code_after'); ?>

</div>

<style type="text/css" id="custom-cursor">
  .wptb_legacy_warning {
    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
    border: 1px solid #e55a2b;
    position: relative;
    overflow: hidden;
  }

  .wptb_legacy_warning::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ff4757, #ff6b35, #f7931e);
  }

  .wptb_legacy_warning_content {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 20px;
    color: #fff;
  }

  .wptb_legacy_warning_icon {
    flex-shrink: 0;
    margin-top: 2px;
    color: #fff;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }

  .wptb_legacy_warning_text {
    flex: 1;
    min-width: 0;
  }

  .wptb_legacy_warning_text h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .wptb_legacy_warning_text p {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.95);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .wptb_legacy_warning_button_button {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    backdrop-filter: blur(10px);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .wptb_legacy_warning_button_button:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .wptb_legacy_warning_button_button:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .wptb_legacy_warning_button_button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .wptb_legacy_warning_close {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.9);
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    backdrop-filter: blur(10px);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .wptb_legacy_warning_close:hover {
    background: transparent;
    border: none;
    color: #fff;
    transform: translateY(1px);
  }

  .wptb_legacy_warning_close:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .wptb_legacy_content {
    overflow: hidden;
    height: calc(100vh - 100px);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .wptb_legacy_warning_content {
      flex-direction: column;
      gap: 12px;
      padding: 16px;
    }

    .wptb_legacy_warning_actions {
      width: 100%;
      flex-direction: column;
      gap: 8px;
    }

    .wptb_legacy_warning_button_button,
    .wptb_legacy_warning_close {
      width: 100%;
      justify-content: center;
    }
  }
</style>
<script type="text/javascript">
  let isChanging = false;
  async function switchToNewBuilder(evt) {
    if (isChanging) {
      return;
    }
    isChanging = true;
    evt.target.disabled = true;
    evt.target.innerHTML = "Switching to new builder...";
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
        evt.target.disabled = false;
        evt.target.innerHTML = "Switch to new builder";
        return;
      }
      if (data.error) {
        evt.target.disabled = false;
        evt.target.innerHTML = "Switch to new builder";
        return;
      }
      window.location.reload();
    } catch (_) {
      // Empty
    }
    isChanging = false;
    evt.target.disabled = false;
    evt.target.innerHTML = "Switch to new builder";
  }
  document.querySelector(".wptb_legacy_warning_button_button").addEventListener("click", switchToNewBuilder);
  document.querySelector(".wptb_legacy_warning_close").addEventListener("click", () => {
    document.querySelector(".wptb_legacy_warning").style.display = "none";
    document.querySelector(".wptb_legacy_content").style.height = "100vh";
  });
</script>