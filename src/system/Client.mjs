/**
 * Served to client on page load. Handles Client/User-related tasks and settings
 * @file Client.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:Client
 * @see <a href="./client.Client_Client.html">Module</a>
 */
/**
 * Served to client on page load. Handles Client/User-related tasks and settings
 * @file Client.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:Client
 * @see <a href="./client.Client_Client.html">Module</a>
 * @namespace ClientCode
 */
/**
 * @module Client
 * @memberof client
 * @description Client.mjs handles Client data and user settings on the client side
 * @name Client:Client
 * @author Smittel
 */
import { Client as emit } from "./Connect.mjs"

/**
 * Handles incoming data from the server relating to client settings and user data
 * @method handle
 * @param {Object} data 
 * @name Export:handle
 */
function handle(data) {
    console.log("Client", data)
}



export {handle}