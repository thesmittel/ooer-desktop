import { ValueError } from "../modules/system/Error.mjs";

class UIElement {
    #element;
    #__elementCreated = false;
    constructor() {
    }
    get element() {
        return this.#element;
    }
    set element(el) {
        if (this.#__elementCreated) {
            console.error("Element already created.")
            return;
        }
        this.#element = el;
        this.#__elementCreated = true
    }
}

export { UIElement }
