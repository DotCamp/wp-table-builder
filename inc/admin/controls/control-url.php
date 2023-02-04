<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder url control.
 *
 * A control class for creating url control for to add tag "a" with href attribute
 * and also to set attributes target and rel="nofollow".
 *
 * @since 1.1.2
 */
class Control_Url extends Base_Control {
	/**
	 * Get control type.
	 *
	 * @return string Control type.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	public function get_type() {
		return 'url';
	}

	/**
	 * Enqueue url control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles used by the url
	 * control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {

	}

	/**
	 * Render url control output in the editor.
	 *
	 * Used to generate the control HTML in the editor wp js template
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function content_template() {
		?>
        <#
            let label,
                selector,
                dataElement,
                convertSpan;

            if( data.label ) {
                label = data.label;
            }

            if( data.selector ) {
                selector = data.selector;
            }

            if( data.convertSpan ) {
                convertSpan = data.convertSpan;
            } else {
                convertSpan = false;
            }

            if( selector ) {
                let selectorArr = selector.replace( '.', '' ).split( ' ' );
                let infArr = selectorArr[0].match( /wptb-element-((.+-)\d+)/i );
                let dataElement = 'wptb-options-' + infArr[1];
            }

            targetInputAddClass = data.elementControlTargetUnicClass;
            let postfixIdFor = targetInputAddClass.replace( 'wptb-el', '' ).toLowerCase();
        #>

        <div class="wptb-settings-item-header" id="{{{targetInputAddClass}}}-header">
            <p class="wptb-settings-item-title">{{{label}}}</p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" id="{{{targetInputAddClass}}}-controls" style="padding-bottom: 10px">
            <div class="wptb-settings-col-xs-8" style="margin: 15px 0;">
                <input type="text" data-type="element-link"
                       placeholder="<?php esc_attr_e( 'Insert Link Here', NS\PLUGIN_TEXT_DOMAIN ); ?>"
                       class="wptb-element-property {{{targetInputAddClass}}}" data-element="{{{dataElement}}}">
            </div>
            <div class="wptb-plugin-width-full" style="border:solid var(--wptb-plugin-gray-300); border-width: 1px 0 1px 0; padding: 10px 0;">
                <div class="wptb-settings-space-between wptb-settings-dropdown-row">
                    <label><?php esc_html_e( 'Link', 'wp-table-builder' ); ?></label>
                    <!--                <select data-type="element-rel" id="element-rel-{{{postfixIdFor}}}" class="wptb-element-property {{{targetInputAddClass}}}" data-element="{{{dataElement}}}">-->
                    <!--                    <option value="none">-->
			        <?php //esc_html_e('None', 'wp-table-builder'); ?><!--</option>-->
                    <!--                    <option value="sponsored">sponsored</option>-->
                    <!--                    <option value="nofollow">nofollow</option>-->
                    <!--                    <option value="noreferrer">noreferrer</option>-->
                    <!--                </select>-->
                </div>
                <?php
                $supported_rel_values = ['sponsored', 'nofollow', 'noreferrer'];

                foreach ($supported_rel_values as $rel):
                ?>
                <div class="wptb-settings-checkbox-row">
                    <input type="checkbox" data-type="element-rel"
                           value="<?php esc_attr_e($rel);?>"
                           id="element-<?php echo esc_attr_e($rel); ?>{{{postfixIdFor}}}"
                           class="wptb-element-property {{{targetInputAddClass}}}" data-element="{{{dataElement}}}">
                    <label for="element-<?php echo esc_attr_e($rel); ?>{{{postfixIdFor}}}"><?php echo $rel;?></label>
                </div>
                <?php endforeach; ?>
            </div>
            <div class="wptb-settings-space-between wptb-settings-dropdown-row">
                <label for="element-target-{{{postfixIdFor}}}"><?php esc_html_e('Open in', 'wp-table-builder'); ?></label>
                <select data-type="element-target" id="element-target-{{{postfixIdFor}}}" class="wptb-element-property {{{targetInputAddClass}}}" data-element="{{{dataElement}}}">
                    <option value="_blank"><?php esc_html_e('New tab', 'wp-table-builder'); ?></option>
                    <option value="_self"><?php esc_html_e('Current window', 'wp-table-builder'); ?></option>
                </select>
            </div>
            <div class="wptb-settings-checkbox-row">
                <input type="checkbox" data-type="element-link-convert-relative"
                       id="element-convert-relative{{{postfixIdFor}}}"
                       class="wptb-element-property {{{targetInputAddClass}}}" data-element="{{{dataElement}}}">
                <label for="element-convert-relative{{{postfixIdFor}}}"><?php esc_html_e( 'Convert Relative Link to Absolute', NS\PLUGIN_TEXT_DOMAIN ); ?></label>
            </div>
        </div>

        <wptb-template-script>
            (function () {
                const getSelectorElement = () => document.querySelector("{{{selector}}}");
                let selectorElement = document.querySelector("{{{selector}}}");
                let targetInputs = document.getElementsByClassName(
                    "{{{targetInputAddClass}}}"
                );

                const wrapperAnchorExists = () => {
                    return convertSpan()
                        ? getSelectorElement().tagName.toLowerCase() === "a"
                        : selectorElement.parentElement.tagName.toLowerCase() === "a";
                };

                const convertSpan = () => "{{{convertSpan}}}" === "true";

                const copyAttrs = (fromEl, toEl) => {
                    for (const attr of fromEl.attributes) {
                        toEl.setAttribute(attr.name, attr.value);
                    }
                };

                const addWrapperAnchor = () => {
                    const selectorElement = getSelectorElement();
                    const newAnchor = document.createElement("a");
                    const parent = selectorElement.parentElement;
                    const nextSibling = selectorElement.nextSibling;

                    parent.removeChild(selectorElement);
                    nextSibling
                        ? parent.insertBefore(newAnchor, nextSibling)
                        : parent.appendChild(newAnchor);

                    if (convertSpan()) {
                        copyAttrs(selectorElement, newAnchor);
                        newAnchor.append(...selectorElement.childNodes);
                    } else {
                        newAnchor.appendChild(selectorElement);
                    }
                };

                const removeWrapperAnchor = () => {
                    if (convertSpan()) {
                        const selectorElement = getSelectorElement();
                        const newSpan = document.createElement("span");
                        const parent = selectorElement.parentElement;
                        const nextSibling = selectorElement.nextSibling;

                        parent.removeChild(selectorElement);
                        nextSibling
                            ? parent.insertBefore(newSpan, nextSibling)
                            : parent.appendChild(newSpan);

                        copyAttrs(selectorElement, newSpan);

                        newSpan.append(...selectorElement.childNodes);
                    } else {
                        const anchor = selectorElement.parentElement;
                        const parent = anchor.parentElement;
                        const nextSibling = anchor.nextSibling;

                        parent.removeChild(anchor);
                        nextSibling
                            ? parent.insertBefore(selectorElement, nextSibling)
                            : parent.appendChild(selectorElement);
                    }
                };

                const isMailLink = (val) => {
                    const regExp = new RegExp(/^(mailto:(.+)@(.+)\.(.+))$/);
                    return regExp.test(val);
                };

                function applyLinkChanges(targetInput) {
                    if (wrapperAnchorExists()) {
                        let href = selectorElement.getAttribute("href");
                        targetInput.value = href;

                        if (!href) {
                            removeWrapperAnchor();
                        }
                    }

                    targetInput.onchange = function () {
                        if (this.value) {
                            if (!wrapperAnchorExists()) addWrapperAnchor();
                            const anchor = convertSpan()
                                ? getSelectorElement()
                                : selectorElement.parentElement;

                            if (isMailLink(this.value)) {
                                anchor.href = this.value;
                            } else {
                                const convertRelative =
                                    anchor.dataset.wptbLinkEnableConvertRelative;
                                anchor.href = WPTB_Helper.linkHttpCheckChange(
                                    this.value,
                                    convertRelative === "true"
                                );
                            }
                        } else {
                            removeWrapperAnchor();
                        }

                        new WPTB_TableStateSaveManager().tableStateSet();
                    };
                }

                function applyTargetChanges(targetInput) {
                    if (wrapperAnchorExists()) {
                        const target =
                            selectorElement.parentElement.getAttribute("target") || "_self";
                        targetInput.value = target;
                    }

                    targetInput.addEventListener("input", (e) => {
                        if (wrapperAnchorExists()) {
                            const val = e.target.value;

                            convertSpan()
                                ? getSelectorElement().setAttribute("target", val)
                                : selectorElement.parentElement.setAttribute("target", val);

                            new WPTB_TableStateSaveManager().tableStateSet();
                        }
                    });
                }

                function applyRelChanges(targetInput) {
                    if (wrapperAnchorExists()) {
                        const rels = (
                            selectorElement.parentElement.getAttribute("rel") || ""
                        ).split(" ");

                        if (rels.includes(targetInput.value)) {
                            targetInput.checked = true;
                        }
                    }

                    targetInput.addEventListener("input", (e) => {
                        if (wrapperAnchorExists()) {
                            const anchor = convertSpan()
                                ? getSelectorElement()
                                : selectorElement.parentElement;
                            const currentValue = targetInput.value;
                            const currentRels = (anchor.getAttribute("rel") || "").split(
                                " "
                            );
                            const index = currentRels.indexOf(currentValue);

                            if (e.target.checked) {
                                if (index < 0) {
                                    currentRels.push(currentValue);
                                    anchor.setAttribute(
                                        "rel",
                                        currentRels.join(" ").trim()
                                    );
                                }
                            } else {
                                currentRels.splice(index, 1);
                                if (currentRels.length === 0) {
                                    anchor.removeAttribute("rel");
                                } else {
                                    anchor.setAttribute(
                                        "rel",
                                        currentRels.join(" ").trim()
                                    );
                                }
                            }

                            new WPTB_TableStateSaveManager().tableStateSet();
                        }
                    });
                }

                function applyConvertRelChanges(targetInput) {
                    if (wrapperAnchorExists()) {
                        const convertRelativeEnabled = convertSpan()
                            ? getSelectorElement().dataset.wptbLinkEnableConvertRelative
                            : selectorElement.parentElement.dataset
                                .wptbLinkEnableConvertRelative;

                        if (convertRelativeEnabled === "true") {
                            targetInput.checked = true;
                        }
                    }

                    targetInput.addEventListener("change", function () {
                        if (wrapperAnchorExists()) {
                            const anchor = convertSpan()
                                ? getSelectorElement()
                                : selectorElement.parentElement;
                            const hrefVal = anchor.href;

                            if (!isMailLink(hrefVal)) {
                                if (this.checked) {
                                    anchor.dataset.wptbLinkEnableConvertRelative = true;
                                } else {
                                    anchor.dataset.wptbLinkEnableConvertRelative = false;
                                }
                                anchor.href = WPTB_Helper.linkHttpCheckChange(
                                    hrefVal,
                                    this.checked
                                );

                                new WPTB_TableStateSaveManager().tableStateSet();
                            }
                        }
                    });
                }

                for (const target of targetInputs) {
                    switch (target.dataset.type) {
                        case "element-link":
                            applyLinkChanges(target);
                            break;

                        case "element-target":
                            applyTargetChanges(target);
                            break;

                        case "element-rel":
                            applyRelChanges(target);
                            break;

                        case "element-link-convert-relative":
                            applyConvertRelChanges(target);
                            break;

                        default:
                            break;
                    }
                }
            })();

        </wptb-template-script>
        
		<?php
	}
}
