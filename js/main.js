/**
 * @module main
 * @name Client:main
 * @description Starting point, initialiser for all other modules. Handles clockticks
 */

import * as Connect from "./modules/Connect.mjs"
import * as Handler from "./modules/Handlers.mjs"
import { create } from "./modules/Util.mjs"
// import { Panel } from "./components/ui.mjs"
// import * as UI from "./components/ui.mjs"
// import { Widget } from "./modules/desktop/desktop.mjs"
import { ArgumentError, ValueError } from "./modules/system/Error.mjs"
import * as Keyboard from "./modules/input/Keyboard.mjs"
import { clock } from "./modules/util/clock.mjs"
import { PasswordPrompt } from "./components/ui/passwordPrompt.mjs"
import * as ENV from "./modules/system/Environment.mjs"
import { load } from "./modules/loader.mjs"


let UI = await load("./js/components/ui")
window.UI = UI
console.log(window.UI)

// document.querySelector("taskbar-button#home").addEventListener("click", Handler.openStartmenu)
// document.querySelector("taskbar-button#search").addEventListener("click", Handler.openSearch)
// document.querySelector("div#desktop-hub-close").addEventListener("click", Handler.closeHub)
// document.querySelector("div#desktop-hub-settings").addEventListener("click", (e) => {
//     Handler.closeHub()
//     Handler.openSettings(e)
// })



// const fs = require("fs")


// for some reason this works, but will be changed anyways
// Handler.openLogin({stopPropagation: ()=>{}})

// document.getElementById("login").addEventListener("click", Auth.login)


// const originalEventListener = EventTarget.prototype.addEventListener;



// EventTarget.prototype.addEventListener = function (type, listener, options) {
//     const newListener = function (event) {
//         // No matter where, no matter what, this will ALWAYS sanitise any user input
//         // Textboxes, textareas, input etc
//         const oldVal = event.target.value;
//         event.target.value = sanitise(event.target.value)
//         // contenteditable = true
//         const oldHTML = event.target.innerHTML
//         event.target.innerHTML = sanitise(event.target.innerHTML)
//         // Should probably disable timeouts and intervals since those would not be affected by any of this due to the reset
//         listener.call(this, event)

//         // Resetting the elements to their previous state to prevent any visual glitches.
//         event.target.value = unsanitise(event.target.value);
//         event.target.innerHTML = unsanitise(event.target.innerHTML);
//     }
//     originalEventListener.call(this, type, newListener, options);
// }


// HTMLElement.prototype.__defineGetter__('value', function() {
//     console.log("The 'value' property was read");
//     // Return the actual value of the 'value' property
//     return this.getAttribute('value');
// });


/**
 * Attempt at overriding value getter, didnt work
 */
Object.defineProperty(HTMLElement.prototype, "value", {
    enumerable: true,
    configurable: true,
    get: function() {
        console.log("test")
    }
})



const clockobject = document.getElementById("clock-main");
document.addEventListener("contextmenu", Handler.contextMenu)
// Clock
// function clocktick() {
//     let now = new Date(Date.now());
//     clockobject.dataset.time = now.toLocaleTimeString(undefined, {
//         hour: "2-digit",
//         minute: "2-digit"
//     }).replace(/[ap]m/gi, "")
//     clockobject.dataset.date = now.toLocaleDateString(undefined, {
//         weekday: "long",
//         year: "numeric",
//         month: "long",
//         day: "numeric"
//     })
// }
// clocktick();

// setInterval(clocktick, 1000)
console.log(ENV.configPath, ENV.installPath)
const webview = create({
    tagname: "webview",
    // src: "http://localhost:48080/system/settings",
    // src: "file:///" + ENV.configPath + "/applications/system/settings/settings.html",
    src: "file:///" + ENV.installPath + "/server/template.html",
    partition: "trusted",
    style: `position: fixed;
    top: 20px;
    left: 20px;
    height: 600px;
    width: 800px;
    z-index: 10000;
    background: #0004;
    backdrop-filter: blur(12px)`,
    allowtransparency: "on"
})


setTimeout(() => {
    webview.executeScript(
        // {code: `let s = document.createElement('script'); s.src = "file:///${ENV.configPath}/applications/system/settings/settings.js"; s.type = "module"; document.head.append(s)`},
        // {code: `let s = document.createElement('script'); s.src = "http://localhost:48080/app/js/system/settings"; s.type = "module"; document.head.append(s)`},
        {code: "console.log(window)"},
        (res) => { console.log("oman",res)}
    )
}, 100);

if (!ENV.isBrowser) {
    import("./modules/install.mjs")
}

document.body.append(webview)
