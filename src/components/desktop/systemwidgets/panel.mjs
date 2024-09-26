/**
 * Manages a panels properties and elements
 * @file Panel.mjs
 * @author Smittel
 * @copyright 2024
 * @name UI:Handlers
 * @see <a href="./client.Client_Handlers.html">Module</a>
 */
/**
 * Manages a panels properties and elements
 * @file Panel.mjs
 * @author Smittel
 * @copyright 2024
 * @name UI:Handlers
 * @see <a href="./client.Client_Handlers.html">Module</a>
 * @namespace ClientCode
 */
/**
 * @module Panel
 * @memberof client
 * @description Manages Panels and panel related UI
 * @name UI:Desktop.Panel
 * @author Smittel
 */
import { AutoTypeError, ValueError } from "../../../Error.mjs";
import { contextMenu } from "../../../Handlers.mjs";
import { ContextMenu } from "../../ui.mjs";
import { NumberBox } from "../../ui/numberbox.mjs";
import { create, randomId } from "../../Util.mjs";
import { DynamicString } from "../../util/dynstring.mjs";
import { Window } from "../../Window.mjs";
import { Desktop } from "../desktop.mjs";


const horizontal = ["left", "center", "right"]
const vertical = ["top", "center", "bottom"]
const flex = ["flex-start", "center", "flex-end"]



class Panel {
    hasBackdrop = [false, false]
    element; /** @member {HTMLElement} element */
    #applets = [];
    contextmenu;
    #anchor; /** @property {[("left"|"center"|"right") ("top"|"center"|"bottom")]} anchor */

    anchorH;
    anchorV;
    #offset; /** @property {[Number Number]} offset */
    #dimensions = []; /** @member {[Number Number]} dimensions */
    #floating; /** @member {Boolean} floating */
    #fullwidth; /** @member {Boolean} fullwidth */
    #locked; /** @member {Boolean} locked */
    #edgeselector; /** @member {EdgeSelector} edgeselector */
    id; /** @member {String} id */
    #settingsWindow; /** @member {PanelOptions} settingsWindow */
    #desktop;
    #edgeX; #edgeY;
    #edge;
    debug = new DynamicString(
        "Debug info: <br>\nHorizontal: ", { object: this, properties: ["anchor[0]"] },
        "<br>\nVertical: ", { object: this, properties: ["anchor[1]"] },
        "<br>\nFloating: ", { object: this, properties: ["floating"] },
        "<br>\nFull Width: ", { object: this, properties: ["fullwidth"] },
        "<br>\nLocked: ", { object: this, properties: ["locked"] }
    )
    /**
     *
     * @param {Object} data
     * @param {Number} data.width,
     * @param {Number} data.height,
     * @param {[Number Number]} data.offset [x, y]
     * @param {[Number Number]} data.dimensions [width, height]
     * @param {[("left"|"center"|"right") ("top"|"center"|"bottom")]} data.anchor [horizontal, vertical]
     * @param {String} data.anchorH,
     * @param {String} data.anchorV,
     * @param {Color} data.rgb,
     * @param {Number} data.alpha,
     * @param {Boolean} data.floating,
     * @param {Boolean} data.fullwidth,
     * @param {Boolean} data.locked,
     * @param {*} Desktop
     */
    constructor({ dimensions = [120, 48], offset = [0, 0], anchor = ["center", "bottom"], rgb, alpha, floating = false, fullwidth = false, locked = false }, Desktop) {
        this.#offset = offset;
        this.#edge = [flex[Math.abs(horizontal.indexOf(anchor[0]))], flex[Math.abs(vertical.indexOf(anchor[1]))]];

        this.id = randomId(12);
        this.#locked = locked;
        this.#desktop = Desktop;
        this.element = create({
            tagname: "desktop-panel",
            style: {
                "justify-self": this.#edge[0],
                "align-self": this.#edge[1],
                "background": `rgba(${(typeof rgb.r == "number" && rgb.r < 256 && rgb.r >= 0) ? rgb.r : "var(--panel-background-r)"},
                ${(typeof rgb.g == "number" && rgb.g < 256 && rgb.g >= 0) ? rgb.g : "var(--panel-background-g)"},
                ${(typeof rgb.b == "number" && rgb.b < 256 && rgb.b >= 0) ? rgb.b : "var(--panel-background-b)"},
                ${alpha})`
            },
            floating: floating,
            fullwidth: fullwidth,
            locked: locked,
            edgeX: anchor[0],
            edgeY: anchor[1],
            dataset: {
                stopCtxPropagation: true
            },
            eventListener: {
                click: (e) => {
                    e.stopPropagation()
                },
                contextmenu: (e) => {
                    e.stopPropagation();
                    contextMenu(e)
                }
            }
        })


        this.dimensions = { w: dimensions[0], h: dimensions[1] };
        this.anchor = anchor
        this.fullwidth = fullwidth;
        this.floating = floating;
        this.edgeselector = new EdgeSelector(this, Desktop)
        this.settingsWindow = new PanelOptions(this, Desktop)
        this.edge = { x: this.#anchor[0], y: this.#anchor[1] }

        document.addEventListener("keydown", (e) => {
            if (e.key == "Escape" && Desktop.element.dataset.editMode == "true") {
                let panels = Desktop.getPanels();
                panels.forEach(element => {
                    element.edgeselector.hide()
                    element.settingsWindow.hide()
                });
                Desktop.element.dataset.editModeManuallyStarted = false;
                Desktop.clearEditDialogs();
                Desktop.exitEditMode()
            }

        })

        this.element.append(this.settingsWindow.element)
        this.element.style.setProperty("--margin-block", this.#offset[0] + "px")
        this.element.style.setProperty("--margin-inline", this.#offset[1] + "px")
        this.element.style.setProperty("--panel-height", (typeof this.dimensions[1] == "number") ? (this.dimensions[1] + "px") : this.dimensions[1])
        this.element.style.setProperty("--panel-width", (typeof this.dimensions[0] == "number") ? (this.dimensions[0] + "px") : this.dimensions[0])
        this.#makeContextMenu();
    }

    set anchor(arr) {
        if (!(arr instanceof Array)) throw new TypeError(`Panel.anchor: Value must be Array, got ${arr} : ${typeof arr}`)
        if (!(arr[0] == "left" || arr[0] == "center" || arr[0] == "right")) throw new ValueError(this, "<set anchor>", `First value must be "left", "center" or "right", got ${arr[0]}`)
        if (!(arr[1] == "top" || arr[1] == "center" || arr[1] == "bottom")) throw new ValueError(this, "<set anchor>", `Second value must be "top", "center" or "bottom", got ${arr[1]}`)
        let h = horizontal[Math.abs(horizontal.indexOf(arr[0]))];
        let v = vertical[Math.abs(vertical.indexOf(arr[1]))];
        this.#anchor = [h, v];

        this.element.dataset.horizontalAnchor = h;
        this.element.dataset.verticalAnchor = v;


    }
    get anchor() {
        return this.#anchor
    }

    /**
     * @param {Object} offset
     * @param {Number} offset.x
     * @param {Number} offset.y
     */
    set offset({ x, y }) {
        this.#offset = [x, y]
    }
    /**
     * @returns {[Number Number]}
     */
    get offset() {
        return this.#offset;
    }

    set edgeselector(/** @param {EdgeSelector} */ es) {
        if (!(es instanceof EdgeSelector)) throw new AutoTypeError("Panel.edgeselector", "EdgeSelector", "es", es)
        this.#edgeselector = es;
    }
    /** @returns {EdgeSelector} */
    get edgeselector() {
        return this.#edgeselector
    }

    set settingsWindow(/** @param {PanelOptions} */ sw) {
        if (!(sw instanceof PanelOptions)) throw new AutoTypeError("Panel.settingsWindow", "PanelOptions", "sw", sw)
        this.#settingsWindow = sw
    }
    get settingsWindow() {
        return this.#settingsWindow
    }

    set locked(/** @param {Boolean} locked */ locked) {
        if (typeof locked !== "boolean") throw new AutoTypeError("Panel.locked", "Boolean", "value", value)
        this.#locked = locked;
        this.element.setAttribute("locked", locked)
    }
    get locked() {
        return this.#locked;
    }


    set dimensions({ w, width, h, height }) {
        if (width) w = width;
        if (height) h = height;
        if (typeof w !== "number" && w !== undefined) throw new AutoTypeError("Panel.dimensions", "number", "w", w)
        if (typeof h !== "number" && w !== undefined) throw new AutoTypeError("Panel.dimensions", "number", "h", h)
        if (typeof w === "number") {
            this.#dimensions[0] = w;
            this.element.dataset.width = w;
            this.element.style.width = w + "px";
        }
        if (typeof h === "number") {
            this.#dimensions[1] = h;
            this.element.dataset.height = h;
            this.element.style.height = h + "px";
        }

    }
    get dimensions() {
        return this.#dimensions;
    }



    set floating(/** @param {Boolean} value */ value) {
        if (typeof value !== "boolean") throw new AutoTypeError("Panel.floating", "Boolean", "value", value)

        this.#floating = value;
        this.element.setAttribute("floating", value);
        // this.#makeContextMenu()
    }
    get floating() {
        return this.#floating;
    }


    set fullwidth(/** @param {Boolean} value */ value) {
        if (typeof value !== "boolean") throw new AutoTypeError("Panel.fullwidth", "Boolean", "value", value)
        this.#fullwidth = value
        this.element.setAttribute("fullwidth", value)
        // this.#makeContextMenu()
    }
    get fullwidth() {
        return this.#fullwidth;
    }


    #makeContextMenu() {

        const ctxRaw = [
            { type: "title", label: "Panel" },
            // {
            //     type: "text", label: `Debug info:<br>Vertical: ${this.#anchor[1]}<br>
            // Horizontal: ${this.#anchor[0]}<br>
            // Floating: ${this.floating ? "Yes" : "No"}<br>
            // Full width: ${this.fullwidth ? "Yes" : "No"}<br>
            // Locked: ${this.locked ? "Yes" : "No"}`
            // },
            {
                type: "text", label: this.debug.string
            },
            { type: "divider" },
            {
                type: "list",
                items: [
                    {
                        label: this.#locked ? "Unlock" : "Lock",
                        symbol: this.#locked ? "bx-lock-open-alt" : "bx-lock-alt",
                        handler: () => {
                            this.locked = !this.locked;
                            this.#makeContextMenu()
                        }
                    },
                    {
                        label: "Floating",
                        symbol: this.#floating ? "bxs-checkbox-checked" : "bx-checkbox",
                        handler: () => {
                            if (this.#locked) return;
                            this.floating = !this.floating;
                            this.#makeContextMenu()
                        },
                        enabled: !this.#locked
                    }, {
                        label: "Full width",
                        symbol: this.#fullwidth ? "bxs-checkbox-checked" : "bx-checkbox",
                        handler: () => {
                            if (this.#locked) return;
                            this.fullwidth = !this.fullwidth
                            this.#makeContextMenu()
                        },
                        enabled: !this.#locked
                    }, {
                        label: "Set position",
                        symbol: "bx-move",
                        handler: (e) => {
                            e.stopPropagation()
                            this.contextmenu.hide()
                            if (this.#locked) return;
                            let panels = this.#desktop.getPanels().filter(a => a != this)
                            this.hasBackdrop[0] = true
                            this.settingsWindow.setEdge(this.edge)
                            for (let i = 0; i < panels.length; i++) {
                                if (this != panels[i]) {
                                    panels[i].settingsWindow.hide();
                                    panels[i].edgeselector.hide();
                                }
                            }
                            this.#edgeselector.show()
                        },
                        enabled: !this.#locked
                    }, {
                        label: "More Options...",
                        symbol: "bx-cog",
                        handler: (e) => {
                            e.stopPropagation()
                            this.contextmenu.hide()
                            if (this.#locked) return;
                            // show option dialog
                            let panels = this.#desktop.getPanels().filter(a => a != this)
                            this.hasBackdrop[1] = true
                            for (let i = 0; i < panels.length; i++) {
                                panels[i].settingsWindow.hide();
                                panels[i].edgeselector.hide();

                            }
                            this.#settingsWindow.show()
                        },
                        enabled: !this.#locked
                    }
                ]
            }
        ]
        this.contextmenu = new ContextMenu(this.element, ctxRaw)
        this.element.contextMenu = this.contextmenu
    }


    set edge(/**@param {Object} edge @param {*} edge.x @param {*} edge.y */ { x, y }) {
        this.#anchor = [horizontal[Math.abs(horizontal.indexOf(x))], vertical[Math.abs(vertical.indexOf(y))]]
        this.#edge = [flex[Math.abs(horizontal.indexOf(x))], flex[Math.abs(vertical.indexOf(y))]]

        this.element.style["justify-self"] = this.#edge[0]
        this.element.style["align-self"] = this.#edge[1]

        this.element.setAttribute("edgeX", x)
        this.element.setAttribute("edgeY", y)
        this.#makeContextMenu()
        this.#settingsWindow.setEdge({ x: x, y: y })
        this.#edgeselector.hide()
    }
    get edge() {
        return { x: this.#anchor[0], y: this.#anchor[1] }
    }





}

class EdgeSelector {
    #parent;
    element;
    #backdrop;
    #desktop;
    /**
     *
     * @param {Panel} parent
     * @param {Desktop} desktop
     */
    constructor(parent, desktop) {
        this.desktop = desktop
        this.parent = parent;
        this.element = create({
            tagname: "edge-selector-container",
            parent: parent,
            self: this,
            eventListener: {
                click: (e) => {
                    this.#parent.hasBackdrop = [false, false]
                    e.stopPropagation();
                    this.hide()
                }
            },
            childElements: [
                {
                    tagname: "edge-selector",
                    edgeX: "left",
                    edgeY: "top",
                    eventListener: {
                        click: (e) => {
                            this.#parent.edge = { x: "left", y: "top" };
                            e.stopPropagation()
                            this.hide();
                        }

                    },
                    childElements: [
                        {
                            tagname: "i",
                            classList: ["bx", "bx-chevron-up", "rotate-315", "bx-lg"]
                        }
                    ]
                }, {
                    tagname: "edge-selector",
                    edgeX: "center",
                    edgeY: "top",
                    eventListener: {
                        click: (e) => {
                            this.#parent.edge = { y: "top" };
                            e.stopPropagation()
                            this.hide();
                        }
                    },
                    childElements: [
                        {
                            tagname: "i",
                            classList: ["bx", "bx-chevron-up", "bx-lg"]
                        }
                    ]
                }, {
                    tagname: "edge-selector",
                    edgeX: "right",
                    edgeY: "top",
                    eventListener: {
                        click: (e) => {
                            this.#parent.edge = { x: "right", y: "top" };
                            e.stopPropagation()
                            this.hide();
                        }
                    },
                    childElements: [
                        {
                            tagname: "i",
                            classList: ["bx", "bx-chevron-up", "rotate-45", "bx-lg"]
                        }
                    ]
                }, {
                    tagname: "edge-selector",
                    edgeX: "left",
                    edgeY: "center",
                    eventListener: {
                        click: (e) => {
                            this.#parent.edge = { x: "left" };
                            e.stopPropagation()
                            this.hide();
                        }
                    },
                    childElements: [
                        {
                            tagname: "i",
                            classList: ["bx", "bx-chevron-up", "rotate-270", "bx-lg"]
                        }
                    ]
                }, {
                    tagname: "edge-selector",
                    edgeX: "right",
                    edgeY: "center",
                    eventListener: {
                        click: (e) => {
                            this.#parent.edge = { x: "right" };
                            e.stopPropagation()
                            this.hide();
                        }
                    },
                    childElements: [
                        {
                            tagname: "i",
                            classList: ["bx", "bx-chevron-up", "rotate-90", "bx-lg"]
                        }
                    ]
                }, {
                    tagname: "edge-selector",
                    edgeX: "left",
                    edgeY: "bottom",
                    eventListener: {
                        click: (e) => {
                            this.#parent.edge = { x: "left", y: "bottom" };
                            e.stopPropagation()
                            this.hide();
                        }
                    },
                    childElements: [
                        {
                            tagname: "i",
                            classList: ["bx", "bx-chevron-up", "rotate-225", "bx-lg"]
                        }
                    ]
                }, {
                    tagname: "edge-selector",
                    edgeX: "center",
                    edgeY: "bottom",
                    eventListener: {
                        click: (e) => {
                            this.#parent.edge = { y: "bottom" };
                            e.stopPropagation()
                            this.hide();
                        }
                    },
                    childElements: [
                        {
                            tagname: "i",
                            classList: ["bx", "bx-chevron-up", "rotate-180", "bx-lg"]
                        }
                    ]
                }, {
                    tagname: "edge-selector",
                    edgeX: "right",
                    edgeY: "bottom",
                    eventListener: {
                        click: (e) => {
                            this.#parent.edge = { x: "right", y: "bottom" };
                            e.stopPropagation()
                            this.hide();
                        }
                    },
                    childElements: [
                        {
                            tagname: "i",
                            classList: ["bx", "bx-chevron-up", "rotate-135", "bx-lg"]
                        }
                    ]
                },
            ]
        })
    }


    set parent(/** @param {Panel} panel*/ panel) {
        if (!(panel instanceof Panel)) throw new AutoTypeError("EdgeSelector.parent", "Panel", "panel", panel)
        this.#parent = panel;
    }
    get parent() {
        return this.#parent;
    }

    set desktop(/** @param {Desktop} desktop */ desktop) {
        if (!(desktop instanceof Desktop)) throw new AutoTypeError("EdgeSelector.parent", "Panel", "panel", panel)
        this.#desktop = desktop;
    }
    get desktop() {
        return this.#desktop;
    }

    show() {
        // document.querySelector("desktop-environment").style.scale = 0.9;
        // this.#parent.element.parentNode.append(backdrop);
        this.#desktop.enterEditMode()
        this.#parent.element.style["z-index"] = 101;
        this.#parent.element.style.border = "solid 2px var(--panel-highlight-color)"
        this.#desktop.layers[5].append(this.element)
        // console.log(this.#parent.element)
    }

    hide() {
        // console.log("hkbdfshkvfdavhhikvb", this.#parent.element, this.#parent.hasBackdrop)
        this.#parent.hasBackdrop[0] = false;
        this.element.remove();
        if (this.#desktop.element.dataset.editMode == "false") return;
        if (!this.#parent.hasBackdrop[1]) {
            this.#desktop.exitEditMode()
            this.#parent.element.style["z-index"] = undefined
            this.#parent.element.style.borderStyle = "var(--panel-border-style)"
            this.#parent.element.style.borderWidth = "var(--panel-border-width)"
            this.#parent.element.style.borderColor = "var(--panel-border-color)"
        }

    }
}

class PanelOptions {
    element;
    #parent;
    #desktop;
    constructor(parent, desktop) {
        this.#desktop = desktop
        this.#parent = parent
        let numberbox = new NumberBox(0, 0)
        numberbox.element.addEventListener("update", (e) => {if (e.detail.value() > window.innerHeight) numberbox.value = window.innerHeight})
        /*
        Floating: toggle
        Width: Fit, Fix:Number px, Full
        Height: Number px,
        OffsetX: Number px,
        OffsetY: Number px,
        Color: Color,
        Transparency: Number 0..1
        */
        this.element = create({
            tagname: "panel-settings",
            style: {
                "justify-self": flex[Math.abs(horizontal.indexOf(this.#parent.anchor[0]))]
            },
            // eventListener: {
            //     click: (e) => { e.stopPropagation(); this.#parent.contextmenu.hide(); this.hide(); console.log("this is triggered") }
            // },
            dataset: { hidden: true },
            edgeH: this.#parent.anchorH,
            edgeV: this.#parent.anchorV,
            dataset: {
                stopCtxPropagation: true,
                hidden: true
            },
            childElements: [
                numberbox.element
            ]
        })
        document.querySelector("desktop-environment").addEventListener("click", (e) => {
            if (this.#desktop.element.dataset.editMode == "false") return
            this.#parent.hasBackdrop = [false, false]; this.hide(e)
            this.#desktop.clearEditDialogs()
        })
        // document.querySelector("desktop-environment").addEventListener("contextmenu", (e) => {
        //     if (this.#desktop.element.dataset.editMode == "false") return
        //     this.#parent.hasBackdrop = [false, false]; this.hide(e)
        // })

    }

    setEdge({ x = "center", y = "center" }) {


        // console.log("set edge", x, horizontal[Math.abs(vertical.indexOf(x))], flex[Math.abs(horizontal.indexOf(x))], "|", y, vertical[Math.abs(vertical.indexOf(y))], flex[Math.abs(horizontal.indexOf(y))], "\n", horizontal, "\n", vertical)


        this.element.setAttribute("edgeH", x)

        this.element.setAttribute("edgeV", y)
    }

    show() {
        this.element.dataset.hidden = false;
        this.#parent.element.style["z-index"] = 101;
        this.#parent.element.style.border = "solid 2px var(--panel-highlight-color)"
        this.#desktop.enterEditMode();
        setTimeout(() => {
            this.element.style.transition = "none"
        }, 150);
    }

    hide(e) {
        this.element.style.transition = "translate 0.15s ease, visibility 0.1s ease 0.1s"
        this.#parent.hasBackdrop[1] = false;
        this.element.dataset.hidden = true;
        if (!this.#parent.hasBackdrop[0]) {
            this.#parent.element.style["z-index"] = undefined
            this.#desktop.exitEditMode()
            this.#parent.element.style.borderStyle = "var(--panel-border-style)"
            this.#parent.element.style.borderWidth = "var(--panel-border-width)"
            this.#parent.element.style.borderColor = "var(--panel-border-color)"
            this.#parent.edgeselector.hide()
        }

    }

}

export { Panel }
