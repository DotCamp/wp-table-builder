/* eslint-disable */
var WPTB_Parser = function (code) {
  let div = document.createElement("div");
  div.innerHTML = code;

  let table = div.children[0];
  let columnTitleMobile = [
    ...table.querySelectorAll(".wptb-column-title-mobile-container"),
  ];

  for (let i = 0; i < columnTitleMobile.length; i++) {
    let parent = columnTitleMobile[i].parentNode;
    parent.removeChild(columnTitleMobile[i]);
  }

  const LAST_ID = {
    text: 597,
    image: 1,
    list: 1,
    button: 1,
    shortcode: 1,
    starRating: 1,
    customHTML: 1,
    circleRating: 1,
    icon: 1,
    textIcon: 1,
    ribbon: 1,
    badge: 1,
    styledList: 1,
    progressBar: 1,
  };

  const WPTB_BlockFixer = {
    text(el) {
      if (!el.classList.contains("wptb-text-container")) {
        return;
      }

      const newClassName = "wptb-element-text-" + LAST_ID.text++;
      el.className = el.className?.replace(/\s?wptb-element-text-([0-9]+)/, "");
      el.classList.add(newClassName);
    },

    image(el) {
      if (!el.classList.contains("wptb-image-container")) {
        return;
      }
      const newClassName = "wptb-element-image-" + LAST_ID.image++;
      el.className = el.className?.replace(
        /\s?wptb-element-image-([0-9]+)/,
        ""
      );
      el.classList.add(newClassName);
    },

    button(el) {
      if (!el.classList.contains("wptb-button-container")) {
        return;
      }

      const newClassName = "wptb-element-button-" + LAST_ID.button++;
      el.className = el.className?.replace(
        /\s?wptb-element-button-([0-9]+)/,
        ""
      );
      el.classList.add(newClassName);
    },

    list(el) {
      if (!el.classList.contains("wptb-list-container")) {
        return;
      }
      const newClassName = "wptb-element-list-" + LAST_ID.list++;
      el.className = el.className?.replace(/\s?wptb-element-list-([0-9]+)/, "");
      el.classList.add(newClassName);
    },

    starRating(el) {
      if (!el.classList.contains("wptb-star_rating-container")) {
        return;
      }

      const newClassName = "wptb-element-star_rating-" + LAST_ID.starRating++;
      el.className = el.className?.replace(
        /\s?wptb-element-star_rating-([0-9]+)/,
        ""
      );
      el.classList.add(newClassName);
    },

    html(el) {
      if (!el.classList.contains("wptb-custom_html-container")) {
        return;
      }

      const newClassName = "wptb-element-custom_html-" + LAST_ID.customHTML++;
      el.className = el.className?.replace(
        /\s?wptb-element-custom_html-([0-9]+)/,
        ""
      );
      el.classList.add(newClassName);
    },

    shortCode(el) {
      if (!el.classList.contains("wptb-shortcode-container")) {
        return;
      }

      const newClassName = "wptb-element-shortcode-" + LAST_ID.shortcode++;
      el.className = el.className?.replace(
        /\s?wptb-element-shortcode-([0-9]+)/,
        ""
      );
      el.classList.add(newClassName);
    },

    circleRating(el) {
      if (!el.classList.contains("wptb-circle_rating-container")) {
        return;
      }
      const newClassName =
        "wptb-element-circle_rating-" + LAST_ID.circleRating++;
      el.className = el.className?.replace(
        /\s?wptb-element-circle_rating-([0-9]+)/,
        ""
      );
      el.classList.add(newClassName);
    },

    icon(el) {
      if (!el.classList.contains("wptb-icon-container")) {
        return;
      }

      const newClassName = "wptb-element-icon-" + LAST_ID.icon++;
      el.className = el.className?.replace(/\s?wptb-element-icon-([0-9]+)/, "");
      el.classList.add(newClassName);
    },

    ribbon(el) {
      if (!el.classList.contains("wptb-ribbon_element-container")) {
        return;
      }

      const newClassName = "wptb-element-ribbon_element-" + LAST_ID.ribbon++;
      el.className = el.className?.replace(
        /\s?wptb-element-ribbon_element-([0-9]+)/,
        ""
      );
      el.classList.add(newClassName);
    },

    styledList(el) {
      if (!el.classList.contains("wptb-styled_list-container")) {
        return;
      }

      const newClassName = "wptb-element-styled_list-" + LAST_ID.styledList++;
      el.className = el.className?.replace(
        /\s?wptb-element-styled_list-([0-9]+)/,
        ""
      );
      el.classList.add(newClassName);
    },

    textIcon(el) {
      if (!el.classList.contains("wptb-text_icon_element-container")) {
        return;
      }

      const newClassName =
        "wptb-element-text_icon_element-" + LAST_ID.textIcon++;
      el.className = el.className?.replace(
        /\s?wptb-element-text_icon_element-([0-9]+)/,
        ""
      );
      el.classList.add(newClassName);
    },

    progressBar(el) {
      if (!el.classList.contains("wptb-progress_bar-container")) {
        return;
      }

      const newClassName = "wptb-element-progress_bar-" + LAST_ID.progressBar++;
      el.className = el.className?.replace(
        /\s?wptb-element-progress_bar-([0-9]+)/,
        ""
      );
      el.classList.add(newClassName);
    },

    badge(el) {
      if (!el.classList.contains("wptb-badge-container")) {
        return;
      }
      const newClassName = "wptb-element-badge-" + LAST_ID.badge++;
      el.className = el.className?.replace(
        /\s?wptb-element-badge-([0-9]+)/,
        ""
      );
      el.classList.add(newClassName);
    },
  };

  let tds = table.querySelectorAll("td");
  for (let i = 0; i < tds.length; i++) {
    tds[i].classList.add("wptb-droppable");
    tds[i].classList.remove("wptb-column-title-mobile-not-elements");
    const blocks = tds[i].children;
    for (let j = 0; j < blocks.length; j++) {
      WPTB_BlockFixer.text(blocks[j]);
      WPTB_BlockFixer.button(blocks[j]);
      WPTB_BlockFixer.image(blocks[j]);
      WPTB_BlockFixer.list(blocks[j]);
      WPTB_BlockFixer.starRating(blocks[j]);
      WPTB_BlockFixer.html(blocks[j]);
      WPTB_BlockFixer.shortCode(blocks[j]);
      
      WPTB_BlockFixer.circleRating(blocks[j]);
      WPTB_BlockFixer.icon(blocks[j]);
      WPTB_BlockFixer.ribbon(blocks[j]);
      WPTB_BlockFixer.styledList(blocks[j]);
      WPTB_BlockFixer.textIcon(blocks[j]);
      WPTB_BlockFixer.progressBar(blocks[j]);
      WPTB_BlockFixer.badge(blocks[j]);
    }
  }

  return table;
};
