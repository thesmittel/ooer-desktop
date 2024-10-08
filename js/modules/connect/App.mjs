/**
 * Served to client on page load. Handles app related tasks that are not system critical.
 * @file App.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:App
 * @see <a href="./client.Client_App.html">Module</a>
 */
/**
 * Served to client on page load. Handles app related tasks that are not system critical.
 * @file App.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:App
 * @see <a href="./client.Client_App.html">Module</a>
 * @namespace ClientCode
 */
/**
 * @module App
 * @memberof client
 * @description App.mjs handles application requests, manages apps, their instances and windows, creates windows as well as managing the task bar.
 * @name Client:App
 * @author Smittel
 */

import { App as emit } from "../Connect.mjs"
import { randomId } from "../Util.mjs";
import { Window, maximiseWindow } from "../app/Window.mjs"

/**
 * Receives data from the server directed at this module via the Connect module, serves as the connection between the two.
 * @method handle
 * @name Export:handle
 * @param {Object} data
 *
 */
function handle(res) {
    console.log("res", res)
    switch (res.response) {
        case "start_app":
            new App(res.data.id, res.data, res.data.permissions)
            break
        case "start_sysapp":
            new App(res.data.id, res.data, 2)
            break
        case "appdata":
            const { id } = res.data;
            if (appListeners[res.app] == undefined) return;
            if (appListeners[res.app][res.instance] == undefined) return
            appListeners[res.app][res.instance](res.data);
            break;
    }
}
/**
 * Holds an applications full identifier and their server data event callback as key-value pairs
 * @member appListeners
 * @name Internal:appListeners
 * @type Object
 * @todo Implement method for passing requested information to apps
 */
const appListeners = {}
/**
 * Allows system apps to register a callback function for server communication.
 * @param {String} id App-Instance-Window ID
 * @param {Function} func Callback
 * @method registerListener
 * @name Export:registerListener
 */
function registerListener(appid, instanceid, func) {
    if (appListeners[appid] == undefined) {
        appListeners[appid] = {}
    }
    if (appListeners[appid][instanceid] == undefined) {
        appListeners[appid][instanceid] = func
    }
}

function deleteListener(id, instanceid) {
    if (!appListeners[id][instanceid]) {
        throw new Error("No listener registered (Application: " + id + ", instance: " + instanceid + ")")
        return -1;
    }
    delete appListeners[id][instanceid]
}

/**
 * Holds instances of apps identified by their application ID and instance ID for unique identification
 * @member appInstances
 * @name Internal:appInstances
 * @type Object
 */
let appInstances = {}
// Sends
let appInstanceObjectRefSent = false;
/**
 * Returns a reference to the AppInstances object exactly once. Returns null for any subsequent requests.
 * @returns {Object|null}
 */
function getAppInstanceObjectRef() {
    let ret = appInstanceObjectRefSent?null:appInstances;
    appInstanceObjectRefSent = true;
    return ret;
}

// setTimeout(() => {
//     addAppInstanceObjectRef(appInstances)
// }, 1);




/**
 * @class Internal:App
 * @classdesc Constructs and manages windows for an app instance
 * @member App
 * @name Internal:App
 * @see <a href="./client.Client_App-App.html">Internal:App</a>
 * @todo Figure out how to document stuff inside these classes :/
 */
class App {
    #instance_id; // used for server responses to identify app instances - Random, "local"
    #app_id; // used to identify the app itself - determined by server
    // Both ids are needed to identify an app instance
    elements = []; // If an app uses multiple windows or applets, they are held here
    #version;
    #author;
    #name;
    #type;
    #icon;
    #about;
    #privilege;

    /**
     * Receives app config data from the server, initialises app instance, creates window
     * @constructor
     * @param { String } app_id App ID
     * @param { Object } data Server-provided application data
     * @param { Boolean } sys is system application?
     */
    constructor(app_id, data, sys) {
        this.#instance_id = randomId(12)
        this.#app_id = (sys === 2)?app_id:app_id.toString().padStart(12, "0");
        this.#author = data.config.author;
        this.#name = data.config.name;
        this.#type = data.config.type;
        this.#version = data.config.version;
        this.#about = data.about;
        this.#icon = data.icon;
        this.#privilege = sys
        appInstances[this.#instance_id] = this

        if (this.#type == "windowed") {
            for (let w of data.config.windows) {
                this.addWindow(w, sys)
            }
        }

        // this.addWindow({config: {}, "window_title": "test", content: {}, script: ""})

    }

    /**
     * Responsible for creating an instance of class window and saving it in the App instance
     * @param { Object } data Received from server, contains code, style, markup and miscellaneous config data
     * @param { Boolean } sys Determines level of access, true means it has access to the Client modules
     * @method addWindow
     * @public
     * @name Internal:App~addWindow
     */
    addWindow(data, sys) {
        const w = new Window(this.#instance_id, this.#app_id, data, this.#icon, sys)
        this.elements.push(w)
        w.show()

    }

    removeWindow(id) {
        this.elements = this.elements.filter(a => a.windowId != id)
    }

}


export { handle, maximiseWindow, registerListener, deleteListener, getAppInstanceObjectRef }
