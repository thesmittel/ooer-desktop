/**
 * Server module: handles authentication
 * @file Auth.js
 * @author Smittel
 * @copyright 2024
 * @name Server:Auth
 * @see <a href="./client.Client_Auth.html">Server:Auth</a>
 * @requires Crypto
 * @requires fs
 * @requires Server:main.addUser
 * @todo Replace user password storage with a database instead of a JSON
 */
/**
 * Server module: handles authentication
 * @file Auth.js
 * @author Smittel
 * @copyright 2024
 * @name Server:Auth
 * @see <a href="./server.Server_Auth.html">Server:Auth</a>
 * @namespace ServerCode
 * @requires Crypto
 * @requires fs
 * @requires Server:main.addUser
 * @todo Replace user password storage with a database instead of a JSON
 */
/**
 * @module Auth
 * @memberof server
 * @description Server module: handles authentication
 * @name Server:Auth
 * @author Smittel
 * @requires Crypto
 * @requires fs
 * @requires Server:main.addUser
 * @todo Replace user password storage with a database instead of a JSON
 */

import * as Crypto from 'crypto'
import * as fs from "fs"
import { addUser } from '../../server.js';
import { Socket } from 'socket.io';


// this WILL be replaced
/**
 * Contains the password "database", a JSON, as of now
 * @todo Implement actual database before thinking about deploying anything
 * @member passwords
 * @name Internal:password
 * @type {{String: {"password": String, "salt": String}}}
 */

let passwords = JSON.parse(fs.readFileSync("./server/passworddb/passwords.json").toString()).passwords

/**
 * Contains all sessions, both ones that are assigned to a user, and those that arent.
 * @member sessions
 * @name Internal:sessions
 * @type { {assigned: Set<{
 * "user-id": String,
 * "token": String,
 * "cache": Map<String, any>,
 * "socket": Socket,
 * "expires": Number
 * }>, unassigned: Set<Socket>} }
 */
let sessions = {
    assigned: new Set(),
    unassigned: new Set()
};

/**
 * Keeps track of tokens and their associated users and expiration
 * @member tokens
 * @name Internal:tokens
 * @type {Array<{id: String, token: String, expires: Number}>}
 */
let tokens = []

/**
 * 1000ms interval deleting all expired tokens
 * @type {Interval}
 * @member tokenInterval
 * @name Internal:tokenInterval
 * @constant
 */
const tokenInterval = setInterval(() => {
    tokens = tokens.filter(a => a.expires < Date.now())
}, 1000)


/**
 * Generates a cryptographically random userID - probably not strictly necessary - that is guaranteed to be 12 digits long
 * @returns { String }
 * @method getNewUserID
 * @name Internal:getNewUserID
 */
function getNewUserID() {
    return Crypto.randomBytes(12).map(a => a % 10).join("").padStart(12, "0")
}

/**
 * Generates a cryptographically random token, 128 bytes long, converts to base64
 * @method tokenGen
 * @name Export:tokenGen
 * @returns { String }
 */
function tokenGen() {
    const token = Crypto.randomBytes(128).toString('base64');
    return token;
}

/**
 * Generates a cryptographically random salt thats unique to every user.
 * @todo Store salts separately from user password
 * @method saltGen
 * @method Internal:saltGen
 * @returns {String}
 */
function saltGen() {
    const salt = Crypto.randomBytes(64).toString("base64");
    return salt;
}

/**
 * Takes the salted password and hashes it
 * @todo !IMPORTANT: Scratch this idea entirely, either use bcrypt or Auth0
 * @param { String } saltedPassword salt + password
 * @returns {String} Hash
 * @method hashPassword
 * @name Internal:hashPassword
 */
function hashPassword(saltedPassword) {
    return Crypto.createHash('md5').update(saltedPassword).digest('hex');
}

/**
 * Creates new user.
 * @todo Overhaul completely, 'tis but a sketch
 * @param { Socket } socket
 * @param { {username: String, email: String, password: String, passwordconfirm: String} } param1
 * @method signup
 * @name Export:signup
 */
function signup(socket, {username, email, password, passwordconfirm}) {
    const salt = saltGen();
    const hashedPW = hashPassword(salt + password)
    let id = getNewUserID();
    while (passwords[id] != undefined) {
        id = getNewUserID();
    }
    passwords[id] = {password: hashedPW, salt: salt}
    fs.writeFile("./passworddb/passwords.json", JSON.stringify({passwords: passwords}), ()=> {})
    addUser(id, username, email)
    socket.emit("Auth", {response: "confirm-signup", data: {username: username, password: password}})
}

/**
 * Takes login information, compares, sends errors or confirmation based on input
 * @param { Socket } socket Socket Object
 * @param { {id: String, password: String } } data Provided login information
 * @param { Object } user Userdata fetched from database
 * @method login
 * @name Export:login
 */
function login(socket, data, user) {
    if (user == undefined) {
        socket.emit("Auth", {
            error: {
                code: "A-0001",
                message: "Invalid username"
            }
        })
        return;
    }
    if (passwords[user.id].password != hashPassword(passwords[user.id].salt + data.password)) {
        socket.emit("Auth", {
            error: {
                code: "A-0002",
                message: "Invalid password"
            }
        })
        return
    }
    loginconfirm(socket, data, user, false)
}

/**
 * Logs in automatically, if valid session token is still present.
 * @param { Socket } socket Socket Object
 * @param { {id: String, password: String } } data Provided login information
 * @param { Object } user Userdata fetched from database
 * @method loginwithcookie
 * @name Export:loginwithcookie
 */
function loginwithcookie(socket, data, user) {

    let check = tokens.filter(a => (a.id == data.userid && a.token == data.oldToken))
    if (check == null) return;
    tokens = tokens.filter(a => a.id != data.userid)
    loginconfirm(socket, data, user, true)
}

/**
 * Sends confirmation to user upon successful login, triggers clientside initialisation
 * @todo Make the login notification a little less aggressive
 * @param { Socket } socket Socket Object
 * @param { {id: String, password: String } } data Provided login information
 * @param { Object } user Userdata fetched from database
 * @method loginconfirm
 * @name Internal:loginconfirm
 */
function loginconfirm(socket, data, user, withcookie) {
    let currTime = Date.now();
	let expiretime = currTime + (30 * 60 * 1000); // Cookies expire after 30 minutes.
    const token = tokenGen();
    sessions.unassigned.delete(socket)
    sessions.assigned.add({
        "user-id": user.id,
        "token": token,
        "cache": user,
        "socket": socket,
        "expires": expiretime
    })
    tokens.push({
        id: user.id,
        token: token,
        expires: expiretime
    })
    socket.emit("Auth", {
        response: withcookie?"confirm-cookielogin":"confirm-login",
        data: {
            "user-id": user.id,
            "token": token,
            "cache": user,
            "expires": expiretime
        }
    })


    for (let s in user["desktop_symbols"]) {
        const curr = user["desktop_symbols"][s];
        let appconfig;
        if (curr.appid.match(/^\d{12}$/g)) {
            appconfig = JSON.parse(fs.readFileSync(`./server/applications/custom/${curr.appid}/config.json`))
            user["desktop_symbols"][s].description = appconfig.about;
            user["desktop_symbols"][s].contextmenu = appconfig.contextmenu
        } else {
            appconfig = JSON.parse(fs.readFileSync(`./server/applications/system/${curr.appid}/config.json`))
            user["desktop_symbols"][s].description = appconfig.about;
            user["desktop_symbols"][s].contextmenu = appconfig.contextmenu
        }
    }

    socket.emit("System", {res: "desktop-symbols", data: user["desktop_symbols"]})
    socket.emit("System", {res: "notification", data: {icon: "logo.png", title: "congratulations.", text: "Ya managed to log in. proud of ya, bozo"}})

}

/**
 * When a connection closes, this removes the socket from the tracker
 * @param { Socket } socket
 * @method removeSocket
 * @name Export:removeSocket
 */
function removeSocket(socket) {
    let wasUnassigned = sessions.unassigned.delete(socket);
    if (wasUnassigned) return;
    let tmp = Array.from(sessions.assigned);
    let obj = tmp.filter(a => a.socket == socket)[0]
    sessions.assigned.delete(obj)
}

/**
 * When a new connection is established, the socket object is added to the sessions tracker. It will be unassigned, until the user logs in or is logged in automatically.
 * @param { Socket } socket
 * @method addUnassignedSocket
 * @name Export:addUnassignedSocket
 */
function addUnassignedSocket(socket) {
    sessions.unassigned.add(socket)
}


/**
 * Checks if the username is available, sends errorcode, when it is not, else confirmation
 * @param { Socket } socket
 * @param { Object } users
 * @param { Object } data
 * @method signupCheckUsernameAvailable
 * @name Export:signupCheckUsernameAvailable
 */
function signupCheckUsernameAvailable(socket, users, data) {
    const user = users.filter(a => a.username.toLowerCase() == data.toLowerCase() )[0];
    if (user) {
        socket.emit("Auth", {
            error: {
                code: "A-0003",
                message: "Username taken"
            }
        })
    } else {
        socket.emit("Auth", {response: "confirm-usernameAvailable"})
    }
    return (user == null)
}

/**
 * Checks if a given email is already registered. Yes: Error, No: confirm
 * also checks validity of email address (only by syntax, not my checking if it exists.)
 * @param { Socket } socket
 * @param { Object } users
 * @param { Object } data
 * @method signupCheckEmailRegistered
 * @name Export:signupCheckEmailRegistered
 */
function signupCheckEmailRegistered(socket, users, data) {
    if (data == undefined || data == "") {
        socket.emit("Auth", {response: "confirm-emailAvailable"})
        return true
    };
    const user = users.filter(a => a.email == data)[0];
    if (user) {
        socket.emit("Auth", {
            error: {
                code: "A-0004",
                message: "Email address already registered"
            }
        })
    } else {
        socket.emit("Auth", {response: "confirm-emailAvailable"})
    }
    return (user == null && signupCheckValidEmail(socket, data))
}

/**
 * Checks if passwords match, yes: confirm, no: error
 * @param { Socket } socket
 * @param { Object } users
 * @param { Object } data
 * @method signupCheckPasswordMatch
 * @name Export:signupCheckPasswordMatch
 */
function signupCheckPasswordMatch(socket, {password, passwordconfirm}) {
    if (password != passwordconfirm) {
        socket.emit("Auth", {error: {
            code: "A-0006",
            message: "Passwords don't match"
        }})
    }
    return (password == passwordconfirm)
}

/**
 * Checks if passwords meets requirement, yes: confirm, no: error
 * @param { Socket } socket
 * @param { Object } users
 * @param { Object } data
 * @method signupCheckPasswordRequirements
 * @name Export:signupCheckPasswordRequirements
 */
function signupCheckPasswordRequirements(socket, {password}) {
    if (password == undefined || password == "") socket.emit("Auth", {error: {
        code: "A-0007",
        message: "Password required"
    }})
    console.log(password)
    const length = (password.length >= 8);
    const uppercase = password.match(/[A-Z]/g) != null;
    const lowercase = password.match(/[a-z]/g) != null;
    const numbers = password.match(/[0-9]/g) != null;
    const special = password.match(/[*.!@$%^&(){}\[\]:;<>,.?\/~_+\-=|\]§´`#'°]/g) != null;
    let metRequirements = 0;
    metRequirements += uppercase;
    metRequirements += lowercase;
    metRequirements += numbers;
    metRequirements += special;
    if (!length || (metRequirements < 3)) {
        socket.emit("Auth", {error: {
            code: "A-0005",
            message: "Password criteria not met"
        }})
    }
    return (length && (metRequirements >= 3))
}

/**
 * Called by signupCheckEmailRegistered()
 * uses regex to check if input is a possible email address. Does not confirm if it is in use. Emits error when it doesnt meet the standard
 * @param { Socket } socket
 * @param { string } email
 * @method signupCheckValidEmail
 * @name Internal:signupCheckValidEmail
 */
function signupCheckValidEmail(socket, email) {
    if (email == "" || email == undefined) return true
    let extract = email.match(/[^\s.{2,}]{2,}@\S+\.\S{2,}/)
    if (extract == null) {
        socket.emit("Auth", {error: {
            code: "A-0008",
            message: "Invalid Email address"
        }})
        return false
    }
    extract = extract[0];
    if (extract.length != email.length) {
        socket.emit("Auth", {error: {
            code: "A-0008",
            message: "Invalid Email address"
        }})
        return false
    }
    socket.emit("Auth", {response: "confirm-legalemail"})
    return true
}

function confirmPassword(socket, data) {
    // console.log(socket)
    const user = [...sessions.assigned].filter(a => a.socket == socket)[0];
    console.log(user.cache.id, data.password)
    const passwordInDatabase = passwords[user.cache.id].password
    const hashedUserProvidedPW = hashPassword(passwords[user.cache.id].salt + data.password)
    console.log(passwordInDatabase, hashedUserProvidedPW)
    if (passwordInDatabase == hashedUserProvidedPW) {
        socket.emit("Auth", {response: "password-prompt-correct"})
    } else {
        socket.emit("Auth", {response: "password-prompt-incorrect"})
    }

}

export {confirmPassword, login, tokenGen, addUnassignedSocket, removeSocket, loginwithcookie, signup, signupCheckUsernameAvailable, signupCheckEmailRegistered, signupCheckPasswordMatch, signupCheckPasswordRequirements}
