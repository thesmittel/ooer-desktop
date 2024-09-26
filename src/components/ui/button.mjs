import { create } from "../Util.mjs";
class Button {
    element;
    constructor(text, x, y, style) {
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

export { Button }