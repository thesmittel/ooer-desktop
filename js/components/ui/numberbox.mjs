import { clamp, create, round } from "../../modules/Util.mjs";
import * as Keyboard from "../../modules/input/Keyboard.mjs"
class NumberBox {
    #element;
    #input;
    #plus;
    #minus;
    #min; #max;
    #event;
    #value;
    get value() {
        return this.#input.value;
    }

    set value(v) {
        if (isNaN(parseFloat(v))) return;
        this.#input.value = parseFloat(v)
    }
    /**
     *
     * @param {Number} [val=0] Default value
     * @param {Number} [min=-Infinity] Minimum allowed number
     * @param {Number} [max=Infinity] Maximum allowed number
     */
    constructor(val, min, max) {
        this.#event = new CustomEvent("update", {
            detail: {
                value: () => parseFloat(this.#input.value)
            },
            bubbles: true,
            cancelable: true,
            explicitOriginalTarget: this.element,
            target: this.element,
            originalTarget: this.element,
            currentTarget: this.element
        })
        this.#min = (typeof min !== "number") ? -Infinity : min;
        this.#max = (typeof max !== "number") ? Infinity : max;
        this.#input = create({
            tagname: "input",
            type: "text",
            size: Math.max(val?.length, 1) || 1,
            value: val || 0,
            eventListener: {
                input: (e) => {
                    if (parseFloat(this.#input.value) > this.#max) this.#input.value = this.#max
                    if (parseFloat(this.#input.value) < this.#min) this.#input.value = this.#min
                    this.#input.size = Math.max(1, this.#input.value.length)
                    this.element.dispatchEvent(this.#event)
                },
                keydown: (e) => {
                    if (isNaN(parseFloat(e.key)) && e.key !== "." && e.key !== "Backspace" && !Keyboard.L_CTRL) e.preventDefault()
                },
                focusout: (e) => {
                    this.element.dispatchEvent(this.#event)
                }
            }
        })

        this.#minus = create({
            tagname: "div",
            classList: ["minus"],
            innerText: "-",
            eventListener: {
                click: () => {
                    if (Keyboard.L_SHIFT) {
                        this.#input.value = round(parseFloat(this.#input.value) - 10, 1)
                    } else if (Keyboard.L_CTRL) {
                        this.#input.value = round(parseFloat(this.#input.value) - 0.1, 1)
                    } else {
                        this.#input.value = round(parseFloat(this.#input.value) - 1, 1)
                    }
                    if (parseFloat(this.#input.value) > this.#max) this.#input.value = this.#max
                    if (parseFloat(this.#input.value) < this.#min) this.#input.value = this.#min
                    this.#input.size = Math.max(1, this.#input.value.length)
                    this.element.dispatchEvent(this.#event)
                }
            }
        })
        this.#plus = create({
            tagname: "div",
            classList: ["plus"],
            innerText: "+",
            eventListener: {
                click: () => {
                    if (Keyboard.L_SHIFT) {
                        this.#input.value = round(parseFloat(this.#input.value) + 10, 1)
                    } else if (Keyboard.L_CTRL) {
                        this.#input.value = round(parseFloat(this.#input.value) + 0.1, 1)
                    } else {
                        this.#input.value = round(parseFloat(this.#input.value) + 1, 1)
                    }
                    if (parseFloat(this.#input.value) > this.#max) this.#input.value = this.#max
                    if (parseFloat(this.#input.value) < this.#min) this.#input.value = this.#min
                    this.#input.size = Math.max(1, this.#input.value.length)
                    this.element.dispatchEvent(this.#event)

                }
            }
        })
        this.#element = create({
            tagname: "number-box",
            childElements: [this.#minus, this.#input, this.#plus],
            eventListener: {
                wheel: (e) => {
                    e.preventDefault()
                    const fac = Keyboard.L_SHIFT?10:Keyboard.L_CTRL?0.1:1
                    this.#input.value = round(clamp(this.#min, parseFloat(this.#input.value) - (e.deltaY / Math.abs(e.deltaY) * fac), this.#max),1)
                }
            }
        })
    }


    get element() {
        return this.#element
    }
}

export { NumberBox }
