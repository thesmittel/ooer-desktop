import { create } from "../../modules/Util.mjs";
import { UIElement } from "../UIElement.mjs";
class Button extends UIElement {

    constructor(text, x, y, style) {
        super()
        this.element = create({
            tagname: "input",
            type: "button",
            style: style || "",
            innerText: text
        })
        this.element.style.top = x + "px";
        this.element.style.left = y + "px";
    }
}

const _name = "Butt"

export { Button, _name }
