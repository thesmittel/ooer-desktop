/**
 * Creates and manages an elements context menu
 * @file contextmenu.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:UIElements > ContextMenu
 * @see <a href="./client.Client_UIElements%2520_%2520ContextMenu.html">Module</a>
 */
/**
 * Creates and manages an elements context menu
 * @file contextmenu.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:UIElements > ContextMenu
 * @see <a href="./client.Client_UIElements%2520_%2520ContextMenu.html">Module</a>
 * @namespace ClientCode.UIElements
 */
/**
 * @module ContextMenu
 * @memberof Client:UIElements
 * @description Creates and manages an elements context menu
 * @name Client:UIElements > ContextMenu
 * @author Smittel
 */
import { create } from "../Util.mjs";
/*

[
    {
        type: "list" | "grid" | "divider",
        elements: [
            // for divider, elements are ignored
            {
                label: String,
                handle: Function,
                symbol: URL/boxicon,
                submenu: Array, congruent to elements, optional, coming soon, not advised
            }
        ]
    },
    {
        type: "text",
        label: String
    }
]

*/
/**
 * Creates a contextmenu accessible by right clicking elements that have a defined one.
 * The Context menu appears to the bottom left of the mouse position, unless the space is insufficient.
 * Horizontally, it gets added to the bottom right of the mouse position, vertically, it gets placed flush with the bottom of the screen.<br>
 * Contextmenus support clickable elements arranged in either a list or grid, unclickable elements include a title, a description and dividers.
 * All elements can be placed anywhere.
 */
class ContextMenu {
    #element;
    #timeout;
    #structure = [];
    parent;
    /**
     * @todo data attribute stopPropagation to the highest parent element of child elements.
     * @todo change the way context menus are displayed, if element has none, check parent element and so on, until either a context menu or a stopPropagation attribute is found
     * @param {HTMLElement} parentElement The DOM node that "owns" the context menu. Context menus get attached to the HTML Element as a property.
     * @param {Object[]} elements
     * @param {("list"|"grid"|"divider"|"title"|"text")} elements[].type Defines the type of an element
     * @param {String} elements[].label Defines the text used by Title and Text type elements
     * @param {Object[]} elements[].items Defines the elements within the list or grid.
     * @param {String} elements[].items[].label The label is directly displayed for list elements, displayed on hover for grid elements
     * @param {String} elements[].items[].symbol The symbol is optional for list elements, but semi-mandatory for grid elements, defines a symbol that is displayed on the element
     * @param {Function} elements[].items[].handler Defines whats executed when a list or grid element is clicked.
     * @param {Boolean} elements[].items[].empty Skips the spot this element would have taken within the grid. Only works for grid elements.
     */
    constructor(parentElement, elements) {
        this.parent = parentElement;
        if (!(elements instanceof Array)) throw new TypeError("class ContextMenu: constructor requires Array.")
        if (elements.length == 0) throw new ReferenceError("class ContextMenu: Array must not be of length 0.")
        this.#element = create({
            tagname: "context-menu"
        })

        for (let i = 0; i < elements.length; i++) {
            let e;
            switch (elements[i].type) {
                case "grid":
                    e = new ContextMenuGrid(
                        elements[i].items.map(a => {
                            if (a.empty) return {element: create({tagname: "div"})}
                            return new ContextMenuGridElement(a.label, a.symbol, a.handler, a.enabled)
                        })
                    )
                    this.#structure.push(e)
                    e = e.element;
                    break;
                case "list":
                    e = new ContextMenuList(
                        elements[i].items.map(a => new ContextMenuListElement(a.label, a.symbol, a.handler, a.enabled))
                    )
                    this.#structure.push(e);
                    e = e.element;
                    break;
                case "divider":
                    e = new ContextMenuDivider();
                    this.#structure.push(e);
                    e = e.element;
                    break;
                case "title":
                    e = new ContextMenuTitle(elements[i].label)
                    this.#structure.push(e)
                    e = e.element;
                    break;
                case "text":
                    e = new ContextMenuDescription(elements[i].label)
                    this.#structure.push(e)
                    e = e.element;
                    break;
            }
            this.#element.append(e);
        }
        parentElement.contextMenu = this;
    }

    debug() {
        console.log(this.#structure)
    }

    show(x, y) {
        clearTimeout(this.#timeout)

        let width = 240; // needs to somehow be theme dependent once those are a thing
        if (x + width > window.innerWidth) x -= width; // if menu would be off screen horizontally, spawn left of cursor
        this.#element.style.left = x + "px";
        this.#element.style.top = y + "px";
        document.body.append(this.#element)
        // takes the dimensions on screen, if off screen vertically, moves it up so its flush with bottom of screen
        // needs to be appended to DOM first before the height is accessible
        if (y + this.#element.clientHeight > window.innerHeight) this.#element.style.top = window.innerHeight - this.#element.clientHeight + "px"
        this.#element.dataset.visible = "true"
    }

    hide() {
        this.#element.dataset.visible = "false"
        this.#timeout = setTimeout(() => {
            this.#element.remove();
        }, 100);

    }
}

class ContextMenuText {
    #text;
    element;
    constructor(text) {
        this.#text = text
        this.element = create({
            tagname: "span",
            innerHTML: text
        })
    }
}

class ContextMenuDescription extends ContextMenuText {
    constructor(text) {
        super(text);
        this.element.classList.add("text")
    }
}

class ContextMenuTitle extends ContextMenuText {
    constructor(text) {
        super(text);
        this.element.classList.add("title")
    }
}

class ContextMenuDivider {
    element = create({ tagname: "hr" });
}

class ContextMenuList {
    element;
    #structure = []
    constructor(elements) {
        this.#structure = elements
        this.element = create({
            tagname: "context-menu-list",
            childElements: elements.map(a => a.element)
        })
    }
}


class ContextMenuGrid {
    element;
    #structure = [];
    constructor(elements) {
        this.#structure = elements
        this.element = create({
            tagname: "context-menu-grid",
            style: {
                "grid-template-rows": `repeat(${Math.ceil(elements.length / 5)}, 36px)`
            },
            childElements: elements.map(a => a.element)
        })
    }
}

class ContextMenuElement {
    symbol;
    label
    handler;
    element;
    enabled;
    constructor(label, handler, symbol, enabled) {
        this.enabled = enabled;
        if (handler && typeof handler != "function") throw new TypeError("class ContextMenuElement: optional argument handler must be a function")
        if (label == undefined || label == null || label == "") throw new ReferenceError("class ContextMenuElement: argument label must be non-empty string.")

        if (symbol) {
            this.symbol = [...(symbol.split(" "))];
            for (let i in this.symbol) {
                if (!this.symbol[i].match(/^bxs?-.*$/gi)) throw new ReferenceError("class ContextMenuElement: symbols must be boxicon symbols, check the reference: https://boxicons.com/. Got '" + symbol + "' instead. You can leave out the generic 'bx' class, only include the relevant parts (name, size, animation, orientation")
            }
        }
        this.label = label;
        this.handler = handler;
    }
}

class ContextMenuListElement extends ContextMenuElement {
    constructor(label, symbol, handler, enabled = true) {
        super(label, handler, symbol, enabled);
        this.element = create({
            tagname: "context-menu-element",
            childElements: [
                { tagname: "i", classList: ["bx", this.symbol] },
                { tagname: "span", innerText: this.label }
            ],
            enabled: this.enabled,
            eventListener: {
                click: (event) => {
                    // Something was supposed to go here but i dont remember rn
                    if (this.handler) this.handler(event);
                }
            }
        })
    }
}

class ContextMenuGridElement extends ContextMenuElement {
    constructor(label, symbol, handler, enabled = true) {
        super(label, handler, symbol, enabled);
        if (!symbol) console.trace("class ContextMenuGridElement: grid icons must have an icon.")
        this.element = create({
            tagname: "context-menu-element",
            childElements: [{ tagname: "i", classList: ["bx", ...(this.symbol || [])] }],
            dataset: { label: this.label },
            enabled: this.enabled,
            eventListener: {
                click: (event) => {
                    if (this.handler) this.handler(event)
                }
            }
        })
    }
}

class InteractableContextMenuListElement extends ContextMenuElement {
    constructor(label, symbol, handler, type) {
        super(label, handler, symbol);

        this.element = create({
            tagname: "context-menu-element",
            childElements: [
                { tagname: "i", classList: ["bx", this.symbol] },
                // depending on type
                // { tagname: "span", innerText: this.label }
            ],
            eventListener: {
                click: (event) => {
                    // Something was supposed to go here but i dont remember rn
                    if (this.handler) this.handler(event);
                }
            }
        })
    }
}
export { ContextMenu }
