import { create } from "/js/modules/Util.mjs"

class TextDropDown {
    element;
    #list;
    #event;
    #selected;
    #listElements;
    /**
     * 
     * @param {String[]} arr array of options
     * @param {Number} defaultSelection index of default element
     */
    constructor(arr, defaultSelection) {
        this.#selected = defaultSelection || 0

        this.#listElements = arr.map(a => create({
            tagname: "textdropdown-element",
            innerText: a,
            eventListener: {
                click: (e) => {
                    this.element.querySelector("input").value = e.target.innerText
                    this.#selected = this.#listElements.indexOf(e.target)
                }
            }
        }))

        this.#list = create({
            tagname: "textdropdown-list",
            childElements: this.#listElements
        })
        this.element = create({
            tagname: "textdropdown-main",
            childElements: [
                {
                    tagname: "input",
                    type: "text",
                    value: arr[defaultSelection || 0],
                    eventListener: {
                        focusin: (e) => {
                            const elBounds = this.element.getBoundingClientRect();
                            const paBounds = this.element.parentNode.getBoundingClientRect();
                            this.element.parentNode.style.zIndex = 100
                            this.#list.style = `left: ${elBounds.x - paBounds.x}px;
                            height: auto;
                            max-height: 180px;
                            width: ${elBounds.width}px;`
                            this.element.parentNode.append(this.#list)
                            this.#list.innerText = ""
                            this.#list.append(...this.#listElements)
                        },
                        input: (e) => {
                            const copy = ([...this.#listElements].filter(a => a.innerText.toLowerCase().match(e.target.value.toLowerCase())));
                            this.#list.innerText = ""
                            this.#list.append(...copy)
                        }
                    }
                }
            ]
        })
        document.addEventListener("click", (e) => {
            if (e.target.tagName != "TEXTDROPDOWN-LIST" 
            && e.target.tagName != "TEXTDROPDOWN-MAIN"
            && e.target.parentNode.tagName != "TEXTDROPDOWN-MAIN") {
                this.#list.remove()
            }
        })
    }

    setStyle(style) {
        if (typeof style == "object") {
            for (let i in style) {
                this.element.style[i] = style[i]
            }
        } else {
            this.element.style = style;
        }
    }
}

export { TextDropDown }