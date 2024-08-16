/* eslint-disable */
var WPTB_Stringifier = function (codeMain) {
  if (!codeMain) {
    return;
  }

  const data = codeMain.dataset;
  const tBodyData = codeMain.querySelector("tbody")?.dataset || {};
  const tableStyle = codeMain.style;
  
  const firstTd = codeMain.querySelector("td");
  const allTr = codeMain.querySelectorAll("tr");

  const tableProps = {
    alignment: data.wptbTableAlignment || "center",
    enableMaxWidth: data.wptbApplyTableContainerMaxWidth ? 1 : false,
    maxWidth: data.wptbTableContainerMaxWidth || "700",
    cellMinWidth: data.wptbTdWidthAuto || "120",
    sortHorizontal: data.wptbSortableTableHorizontal == "1" ? 1 : false,
    sortVertical: data.wptbSortableTableVertical == "1" ? 1 : false,
    separateCells: tableStyle.borderCollapse !== "collapse" ? true : false,
    tableSpacingX: data.borderSpacingColumns || "3",
    tableSpacingY: data.borderSpacingRows || "3",
    cols: data.tableColumns,
    cellsWidthAutoCount: data.wptbCellsWidthAutoCount,
    tdSumMaxWidth: data.wptbTableTdsSumMaxWidth,

    // Global Font Style
    fontColor: tBodyData.globalFontColor || "#000000",
    linkColor: tBodyData.globalLinkColor || "#000000",
    fontSize: tBodyData.globalFontSize || "15",

    // Border
    tableBorder: tableStyle.border,
    headerInnerBorder: firstTd?.style.border,
    // rowBorderOnly: null, // It's in the directives
    // columnBorderOnly: null, // It's in the directives

    // Other
    scrollX: data.wptbHorizontalScrollStatus,
    disableThemeStyles: data.wptbDisableThemeStyles === "1" ? 1 : false,
    extraStyles: data.wptbExtraStyles || "",
    stickyFirstColumn: data.wptbFirstColumnSticky,
    stickyTopRow:
      codeMain.querySelector("tr")?.dataset?.wptbStickyRow === "true"
        ? true
        : false,
    paginationEnable: data.wptbPaginationEnable === "true" ? "true" : false,
    paginationTopRowAsHeader: (
      data.wptbProPaginationTopRowHeader === "true"
    ).toString(),
    rowsPerPage: data.wptbRowsPerPage || "10",
    rowsChangeable: data.wptbRowsChangeable === "true" ? "true" : false,

    searchEnable: data.wptbSearchEnable === "true" ? "true" : false,
    searchKeepHeader: (data.wptbProSearchTopRowHeader === "true").toString(),
    searchPosition: data.wptbSearchbarPosition || "left",
    role: codeMain.getAttribute("role") || "table",

    directives: data.wptbTableDirectives,
    responsiveDirectives: data.wptbResponsiveDirectives,

    // Colors
    headerBg: data.wptbHeaderBackgroundColor,
    evenRowBg: data.wptbEvenRowBackgroundColor,
    oddRowBg: data.wptbOddRowBackgroundColor,

    hoverHeaderBg: data.wptbHeaderHoverBackgroundColor,
    hoverEvenRowBg: data.wptbEvenRowHoverBackgroundColor,
    hoverOddRowBg: data.wptbOddRowHoverBackgroundColor,
  };

  const rows = [];

  Array.from(allTr).forEach((el) => {
    const hMatch = el.className.match(/wptb-row-highlighted-([0-9]+)/);
    const row = {
      props: {
        hightLighted: hMatch ? `wptb-row-highlighted-${hMatch[1]}` : undefined,
        background: el.style.backgroundColor,
      },
      cells: [],
    };
    Array.from(el.children).forEach((td) => {
      const tData = td.dataset;
      const hMatch = td.className.match(/wptb-col-highlighted-([0-9]+)/);

      const cell = {
        props: {
          width: td.style.width,
          autoWidth: tData.wptbCssTdAutoWidth === "true" ? "true" : false,
          height: td.style.height,
          autoHeight: tData.wptbCssTdAutoHeight === "true" ? "true" : false,
          padding: td.style.padding,
          background: td.style.backgroundColor,
          ownBgColor: tData.wptbOwnBgColor,
          borderWidth: td.style.borderWidth,
          borderColor: td.style.borderColor,
          borderStyle: td.style.borderStyle,
          borderRadius: td.style.borderRadius,
          vAlign: tData.wptbCellVerticalAlign || "center",
          isEmpty: td.classList.contains("wptb-empty"),
          highlighted: `wptb-col-highlighted-${hMatch?.[1] || "none"}`,
          xIndex: tData.xIndex,
          yIndex: tData.yIndex,
          xSort: tData.sortedVertical,
          ySort: tData.sortedHorizontal,
        },
        blocks: [],
      };

      Array.from(td.children).forEach((blockEl) => {
        const block =
          WPTB_BlockSerializer.text(blockEl) ||
          WPTB_BlockSerializer.image(blockEl) ||
          WPTB_BlockSerializer.button(blockEl) ||
          WPTB_BlockSerializer.list(blockEl) ||
          WPTB_BlockSerializer.starRating(blockEl) ||
          WPTB_BlockSerializer.html(blockEl) ||
          WPTB_BlockSerializer.shortCode(blockEl) ||
          // Pro
          WPTB_BlockSerializer.circleRating(blockEl) ||
          WPTB_BlockSerializer.icon(blockEl) ||
          WPTB_BlockSerializer.ribbon(blockEl) ||
          WPTB_BlockSerializer.styledList(blockEl) ||
          WPTB_BlockSerializer.textIcon(blockEl) ||
          WPTB_BlockSerializer.progressBar(blockEl) ||
          WPTB_BlockSerializer.badge(blockEl);
        block && cell.blocks.push(block);
      });

      row.cells.push(cell);
    });
    rows.push(row);
  });

  return JSON.stringify({
    props: tableProps,
    rows,
  });
};

var WPTB_BlockSerializer = {
  text(el) {
    if (!el.classList.contains("wptb-text-container")) {
      return;
    }
    let text = "";
    Array.from(el.querySelectorAll("p")).forEach((child) => {
      text += child.outerHTML;
    });
    return {
      type: "text",
      props: {
        text,
        color: el.style.color,
        fontSize: el.style.fontSize,
        padding: el.style.padding,
        margin: el.style.margin,
      },
    };
  },

  image(el) {
    if (!el.classList.contains("wptb-image-container")) {
      return;
    }

    const imgEl = el.querySelector("img");
    const lTarget = el.querySelector(".wptb-link-target");

    return {
      type: "image",
      props: {
        src: imgEl?.src,
        alignment: el.dataset.wptbImageAlignment || "center",
        altText: imgEl?.getAttribute("alt"),
        imgHeight: imgEl?.getAttribute("height"),
        imgWidth: imgEl?.getAttribute("width"),

        sizeRelativeTo: el.dataset.wptbImageSizeRelative || "container",
        size: imgEl.dataset.wptbSize,
        width: lTarget?.style.width,

        url: lTarget?.href,
        linkRel: lTarget?.getAttribute("rel"),
        linkTarget: lTarget?.getAttribute("target"),
        convertToAbsolute:
          lTarget?.dataset.wptbLinkEnableConvertRelative === "true"
            ? "true"
            : false,

        padding: el.style.padding,
        margin: el.style.margin,
      },
    };
  },

  button(el) {
    if (!el.classList.contains("wptb-button-container")) {
      return;
    }

    const bWrap = el.querySelector(".wptb-button-wrapper");
    const lTarget = el.querySelector(".wptb-link-target");
    const btnDiv = el.querySelector(".wptb-button");
    const iconEl = el.querySelector(".wptb-button-icon");
    const labelEl = el.querySelector(".wptb-button-label");

    return {
      type: "button",
      props: {
        text: el.querySelector("p").innerHTML,
        size: bWrap.className.match(/wptb-size-(s|m|l|xl)/)?.[1] || "m",
        width: lTarget?.style.width,
        borderRadius: btnDiv?.style.borderRadius,
        background: btnDiv?.dataset.wptbElementBgColor,
        color: btnDiv?.dataset.wptbElementColor,
        buttonAlignment: bWrap?.style.justifyContent,
        contentAlignment: btnDiv?.style.justifyContent,
        id: lTarget?.id,
        // Url
        url: lTarget?.href,
        linkRel: lTarget?.getAttribute("rel"),
        linkTarget: lTarget?.getAttribute("target"),
        convertToAbsolute:
          lTarget?.dataset.wptbLinkEnableConvertRelative === "true"
            ? true
            : false,

        // Hover
        hoverBg: btnDiv?.dataset.wptbElementHoverBgColor,
        hoverColor: btnDiv?.dataset.wptbElementHoverTextColor,
        hoverScale: btnDiv?.dataset.wptbElementHoverScale,

        // Icon
        icon: iconEl?.dataset.wptbButtonIconSrc || "",
        iconPosition: btnDiv?.classList.contains(
          "wptb-plugin-button-order-right"
        )
          ? "right"
          : "left",
        iconSize: iconEl?.style.height,

        // Label
        hasLabel: bWrap.classList.contains("wptb-button-has-label"),
        labelBg: labelEl?.style.backgroundColor,
        labelColor: labelEl?.style.color,
        labelText: labelEl?.innerHTML,

        // Spacing
        padding: el.style.padding,
        margin: el.style.margin,
      },
    };
  },

  list(el) {
    if (!el.classList.contains("wptb-list-container")) {
      return;
    }

    const firstLi = el.querySelector("li");
    const firstP = firstLi?.querySelector("p");
    const icon = firstP.className.match(
      /wptb-list-style-type-(none|circle|square|disc)/
    )?.[0];

    const items = [];

    Array.from(el.querySelectorAll("li")).forEach((child) => {
      const toolTipEl = child.querySelector(".wptb-m-tooltip");
      const tooltipPosision =
        child.className.match(/wptb-tooltip-(top|bottom|left|right)/)?.[0] ||
        "top";
      const pEl = child.querySelector("p");

      const alignment = pEl?.style.textAlign || "left";

      items.push({
        text: pEl.innerHTML,
        alignment,
        toolTip: toolTipEl?.innerHTML || "",
        tooltipPosision,
        toolTipStyle: toolTipEl?.getAttribute("style") || "",
      });
    });


    return {
      type: "list",
      props: {
        type: icon ? "unordered" : "ordered",
        listIcon: icon || "disc",
        color: firstP?.style.color,
        fontSize: firstP?.style.fontSize,
        itemSpacing: firstLi?.style.marginBottom,

        padding: el.style.padding,
        margin: el.style.margin,
      },
      items,
    };
  },

  starRating(el) {
    if (!el.classList.contains("wptb-star_rating-container")) {
      return;
    }

    const firstStar = el.querySelector("li");
    const ratingBox = el.querySelector(".wptb-number-rating-box");
    const ratingEl = ratingBox?.firstElementChild;
    return {
      type: "starRating",
      props: {
        starSize: firstStar?.style.height,
        starColor: firstStar?.querySelector("svg")?.style.fill,
        starCount: el.dataset.starCount,
        alignment: el.style.textAlign,
        showRating: ratingBox?.style.display !== "none",
        fontSize: ratingEl?.style.fontSize,
        color: ratingEl?.style.color,

        value: Number(ratingEl?.textContent.split("/")?.[0].trim() || 0),

        padding: el.style.padding,
        margin: el.style.margin,
      },
    };
  },

  html(el) {
    if (!el.classList.contains("wptb-custom-html-container")) {
      return;
    }
    return {
      type: "customHtml",
      props: {
        html: el.firstElementChild.innerHTML,

        padding: el.style.padding,
        margin: el.style.margin,
      },
    };
  },

  shortCode(el) {
    if (!el.classList.contains("wptb-shortcode-container")) {
      return;
    }
    return {
      type: "shortcode",
      props: {}
    }
  },

  circleRating(el) {
    if (!el.classList.contains("wptb-circle_rating-container")) {
      return;
    }

    const wrapper = el.querySelector(".wptb-rating-circle-wrapper");
    const bar = el.querySelector(".wptb-rating-circle-bar");

    return {
      type: "circleRating",
      props: {
        size: wrapper?.style.fontSize,
        color: bar?.style.borderColor,
        ratingType:
          el.dataset.wptbRatingType === "number" ? "number" : "percent",
        value: el.dataset.percentageCount || "37",
        total: el.dataset.wptbTotalNumber || "10",

        padding: el.style.padding,
        margin: el.style.margin,
      },
    };
  },

  icon(el) {
    if (!el.classList.contains("wptb-icon-container")) {
      return;
    }

    const wrapper = el.querySelector(".wptb-icon-wrapper");
    const firstIcon = el.querySelector(".wptb-icon-link-target-1");

    const icons = [];

    Array.from(wrapper.children).forEach((child) => {
      const divEl = child.firstElementChild;
      icons.push({
        icon: divEl?.dataset.wptbIconSrc || "star",
        url: child?.href,
        linkRel: child?.getAttribute("rel"),
        linkTarget: child?.getAttribute("target"),
        convertToAbsolute:
          child?.dataset.wptbLinkEnableConvertRelative === "true"
            ? true
            : false,
      });
    });

    return {
      type: "icon",
      props: {
        count: el.dataset.wptbIconNumber,
        size: firstIcon?.firstElementChild?.style.width,
        alignment: wrapper?.style.textAlign,

        padding: el.style.padding,
        margin: el.style.margin,
      },
      icons,
    };
  },

  ribbon(el) {
    if (!el.classList.contains("wptb-ribbon_element-container")) {
      return;
    }

    const inner = el.querySelector(".wptb-element-ribbon-inner");
    const colorDump = el.querySelector(".wptb-element-ribbon-color-dump");
    const pEL = inner?.querySelector("p");
    const iconEl = el.querySelector("#wptbRibbonIconDump");

    return {
      type: "ribbon",
      props: {
        type: el.dataset.wptbRibbonType,
        modifications: el.dataset.wptbRibbonModifications,
        side: el.dataset.wptbRibbonSide,
        xOffset: el.dataset.wptbRibbonXOffset,
        yOffset: el.dataset.wptbRibbonYOffset,
        width: el.dataset.wptbRibbonWidth,
        style: el.getAttribute("style"),

        background: (colorDump || inner)?.style.backgroundColor,
        borderColor: (colorDump || inner)?.style.borderColor,
        color: el.style.color,
        fontSize: pEL?.style.fontSize,
        text: pEL?.innerHTML,

        icon: iconEl?.dataset.wptbRibbonIconSrc,
        enableAnimation: iconEl?.dataset.enableAnimation === '1'? '1' : false,
        animationType: iconEl?.dataset.wptbRibbonIconAnimationType,
      },
    };
  },

  styledList(el) {
    if (!el.classList.contains("wptb-styled_list-container")) {
      return;
    }
    const firstLi = el.querySelector("li");
    const firstP = firstLi?.querySelector("p");
    const iconEL = el.querySelector(".wptb-styled-list-icon");

    const items = [];

    Array.from(el.querySelectorAll("li")).forEach((child) => {
      const toolTipEl = child.querySelector(".wptb-m-tooltip");
      const tooltipPosision =
        child.className.match(/wptb-tooltip-(top|bottom|left|right)/)?.[0] ||
        "top";
      const pEl = child.querySelector("p");

      const alignment =
        child.firstElementChild?.dataset.wptbStyledListAlignment || "left";

      
      items.push({
        text: pEl.innerHTML,
        alignment,
        toolTip: toolTipEl?.innerHTML || "",
        tooltipPosision,
        toolTipStyle: toolTipEl?.getAttribute("style") || "",
      });
    });


    return {
      type: "styledList",
      props: {
        icon: iconEL?.dataset.wptbStyledListIconSrc,
        iconSize: iconEL?.style.height,
        iconColor: iconEL?.style.fill,
        iconSpacing: firstP?.style.marginLeft,
        color: firstP?.style.color,
        fontSize: firstP?.style.fontSize,
        itemSpacing: firstLi?.style.marginBottom,

        padding: el.style.padding,
        margin: el.style.margin,
      },
      items,
    };
  },

  textIcon(el) {
    if (!el.classList.contains("wptb-text_icon_element-container")) {
      return;
    }

    const data = el.dataset;

    const pEl = el.querySelector("p");
    const iconEL = el.querySelector(".wptb-text-icon-icon-wrapper");

    return {
      type: "textIcon",
      props: {
        spaceBetween: data.wptbTextIconSpaceBetween,
        alignment: data.wptbTextIconAlignment,
        fontSize: el.style.fontSize,
        color: pEl?.parentElement.style.color,
        text: pEl?.innerHTML,
        icon: iconEL?.dataset.wptbTextIconIconSrc,
        iconLocation: data.wptbTextIconIconLocation,
        iconSize: iconEL?.style.height,
        iconColor: iconEL?.style.color,

        padding: el.style.padding,
        margin: el.style.margin,
      },
    };
  },

  progressBar(el) {
    if (!el.classList.contains("wptb-progress_bar-container")) {
      return;
    }

    const labelEl = el.querySelector(".wptb-progress-bar-label");
    const prBar = el.querySelector(".wptb-progress-bar-trail");

    return {
      type: "progressBar",
      props: {
        value: parseInt(labelEl?.textContent || "0"),
        thickness: prBar?.style.strokeWidth,
        primaryColor: el
          .querySelector(".wptb-progress-bar-path")
          ?.getAttribute("stroke"),
        secondaryColor: prBar?.getAttribute("stroke"),
        labelColor: labelEl?.style.color,

        padding: el.style.padding,
        margin: el.style.margin,
      },
    };
  },

  badge(el) {
    if (!el.classList.contains("wptb-badge-container")) {
      return;
    }

    const wrapper = el.querySelector(".wptb-badge-wrapper");

    return {
      type: "badge",
      props: {
        fontSize: wrapper?.style.fontSize,
        color: wrapper?.style.color,
        background: wrapper?.style.backgroundColor,
        alignment: el.style.justifyContent,

        text: wrapper?.firstElementChild?.innerHTML,

        padding: el.style.padding,
        margin: el.style.margin,
      },
    };
  },
};
