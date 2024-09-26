/**
 * Map of characters to be sanitised for use in HTML without being parsed as actual HTML
 * @constant Object 
 * @name Internal:sanitationMap
 */
const sanitationMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;"
}

/**
 * Sanitises text by replacing relevant characters. Returns empty string, 
 * if a falsy element is provided. "false" (String), 0, -0 and 0n (BigInt(0)) are treated separately
 * to prevent unusual behaviour.
 * @param { String } text 
 * @returns Sanitised String
 * @method sanitise
 * @name Export:sanitise
 */
function sanitise(text) {
    if (text === "false" || typeof text == "number" || text === 0n) return text
    if (text) {
        for (let x in sanitationMap) {
            text = text.replaceAll(new RegExp(x, "g"), sanitationMap[x])
        }
    }
    return text || "";
}

/**
 * Reverses sanitation of text. This is not advised, unless critically important.
 * Not guaranteed to be a 1 to 1 undo of the sanitise function. Edge cases are handled the same.
 * @see Util~Export:sanitise
 * @param { String } text 
 * @returns Unsanitised String
 * @method unsanitise
 * @name Export:unsanitise
 */
function unsanitise(text) {
    if (text === "false" || typeof text == "number" || text === 0n) return text
    if (text) {
        for (let x in sanitationMap) {
            text = text.replaceAll(new RegExp(sanitationMap[x], "g"), x)
        }
    }
    return text || "";
}

const inline = / /g
const subscript = /(?<!\\)°(?!\s)([\w\W]*?)(?<!\s)(?<!\\)°/g
const superscript = /(?<!\\)\^(?!\s)([\w\W]*?)(?<!\s)(?<!\\)\^/g
const underline = /(?<!\\)_(?!\s)([\w\W]*?)(?<!\s)(?<!\\)_/g
const strikethrough = /(?<!\\)~(?!\s)([\w\W]*?)(?<!\s)(?<!\\)~/g
const bolditalic = /(?<!\\)\*{3}(?!\s)([\w\W]*?)(?<!\\)\*{3}/g   // this first
const bold = /(?<!\\)\*{2}(?!\s)([\w\W]*?)(?<!\\)\*{2}/g   // then this
const italic = /(?<!\\)\*{1}(?!\s)([\w\W]*?)(?<!\\)\*{1}/g   // then this
const h1 = /^#{1} (.*)/gm
const h2 = /^#{2} (.*)/gm
const h3 = /^#{3} (.*)/gm
const h4 = /^#{4} (.*)/gm
const escape = /\\(\^|°|_|~|\*+)/g
function formattingParser(text) {
    text = text.replace(/^#{1} (.*)/gm, "<h2>$1</h2>")
    text = text.replace(/^#{2} (.*)/gm, "<h3>$1</h3>")
    text = text.replace(/^#{3} (.*)/gm, "<h4>$1</h4>")
    text = text.replace(/^#{4} (.*)/gm, "<h5>$1</h5>")
    text = text.replace(superscript, "<sup>$1</sup>")
    text = text.replace(subscript, "<sub>$1</sub>")
    text = text.replace(underline, "<u>$1</u>")
    text = text.replace(strikethrough, "<s>$1</s>")
    text = text.replace(bolditalic, "<b><em>$1</em></b>")
    text = text.replace(bold, "<b>$1</b>")
    text = text.replace(italic, "<em>$1</em>")
    text = text.replace(escape, "$1")
    return text
}

export { sanitise, unsanitise, formattingParser }


