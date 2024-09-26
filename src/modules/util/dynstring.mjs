class DynamicString {
    #args;

    constructor() {
        this.#args = Array.from(arguments);
        // console.log(arguments)
    }

    get string() {
        let r = "";
        for (let i = 0; i < this.#args.length; i++) {
            if (typeof this.#args[i] == "string" || typeof this.#args[i] == "number" || typeof this.#args[i] == "boolean") {
                r += this.#args[i];
            } else {
                this.#args[i].properties.forEach(a => {
                    let prop;

                    let index = a.match(/(?<=\[).+(?=\])/g);
                    let indexFull = a.match(/(\[).+(\])/g)

                    if (index) {
                        prop = this.#args[i].object[a.replace(indexFull[0], "")][index]
                        // console.log(prop)
                    } else {
                        prop = this.#args[i].object[a]
                    }
                    r += `${prop} `
                });
            }
        }
        return r;
    }
}


export { DynamicString }
