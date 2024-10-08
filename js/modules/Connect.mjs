/**
 * Served to client on page load. Handles communication with the server.
 * @file Connect.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:Connect
 * @see <a href="./client.Client_Connect.html">Module</a>
 */
/**
 * Served to client on page load. Handles communication with the server.
 * @file Connect.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:Connect
 * @see <a href="./client.Client_Connect.html">Module</a>
 * @namespace ClientCode
 */
/**
 * @module Connect
 * @memberof client
 * @description Handles server connection and communication
 * @name Client:Connect
 * @author Smittel
 */

/**
 * @borrows handle, cookieLogin from Auth.mjs
 * @import handle
*/
import {handle as auth, cookieLogin as cookie} from "./connect/Auth.mjs"
import {handle as client} from "./connect/Client.mjs"
import {handle as system} from "./connect/System.mjs"
import {handle as app} from "./connect/App.mjs"
import { DialogBox } from "../components/ui.mjs"

const isSystem = (io !== undefined)
setTimeout(() => {
    console.log(isSystem)
}, 10000);
let App, System, Client, Auth;

/**
 * @constant socket Socket.io instance
 * @name Internal:socket
 */
if (isSystem) {
const ip = globalThis.process!==undefined?"http://localhost:8080":undefined
const socket = io(ip);

/**
 * Sends system data back to the server via a websocket.
 * System data includes general commands and requests to the server, like starting an app.
 * @example {
 *  req: "request_name",
 *  data: {
 *      // additional data
 *  }
 * }
 * @method System
 * @param {Object} data
 * @name Export:System
 */
System = function (data) {
    // console.log(data)
    socket.emit("System", data)
}

/**
 * Sends authentification data back to the server via a websocket. Used for logging in and out, signing up, verifying identity, handling cookies
 * @example {
 *  req: "request_name",
 *  data: {
 *      // additional data
 *  }
 * }
 * @method Auth
 * @param {Object} data
 * @name Export:Auth
 */
Auth = function (data) {
    socket.emit("Auth", data)
}

/**
 * Sends Client data back to the server via a websocket. Client data includes user settings, details and similar
 * @example {
 *  req: "request_name",
 *  data: {
 *      // additional data
 *  }
 * }
 * @method Client
 * @param {Object} data
 * @name Export:Client
 */
Client = function (data) {
    socket.emit("Client", data)
}
/**
 * Sends app data back to the server via a websocket. Used for communication between apps and the server. Currently only accessible by system level apps.
 * @example {
 *  req: "request_name",
 *  data: {
 *      // additional data
 *  }
 * }
 * @method App
 * @param {Object} data
 * @name Export:app
 */
App = function (data) {
    console.log("emits", data)
    socket.emit("App", data)
}

cookie()
// console.log("system:", system.toString())
/**
 * @listens System
 * @callback System:handle
 * @name Server:System
 * @see Client:System
 */
socket.on("System", system)
/**
 * @listens Auth
 * @callback Auth:handle
 * @name Server:Auth
 * @see Client:Auth
 */
socket.on("Auth",   auth)
/**
 * @listens Client
 * @callback Client:handle
 */
socket.on("Client", client)
/**
 * @listens App
 * @callback App:handle
 * @name Server:App
 * @see Client:App
 */
socket.on("App",    app)
/**
 * @listens disconnect
 * @callback Error:errorDialog
 */
socket.on("disconnect", () => {
    const error = new DialogBox(
        "Connection lost.",
        "Connection to the server has been lost.\nTry again?",
        4,
        [{
                text: "Retry",
                call: () => {console.log("retry")},
                main: true
        }, {
                text: "Abort",
                call: () => {console.log("abort")},
                main: false
        }],
        document.body,
        false

    )
})
} else {
    System = function () {throw new Error("Not available in App context")}
    App = function () {throw new Error("Not available in App context")}
    Auth = function () {throw new Error("Not available in App context")}
    Client = function () {throw new Error("Not available in App context")}
}
export {System, App, Auth, Client}
