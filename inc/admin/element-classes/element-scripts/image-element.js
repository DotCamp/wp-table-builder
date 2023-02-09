element.querySelectorAll("a").forEach((anchor) => {
    anchor.addEventListener("click", (e) => e.preventDefault());
});

const linkTarget = element.querySelector(".wptb-link-target");

const addMedia = function (element, imageChange = false) {
    const img = element.querySelector("img");

    let src;
    if (img && img.src) {
        src = img.src;
    }

    file_frame = wp.media.frames.file_frame = wp.media({
        title: "Select a image to upload",
        button: {
            text: "Use this image",
        },
        multiple: false,
        frame: "post",
    });

    const imageSetting = function (img, attachment) {
        if (!img) {
            img = document.createElement("img");

            element.querySelector(".wptb-link-target").appendChild(img);
        }

        const imageButton = linkTarget.querySelector(".wptb-icon-image-button");

        // remove image button that is present when image element is empty
        if (imageButton) {
            linkTarget.removeChild(imageButton);
        }

        // make img tag visible
        img.classList.remove("wptb-image-element-dummy");

        const imgSrc = attachment.url;
        const linkArr = imgSrc.split(":");
        let linkClean;
        if (Array.isArray(linkArr) && linkArr.length > 0) {
            linkClean = linkArr[linkArr.length - 1];
        }

        img.height = attachment.height;
        img.width = attachment.width;
        img.style.width = "100%";
        img.src = linkClean;

        // add image element class for easy filtering
        img.classList.add("wptb-image-element-target");

        element.classList.remove("wptb-elem-placeholder");

        const wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    file_frame.on("select", function () {
        attachment = file_frame.state().props.toJSON();
        imageSetting(img, attachment);
    });

    file_frame.on("insert", function () {
        attachment = file_frame.state().get("selection").first().toJSON();
        imageSetting(img, attachment);
    });

    if (src == undefined || imageChange == true) {
        file_frame.open();
        file_frame.menuItemVisibility("gallery", "hide");
        file_frame.menuItemVisibility("playlist", "hide"),
            file_frame.menuItemVisibility("video-playlist", "hide"),
            file_frame.menuItemVisibility("audio-playlist", "hide");
    } else {
        img.src = src;
    }
};

const iconImageButton = element.querySelector(".wptb-icon-image-button");
if (iconImageButton) {
    iconImageButton.onclick = function () {
        addMedia(element, true);
    };
}

if (iconImageButton && !element.classList.contains("wptb-elem-placeholder")) {
    element.classList.add("wptb-elem-placeholder");
    addMedia(element);
}

const watchList = {
    imageReplaceButton(val, element) {
        addMedia(element, true);
    },
    imageAlignment(alignment, element) {
        const linkTarget = element.querySelector(".wptb-link-target");
        // update style float value for more fluid transition between relative modes
        linkTarget.style.float = alignment === "center" ? "none" : alignment;
    },
};

function controlsChange(inputs, element) {
    // eslint-disable-next-line array-callback-return
    Object.keys(inputs).map((input) => {
        if (Object.prototype.hasOwnProperty.call(inputs, input)) {
            if (Object.prototype.hasOwnProperty.call(watchList, input)) {
                watchList[input](
                    inputs[input].eventValue || inputs[input].targetValue,
                    element
                );
            }
        }
    });
}

/**
 * Backward compatibility operations for tables created before.
 */
(function imageElementBackwardsCompatibility() {
    const imageAnchor = element.querySelector("a");

    if (imageAnchor) {
        // compatibility update for new image alignment control
        const floatVal =
            (imageAnchor.style.float === "none"
                ? "center"
                : imageAnchor.style.float) || "center";

        const imageSizeRelative = element.dataset.wptbImageSizeRelative;

        if (!imageSizeRelative) {
            WPTB_ControlsManager.updateControlValue(
                elementId,
                "imageAlignment",
                floatVal
            );
        }

        if (!imageAnchor.className) {
            imageAnchor.className = "wptb-link-target";
        }
    }
})();

WPTB_Helper.controlsInclude(element, controlsChange, true);
