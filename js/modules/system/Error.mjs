/**
 * Served to client on page load. Handles Errors and Dialogs
 * @file Error.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:Error
 * @see <a href="./client.Client_Error.html">Module</a>
 */
/**
 * Served to client on page load. Handles Errors and Dialogs
 * @file Error.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:Error
 * @see <a href="./client.Client_Error.html">Module</a>
 * @namespace ClientCode
 */
/**
 * @module Error
 * @memberof client
 * @description Error.mjs parses error codes returned from the server as well as generating error messages
 * @name Client:Error
 * @author Smittel
 */

import { create } from "../Util.mjs";

function invalidCredentials(message) {
    let cont = document.querySelector("div#login-container")
    console.log(message.message)
    if (!cont) return;
    cont.dataset.error = message.message;
}

function emailTaken({ code, message }) {
    const signup = document.querySelector("div#signup-container");
    signup.dataset.erroremail = code;
    signup.querySelector("div#signup-email-div").dataset.erroremail = message
}

function usernameTaken({ code, message }) {
    const signup = document.querySelector("div#signup-container");
    signup.dataset.errorusername = code;
    signup.querySelector("div#signup-username-div").dataset.errorusername = message
}

function passwordsDontMatch({ code, message }) {
    const signup = document.querySelector("div#signup-container");
    signup.dataset.errorpassword = code
    signup.querySelector("div#signup-password-div").dataset.errorpassword = message
}

function criteriaNotMet(data) {
    const signup = document.querySelector("div#signup-container");
    signup.querySelector("#password-hint").dataset.visible = true;
}

function invalidEmail({ code, message }) {
    const signup = document.querySelector("div#signup-container");
    signup.dataset.erroremail = code
    signup.querySelector("div#signup-email-div").dataset.erroremail = message
}

function passwordRequired({ code, message }) {
    setTimeout(() => {
        const signup = document.querySelector("div#signup-container");
        signup.dataset.errorpassword = code
        signup.querySelector("div#signup-password-div").dataset.errorpassword = message
    }, 1);

}

function invalidUsername({ code, message }) {
    const signup = document.querySelector("div#signup-container");
    signup.dataset.errorusername = code
    signup.querySelector("div#signup-username-div").dataset.errorusername = message
}

function connectionTimedOut(data) {
    // Display error message
}

const symbols = [
    "<box-icon color='#37f' size='lg' name='alarm-exclamation'></box-icon>", // Alarm, Clock, Timer
    "<box-icon name='info-circle' size='lg' color='#5ae'></box-icon>", // Info
    "<box-icon name='help-circle'size='lg'color='#3ae'></box-icon>", // Question
    "<box-icon name='error' size='lg' color='#ec2'></box-icon>", // Exclamation
    "<box-icon color='#ea1425' size='lg' name='x-circle'></box-icon>" // Error (Critical)

]

function errorDialog({ title, description, type, buttons, blocked, parent }) {
    console.log(type, symbols[type])
    /*
    {
        title: String,
        description: String,
        type: Number, |INFO:0, QUESTION:1, WARN:2, CRITICAL:3|
        buttons: [
            {
                text: "Button Text",
                call: function,
                main: boolean, |determines style of button|
            }
        ],
        blocked: bool, |Application blocked?|
        parent: DOMElement |Where does the error belong?|
    }
    */
    // const symbols = [
    //     `<i class="fa-solid fa-circle-info fa-xl"></i>`,
    //     `<i class="fa-regular fa-circle-question fa-xl"></i>`,
    //     `<i class="fa-solid fa-triangle-exclamation fa-xl"></i>`,
    //     `<i class="fa-solid fa-circle-xmark fa-xl"></i>`
    // ]
    const symbolColors = ["#28f", "#82c", "#eb3", "#e31"];
    function makeButtons(a) {
        const b = {
            tagname: "error-button",
            innerHTML: a.text,
            eventListener: {"click": a.call},
            dataset: {main: a.main == true}
        }
        return b;
    }
    const error = create({
        tagname: "error-box",
        dataset: {
            title: title
        },
        childElements: [
            {
                tagname: "div",
                classList: ["container"],
                childElements: [
                    {
                        tagname: "div",
                        classList: ["error-icon"],
                        innerHTML: symbols[type],
                        style: `color: ${symbolColors[type]}`
                    },
                    {
                        tagname: "div",
                        classList: ["error-description"],
                        childElements: [
                            {
                                tagname: "pre",
                                innerHTML: description
                            }
                        ]
                    },
                    {
                        tagname: "div",
                        classList: ["error-buttons"],
                        childElements: buttons.map(makeButtons)
                    }
                ]
            }
        ]
    })
    parent.append(error)
}

/**
 * handlers defines functions necessary to handle error codes.
 * These errorcodes, or more accurately status codes, are limited for now, only explicitly marking which module threw them.
 * The end goal is to assign numbers to different concepts, for example:
 * <code> A-0001 </code> will turn into <code> A-LG-IC-U </code> meaning Auth: Login-Invalid Credentials: Username<br>
 * However, they will probably still be converted back to collections of numbers
 * @member handlers
 */
const handlers = {
    "A-0001": invalidCredentials, // A-LG-IC-U Auth; Login; invalid credentials: Username
    "A-0002": invalidCredentials, // A-LG-IC-P Auth; Login; invalid credentials: Password
    "A-0003": usernameTaken,      // A-SU-NA-U Auth: Signup, not available: Username
    "A-0004": emailTaken,         // A-SU-NA-E Auth: Signup, not available: Email
    "A-0005": criteriaNotMet,     // A-SU-II-C Auth; Signup; Invalid Input: Password Criteria not met
    "A-0006": passwordsDontMatch, // A-SU-II-M Auth; Signup; Invalid Input: Passwords dont match
    "A-0007": passwordRequired,   // A-SU-II-P Auth; Signup; Invalid Input: No Password entered
    "A-0008": invalidEmail,       // A-SU-II-E Auth; Signup; Invalid Input: Invalid Email
    "A-0009": invalidUsername,    // A-SU-II-U Auth; Signup; Invalid Input: Invalid Username
    "S-0001": connectionTimedOut  // S-SC-CTO  System; Server Connection; Connection timed out
}


class ArgumentError extends Error {
    constructor(obj, func, text) {
        super(errorFormatter(obj,func,text))
    }
}

class ValueError extends Error {
    constructor(obj, func, text) {
        super(errorFormatter(obj,func,text))
    }
}

class AutoTypeError extends Error {
    constructor(origin, expectedType, name, value) {
        super(`${origin}: Value ${name} must be ${expectedType}, got ${value}: ${typeof value}`)
    }
}

function errorFormatter(obj, func, text) {
    console.log(obj, func, text)
    return `${obj?.constructor?.name ? obj.constructor.name + "." : ""}${typeof func == "function" ? func.toString().match(/.*?\)(?= *{)/)[0].trim() : func}: ${text}`

}

export { handlers, errorDialog, ArgumentError, ValueError, AutoTypeError }
