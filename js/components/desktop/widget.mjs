import { create, randomId } from "../../modules/Util.mjs"
import { ValueError } from "../../modules/system/Error.mjs"
class Widget {
    #xPos; #yPos;
    #anchorX; #anchorY;
    #width; #height;
    element;
    #id;
    #appid;
    #style
    constructor(appid, html, css, {x, y, w, h, anchorX, anchorY}) {

        this.#appid = appid;
        this.#id = `desktop-widget-${randomId(12)}`;
        this.#style = create({
            tagname: "style",
            type: "text/css",
            innerText: `desktop-widget#desktop-widget-${this.#id} {${css}}`
        })
        this.#xPos = x;
        this.#yPos = y;
        this.#width = w;
        this.#height = h;
        this.#anchorX = anchorX;
        this.#anchorY = anchorY;
        this.element = create({
            tagname: "desktop-widget",
            style: `
            ${anchorY=="center"?"top":anchorY}: ${anchorY=="center"?"50%":x + "px"};
            ${anchorY=="center"?"left":anchorY}: ${anchorY=="center"?"50%":y + "px"};
            translate: ${anchorX=="center"?"-50%":"0"} ${anchorY=="center"?"-50%":"0"};
            width: ${w}px;
            height: ${h}px;
            `,
            innerHTML: html
        })

    }

    setDimenions({w, h}) {
        if (!isNaN(w)) {
            w = parseFloat(w)
            this.#width = w;
            this.element.style.width = w + "px"
        }

        if (!isNaN(h)) {
            h = parseFloat(h);
            this.#height = h;
            this.element.style.height = h + "px"
        }
    }

    setPosition({x, y}) {
        if (!isNaN(x)) {
            this.#xPos = parseFloat(x);
            this.element.style.left = undefined;
            this.element.style.right = undefined;
            this.element.style[this.#anchorX=="center"?"left":this.#anchorX] = x + "px";
        }
        if (!isNaN(y)) {
            this.#yPos = parseFloat(y);
            this.element.style.top = undefined;
            this.element.style.bottom = undefined;
            this.element.style[this.#anchorY=="center"?"top":this.#anchorY] = y + "px";
        }
    }

    setAnchor({x, y}) {
        if (x != "left" && x != "center" && x != "right" && x != "") throw new ValueError(this, this.setAnchor, "Argument 'x' must be 'left', 'right' or 'center'")
        if (y != "top" && y != "center" && y != "bottom" && y != "") throw new ValueError(this, this.setAnchor, "Argument 'y' must be 'top', 'bottom' or 'center'")
        if (x) {
            this.#anchorX = x
        };
        if (y) {
            this.anchorY = y
        };
    }

    update(data) {
        if (typeof data == "string") { // Raw html provided
            this.element.innerHTML = data;
        } else {
            this.element.innerHTML = "";
            this.element.append(create(data))
        }
    }
}

export {Widget}
