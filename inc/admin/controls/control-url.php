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
                       placeholder="<?php esc_attr_e( 'Insert Link Here', 'wp-table-builder' ); ?>"
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
                <label for="element-convert-relative{{{postfixIdFor}}}"><?php esc_html_e( 'Convert Relative Link to Absolute', 'wp-table-builder' ); ?></label>
            </div>
        </div>

        <wptb-template-script>
            (function () {
                let selectorElement = document.querySelector("{{{selector}}}");

                let elementIsAnchor = selectorElement.tagName.toLowerCase() === "a";

                const copyAttrs = (fromEl, toEl) => {
                    for (const attr of fromEl.attributes) {
                        toEl.setAttribute(attr.name, attr.value);
                    }
                };

                const disableControls = () => {
                    const targetInputs = document.getElementsByClassName(
                        "{{{targetInputAddClass}}}"
                    );

                    for (const target of targetInputs) {
                        if (target.dataset.type !== "element-link")
                            target.setAttribute("disabled", "");
                    }
                };

                const enableControls = () => {
                    const targetInputs = document.getElementsByClassName(
                        "{{{targetInputAddClass}}}"
                    );

                    for (const target of targetInputs) {
                        target.removeAttribute("disabled");
                    }
                };

                const convertSpanToAnchor = () => {
                    const newAnchor = document.createElement("a");
                    const parent = selectorElement.parentElement;
                    const nextSibling = selectorElement.nextSibling;

                    parent.removeChild(selectorElement);
                    nextSibling
                        ? parent.insertBefore(newAnchor, nextSibling)
                        : parent.appendChild(newAnchor);

                    copyAttrs(selectorElement, newAnchor);
                    newAnchor.append(...selectorElement.childNodes);

                    newAnchor.addEventListener("click", (e) => e.preventDefault());

                    selectorElement = newAnchor;
                    elementIsAnchor = true;
                    enableControls();
                };

                const convertAnchorToSpan = () => {
                    selectorElement.removeAttribute("href");
                    const newSpan = document.createElement("span");
                    const parent = selectorElement.parentElement;
                    const nextSibling = selectorElement.nextSibling;

                    parent.removeChild(selectorElement);
                    nextSibling
                        ? parent.insertBefore(newSpan, nextSibling)
                        : parent.appendChild(newSpan);

                    copyAttrs(selectorElement, newSpan);

                    newSpan.append(...selectorElement.childNodes);

                    selectorElement = newSpan;
                    elementIsAnchor = false;
                    disableControls();
                };

                const isMailLink = (val) => {
                    const regExp = new RegExp(/^(mailto:(.+)@(.+)\.(.+))$/);
                    return regExp.test(val);
                };

                const isTelLink = (val) => {
                    const regExp = new RegExp(/^(tel:)([\d\(\) \+\-]+)$/);
                    return regExp.test(val);
                };

                function setLinkValue(targetInput) {
                    if (!elementIsAnchor) {
                        disableControls();
                        return;
                    }

                    const href = selectorElement.getAttribute("href");
                    targetInput.value = href;

                    if (!href) {
                        convertAnchorToSpan();
                    }
                }

                function setTargetInputValue(targetInput) {
                    if (!elementIsAnchor) return;

                    const target = selectorElement.getAttribute("target") || "_self";
                    targetInput.value = target;
                }

                function setRelInputValue(targetInput) {
                    if (!elementIsAnchor) return;

                    const rels = (selectorElement.getAttribute("rel") || "").split(" ");

                    if (rels.includes(targetInput.value)) {
                        targetInput.checked = true;
                    }
                }

                function setConvertToRelInputValue(targetInput) {
                    if (!elementIsAnchor) return;

                    const convertRelativeEnabled =
                        selectorElement.dataset.wptbLinkEnableConvertRelative;

                    if (convertRelativeEnabled === "true") {
                        targetInput.checked = true;
                    }
                }

                function linkChangeCallback() {
                    if (this.value) {
                        if (!elementIsAnchor) convertSpanToAnchor();

                        if (isMailLink(this.value) || isTelLink(this.value)) {
                            selectorElement.href = this.value;
                        } else {
                            const convertRelative =
                                selectorElement.dataset.wptbLinkEnableConvertRelative;
                            selectorElement.href = WPTB_Helper.linkHttpCheckChange(
                                this.value,
                                convertRelative === "true"
                            );
                        }
                    } else {
                        convertAnchorToSpan();
                    }

                    new WPTB_TableStateSaveManager().tableStateSet();
                }

                const targetChangeCallback = (e) => {
                    if (!elementIsAnchor) return;

                    const val = e.target.value;

                    selectorElement.setAttribute("target", val);

                    new WPTB_TableStateSaveManager().tableStateSet();
                };

                const relChangeCallback = (e, currentValue) => {
                    if (!elementIsAnchor) return;

                    const currentRels = (selectorElement.getAttribute("rel") || "").split(
                        " "
                    );
                    const index = currentRels.indexOf(currentValue);

                    if (e.target.checked) {
                        if (index < 0) {
                            currentRels.push(currentValue);
                            selectorElement.setAttribute(
                                "rel",
                                currentRels.join(" ").trim()
                            );
                        }
                    } else {
                        currentRels.splice(index, 1);
                        if (currentRels.length === 0) {
                            selectorElement.removeAttribute("rel");
                        } else {
                            selectorElement.setAttribute(
                                "rel",
                                currentRels.join(" ").trim()
                            );
                        }
                    }

                    new WPTB_TableStateSaveManager().tableStateSet();
                };

                function convertToRelCallback() {
                    if (!elementIsAnchor) return;

                    const hrefVal = selectorElement.href;

                    if (!isMailLink(hrefVal) || !isTelLink(hrefVal)) {
                        if (this.checked) {
                            selectorElement.dataset.wptbLinkEnableConvertRelative = true;
                        } else {
                            selectorElement.dataset.wptbLinkEnableConvertRelative = false;
                        }
                        selectorElement.href = WPTB_Helper.linkHttpCheckChange(
                            hrefVal,
                            this.checked
                        );

                        new WPTB_TableStateSaveManager().tableStateSet();
                    }
                }

                (function setInputValuesAndCallbacks() {
                    const targetInputs = document.getElementsByClassName(
                        "{{{targetInputAddClass}}}"
                    );

                    for (const target of targetInputs) {
                        switch (target.dataset.type) {
                            case "element-link":
                                setLinkValue(target);
                                target.oninput = linkChangeCallback;
                                break;

                            case "element-target":
                                setTargetInputValue(target);
                                target.addEventListener("input", targetChangeCallback);
                                break;

                            case "element-rel":
                                setRelInputValue(target);
                                target.addEventListener("input", (e) =>
                                    relChangeCallback(e, target.value)
                                );
                                break;

                            case "element-link-convert-relative":
                                setConvertToRelInputValue(target);
                                target.addEventListener("change", convertToRelCallback);
                                break;

                            default:
                                break;
                        }
                    }
                })();
            })();
        </wptb-template-script>
        
		<?php
	}
}
