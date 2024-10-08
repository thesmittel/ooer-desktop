import { App as emit } from "./modules/Connect.mjs";

class UnknownIdentifierError extends Error {
    constructor(t) {
        super(t)
    }
}

class InsufficientPermissionsError extends Error {
    constructor(t) {
        super(t)
    }
}
/*
    1 UPDATE_CONTENT
    2 SUMMON_WINDOW
    4 OPEN_DIALOG
    8 OVERRIDE_WINDOW
   16 SERVER_COMMUNICATION
   32 READ_NOTIFICATIONS
   64 SEND_NOTIFICATIONS
  128 ACCESS_CONTACTS
  256 READ_USERNAME
  512 CHANGE_USERNAME
 1024 READ_NICKNAME
 2048 CHANGE_NICKNAME
 4096 READ_SETTINGS
 8192 CHANGE_SETTINGS
16384 ACCESS_LOCAL_FILES
32768 ACCESS_CLOUD_FILES
65536 MAKE_GLOBAL_SHORTCUT
*/

function addApp({js, html, css, id, permissions, type}) {
    if (!apps[id]) {
        apps[id] = {
            type: type
        }
    }
}

const apps = {}
const apps_dummy = {
    "app_id": {
        "type": "Window, Background, Applet, Widget",
        "permission": {
            "UPDATE_CONTENT": true,  // changing elements within the window
            "SUMMON_WINDOW": true,   // Can spawn new windows
            "OVERRIDE_WINDOW": true, // Can change window properties
            "SERVER_COMMUNICATION": true,
            "OPEN_DIALOG": true,
            "READ_MESSAGES": false,
            "SEND_MESSAGES": false,
            "ACCESS_FILES": false,
            "CHANGE_SETTINGS": false,
            "CHANGE_STATUS": false,
            "CHANGE_USERNAME": false,
            "CHANGE_NICKNAME": false,

        },
        "instances": {
            "instance_id": {
                "summoned_windows": [],
                "message": (data) => { handleAppData({ "app": "~app_id", "instance": "~instance_id" }, data) },
                "worker": "webworker object"
            }
        }
    }
}

/**
 *
 * @param {Object} identifier
 * @param {String} identifier.app App ID, automatically added by worker communication functions
 * @param {String} identifier.instance Instance ID, the same app can have multiple independent instances, automatically added by worker communication functions
 * @param {Object} data Request type and relevant data, function will decide what to do with it
 */
function handleAppData(identifier, data) {
    if (!apps[identifier.app]) throw new UnknownIdentifierError("AppManager.handleAppData(): Could not find app for ID" + identifier.app + ".")
    if (!apps[identifier.app].instances[identifier.instance]) throw new UnknownIdentifierError("AppManager.handleAppData(): Could not find app instance for ID" + identifier.app + "~>" + identifier.instance + ".")

    if (!apps[identifier.app].permission[data.request.toUpperCase()]) throw new InsufficientPermissionsError(`AppManager.handleAppData(): App ${identifier.app} does not have ${data.request.toUpperCase()} permission`)
    switch (data.request) {
        case "summon_window": {
        }
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

export {registerListener, deleteListener}
