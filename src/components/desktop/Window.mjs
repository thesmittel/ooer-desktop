/**
 * Contains code relating to windows
 * @file Window.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:Window
 * @see <a href="./client.Client_Window.html">Module</a>
 */
/**
 * Contains code relating to windows
 * @file Window.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:Window
 * @see <a href="./client.Client_Window.html">Module</a>
 * @namespace ClientCode
 */
/**
 * @module Window
 * @memberof client
 * @description Contains code relating to windows
 * @name Client:Window
 * @author Smittel
 */

import { App as emit } from "./Connect.mjs"
import { create, randomId, getElement } from "./Util.mjs";
import { dragElement } from "./Dragging.mjs";
import { loseFocus } from "../Handlers.mjs";
import { registerListener } from "./App.mjs";
import { currentDesktop } from "./System.mjs";
document.addEventListener("mousemove", windowResize);
document.addEventListener("mouseup", endResize)

let appInstances;
/**
 * Receives reference to object keeping track of app instances, saves it into member appInstances on the first go.
 * Rejects any subsequent attempts at altering it.
 * @param { Object } obj Reference to appInstances object from App.mjs
 */
function addAppInstanceObjectRef(obj) {
    // This prevents any changes after the fact, only the original assignment will go through
    if (appInstances != undefined) return
    appInstances = obj;
}


/**
 * @class Internal:Window
 * @classdesc Holds the data for a window, creates the relevant DOM Elements and appends to DOM
 * @member Window
 * @name Export:Window
 * @see <a href="./client.Client_Window.html">Internal:Window</a>
 * @todo Figure out how to document stuff inside these classes :/
 */
class Window {
    windowId;
    windowObject;
    #windowBody;
    #instance_id;
    #app_id;
    #script;
    #style;
    taskbaricon;
    #privilege;
    close(event) {
        const parent = getParentWindow(event.target);
        const { appid, instanceid, windowid } = parent.dataset;
        appInstances[instanceid].removeWindow(windowid)
        document.querySelector(`taskbar-button[data-appid="${appid}"][data-instanceid="${instanceid}"][data-windowid="${windowid}"]`).remove()
        parent.remove();
    }
    /**
     *
     * @param { (String|Number) } instance_id 12 Digit identificator
     * @param { (String|Number) } app_id 12 Digit identificator
     * @param { Object } data Window confic provided by server
     * @param { String } icon URL to icon, provided by server
     * @param { Boolean } sys Determines access level of window scripts
     */
    constructor(instance_id, app_id, data, icon, sys) {
        this.#instance_id = instance_id;
        this.#app_id = app_id;
        this.windowId = randomId(12)
        this.#privilege = sys || false;


        const closebutton = create({
            tagname: "a",
            id: "windowcontrolbutton",
            dataset: { action: "cls" },
            innerHTML: '<i id="windowcontrollbuttonicon" class="bx bx-x bx-sm"></i>',
            eventListener: {
                click: this.close,
                mousedown: (e) => { e.stopPropagation() }
            }
        })

        const minimiseButton = create({
            tagname: "a",
            id: "windowcontrolbutton",
            dataset: { action: "min" },
            innerHTML: '<i class="bx bx-chevron-down bx-sm"></i>',
            eventListener: {
                click: (e) => {
                    getParentWindow(e.target).dataset.minimised = "true"
                },
                mousedown: (e) => { e.stopPropagation() }
            }
        })

        const restoreButton = create({
            tagname: "a",
            id: "windowcontrolbutton",
            dataset: {
                action: "max",
            },
            eventListener: {
                click: (e) => {
                    e.stopPropagation();
                    let replace = e.target;
                    let target = e.target.parentNode;
                    const parentWindow = getParentWindow(target);
                    parentWindow.style.transition = "all 0.05s"
                    setTimeout(() => { parentWindow.style.transition = null }, 50)


                    if (e.target.tagName == "I") {
                        target = target.parentNode
                        replace = replace.parentNode
                    }

                    maximiseWindow(parentWindow)
                    target.replaceChild(maximiseButton, replace)
                },
                mousedown: (e) => { e.stopPropagation() }
            },
            innerHTML: '<i class="bx bx-windows bx-xs"></i>'
        })

        const maximiseButton = create({
            tagname: "a",
            id: "windowcontrolbutton",
            dataset: {
                action: "res"
            },
            eventListener: {
                click: (e) => {
                    e.stopPropagation();
                    let replace = e.target;
                    let target = e.target.parentNode;
                    const parentWindow = getParentWindow(target);
                    parentWindow.style.transition = "all 0.05s"
                    setTimeout(() => { parentWindow.style.transition = null }, 50)


                    if (e.target.tagName == "I") {
                        target = target.parentNode
                        replace = replace.parentNode
                    }

                    maximiseWindow(parentWindow)
                    target.replaceChild(restoreButton, replace)
                },
                mousedown: (e) => { e.stopPropagation() }
            },
            innerHTML: '<i class="bx bx-window bx-xs"></i>'
        })

        this.#style = create({
            tagname: "style",
            innerHTML: `div#window-${this.#app_id}-${this.#instance_id}-${this.windowId} > .window-body {${data.css}}`
        })

        this.#windowBody = create({
            tagname: "div",
            classList: ["window-body"],
            id: `window-${this.#app_id}-${this.#instance_id}-${this.windowId}.body`,
            innerHTML: data.html,
            dataset: {
                stopCtxPropagation: true,
            }
        })

        const w = create({
            tagname: "div",
            classList: ["window"],
            id: `window-${this.#app_id}-${this.#instance_id}-${this.windowId}`,
            style: {
                width: ((data.defaultWidth) || (window.innerWidth * 0.7)) + "px",
                height: ((data.defaultHeight) || (window.innerHeight * 0.7)) + "px",
                "min-width": (data.minWidth || 240) + "px",
                "min-height": (data.minHeight || 240) + "px",
                "z-index": getNumberOfWindows(),
                top: "12px",
                left: "12px"
            },
            eventListener: { mousedown: activeWindowChange },
            dataset: {
                minimised: "false",
                id: this.#app_id,
                instanceid: this.#instance_id,
                windowid: this.windowId,
                appid: this.#app_id,
                active: "false",
                oldTop: "0px",
                oldLeft: "0px",
                oldWidth: "100%",
                oldHeight: "100%",
                maximised: "false",
                minHeight: (data.minHeight || 70),
                minWidth: (data.minWidth || 240),
                stopCtxPropagation: true,
            },
            childElements: [
                {
                    tagname: "div",
                    classList: ["header-wrap"],
                    childElements: [{
                        tagname: "div",
                        id: `window-${this.#app_id}-${this.#instance_id}-${this.windowId}-header`,
                        classList: ["window-header"],
                        childElements: [
                            {
                                tagname: "div",
                                id: `window-${this.#app_id}-${this.#instance_id}-${this.windowId}-header-icon`,
                                classList: ["window-icon"],
                                childElements: [
                                    { tagname: "img", src: icon }
                                ]
                            },
                            {
                                tagname: "div",
                                id: `window-${this.#app_id}-${this.#instance_id}-${this.windowId}-header-title`,
                                innerText: data.title,
                                classList: ["window-title"]
                            },

                            minimiseButton,
                            maximiseButton,
                            closebutton
                        ]
                    }]
                },
                this.#style, this.#windowBody, {
                    tagname: "div",
                    classList: ["resize", "left"],
                    eventListener: {
                        mousedown: startResize,
                        mouseup: endResize
                    },
                }, {
                    tagname: "div",
                    classList: ["resize", "right"],
                    eventListener: {
                        mousedown: startResize,
                        mouseup: endResize
                    }
                }, {
                    tagname: "div",
                    classList: ["resize", "top"],
                    eventListener: {
                        mousedown: startResize,
                        mouseup: endResize
                    }
                }, {
                    tagname: "div",
                    classList: ["resize", "bottom"],
                    eventListener: {
                        mousedown: startResize,
                        mouseup: endResize
                    }
                }, {
                    tagname: "div",
                    classList: ["resize", "bottomleft"],
                    eventListener: {
                        mousedown: startResize,
                        mouseup: endResize
                    }
                }, {
                    tagname: "div",
                    classList: ["resize", "bottomright"],
                    eventListener: {
                        mousedown: startResize,
                        mouseup: endResize
                    }
                }, {
                    tagname: "div",
                    classList: ["resize", "topleft"],
                    eventListener: {
                        mousedown: startResize,
                        mouseup: endResize
                    }
                }, {
                    tagname: "div",
                    classList: ["resize", "topright"],
                    eventListener: {
                        mousedown: startResize,
                        mouseup: endResize
                    }
                }
            ]
        });

        this.windowObject = w;
        if (data.js != undefined && data.js != "") {
            this.#script = this.#addScript(data.js, this.windowObject, this.#app_id, this.#instance_id, this.windowId, this.#windowBody)
        }

        if (data.draggable == true || data.draggable === undefined) {
            dragElement(this.windowObject)
        }



        /*
        TO DO: change task bar icon creation to allow for grouping of icons that belong to the same application instance
        */
        this.taskbaricon = create({
            tagname: "taskbar-button",
            style: `background-image: url(${icon}); background-size: contain;`,
            dataset: {
                windowid: this.windowId,
                instanceid: this.#instance_id,
                appid: this.#app_id,
                active: "true"
            },
            eventListener: {
                click: (e) => { taskbarIconClick(e, this.windowId, this.#instance_id, this.#app_id) },
                mouseover: taskbarSymbolAddWindowPreview,
                mouseout: taskbarSymbolDeleteWindowPreview
            }
        })

        document.querySelector("task-bar").append(this.taskbaricon)
    }

    /**
     * Sets the draw order of the current window. DO NOT USE
     * could potentially cause draw order issues for window updates.
     * @deprecated
     * @param { Number } n
     */
    setDrawOrder(n) {
        this.windowObject.style["z-index"] = n
    }
    /**
     * Adds window object to DOM tree parented to body, changes active window to itself
     */
    show() {
        currentDesktop.addWindow(this.windowObject)
        // document.body.append(this.windowObject)
        activeWindowChangeTarget(this.windowObject)
    }

    /**
     * Creates a script element containing the code for an app window.
     * @todo make security related code modifications serverside
     * @todo attach listener function to script object that can be accessed within the script but not outside
     * @todo find way to allow intervals - idea: override setInterval with function that creates a variable in an object thats saved in this module of the following format:
     * <code>
     * {
     *  appid: {
     *      instanceid: {
     *          windowid: [ interval 1, interval 2,...,interval n ]
     *      }
     *  }
     * }
     * @param { String } js The code
     * @param { HTMLDivElement } windowObject Entirety of window including header and resize handlers
     * @param { String } appId 12-digit identifier for app
     * @param { String } instanceId 12-digit identifier for app instance
     * @param { String } windowId 12-digit identifier for instance window
     * @param { HTMLDivElement } windowbody Content of window
     * @returns HTMLScriptElement
     */
    #addScript(js, windowObject, appId, instanceId, windowId, windowbody) {
        const script = document.createElement("script");
        // script.id = "scr" + windowObject.id ;
        const id = `id${appId}${instanceId}${windowId}`;

        const app = {};
        Object.defineProperties(app, {
            app: {
                value: appId,
                configurable: false,
                enumerable: false,
                writable: false
            },
            instance: {
                value: instanceId,
                configurable: false,
                enumerable: false,
                writable: false
            },
            window: {
                value: windowId,
                configurable: false,
                enumerable: false,
                writable: false
            },
            bodyid: {
                value: `window-${appId}-${instanceId}-${windowId}.body`,
                configurable: false,
                enumerable: false,
                writable: false
            },
            windowid: {
                value: `window-${appId}-${instanceId}-${windowId}`,
                configurable: false,
                enumerable: false,
                writable: false
            },
            fullid: {
                value: `${appId}-${instanceId}-${windowId}}`,
                configurable: false,
                enumerable: false,
                writable: false
            },
            body: {
                value: this.#windowBody,
                configurable: false,
                enumerable: false,
                writable: false
            },
            addListener: {
                value: (func) => {
                    if (typeof func !== "function") {
                        throw new TypeError("Listener callback must be a function, got " + typeof func)
                    }
                    const id = `${appId}-${instanceId}-${windowId}`;
                    registerListener(id, func)
                },
                configurable: false,
                enumerable: false,
                writable: false
            },
            removeListener: {
                value: () => {
                    const id = `${appId}-${instanceId}-${windowId}`;
                    deleteListener(id);
                },
                configurable: false,
                enumerable: false,
                writable: false
            },
            addOverride: {
                value: (name, func) => {
                    if (typeof func !== "function") {
                        throw new TypeError("func must be of type function, got " + typeof func)
                    }
                    // add to data somehow
                    // replace default handler for overridden
                },
                configurable: false,
                enumerable: false,
                writable: false
            },
            data: {
                value: {},
                configurable: false,
                enumerable: false,
                writable: false
            }
        });

        Object.defineProperty(windowbody, "application", {
            value: app,
            configurable: true,
            enumerable: false
        })

        script.type = "text/javascript";
        js = js.replace(`"<application>"`, `const application = globalGetElementById("${windowbody.application.bodyid}").application`)
        /* TO DO:
            Theres a potential "exploit" with spawned webworkers with foreign scripts.
            Test, if possible, if so, patch
        */
        switch (this.#privilege) {
            case 0:  // fallthrough
            default: // Default permissions: only access to content of windowbody
            case 1: // Elevated permissions: access to entire window of app
                // Different permission levels are handled serverside
                script.innerHTML = `const ${id} = () => {${js}}; ${id}();`
                break;
            case 2: // System permissions: all global objects are available. scripts are treated as modules.
                script.innerHTML = js;
                script.type = "module"
                break;
        }
        // End of code that must be serverside
        script.listen = () => { }
        windowObject.append(script)
        this.script = script;
        return script;
    }

}


/**
 * Finds the parent window of an element by walking up the DOM Tree until it finds an ID that matches the format used by windows.<br>
 * @param { DOMElement } el
 * @returns DOMElement, if window was found, <code>null</code> if given element was not part of a window
 * @method getParentWindow
 * @name Export:getParentWindow
 */
function getParentWindow(el) {
    while (!el.id.match(/^window-\d{12}-\d{12}-\d{12}$/g)) {
        if (el.tagName == "BODY") return null;
        el = el.parentNode;
    }
    return el;
}

/**
 * Counts all windows (DOM-Elements) of all app instances, more of a Util function but wont work there.
 * @method getNumberOfWindows
 * @name Internal:getNumberOfWindows
 * @returns {Number} Number of windows
 */
function getNumberOfWindows() {
    if (appInstances == {}) return 0;
    let n = 0;
    for (let a in appInstances) {
        n += appInstances[a].elements.length;
    }
    return n;
}


/**
 * Maximises a window, storing the old position and dimensions in an attribute, so the previous configuration can be restored.
 * Does not need to call getParentWindow
 * @method maximiseWindow
 * @name Export:maximiseWindow
 * @param { HTMLDivElement } t A window element or element of the window's sub-tree
 * @todo Remove duplicate code by calling Internal:getParentWindow() instead
 */
function maximiseWindow(t) {
    let target = t;
    while (!target.id.match(/^window-\d{12}-\d{12}-\d{12}$/g)) {
        target = target.parentNode;
    }

    [target.dataset.oldTop, target.style.top] = [target.style.top, target.dataset.oldTop];
    [target.dataset.oldLeft, target.style.left] = [target.style.left, target.dataset.oldLeft];
    [target.dataset.oldHeight, target.style.height] = [target.style.height, target.dataset.oldHeight];
    [target.dataset.oldWidth, target.style.width] = [target.style.width, target.dataset.oldWidth];

    target.dataset.maximised = target.dataset.maximised == "false"

    document.getElementById("snapping-prev") // ???
}


let intervals = [];
let initialMouseX = null;
let initialMouseY = null;
let mouseDown = false;
let targetWindow = null;
let resizeDirection = null;
let originalWindow = null;
/**
 * Saves the initial parameters required for properly resizing windows with the new and improved system. The advantage compared to the CSS property <code>resize: both;</code> is, that this allows resizing on all edges in only one dimension as well as on all corners in both dimensions.
 * @listens mousedown
 * @param {Event} event
 * @method startResize
 * @name Internal:startResize
 */
function startResize(event) {
    mouseDown = true;
    initialMouseX = event.clientX;
    initialMouseY = event.clientY;
    targetWindow = event.target.parentNode;
    resizeDirection = event.target.classList[1];
    originalWindow = [
        parseInt(event.target.parentNode.style.width),
        parseInt(event.target.parentNode.style.height),
        event.target.parentNode.offsetTop,
        event.target.parentNode.offsetLeft
    ]
}


/**
 * Calculates the required new values for resizing the windows. Resizing from the top/left edge is equivalent to moving and resizing under the hood
 * @listens mousemove
 * @param {Event} event
 * @method windowResize
 * @name Internal:windowResize
 */
function windowResize(event) {
    //event.preventDefault()
    if (!mouseDown) return;

    if (targetWindow == null) return;
    if (initialMouseX == null || initialMouseY == null) return;

    function top(target) {
        let newTopTop = originalWindow[2] - (initialMouseY - event.clientY);
        let newTopHeight = originalWindow[1] + (initialMouseY - event.clientY);
        if (newTopHeight < target.dataset.minHeight) return
        if (newTopTop < 0 || newTopTop > window.innerHeight - 30) return
        target.style.height = newTopHeight + "px"
        target.style.top = newTopTop + "px"
    }
    function left(target) {
        let newval = originalWindow[0] - (initialMouseX - event.clientX);
        if (newval < target.dataset.minWidth) return;
        target.style.width = newval + "px";
    }
    function bottom(target) {
        let newBottomHeight = originalWindow[1] - (initialMouseY - event.clientY)
        if (newBottomHeight < target.dataset.minHeight) return
        target.style.height = newBottomHeight + "px"
    }
    function right(target) {
        let newRightLeft = originalWindow[3] - (initialMouseX - event.clientX);
        let newRightWidth = originalWindow[0] + (initialMouseX - event.clientX);
        if (newRightWidth < target.dataset.minWidth) return;
        target.style.width = newRightWidth + "px";
        target.style.left = newRightLeft + "px";
    }

    switch (resizeDirection) {
        case "top":
            top(targetWindow)
            break
        case "left":
            right(targetWindow);
            break
        case "bottom":
            bottom(targetWindow);
            break
        case "right":
            left(targetWindow)
            break
        case "topleft":
            top(targetWindow);
            right(targetWindow)
            break
        case "topright":
            top(targetWindow)
            left(targetWindow);
            break
        case "bottomleft":
            bottom(targetWindow);
            right(targetWindow)
            break
        case "bottomright":
            bottom(targetWindow);
            left(targetWindow);
            break
    }


}



/**
 * Resets all initial values because they are no longer needed.
 * @listens mouseup
 * @param {Event} event
 * @method endResize
 * @name Internal:endResize
 */
function endResize(event) {
    // setTimeout(() => { // why was here a 1ms timeout i dont get it
    targetWindow = null;
    initialMouseX = null;
    initialMouseY = null;
    mouseDown = false;
    resizeDirection = null;
    originalWindow = null;
    // }, 1);
}



// change this to use data tags
/**
 * Is mouse on the taskbar window preview?
 * @type Boolean
 * @member mouseOnPreview
 * @name Internal:mouseOnPreview
 */
let mouseOnPreview = false;
/**
 * Is mouse on button
 * @type Boolean
 * @member onButton
 * @deprecated
 * @name Internal:onButton
 */
let onButton = false;

/**
 * Adds a small preview to the taskbar icon on hover by creating a deep copy of the window at the time of the hover event, then scaling it down via CSS scale to preserve aspect ratio, while also retaining the layout of the window
 * The HTML spec sadly lacks widespread support for <code>&lt;element&gt;</code>, so a deep copy has to be created.
 * It is not a live preview, doing so would mean a massive performance hit.
 * @param {MouseEvent} mouseover
 * @method taskbarSymbolAddWindowPreview
 * @name Internal:taskbarSymbolAddWindowPreview
 * @todo Change dimensions of minimised window after sliding off-screen and finishing the animation so that the preview has the correct dimensions
 * @todo Aero-like effect where other windows get put in a glass-like state when hovering over a taskbar icon to emphasise what window is being selected
 * @todo Fix bug, where additional previews are laid on top of each other when moving mouse back from the small preview to the taskbar button
 */
function taskbarSymbolAddWindowPreview({ target }) {
    // if preview already present dont show
    console.log("new?", target.dataset.previewactive)

    if (target.dataset.previewactive == "true") {
        console.log("already there")
        setTimeout(() => {
            target.dataset.previewactive = true;
        }, 1);
        return
    }

    target.dataset.previewactive = true;
    // get id of window
    const parentid = `window-${target.dataset.appid}-${target.dataset.instanceid}-${target.dataset.windowid}`;
    // get parent window
    const windowObject = document.getElementById(parentid)
    // get windowbody, maybe should be windowObject.querySelector or something but
    const windowbody = document.getElementById(`${parentid}.body`);
    // grabbing the stylesheet (raw)
    const style = windowObject.querySelector("style")
        .innerHTML
        .replace(parentid, `taskbar-${parentid}-preview > div `)
    // grab window title
    const title = document.getElementById(`${parentid}-header-title`).innerHTML
    // make deep copy of windowbody
    let clone = windowbody.cloneNode(true)
    // set height of windowbody copy:
    let { height, width } = getComputedStyle(windowbody)
    clone.style.position = "relative"
    clone.style.height = height;
    clone.style.width = width;
    Array.from(clone.querySelectorAll("[data-open='true']")).forEach(a => a.dataset.open = "false")
    height = parseInt(height);
    width = parseInt(width)
    const xScale = 200 / width; // this should probably not be hardcoded
    const yScale = 120 / height;
    clone.id = ""
    // the smaller value should be the scaling factor
    const scalingFactor = Math.min(xScale, yScale);
    // make div with class preview and child element being the copy AND the cover, see below
    let preview = create({
        tagname: "div",
        classList: ["preview"],
        id: `taskbar-${parentid}-preview`,
        style: `height: ${height * scalingFactor}px !important; width: ${width * scalingFactor}px !important`,
        childElements: [
            {
                tagname: "div",
                style: `scale: ${scalingFactor}; transform-origin: top left; pointer-events: none;`,
                childElements: [clone]
            }
        ],
        eventListener: {
            mouseover: previewMouseIn,
            mouseout: previewMouseOut
        },
        dataset: {
            title: title
        }
    })
    const newstyle = create({
        tagname: "style",
        innerHTML: style
    })
    // append to symbol
    target.append(preview, newstyle)
    // with timeout of 1ms, add "active" class, has to have a timeout because otherwise, the active class is already present for some reason, meaning the animation doesnt work
    setTimeout(() => { preview.classList.add("active") }, 1);
}

/**
 * Changes mouseOnPreview state to ensure that the preview stays visible, when hovering over the preview instead of the button
 * @param { MouseEvent } e
 * @method previewMouseIn
 * @name Internal:previewMouseIn
 */
function previewMouseIn(e) {
    e.stopPropagation();
    e.target.parentNode.dataset.previewactive = true;
    mouseOnPreview = true
}

/**
 * Change mouseOnPreview state and delete preview when no longer hovering over button or preview
 * @param { MouseEvent } e
 * @method previewMouseOut
 * @name Internal:previewMouseOut
 */
function previewMouseOut(e) {
    e.stopPropagation();
    e.target.parentNode.dataset.previewactive = false;
    mouseOnPreview = false;
    taskbarSymbolDeleteWindowPreview({ target: e.target.parentNode })
}
// TO DO: change minimising animation to end back on normal scale
/**
 * After a brief delay, delete the preview if the mouseOnPreview state is false.
 * @param { Event } e
 * @method taskbarSymbolDeleteWindowPreview
 * @name Internal:taskbarSymbolDeleteWindowPreview
 * @todo Fix bug that creates new preview but doesnt delete the old one when moving mouse back
 */
function taskbarSymbolDeleteWindowPreview({ target }) {

    target.dataset.previewactive = false;
    setTimeout(() => {
        if (target.dataset.previewactive != "true") {
            if (target.childNodes.length) {
                target.childNodes.forEach(a => {
                    a.classList.remove("active");
                    setTimeout(() => {
                        a.remove()
                    }, 100);
                })
            }
        }
    }, 100);
}

/**
 * Handles the click event when focussing a window. Passes the target window to Internal:activeWindowChangeTarget
 * @see Internal:activeWindowChangeTarget
 * @param { MouseEvent } event
 * @listens MouseEvent
 * @method activeWindowChange
 * @name Internal:activeWindowChange
 */
function activeWindowChange(event) {
    loseFocus(event)
    event.stopPropagation();
    let newActive = getParentWindow(event.target)
    activeWindowChangeTarget(newActive);
}

/**
 * Sets a window as the new active window, changing the draworder bringing the active window to the front while preserving the order of the other windows.
 * @param { HTMLElement } el The new active window.
 * @method activeWindowChangeTarget
 * @name Internal:activeWindowChangeTarget
 */
function activeWindowChangeTarget(el) {
    // Grabs list of all windows attached to any app instance
    let winArr = makeWindowsArray();
    // Removes the new active element
    winArr = winArr.filter(a => a.id != el.id);
    // pushes the new active to end of array
    winArr.push(el)
    for (let i in winArr) {
        winArr[i].style["z-index"] = i
        winArr[i].dataset.active = false;
    }
    el.dataset.active = true;
    updateTaskbar(el.dataset.appid, el.dataset.instanceid, el.dataset.windowid)
}

/**
 * Grabs all windows (DOM-Elements) that belong to app instances, returns them sorted by draw order
 * @method makeWindowsArray
 * @name Internal:makeWindowsArray
 * @returns {Array} Array of DOM elements
 */
function makeWindowsArray() {
    if (appInstances == {}) return 0;
    let n = [];
    for (let a in appInstances) {
        n.push(...appInstances[a].elements.map(a => a.windowObject));
    }
    n.sort((a, b) => a.style["z-index"] - b.style["z-index"])
    return n;
}

/**
 * Updates the taskbar when the active window is changed, highlighting the new active window's task bar icon
 * @param {(String|Number)} app 12 digit number used for unique identification
 * @param {(String|Number)} instance 12 digit number used for unique identification
 * @param {(String|Number)} window 12 digit number used for unique identification
 * @method updateTaskbar
 * @name Internal:updateTaskbar
 */
function updateTaskbar(app, instance, window) {
    for (let a in appInstances) {
        for (let w in appInstances[a].elements) {
            appInstances[a].elements[w].taskbaricon.dataset.active = "false";
        }
    }
    document.querySelector(`taskbar-button[data-appid="${app}"][data-instanceid="${instance}"][data-windowid="${window}"]`).dataset.active = true;
}

/**
 * If a button in the taskbar is clicked, this will change the draw order of windows, bringing the window belonging to the button that was clicked to the front, unless it already is in front, then it gets minimised
 * @param {Event} e Event passthrough
 * @param {(Number|String)} windowid 12-digit number used to identify Instance Window
 * @param {(Number|String)} instanceid 12-digit number used to identify App Instance
 * @param {(Number|String)} appid 12-digit number used to identify App
 * @method taskbarIconClick
 * @name Internal:taskbarIconClick
 */
function taskbarIconClick(e, windowid, instanceid, appid) {
    const w = getElement(`window-${appid}-${instanceid}-${windowid}`)
    if (w.dataset.minimised == "false") {
        if (w.dataset.active == "true") {
            w.dataset.minimised = "true"
        } else {

            activeWindowChangeTarget(w)
        }
    } else {
        w.style.transition = "all 0.05s"
        setTimeout(() => { w.style.transition = null }, 50)
        activeWindowChangeTarget(w)
        w.dataset.minimised = "false"
    }
}

export { Window, getParentWindow, addAppInstanceObjectRef, maximiseWindow }
