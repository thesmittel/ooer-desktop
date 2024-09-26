
/**
 * Main server script
 * @todo Replace with something that isnt javascript. Ideally rust with rust-socketio or something comparable, but this will do for now
 * @file server.js
 * @author Smittel
 * @copyright 2024
 * @name Server:main
 * @requires express
 * @requires http
 * @requires fs
 * @requires socket.io
 * @requires url
 * @requires Server:Auth
 * @requires Server:System
 * @requires Server:App
 * @requires Server:Client (Not yet implemented)
 */

/**
 * Main server script
 * @file server.js
 * @author Smittel
 * @copyright 2024
 * @name Server:main
 * @see <a href="./server.Server_main.html">Server:main</a>
 * @namespace ServerCode
 */
/**
 *
 * @module Server
 * @memberof server
 * @description Main server script
 * @name Server:main
 * @author Smittel
 * @requires express
 * @requires http
 * @requires fs
 * @requires socket.io
 * @requires url
 * @requires Server:Auth
 * @requires Server:System
 * @requires Server:App
 * @requires Server:Client (Not yet implemented)
 */

import * as express from "express"
import * as http from "http"
import * as fs from "fs"
import {Server, Socket} from "socket.io"
import * as url from 'url';
import * as Auth from "./server/modules/Auth.js"
import * as System from "./server/modules/System.js"
import * as App from "./server/modules/App.js"


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

console.log(__dirname)

const app = express.default();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static(__dirname + '/client/public'));

let users = JSON.parse(fs.readFileSync("./server/users/userdata.json").toString()).users


app.get('/', (req, res) => {
	res.sendFile(__dirname + '/client/index.html');
});

app.get('/media/images', (req, res) => {
    res.sendFile(__dirname + "/server/media/images/" + req.query.i)
})

app.get('/media/icons', (req, res) => {
    res.sendFile(__dirname + "/server/media/icons/" + req.query.i)
})

app.get('/media/desktopicons', (req, res) => {
    if (req.query.i.match(/^\d{12}$/g)) {
        res.sendFile(__dirname + "/server/applications/custom/" + req.query.i + "/icon.png")
        return
    }
    res.sendFile(__dirname + "/server/applications/system/" + req.query.i + "/icon.png")
})

/**
 * Handles authentication requests and calls the relevant methods in the Auth module
 * @see <a href="./server.Server_Auth.html">Auth module</a>
 * @param { Socket! } socket
 * @param { {req: String, data: (Map<String, any>|String)}! } data
 * @method authReq
 * @name Internal:authReq
 */
function authReq(socket, data) {
    let user;
    switch (data.req) {
        case "login":
            user = users.filter(a => a.username == data.data.username)[0];
            Auth.login(socket, data.data, user)
            break
        case "cookielogin":
            const cookie = data.data.split(";").map(a => a.split("="))
            const userid = cookie[0][1];
            const oldToken = cookie[1][1];

            const cookieuser = users.filter(a => a.id == userid)[0];
            if (cookieuser != null && cookieuser != undefined) Auth.loginwithcookie(socket, {id: userid, oldToken: oldToken}, cookieuser)
            break
        case "signupCheckUsernameAvailable":
            Auth.signupCheckUsernameAvailable(socket, users, data.data)
            break
        case "signupCheckEmailRegistered":
            Auth.signupCheckEmailRegistered(socket, users, data.data)
            break
        case "signup":
            console.log("ORIG", data.data)
            const username = Auth.signupCheckUsernameAvailable(socket, users, data.data.username)
            const email = Auth.signupCheckEmailRegistered(socket, users, data.data.email)
            const pwmatch = Auth.signupCheckPasswordMatch(socket, data.data)
            const pwreq = Auth.signupCheckPasswordRequirements(socket, data.data)
            if (username && email && pwmatch && pwreq) {
                Auth.signup(socket, data.data)
            }
            break;
        case "password_confirmation": {
            Auth.confirmPassword(socket, data);
            break;
        }
    }
}
/**
 * Handles application requests and calls the relevant methods in the App module
 * @see <a href="./server.Server_App.html">App module</a>
 * @param { Socket! } socket
 * @param { {req: String, data: (Map<String, any>|String)}! } data
 * @method appReq
 * @name Internal:appReq
 */
function appReq(socket, data) {
    switch(data.req) {
        case "fetch_app":
            App.grabApplication(socket, data.data)
            break
    }
}

/**
 * Handles client data requests and calls the relevant methods in the Client module
 * @see <a href="./server.Server_Client.html">Client module</a>
 * @param { Socket! } socket
 * @param { {req: String, data: (Map<String, any>|String)}! } data
 * @method clientReq
 * @name Internal:clientReq
 */
function clientReq(socket, data) {
    const req = data.name.split("\x00")
}

/**
 * Handles system requests and calls the relevant methods in the System module
 * @see <a href="./server.Server_System.html">System module</a>
 * @param { Socket! } socket
 * @param { {req: String, data: (Map<String, any>|String)}! } data
 * @method systemReq
 * @name Internal:systemReq
 */
function systemReq(socket, data) {
    console.log(data)
    switch(data.req) {
        case "heartbeat":
            socket.emit("System", {res: "heartbeat"})
            break
        case "fetch_app":
            console.log("fetch app")
            System.grabApplication(socket, data.data)
            break
    }
}


io.on('connection', (socket) => {
    Auth.addUnassignedSocket(socket);
    socket.on("disconnect", ()=>{Auth.removeSocket(socket)})
	socket.on("Auth", (data) => {authReq(socket, data)})
    socket.on("Client", (data) => {clientReq(socket, data)})
    socket.on("System", (data) => {systemReq(socket, data)})
    socket.on("App", (data) => {appReq(socket, data)})
})

server.listen(8080, () => {
    console.log('listening on *:8080');
});


/**
 * registers a user
 * @todo Put in Auth, requires synchronisation of user object or moving of user object to auth module entirely with requests being sent to the auth module for user info
 * @param { String } id
 * @param { String } username
 * @param { String } email
 * @method addUser
 * @name Export:addUser
 */
function addUser(id, username, email) {
    console.log(id, username, email)
    users.push({
        id: id,
        username: username,
        nickname: null,
        email: email,
        banner: null,
        avatar: null,
        status: "online",
        about: null
    })
    fs.writeFile("./users/userdata.json", JSON.stringify({users: users}), ()=>{})
}




export {addUser}
