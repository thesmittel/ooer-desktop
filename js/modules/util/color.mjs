import { ArgumentError, ValueError } from "../system/Error.mjs";

class Color {
    #r;#g;#b;
    #h;#s;#v;
    #c;#m;#y;#k;
    #hex;

    /**
     *
     * @param {Object} c
     */
    constructor(c) {

    }

    /**
     * @param {Object} color
     * @param {Number} color.r
     * @param {Number} color.g
     * @param {Number} color.b
     *  */
    set rgb(color) {
        if (color?.r === undefined || (color?.r < 0 || color?.r > 255)) throw new ArgumentError(this, "<set rgb>()", `Invalid value for red channel: ${color.r} (${typeof color.r})`)
    }
    get rgb() {
        return {r: this.#r, g: this.#g, b: this.#b}
    }
}

export { Color }
