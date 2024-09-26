
import { create, round, clamp, snap, isElement } from "/js/modules/Util.mjs";

class TextboxSlider {

    element;
    value;
    min; max; step;
    #sliding = false;
    #active = false;
    #tbactive = false;
    #validValue = true;
    #event;
    #labelText;
    #labelDom;
    #indicator; #textbox; #slider; #grid;
    #mouseup;

    constructor({id, name, min, max, val, step, label}) {
        this.#event = new CustomEvent("update", {
            detail: {
                value: () => parseFloat(this.value)
            },
            bubbles: true,
            cancelable: true,
            explicitOriginalTarget: this.element,
            target: this.element,
            originalTarget: this.element,
            currentTarget: this.element
        })
        this.#mouseup = new CustomEvent("set", {
            detail: {
                value: () => this.value
            },
            bubbles: true,
            cancelable: true,
            explicitOriginalTarget: this.element,
            target: this.element,
            originalTarget: this.element,
            currentTarget: this.element
        })
        // new internal event 
        if (min === undefined) throw new ReferenceError("'min' is not defined.")
        if (max === undefined) throw new ReferenceError("'max' is not defined.")
        if (val === undefined) throw new ReferenceError("'val' is not defined.")
        this.value = parseInt(val);
        let indicator, textbox, slider, labelEl, tbGrid;
        this.min = min;
        this.max = max;
        this.step = step;

        indicator = create({
            tagname: "div",
            classList: ["indicator"],
            style: `width: ${round((val - min) / (max - min) * 100, 1)}%;`
        })
        
        textbox = create({
            tagname: "input",
            type: "number",
            min: min,
            max: max,
            step: step || 1,
            value: val,
            style: "z-index: 1; padding-left: 12px",
            eventListener: {
                "keydown": (e) => {
                   if (e.key == "Enter") {
                    indicator.style.background = ""
                    if(this.#validValue) {
                        indicator.style.width = ((e.target.value - this.min) / (this.max - this.min) * 100) + "%"
                        const clamped = clamp(this.min, e.target.value, this.max);
                        this.element.dataset.value = clamped
                        e.target.value = clamped
                        this.value = clamped
                        this.element.dispatchEvent(this.#mouseup)
                    } else {
                        e.target.value = clamp(this.min, e.target.value, this.max);
                        indicator.style.width = ((this.element.dataset.value - this.min) / (this.max - this.min) * 100) + "%"
                    }
                    this.element.style.outline = ""
                    window.getSelection().removeAllRanges()
                    e.target.blur();
                    this.element.dataset.value = e.target.value;
                   }
                },
                "input": (e) => {
                    this.#validValue = !!e.target.value
                    this.element.style.outline = this.#validValue?"":"solid 2px red"

                    if(this.#validValue) {
                        const clamped = clamp(this.min, e.target.value, this.max);
                        indicator.style.width = round((e.target.value - this.min) / (this.max - this.min) * 100, 1) + "%"
                        textbox.value = clamped
                        this.value = clamped
                        this.element.dataset.value = clamped;
                        this.element.dispatchEvent(this.#event)
                        this.element.dataset.value = clamped;
                    }
                },
                "focusout": (e) => {
                    if(this.#validValue) {
                        indicator.style.width = ((e.target.value - this.min) / (this.max - this.min) * 100) + "%"
                        this.element.dataset.value = e.target.value
                        e.target.value = clamp(this.min, e.target.value, this.max)
                    } else {
                        e.target.value = this.element.dataset.value;
                        indicator.style.width = ((this.element.dataset.value - this.min) / (this.max - this.min) * 100) + "%"
                    }
                    this.element.style.outline = ""
                    window.getSelection().removeAllRanges()
                    e.target.blur();
                    indicator.style.background = ""
                    textbox.style["z-index"] = 1
                    this.#tbactive = false;
                }
            }
        })

        
        
        labelEl = create({
            tagname: "span",
            innerText: label || ""
        })
        this.#labelDom = labelEl;
        this.#labelText = label;
        tbGrid = create({
            tagname: "div",
            classList: ["grid"],
            childElements: [
                labelEl, textbox
            ]
        })


        slider = create({
            tagname: "input",    type: "range", id: id || "", name: name || "", min: min, 
            style: "z-index: 2", max: max,      step: step || 1, value: val,   
            eventListener: {
                "input": (e) => {
                    indicator.style.width = round((e.target.value - this.min) / (this.max - this.min) * 100, 1) + "%"
                    textbox.value = e.target.value;
                    this.value = e.target.value;
                    this.element.dataset.value = e.target.value;
                    this.element.style.outline = "none"
                    e.target.parentNode.dataset.value = e.target.value
                    this.element.dispatchEvent(this.#event)
                },
                "mousedown": (e) => {
                    this.#active = true;
                    window.getSelection().removeAllRanges()
                },
                "mousemove": (e) => {
                    this.#sliding = this.#active
                    e.stopPropagation();
                },
                "mouseup": (e) => {
                    setTimeout(() => {
                        this.#sliding = false;
                        this.#active = false;
                        this.element.dispatchEvent(this.#mouseup)
                    }, 1);
                }
            }
        })
        this.#indicator = indicator;
        this.#slider = slider;
        this.#textbox = textbox;
        this.#grid = tbGrid
        this.element = create({
            tagname: "textbox-slider",
            childElements: [
                indicator,
                tbGrid,
                slider
            ],
            dataset: {
                value: val
            },
            eventListener: {
                "click": (e) => {
                    if (!this.#sliding) {
                        if (!this.#tbactive) {
                            textbox.focus();
                            textbox.select();
                            textbox.style["z-index"] = 3;
                            this.#tbactive = true;
                            indicator.style.background = "transparent"
                        }
                    }
                }
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

    show(parentElement) {
        parentElement.append(this.element)
    }

    hide() {
        this.element.remove()
    }

    setTextOffset(val) {
        this.#grid.style["grid-template-columns"] = `${val} 1fr`;
    }

    setLabel(t) {
        this.#labelText = t;
        this.#labelDom.innerText = t
    }
    /**
     * This should only be used for single slideboxes. For grouped slideboxes, use SliderGroup.setParameters(). 
     * Using this function for grouped sliders without the event firing, the group will not be updated properly, and firing the event for every individual one will cause the group to also fire its update event 3 times
     * @emits update
     * @param {Object} parameters Object containing the new parameters for the slidebox
     * @param {Number} [parameters.min] New minimum value
     * @param {Number} [parameters.max] New maximum value
     * @param {Number} [parameters.val] New current value
     * @param {Number} [parameters.step] New step size
     * @param {Boolean} [fireevent] Whether to fire an update event or not. Default: false
     */
    setParameters({min, max, val, step}, fireevent) {
        const nmi = (typeof min  == "number") ? min : this.min;
        const nma = (typeof max  == "number") ? max : this.max;
        const nst = (typeof step == "number") ? step: this.step;
        const nva = (typeof val ==  "number") ? clamp(nmi, snap(val, nmi, nst), nma) : this.value;
        
        
        this.value = nva
        this.#slider.value = nva
        this.#textbox.value = nva
        this.element.dataset.value = nva
        this.min = nmi
        this.#slider.min = nmi
        this.max = nma
        this.#slider.max = nma
        this.step = nst
        this.#slider.step = nst
        
        this.#indicator.style =` width: ${round((nva - nmi) / (nma - nmi) * 100, 1)}%`
        if(fireevent !== undefined && fireevent) this.element.dispatchEvent(this.#event) 
        // todo: setparameters in group class, so that the event only fires  once.
    }

}




class SliderGroup {
    #elements = [];
    #objects = [];
    #values = [];
    element;
    #event; #mouseup;
    #label;

    constructor(array, label) {
        if (!(array instanceof Array)) throw new TypeError("Class SliderGroup: Constructor expects array")
        
        this.#event = new CustomEvent("update", {
            detail: {
                values: () => this.#values
            },
            bubbles: true,
            cancelable: true,
            explicitOriginalTarget: this.element,
            target: this.element,
            originalTarget: this.element,
            currentTarget: this.element
        })
        
        this.#mouseup = new CustomEvent("set", {
            detail: {
                values: () => this.values
            },
            bubbles: true,
            cancelable: true,
            explicitOriginalTarget: this.element,
            target: this.element,
            originalTarget: this.element,
            currentTarget: this.element
        })

        

        for (let i in array) {
            if(isElement(array[i])) {
                this.#objects.push(array[i])
                this.#elements.push(array[i].element)
                array[i].element.addEventListener("update", (e) => {
                    e.stopPropagation();
                    this.#valueJuggling(e)
                    this.element.dispatchEvent(this.#event)
                })
                array[i].element.addEventListener("set", (e) => {
                    e.stopPropagation();
                    this.#valueJuggling(e)
                    this.element.dispatchEvent(this.#mouseup)
                })
                this.#values.push(array[i].value)
            } else {
                const s = new TextboxSlider(array[i])
                this.#objects.push(s)
                this.#elements.push(s.element)
                s.element.addEventListener("update", (e) => {
                    e.stopPropagation();
                    this.#valueJuggling(e)
                    this.element.dispatchEvent(this.#event)
                })
                s.element.addEventListener("set", (e) => {
                    e.stopPropagation();
                    this.#valueJuggling(e)
                    this.element.dispatchEvent(this.#mouseup)
                })
                this.#values.push(s.value)
            }
        }

        if (label) {
            if (isElement(label)) {
                this.#label = label
            } else if (typeof label == "string") {
                this.#label = create({
                    tagname: "span",
                    innerHTML: label
                })
            } else if(label.text) {
                this.#label = create({
                    tagname: "span",
                    innerHTML: label.text,
                    style: label.style||""
                })
            }
            this.#elements = [this.#label, ...this.#elements]
        } else {
            this.#label = null;
        }

        this.element = create({
            tagname: "slider-group",
            childElements: this.#elements,
            dataset: {
                values: parseFloat(this.#values)
            },
            values: parseFloat(this.#values)
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

    #valueJuggling (e) {
        const newValue = parseFloat(e.target.dataset.value)
        this.#values[(this.#label==null)?this.#elements.indexOf(e.target):this.#elements.indexOf(e.target)-1] = newValue;
        this.element.dataset.values = this.#values
        this.element.values = this.#values
    }

    getElements() {
        return this.#objects
    }
    
    /**
     * To manually update slideboxes inside a group, use this method.
     * It takes either an Array if updating all (or the first n slideboxes) at once, or an object, whose keys are the indices of the slidebox to be changed.
     * Using an object, any combination of slideboxes can be updated in any order.
     * Here is an example:<br>
     * <code>{
     *  0: {min: 0, max: 255, step: 1, val: 25},
     *  3: {min: 0, max: 100, step: 1, val: 54},
     *  1: {min: 10, max: 20, step: 2, val: 16},
     * }</code>
     * @emits update
     * @param {Object} parameters
     */
    setParameters(obj, fireevent) {
        for (let i in obj) {
            if (!this.#objects[i]) throw new RangeError(`Invalid index (${i})`)
            this.#objects[i].setParameters(obj[i])
            this.#values[i] = obj[i].val == undefined ? this.#values[i] : obj[i].val
        }
        if (fireevent) this.element.dispatchEvent(this.#event)
    }
}

export { TextboxSlider, SliderGroup }