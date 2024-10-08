import { Widget } from "./widget.mjs";
import { deleteElement, create } from "../../modules/Util.mjs";
import { DesktopSymbolApp } from "../ui/desktopsymbol.mjs";
import { Panel } from "./systemwidgets/panel.mjs";
import { ContextMenu } from "../ui.mjs";
/*
Panels: layer 5, z-index 1 000 000
Windows: layer 3, z-index starts at 1 000
desktop symbols: layer 1, z-index 0
widgets: layers 0,2,4, customisable, defines draw order
layer 4: z-index 100 000
*/
class Desktop {
    #panels = [];
    #widgets = [];
    #windows = [];
    #symbols = [];
    #panelObjects = [];
    layers = [];
    #contextMenu;
    #contextMenuEditMode;
    #hub;
    #background;
    element;
    snapPreview;
    #exitEditModeButton;



    constructor(data) {
        const s = ["widgets-0", "symbols", "widgets-1", "windows", "widgets-2", "panels", "notifications"]
        const c = ["red", "green", "blue", "yellow", "cyan", "magenta"]
        for (let i = 0; i < 7; i++) {
            this.layers.push(create({
                tagname: "desktop-layer",
                dataset: {
                    "layerName": s[i]
                },
                style: `z-index: ${i}`
            }))
        }

        this.snapPreview = create({
            tagname: "div",
            classList: ["snap-preview"],
            dataset: { visible: false },
            id: "snapping-prev"
        })

        this.layers[3].append(this.snapPreview)
        this.element = create({
            tagname: "desktop-environment",
            childElements: this.layers,
            style: `background-image: url("${data.backgroundimage || "/media/images/wallpaper abstract 2.png"}");
                    background-size: ${data.backgroundsize || "cover"};
                    background-position: ${data.backgroundposition || "center center"};
                    background-attachment: fixed;`,
            dataset: {
                editMode: false,
                editModeManuallyStarted: false,
            },
            eventListener: {
                click: ({ target }) => {

                    try {
                        while (target.tagName !== "DESKTOP-SYMBOL") {
                            if (target.tagName == "DESKTOP-ENVIRONMENT") break
                            target = target.parentNode
                        }
                        if (target.tagName !== "DESKTOP-SYMBOL") {
                            this.layers[1].childNodes.forEach(element => {
                                element.dataset.selected = "false"
                            });
                        }
                    } catch (e) {
                        return
                    }
                },
                keydown: (e) => {
                    if (e.key == "Escape") console.log("it")
                }
            },
        })
        this.#exitEditModeButton = create({
            tagname: "div",
            classList: ["exitEditModeContainer"],
            childElements: [{
                tagname: "div",
                classList: ["exitEditMode"],
                childElements: [
                    {
                        tagname: "i",
                        classList: ["bx", "bx-x", "bx-md"]
                    },
                    {
                        tagname: "span",
                        innerText: "Exit edit mode"
                    }
                ],
                eventListener: {
                    click: () => {
                        this.element.dataset.editModeManuallyStarted = false;
                        this.clearEditDialogs()
                        this.exitEditMode()
                    }
                }
            }]
        })
        this.#contextMenuEditMode = new ContextMenu(this.element, [
            {
                type: "list", items: [
                    {
                        label: "Exit edit mode",
                        symbol: "bx-x",
                        handler: () => {
                            this.element.dataset.editModeManuallyStarted = false;
                            this.clearEditDialogs()
                            this.exitEditMode()
                         }
                    }
                ]
            }
        ])

        this.#contextMenu = new ContextMenu(this.element, [
            {
                type: "list", items: [
                    {
                        label: "Edit Desktop", symbol: "bx-cog", handler: () => {
                            this.element.dataset.editModeManuallyStarted = true;
                            this.enterEditMode()
                        }
                    }
                ]
            }
        ])

        document.body.append(this.element)
    }

    enterEditMode() {
        this.element.dataset.editMode = "true";
        this.element.contextMenu = this.#contextMenuEditMode;
        document.body.append(this.#exitEditModeButton)
        this.layers[1].style.zIndex = -2;
        this.layers[1].style.pointerEvents = "none"
        this.layers[3].style.zIndex = -1;
    }

    clearEditDialogs() {

        this.#panelObjects.forEach(a => {
            a.edgeselector.hide()
            a.settingsWindow.hide()
        })
    }

    exitEditMode() {
        if (this.element.dataset.editModeManuallyStarted == "true") return
        if (this.element.dataset.editMode == "false") return;
        this.element.dataset.editMode = "false"
        this.element.contextMenu = this.#contextMenu
        this.#exitEditModeButton.remove()
        this.layers[1].style.zIndex = 1;
        this.layers[1].style.pointerEvents = "all"
        this.layers[3].style.zIndex = 3;
    }

    hide() {
        for (let i = 0; i < this.#widgets.length; i++) {
            this.#widgets[i].remove();
        }
        for (let i = 0; i < this.#widgets.length; i++) {
            this.#panels[i].remove();
        }
        for (let i = 0; i < this.#widgets.length; i++) {
            this.#symbols[i].remove();
        }
        for (let i = 0; i < this.#widgets.length; i++) {
            this.#windows[i].remove();
        }
    }

    removePanel(panel) {
        panel.remove()
        deleteElement(this.#panels, this.#panels.indexOf(panel))
    }

    removeWidget(widget) {
        widget.remove()
        deleteElement(this.#widgets, this.#widgets.indexOf(widget))
    }

    removeDesktopSymbol(symbol) {
        symbol.remove();
        deleteElement(this.#symbols, this.#symbols.indexOf(symbol))
    }

    removeWindow(window) {
        window.remove();
        deleteElement(this.#windows, this.#windows.indexOf(window))
    }

    /**
     * Adds any number of desktop symbols to the Desktop
     * @param {...DesktopSymbol} desktop_symbols
     *
     */
    addDesktopSymbols() {
        for (let i = 0; i < arguments.length; i++) {
            if (!arguments[i].appid.match(/^\d{12}$/g)) {
                arguments[i].systemapp = true; // will be put serverside
                // console.log(arguments[i].appid, "is system")
            }
            const curr = new DesktopSymbolApp(arguments[i])
            this.layers[1].append(curr.element)
            this.#symbols.push(curr.element)
        }

    }

    addWindow(windowelement) {
        // make new window here
        this.#windows.push(windowelement)
        this.layers[3].append(windowelement)
    }

    addPanel(panel) {
        let p = new Panel(panel, this)
        this.#panels.push(p.element)
        this.#panelObjects.push(p)
        this.layers[5].append(p.element)
        return p;
    }

    getPanels() {
        return this.#panelObjects;
    }

}

export { Desktop }
