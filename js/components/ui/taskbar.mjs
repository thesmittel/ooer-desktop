import { create, getElement } from "../../modules/Util.mjs";

const elements = {};
// Predefine start and search
Object.defineProperties(elements, {
    home: {
        value: "home",
        enumerable: false,
        configurable: false
    },
    search: {
        value: "search",
        enumerable: false,
        configurable: false
    },
    "000000000001": {
        icon: "/media/desktopicons/000000000001", // Taskbar shortcut example
        tooltip: "Example application"
    }
})

function addElement(appid, instanceid, windowid, obj) {
    // try-catch in order to prevent "cannot read property of undefined" since that is a bit counterproductive.
    // undefined is the expected state. if it isnt undefined, it returns immediately.
    try {
        let w = elements[appid][instanceid][windowid];
        if (w) return;
    } catch {
        ; // only here to prevent errors being thrown while checking if a window is already registered
    }

    // create app obj if not present
    if (!elements[appid]) elements[appid] = {}
    // create instance obj if not present
    if (!elements[appid][instanceid]) elements[appid][instanceid] = {}
    // create window obj
    if (!elements[appid][instanceid][windowid]) elements[appid][instanceid][windowid] = getElement(`window-${appid}-${instanceid}-${windowid}`)
    // create DOM element
    const el = create({
            tagname: "taskbar-button",
            style: `background-image: url(${icon}); background-size: contain;`,
            dataset: {
                windowid: windowid,
                instanceid: instanceid,
                appid: appid,
                active: "true"
            },
            eventListener: {
                click: (e) => { taskbarIconClick(e, this.windowId, instanceid, appid) },
                mouseover: taskbarSymbolAddWindowPreview,
                mouseout: taskbarSymbolDeleteWindowPreview
            }
        })
}
