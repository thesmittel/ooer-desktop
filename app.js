import("./js/modules/install.mjs")
import("./server.js")
let ENV;
let t0 = Date.now()
import("./js/modules/system/Environment.mjs").then((val) => {
    ENV= val;
    console.log(ENV, Date.now() - t0)
})

console.log(ENV)

// const app = express.default()

// import * as Auth from "./server/modules/Auth.js"
// import * as System from "./server/modules/System.js"
// import * as App from "./server/modules/App.js"
nw.Window.open("./assets/index.html", {

}, function (win) {})

chrome.developerPrivate.openDevTools({
    renderViewId: -1,
    renderProcessId: -1,
    extensionId: chrome.runtime.id
})


const win = nw.Window.get();
win.showDevTools()
