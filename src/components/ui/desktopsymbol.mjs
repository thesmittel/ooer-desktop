/**
 * Creates a desktop symbol
 * @file desktopsymbol.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:UIElements > DesktopSymbol
 * @see <a href="./client.Client_UIElements%2520_%2520ContextMenu.html">Module</a>
 */
/**
 * Creates a desktop symbol
 * @file desktopsymbol.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:UIElements > DesktopSymbol
 * @see <a href="./Client_UIElements.Client_UIElements%2520_%2520DesktopSymbol.html">Module</a>
 * @namespace ClientCode.UIElements
 */
/**
 * @module DesktopSymbol
 * @memberof Client:UIElements
 * @description Creates and manages an elements context menu
 * @name Client:UIElements > DesktopSymbol
 * @author Smittel
 */

import { App, System } from "../Connect.mjs";
import { dragElement } from "../Dragging.mjs";
import * as Keys from "../Keyboard.mjs";
import { create } from "../Util.mjs";
import { ContextMenu, DialogBox } from "../ui.mjs";
import { PasswordPrompt } from "./passwordPrompt.mjs";

function isLockedError(text) {
    const error = new DialogBox(text,
        "Application locked, please unlock first",
        3,
        [{
            text: "OK", call:()=>{error.close()}, main: true}],
        document.body,
        false
    )
    return error;
}

class DesktopSymbol {
    element;
    label;
    icon;
    appid;
    contextmenu;
    description;
    position;
    locked;
    lockedMarker;
    background;
    constructor({ position, appid, text, icon, description, contextmenu, locked, label, systemapp }) {
        if (!contextmenu) {
            contextmenu = []
        } else {
            contextmenu.push({type: "divider"})
        }
        this.locked = locked;
        // Errors
        if (!(contextmenu instanceof Array)) throw new ReferenceError("class DesktopSymbol: optional argument contextMenu must be an array.")
            if (!text) throw new ReferenceError("class DesktopSymbol: argument text must be non-empty string. Got: '" + text + "' (" + typeof label + ")");

        this.lockedMarker = create({
            tagname: "div",
            classList: ["symbol-locked"],
            childElements: [{
                tagname: "i",
                classList: ["bx", "bxs-lock-alt", "bx-md"]
            }]
        })


        this.contextmenu = contextmenu
        this.icon = icon;
        if (!icon) this.icon = appid; // If user didnt customise icon, use assigned apps icon
        this.label = label || text;
        this.appid = appid
        this.position = position
        this.description = description
        this.background = create({
            tagname: "div",
            style: `background-image: url(/media/desktopicons?i=${this.icon});`,
            classList: ["desktop-symbol-background"]
        })

        this.element = create({
            tagname: "desktop-symbol",
            style: `top: ${this.position[1] * 72}px;
            left: ${this.position[0] * 96}px`,
            dataset: {
                appid: this.appid,
                name: this.label,
                locked: this.locked,
                stopCtxPropagation: true,
                selected: "false"
            },
            childElements: [this.background],
            eventListener: {
                click: ({target}) => {
                    console.log("LEFT SHIFT", Keys.L_SHIFT)
                    while (target.tagName !== "DESKTOP-SYMBOL") {
                        if (target.tagName == "DESKTOP-ENVIRONMENT") return
                        target = target.parentNode
                    }
                    if (!Keys.L_SHIFT) {
                        target.parentNode.querySelectorAll("desktop-symbol").forEach(element => {
                            element.dataset.selected = "false";
                        });
                        target.dataset.selected = "true"
                    } else {
                        target.dataset.selected = target.dataset.selected == "false"
                    }
                },
                dblclick: () => {
                    if (this.locked) {
                        isLockedError(text)
                        return
                    }
                    if (this.appid.match(/^\d{12}$/g)) {
                        App({ req: "fetch_app", data: { id: this.appid } })
                    } else {
                        System({ req: "fetch_app", data: { id: this.appid } })
                    }
                },
                // mousedown: dragSymbol
            }
        })

    }
}


class DesktopSymbolApp extends DesktopSymbol {
    constructor({ position, appid, text, icon, description, contextmenu, locked, label, systemapp }) {
        super({ position, appid, text, icon, description, contextmenu, locked, label, systemapp });

        this.contextmenu = new ContextMenu(this.element, [{
            type: "title", label: text
        }, {
            type: "text", label: description || ""
        },
        {
            type: "divider"
        }, {
            "type": "list",
            "items": [
                {
                    "label": "Open",
                    "symbol": "bx-window-open",
                    handler: (event) => {
                        if (this.locked) {
                            isLockedError(text)
                            return
                        }
                        if (this.appid.match(/^\d{12}$/g)) {
                            App({ req: "fetch_app", data: { id: this.appid } })
                        } else {
                            System({ req: "fetch_app", data: { id: this.appid } })
                        }
                    }
                },
                {
                    "label": locked?"Unlock":"Lock",
                    "symbol": locked?"bx-lock-open-alt":"bx-lock-alt",
                    handler: ({target}) => {
                        const success = (target) => {
                            console.log(target)
                            if (target.tagname != "CONTEXT-MENU-ELEMENT") target = target.parentNode;
                            System({ req: "lock_app", data: {id: this.appid, state: this.locked}})
                            this.locked = !this.locked
                            target.childNodes[0].classList.toggle("bx-lock-alt")
                            target.childNodes[0].classList.toggle("bx-lock-open-alt")
                            target.childNodes[1].innerText = this.locked?"Unlock":"Lock"
                            this.element.dataset.locked = this.element.dataset.locked == "false"
                        }
                        const failure = () => {
                        }
                        const dialog = new PasswordPrompt(() => {success(target)}, () => {failure(target)})

                    }
                },
                {
                    label: "Rename",
                    symbol: "bx-rename",
                    handler: (event) => {
                        // Call a dialog box or ideally put a textbox in the desktop symbol, something like this
                        // console.log(this.element)
                    }
                }
            ]
        }, {
            "type": "divider"
        },
        ...this.contextmenu,
        {
            type: "grid",
            items: [
                {
                    label: "Delete",
                    symbol: "bx-trash-alt"
                }, {
                    label: "Copy",
                    symbol: "bx-copy bx-xs"
                }, {
                    label: "Cut",
                    symbol: "bx-cut bx-xs"
                }
            ]
        }]);

        this.element.contextMenu = this.contextmenu;
        if (systemapp) {
            const badge = create({
                tagname: "div",
                classList: ["system-app-badge"],
                childElements: [
                    {
                        tagname: "i",
                        classList: ["bx", "bx-shield-quarter", "bx-xs"]
                    }
                ]
            })
            this.element.append(badge)
        }

        // if (locked) {
            this.element.append(this.lockedMarker)
        // }




    }
}

export { DesktopSymbolApp }
