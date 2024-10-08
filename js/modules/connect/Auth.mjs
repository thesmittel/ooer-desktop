/**
 * Served to client on page load. Handles Authentication.
 * @file Auth.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:Auth
 * @see <a href="./client.Client_Auth.html">Module</a>
 */
/**
 * Served to client on page load. Handles Authentication.
 * @file Auth.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:Auth
 * @see <a href="./client.Client_Auth.html">Module</a>
 * @namespace ClientCode
 */
/**
 * @module Auth
 * @memberof client
 * @description Auth.mjs handles login and authentification
 * @name Client:Auth
 * @author Smittel
 */
import { Auth as emit, System } from "../Connect.mjs"
import { openSignup, openLogin, openSettings, openProfile } from "../Handlers.mjs"
import { create } from "../Util.mjs"
import {ArgumentError, handlers} from "../system/Error.mjs"
import { addDesktop } from "./System.mjs"



let login = {}

/**
 * Called on load, checks if a session identification cookie is present, if so, it automatically logs in. <br>
 * @method cookieLogin
 * @name Export:cookieLogin
 */
function cookieLogin() {
    if (document.cookie.length > 0) {
        emit({req: "cookielogin", data: document.cookie})
    } else {
        loggedout();
    }


}


/**
 * Entrypoint for all authentification related data coming from the server, passed through Connect module.<br>
 * @see Client:Connect
 * @param {Object} data
 * @method handle
 * @name Export:handle
 */
function handle(data) {
    // console.log("in auth", data)
    if (data.error) {
        console.log(data.error)
        handlers[data.error.code](data.error);
        return;
    }
    if (data.response == "confirm-login") {
        if (document.querySelector("login-main")) {
            // console.log("confirmed login")
            const element = document.querySelector("login-main");
            element.dataset.hide = "true"
            setTimeout(() => {
                element.remove()
            }, 200);

        }
        loggedin(data.data);
    }
    if (data.response == "confirm-cookielogin") {
        // console.log("cookielogin")
        loggedin(data.data);
    }
    if (data.response == "confirm-usernameAvailable") {
        usernameAvailable()
    }
    if (data.response == "confirm-emailAvailable") {
        emailAvailable()
    }
    if (data.response == "confirm-legalemail") {
        validEmail()
    }
    if (data.response == "confirm-signup") {
        emit({
            req: "login",
            data: {
                username: data.data.username,
                password: data.data.password
            }
        })
    }
    if (data.response == "password-prompt-correct") {
        correctPasswordPrompt(data)
    }
    if (data.response == "password-prompt-incorrect") {
        incorrectPasswordPrompt(data)
    }
}



/**
 * Removes the error message for invalid email in signup.
 * @method validEmail
 * @name Internal:validEmail
 */
function validEmail() {
    const signup = document.querySelector("div#signup-container");
    signup.querySelector("div#signup-username-div").dataset.erroremail = "None"
}

/**
 * Removes the error message for unavailable username in signup
 * @method usernameAvailable
 * @name Internal:usernameAvailable
 */
function usernameAvailable() {
    const signup = document.querySelector("div#signup-container");
    signup.dataset.errorusername = "None";
}


/**
 * Clears the "Email already taken" error status
 * @method emailAvailable
 * @name Internal:emailAvailable
 */
function emailAvailable() {
    // console.log("email avb")
    const signup = document.querySelector("div#signup-container");
    signup.dataset.erroremail = "None";
}


/**
 * Logs out by deleting session cookie and sending a logout request to server, calls function that resets interface
 * @param {Event} event
 * @method userLogOut
 * @name Internal:userLogOut
 */
function userLogOut(event) {
    event.stopPropagation();
	emit({req: "logout", data: document.cookie})
	const cookies = document.cookie.split(";");

	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i];
		const eqPos = cookie.indexOf("=");
		const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	}

    loggedout();
	login = {}
	// openLogin({stopPropagation: ()=>{}})

}

/**
 * Server response: successful login. Changes appearance of start menu
 * @param {Object} data
 * @method loggedin
 * @name Internal:loggedin
 */
function loggedin(data) {
    /*
    data.desktop = {
        backgroundimage: url,
        backgroundsize: auto|contain|cover,
        backgroundposition: left|center|right top|center|bottom,

    }
    */
   data.desktop = {
    backgroundimage: "/media/images/iceland.jpg"
   }
   addDesktop(data.desktop, data.cache.desktop_symbols)
    let expire = new Date(data.expires).toUTCString()
    // console.log(new Date(Date.now()).toUTCString(), expire)
    const smtopbar =  document.querySelector("div#sm-topbar")
    smtopbar.dataset.login = "true"
    document.cookie = `userid=${data["user-id"]};expires=${expire};SameSite=Strict;secure`
	document.cookie = `token=${data.token};expires=${expire};SameSite=Strict;secure`
    // console.log(data)
	login = {id: data.id, token: data.token, expires: data.expires, cache: data.cache};
    smtopbar.innerHTML = "";

    let userpfp = data.cache.avatar?`/media/images/${data.cache.avatar}`:`/media/images/default.jpg`;

    smtopbar.append(
        create({
            tagname: "a",
            classList: ["settingsbutton"],
            dataset: {ignore: "startmenu"},
            eventListener: {click: openSettings},
            childElements: [
                {
                    tagname: "i",
                    classList: ["bx","bxs-cog", "bx-sm"],
                    dataset: {ignore: "startmenu"}
                }
            ]
        }),
        create({
            dataset: {ignore: "startmenu"},tagname: "div"}),
        create({
            tagname:"div",
            classList: ["centerelement"],
            dataset: {ignore: "startmenu"},
            eventListener: {
                click: openProfile
            },
            childElements: [
                {
                    tagname: "div",
                    classList: ["user-container"],
                    childElements: [
                        {
                            tagname: "div",
                            classList: ["nickname"],
                            innerText: data.cache.nickname || data.cache.username
                        },
                        {
                            tagname: "div",
                            classList: ["username"],
                            innerText: data.cache.username
                        }
                    ]
                },
                {
                    tagname: "div",
                    classList: ["userpfp"],
                    style: `background-image: url("${userpfp}");`,
                    eventListener: {
                        click: openProfile
                    },

                }
            ]
        }),
        create({
            tagname: "a",
            classList: ["settingsbutton"],
            eventListener: {click: userLogOut},
            dataset: {ignore: "startmenu"},
            childElements: [{
                tagname: "i",
                dataset: {ignore: "startmenu"},
                classList: ["bx", "bx-log-out", "bx-sm", "bx-flip-horizontal"]
            }]
        })
    )

}

/**
 * When user logs out, deletes desktop symbols as well as changing the start menu to the "logged out" state
 * @todo remove desktop symbols, close windows
 * @method loggedout
 * @name Internal:loggedout
 */
function loggedout() {
    openLogin({stopPropagation: ()=>{}})
    const smtopbar =  document.querySelector("div#sm-topbar")
    smtopbar.dataset.login = "false";
    smtopbar.dataset.ignore = "startmenu"
    smtopbar.innerHTML = "";
    smtopbar.append(
        create({tagname: "div", dataset: {ignore: "startmenu"}}),
        create({
            tagname: "input",
            type: "button",
            id: "signup",
            value: "Sign up",
            dataset: {ignore: "startmenu"},
            eventListener: {click: openSignup}
        }),
        create({
            tagname: "input",
            type: "button",
            id: "login",
            value: "Log in",
            dataset: {ignore: "startmenu"},
            eventListener: {click: openLogin}
        })
    )
    document.querySelectorAll("desktop-symbol").forEach(a => a.remove())
    document.querySelectorAll("div.window").forEach(a => a.remove())
}

/**
 * Returns the username from the userdata returned from the server, so as to not expose anything else<br>
 * <code>Export</code>
 * @returns Username
 * @method username
 * @name Export:username
 */
function username() {
    return login.cache.username
}


// List of callbacks for actions that require password confirmation
let requiresPassword = [];
function registerPasswordCallback(success, failure, promptWindow) {
    if (!success || !failure) throw new ArgumentError(undefined, registerPasswordCallback, "Needs both a success AND a failure callback");
    requiresPassword.push({success: success, failure: failure})
}

function correctPasswordPrompt(data) {
    for (let i = 0; i < requiresPassword.length; i++) {

    }
    requiresPassword.forEach(a => {a.success()})
    requiresPassword = []
}

function incorrectPasswordPrompt(data) {
    requiresPassword.forEach(a => {
        a.failure()
    })
}


export {handle, cookieLogin, username, registerPasswordCallback}
