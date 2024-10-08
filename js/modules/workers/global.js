const callbacks = {}

onmessage = (e) => {
    if (callbacks[e.callback]) callbacks[e.callback](e.data)
}

function addCallback(id, callback) {
    callbacks.callbackId = (obj) => {
        callback(obj);
        delete callbacks.callbackId;
    };
}

// Object.defineProperties(Array.prototype, {
//     deleteElement: {
//         value: (arr, index) => {
//             if (typeof e != "number") throw new TypeError("Util:deleteElement(arr, e): argument e must be a number")
//             if (e<0 || e>=arr.length) throw new RangeError("Util:deleteElement(arr, e): argument e must be a valid index.")
//             if (!(arr instanceof Array)) throw new TypeError("Util:deleteElement(arr, e): argument arr must be an Array")
//             const fp = arr.splice(index)
//             fp.shift();
//             return [...arr, ...fp]
//         },
//         configurable: false,
//         enumerable: false,
//         writable: false
//     }
// })

Object.defineProperties(Math, {
    clamp: {
        value: (lower, value, upper) => {
            return Math.max(lower, Math.min(value, upper))
        },
        configurable: false,
        enumerable: false,
        writable: false
    },
    map: {
        value: (v, fromMin, fromMax, toMin, toMax) => {
            let dFrom = fromMax - fromMin;
            let dTo = toMax - toMin;
            let dFMinV = v - fromMin;
            let vecFac = dFMinV / dFrom;
            return toMin + vecFac * dTo;
        },
        configurable: false,
        enumerable: false,
        writable: false
    },
    roundTo: {
        value: (v, d) => {
            return Math.round(v * Math.pow(10, d)) / Math.pow(10, d);
        },
        configurable: false,
        enumerable: false,
        writable: false
    },
    snap: {
        value: (val, min, step) => {
            if (step == 0) return val;
        
            let c = Math.round((val - min) / step) * step + min
            let truncate = Math.ceil(-Math.log10(step))
            if (truncate > 0) {
                c = round(c, truncate)
            }
            return c
        },
        configurable: false,
        enumerable: false,
        writable: false
    }
})

Object.defineProperties(String.prototype, {
    sanitise: {
        value: (text) => {
            const sanitationMap = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&apos;"
            }
            if (text === "false" || typeof text == "number" || text === 0n) return text
            if (text) {
                for (let x in sanitationMap) {
                    text = text.replaceAll(new RegExp(x, "g"), sanitationMap[x])
                }
            }
            return text || "";
        },
        configurable: false,
        enumerable: false,
        writable: false
    },
    unsanitise: {
        value: (text) => {
            const sanitationMap = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&apos;"
            }
            if (text === "false" || typeof text == "number" || text === 0n) return text
            if (text) {
                for (let x in sanitationMap) {
                    text = text.replaceAll(new RegExp(sanitationMap[x], "g"), x)
                }
            }
            return text || "";
        }
    },
    formattingParser: {
        value: (text) => {
            text = text.replace(/^#{1} (.*)/gm, "<h2>$1</h2>")
            text = text.replace(/^#{2} (.*)/gm, "<h3>$1</h3>")
            text = text.replace(/^#{3} (.*)/gm, "<h4>$1</h4>")
            text = text.replace(/^#{4} (.*)/gm, "<h5>$1</h5>")
            text = text.replace(/(?<!\\)\^(?!\s)([\w\W]*?)(?<!\s)(?<!\\)\^/g, "<sup>$1</sup>")
            text = text.replace(/(?<!\\)°(?!\s)([\w\W]*?)(?<!\s)(?<!\\)°/g, "<sub>$1</sub>")
            text = text.replace(/(?<!\\)_(?!\s)([\w\W]*?)(?<!\s)(?<!\\)_/g, "<u>$1</u>")
            text = text.replace(/(?<!\\)~(?!\s)([\w\W]*?)(?<!\s)(?<!\\)~/g, "<s>$1</s>")
            text = text.replace(/(?<!\\)\*{3}(?!\s)([\w\W]*?)(?<!\\)\*{3}/g, "<b><em>$1</em></b>")
            text = text.replace(/(?<!\\)\*{2}(?!\s)([\w\W]*?)(?<!\\)\*{2}/g, "<b>$1</b>")
            text = text.replace(/(?<!\\)\*{1}(?!\s)([\w\W]*?)(?<!\\)\*{1}/g, "<em>$1</em>")
            text = text.replace(/\\(\^|°|_|~|\*+)/g, "$1")
            return text
        }
    }
})

const application = {}
Object.defineProperties(application, {
    createElement: {
        value: (obj, callback) => {
            const callbackId = Math.floor(Math.random()*1000000);
            postMessage({
                "command": "create",
                "data": obj,
                "id": callbackId
            })
            addCallback(callbackId, callback)
        },
        writable: false,
        enumerable: false, 
        configurable: false
    },
    getElement: {
        value: (id, callback) => {
            if (!callback) throw new ReferenceError("self.getElement() must specify a callback.")
            const callbackId = Math.floor(Math.random()*1000000)
            postMessage({
                command: "get",
                data: id,
                id: callbackId
            })
            addCallback(callbackId, callback)
        },
        writable: false,
        enumerable: false, 
        configurable: false
    }
})

