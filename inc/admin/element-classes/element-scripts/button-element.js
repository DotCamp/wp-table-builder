const a = element.querySelector("a");
const target = element.querySelector(".wptb-button");
if (a)
    a.onclick = function (e) {
        e.preventDefault();
    };
if (target) {
    const tinyMceInitStart = function () {
        // users tent to use native button implementation of plugin in their custom html elements, using this check to not invalidate any custom html code with tinyMCE
        if (element.parentNode.classList.contains("wptb-custom-html-wrapper")) {
            console.warn(
                "element is part of custom html, aborting tinyMCE init for button."
            );
            return;
        }
        tinyMCE.init({
            target,
            inline: true,
            plugins: "link",
            dialog_type: "modal",
            theme: "modern",
            menubar: false,
            fixed_toolbar_container: "#wpcd_fixed_toolbar",
            toolbar: "bold italic strikethrough",
            extended_valid_elements: "svg[*]",
            verify_html: false,
            setup(ed) {
                ed.on("keydown", function (e) {
                    if (e.keyCode == 13) {
                        e.preventDefault();
                    }

                    const p = e.target.querySelector("p");
                    let pText = p.innerHTML.replace(/\s+/g, " ").trim();
                    pText = pText.replace(/&nbsp;/g, "").trim();

                    if (!window.buttonElemPTextKeyDown) {
                        window.buttonElemPTextKeyDown = pText;
                    }
                });

                ed.on("keyup", function (e) {
                    const p = e.target.querySelector("p");
                    let pText = p.innerHTML.replace(/\s+/g, " ").trim();
                    pText = pText.replace(/&nbsp;/g, "").trim();
                    if (pText !== window.buttonElemPTextKeyDown) {
                        e.target.onblur = function () {
                            const wptbTableStateSaveManager =
                                new WPTB_TableStateSaveManager();
                            wptbTableStateSaveManager.tableStateSet();

                            window.buttonElemPTextKeyDown = "";
                            e.target.onblur = "";
                        };
                    } else {
                        e.target.onblur = "";
                    }
                });
            },
            init_instance_callback(editor) {
                window.currentEditor = editor;
                editor.on("focus", function (e) {
                    const totalWidth =
                        document.getElementsByClassName("wptb-builder-panel")[0]
                            .offsetWidth;
                    if (
                        window.currentEditor &&
                        document.getElementById("wptb_builder").scrollTop >=
                            55 &&
                        window.currentEditor.bodyElement.style.display != "none"
                    ) {
                        document.getElementById(
                            "wpcd_fixed_toolbar"
                        ).style.position = "fixed";
                        document.getElementById(
                            "wpcd_fixed_toolbar"
                        ).style.right = `${
                            totalWidth / 2 -
                            document.getElementById("wpcd_fixed_toolbar")
                                .offsetWidth /
                                2
                        }px`;
                        document.getElementById(
                            "wpcd_fixed_toolbar"
                        ).style.top = "100px";
                    } else {
                        document.getElementById(
                            "wpcd_fixed_toolbar"
                        ).style.position = "static";
                        delete document.getElementById("wpcd_fixed_toolbar")
                            .style.right;
                        delete document.getElementById("wpcd_fixed_toolbar")
                            .style.top;
                    }
                });
            },
        });

        element.removeEventListener("mouseover", tinyMceInitStart, false);
    };

    element.addEventListener("mouseover", tinyMceInitStart, false);
}

(function addBackwardsCompatibility() {
    // for old elements which were before the change of structure of the plugin
    const infArr = element.className.match(/wptb-size-([A-Z]+)/i);
    if (infArr && Array.isArray(infArr)) {
        const wptbSize = infArr[0];
        const wptbSizeNew = wptbSize.toLowerCase();

        element.classList.remove(wptbSize);

        const wptbButtonWrapper = element.querySelector(".wptb-button-wrapper");
        if (wptbButtonWrapper) {
            wptbButtonWrapper.classList.add(wptbSizeNew);
        }
    }

    const anchor = element.querySelector("a");
    if (anchor && !anchor.className) {
        anchor.className = "wptb-link-target";
    }
})();

/**
 * Adds hover color change support for supported button elements.
 */
(function addHoverSupport() {
    const buttons = Array.from(element.querySelectorAll(".wptb-button"));

    buttons.map((b) => {
        if (!b.dataset.wptbElementBgColor) {
            b.dataset.wptbElementBgColor = getComputedStyle(b).backgroundColor;
        }
        if (!b.dataset.wptbElementColor) {
            b.dataset.wptbElementColor = getComputedStyle(b).color;
        }

        b.addEventListener("mouseenter", () => {
            // hover background-color
            if (b.dataset.wptbElementHoverBgColor) {
                b.style.backgroundColor = b.dataset.wptbElementHoverBgColor;
            }
            // hover color
            if (b.dataset.wptbElementHoverTextColor) {
                b.style.color = b.dataset.wptbElementHoverTextColor;
            }
            // hover scale
            if (b.dataset.wptbElementHoverScale) {
                b.style.transform = `scale(${b.dataset.wptbElementHoverScale})`;
            }
        });

        b.addEventListener("mouseleave", () => {
            // reset all supported hover properties to their default value
            if (b.dataset.wptbElementHoverBgColor) {
                b.style.backgroundColor = b.dataset.wptbElementBgColor;
            }
            if (b.dataset.wptbElementHoverTextColor) {
                b.style.color = b.dataset.wptbElementColor;
            }
            if (b.dataset.wptbElementHoverScale) {
                b.style.transform = "scale(1)";
            }
        });
    });
})();

/**
 * Add icon support for button elements
 */
(function addIconSupport() {
    const buttonElements = Array.from(element.querySelectorAll(".wptb-button"));

    // eslint-disable-next-line array-callback-return
    buttonElements.map((b) => {
        if (!b.querySelector(".wptb-button-icon")) {
            const range = document.createRange();
            range.setStart(b, 0);

            const iconElementString =
                '<div class="wptb-button-icon" data-wptb-button-icon-src=""></div>';
            const iconElement =
                range.createContextualFragment(iconElementString);

            b.appendChild(iconElement);
        }
    });
})();
