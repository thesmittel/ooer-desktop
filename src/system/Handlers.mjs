/**
 * Served to client on page load. Contains various eventListeners
 * @file Handlers.mjs
 * @author Smittel
 * @copyright 2024
 * @name UI:Handlers
 * @see <a href="./client.Client_Handlers.html">Module</a>
 */
/**
 * Served to client on page load. Contains various eventListeners
 * @file Handlers.mjs
 * @author Smittel
 * @copyright 2024
 * @name UI:Handlers
 * @see <a href="./client.Client_Handlers.html">Module</a>
 * @namespace ClientCode
 */
/**
 * @module Handlers
 * @memberof client
 * @description Handlers.mjs is a collection of eventListener functions for various tasks
 * @name UI:Handlers
 * @author Smittel
 */
import * as Util from "../modules/Util.mjs";
import * as Server from "../modules/Connect.mjs"
import {handlers} from "./Error.mjs"
import { ContextMenu } from "../components/ui.mjs";
import { currentDesktop } from "./System.mjs";

const hub = document.querySelector("desktop-hub")

document.querySelector("taskbar-button#home").addEventListener("click", openStartmenu)
document.querySelector("taskbar-button#search").addEventListener("click", openSearch)
document.querySelector("div#desktop-hub-close").addEventListener("click", closeHub)
document.querySelector("div#desktop-hub-settings").addEventListener("click", (e) => {
    closeHub()
    openSettings(e)
})

let toHubClose;
function closeHub() {
    hub.dataset.open = false;
    toHubClose = setTimeout(() => {
        hub.remove();
        toHubClose = undefined;
    }, 100);
}

const pressedFKeys = {
    "Shift": false,
    "Control": false,
    "Alt": false,
    "Escape": false,
    "Tab": false,
    "CapsLock": false,
    "AltGraph": false
}
function documentKeyDown(e) {
    if (pressedFKeys[e.key] != undefined) {
        pressedFKeys[e.key] = true
        return
    }
    if (pressedFKeys.Alt && e.key.toLowerCase() == "t") {
        if (hub.dataset.open == "true") {closeHub();return};
        if (toHubClose) clearTimeout(toHubClose);
        document.body.append(hub)
        setTimeout(() => {
            hub.dataset.open = "true"
        }, 0);
    }
}
function documentKeyUp(e) {
    if (pressedFKeys[e.key] != undefined) {
        pressedFKeys[e.key] = false
        return
    }
}


document.addEventListener("mousedown", loseFocus);
document.addEventListener("mousedown", (e) => {
    if(e.buttons == 2) return;
    // if (e.target.tagname != "DIV" && e.target.id != "sysdscontainer" && e.target.tagName != "HTML" && e.target.dataset.type != "widget") return
    if (e.target.tagName != "DESKTOP-ENVIRONMENT") return
    if (e.target.dataset.editMode == "true") return;
    origin = [e.clientX, e.clientY]
    const dragSelector = Util.create({
        tagname: "selector-box"
    })
    function dragSelect(e) {
        currentDesktop.layers[1].append(dragSelector)
        dragSelector.style.top = Math.min(origin[1], e.clientY) + "px";
        dragSelector.style.left = Math.min(origin[0], e.clientX) + "px";
        dragSelector.style.height = (Math.max(origin[1], e.clientY) - Math.min(origin[1], e.clientY)) + "px";
        dragSelector.style.width = (Math.max(origin[0], e.clientX) - Math.min(origin[0], e.clientX)) + "px";
    }

    function endDrag(e) {
        dragSelector.remove();
        document.removeEventListener("mousemove", dragSelect)
        document.removeEventListener("mouseup", endDrag)
    }

    document.addEventListener("mousemove", dragSelect)
    document.addEventListener("mouseup", endDrag)
})
document.addEventListener("keydown", documentKeyDown)
document.addEventListener("keyup", documentKeyUp)

/**
 * Creates the login screen when the login button is clicked. Sends requests to the Connect module and handles events within the login screen
 * @see <a href="./client.Client_Connect.html">Connect</a>
 * @param { Event } event
 * @method openLogin
 * @name Export:openLogin
 */
function openLogin(event) {
    closeHub()
    const startmenu = document.querySelector("start-menu")
    startmenu.dataset.active = "false"
    event.stopPropagation();
    function loginTbKeydown(event) {
        if (event.key == "Enter") {
            login();
        }
    }
    const loginscreen = Util.create({
        tagname: "login-main",
        childElements: [
            {
                tagname: "div",
                classList: ["login-big"],
                childElements: [
                    {
                        tagname: "div",
                        classList: ["login-container"],
                        id: "login-container",
                        dataset: {error: "none"},
                        childElements: [
                            {
                                tagname: "div",
                                classList: ["default-pfp"]
                            },
                            {
                                tagname: "input",
                                type: "text",
                                placeholder: "Username",
                                id: "login-user",
                                dataset: {form: "login"},
                                eventListener: {keydown: loginTbKeydown}
                            },
                            {
                                tagname: "input",
                                type: "password",
                                id: "login-password",
                                placeholder: "Password",
                                dataset: {form: "login"},
                                eventListener: {keydown: loginTbKeydown}
                            }
                        ]
                    },
                    {
                        tagname: "div",
                        classList: ["login-buttons"],
                        childElements: [
                            {
                                tagname: "a",
                                classList: ["login-button"],
                                childElements: [
                                    {
                                        tagname: "i",
                                        classList: ["bx", "bx-x", "bx-md"]
                                    }
                                ],
                                eventListener: {click: closeLogin}
                            },

                            {
                                tagname: "div"
                            },
                            {
                                tagname: "a",
                                classList: ["login-button"],
                                childElements: [
                                    {
                                        tagname: "i",
                                        classList: ["bx", "bx-right-arrow-alt", "bx-md"]
                                    }
                                ],
                                eventListener: {
                                    "click": login
                                }
                            }
                        ]
                    }
                ]
            },

        ]
    })
    document.body.append(loginscreen)
    loginscreen.querySelector("#login-user").focus()
    function closeLogin(e) {
        loginscreen.remove();
    }
    function login(e) {
        Server.Auth({
            req: "login",
            data: {
                username: loginscreen.querySelector("input#login-user").value,
                password: loginscreen.querySelector("input#login-password").value
            }
        })
    }
}

/**
 * Creates signup DOM-Tree, sends signup requests to the Connect module and sets up events within the signup screen.
 * @see <a href="./client.Client_Connect.html">Connect</a>
 * @param { Event } event
 * @method openSignup
 * @name Export:openSignup
 */
function openSignup(event) {
    let metRequirements = 0;
    function sendUsername(event) {
        setTimeout(() => {
            Server.Auth({req: "signupCheckUsernameAvailable", data: event.target.value})
            }
        , 1)
        sendSignup(event)
    }

    function sendEmail(event) {
        setTimeout(() => {
            Server.Auth({req: "signupCheckEmailRegistered", data: event.target.value})
            }
        , 1)
        sendSignup(event)
    }
    function sendSignup(event) {
        if (event.key == "Enter") {
            Server.Auth({
                req: "signup",
                data: {
                    username: event.target.parentNode.parentNode.querySelectorAll("input")[0].value,
                    email: event.target.parentNode.parentNode.querySelectorAll("input")[1].value,
                    password: event.target.parentNode.parentNode.querySelectorAll("input")[2].value,
                    passwordconfirm: event.target.parentNode.parentNode.querySelectorAll("input")[3].value,
                }
            })
        }
    }

    function sendSignupBtn(event) {
        // console.log(event.target.parentNode.parentNode.parentNode)
        Server.Auth({
            req: "signup",
            data: {
                username: event.target.parentNode.parentNode.parentNode.querySelectorAll("input")[0].value,
                email: event.target.parentNode.parentNode.parentNode.querySelectorAll("input")[1].value,
                password: event.target.parentNode.parentNode.parentNode.querySelectorAll("input")[2].value,
                passwordconfirm: event.target.parentNode.parentNode.parentNode.querySelectorAll("input")[3].value,
            }
        })
    }

    function matchPasswords(event) {
        const p1 = event.target.parentNode.children[0];
        const p2 = event.target.parentNode.children[2];
        // console.log(p1, p2)
        setTimeout(() => {
            if (p1.value != p2.value) {
                handlers["A-0006"]({code: "A-0006", message: "Passwords don't match"})
            } else {
                handlers["A-0006"]({code: "None", message: ""})
            }

            // p2.parentNode.parentNode.dataset.errorpassword = (p1.value != p2.value)?"A-0006":"None"
            // p2.parentNode.dataset.errorpassword = (p1.value != p2.value)?"Passwords don't match":""
        }, 1);
        sendSignup(event)
    }

    function showPasswordHint(event) {
        const hint = event.target.parentNode.children[1];
        hint.dataset.visible = true
    }
    function hidePasswordHint(event) {
        const hint = event.target.parentNode.children[1];
        checkPasswordRequirements(event.target.value)
        if (metRequirements < 3 || event.target.value.length < 8) return;
        hint.dataset.visible = false
    }
    function checkPasswordRequirements(val) {
        const lengthRequirement = (val.length >= 8);
        const uppercase = val.match(/[A-Z]/g) != null;
        const lowercase = val.match(/[a-z]/g) != null;
        const numbers = val.match(/[0-9]/g) != null;
        const special = val.match(/[*.!@$%^&(){}\[\]:;<>,.?\/~_+\-=|\]§´`#'°]/g) != null
        metRequirements = 0;
        metRequirements += uppercase;
        metRequirements += lowercase;
        metRequirements += numbers;
        metRequirements += special;
        return [lengthRequirement, uppercase, lowercase, numbers, special]
    }
    function legalUsername(event) {
        const username = event.target.value;
        const match = username.match(/^[^.](((?<!\.)\.)|\w){2,32}[^.]$/g)
        if (match == null) handlers["A-0009"]({code:"A-0009", message: "Invalid username"})
    }
    function updatePasswordHint(event) {
        matchPasswords(event)
        setTimeout(() => {
            const hint = event.target.parentNode.children[1];
            const val = event.target.value;
            const req = checkPasswordRequirements(val);
            // console.log(metRequirements)
            let reqElements = hint.querySelectorAll(".pw-requirement");
            for (let i = 0; i < 5; i++) {
                reqElements[i].dataset.met = req[i]
            }

        }, 1)
        sendSignup(event)
    }
    const loginscreen = Util.create({
        tagname: "login-main",
        childElements: [
            {
                tagname: "div",
                classList: ["signup-big"],
                childElements: [
                    {
                        tagname: "div",
                        classList: ["signup-container"],
                        id: "signup-container",
                        dataset: {
                            errorusername: "None",
                            erroremail: "None",
                            errorpassword: "None"
                        },
                        childElements: [
                            {
                                tagname: "div",
                                classList: ["signup-element-container"],
                                id: "signup-username-div",
                                childElements: [
                                    {
                                        tagname: "input",
                                        dataset: {form: "login"},
                                        type: "text",
                                        id: "signup-username",
                                        placeholder: "Username",
                                        eventListener: {
                                            keydown: sendUsername,
                                            focusout: legalUsername,
                                        }
                                    }
                                ]
                            },{
                                tagname: "div",
                                classList: ["signup-element-container"],
                                id: "signup-email-div",
                                childElements: [
                                    {
                                        tagname: "input",
                                        dataset: {form: "login"},
                                        type: "text",
                                        id: "signup-email",
                                        placeholder: "E-mail (optional)",
                                        eventListener: {
                                            focusout: sendEmail,
                                            keydown: sendSignup
                                        }
                                    }
                                ]
                            },{
                                tagname: "div",
                                classList: ["signup-element-container"],
                                id: "signup-password-div",
                                childElements: [
                                    {
                                        tagname: "input",
                                        dataset: {form: "login"},
                                        type: "password",
                                        id: "signup-password",
                                        placeholder: "Password",
                                        eventListener: {
                                            focus: showPasswordHint,
                                            focusout: hidePasswordHint,
                                            keydown: updatePasswordHint
                                        }
                                    },
                                    {
                                        tagname: "div",
                                        classList: ["password-hint"],
                                        id: "password-hint",
                                        dataset: {visible: false},
                                        childElements: [
                                            {tagname: "div", innerHTML: "Your password must be"},
                                            {tagname: "div", innerHTML: "more than 8 characters long", classList:["pw-requirement"], dataset: {met: false}},
                                            {tagname: "div", innerHTML: "and fulfill 3 of these requirements:"},
                                            {tagname: "div", innerHTML: "Contain uppercase letters", classList:["pw-requirement"], dataset: {met: false}},
                                            {tagname: "div", innerHTML: "Contain lowercase letters", classList:["pw-requirement"], dataset: {met: false}},
                                            {tagname: "div", innerHTML: "Contain numbers", classList:["pw-requirement"], dataset: {met: false}},
                                            {tagname: "div", innerHTML: "Contain special characters", classList:["pw-requirement"], dataset: {met: false}},
                                        ]
                                    },
                                    {
                                        tagname: "input",
                                        dataset: {form: "login"},
                                        type: "password",
                                        id: "signup-password-confirm",
                                        placeholder: "Confirm Password",
                                        eventListener: {keydown: matchPasswords}
                                    }
                                ]
                            }
                        ]
                    },{
                        tagname: "div",
                        classList: ["signup-buttons"],
                        childElements: [
                            {
                                tagname: "a",
                                classList: ["login-button"],
                                childElements: [
                                    {
                                        tagname: "i",
                                        classList: ["bx", "bx-x", "bx-md"]
                                    }
                                ],
                                eventListener: {click: closeSignup}
                            },

                            {
                                tagname: "div"
                            },
                            {
                                tagname: "a",
                                classList: ["login-button"],
                                childElements: [
                                    {
                                        tagname: "i",
                                        classList: ["bx", "bx-right-arrow-alt", "bx-md"]
                                    }
                                ],
                                eventListener: {
                                    "click": sendSignupBtn
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    })
    function closeSignup(e) {
        loginscreen.remove();
    }
    document.body.append(loginscreen)
}

/**
 * Toggles start menu
 * @param { MouseEvent } event
 * @method openStartmenu
 * @name Internal:openStartmenu
 */
function openStartmenu(event) {
    const startmenu = document.querySelector("start-menu");
    startmenu.dataset.active = startmenu.dataset.active == "false"
}

/**
 * Toggles search bar
 * @param { MouseEvent } event
 * @method openSearch
 * @name Internal:openSearch
 */
function openSearch(event) {
    const search = document.querySelector("desktop-search");
    search.dataset.active = search.dataset.active == "false"
    search.children[0].value = ""
    search.children[0].focus();
}

/**
 * If an element loses focus, this allows that element to have specific behaviours. For example: Elements with the data attribute "closeonfocus" set to "true" will set the data attribute "active" to "false", if another element is clicked. If the clicked element has the data attribute "ignore" set to "startmenu" or "search", the respective element will NOT be closed.
 * @todo Allow multiple elements to be ignored
 * @todo Allow elements to "register" for their own ignore tag
 * @param { MouseEvent } event
 * @method loseFocus
 * @name Internal:loseFocus
 */
function loseFocus(event) {
    let elements = document.querySelectorAll("[data-closeonfocus='true']")
    for (let e of elements) {
        if (event.target.dataset.ignore=="startmenu" && e.tagName=="START-MENU") {
            continue;
        }
        if (event.target.dataset.ignore=="search" && e.tagName=="DESKTOP-SEARCH") continue;
        e.dataset.active = "false"
    }
}

/**
 * Makes request to connect module to open the settings app
 * @see <a href="./client.Client_Connect.html">Connect</a>
 * @todo Make event parameter optional by wrapping <code>e.stopPropagation()</code> in a try-catch block
 * @todo Once optional: add to export
 * @todo Let function take optional parameters for what settings submenu to initialise as
 * @param { Event } e
 * @method openSettings
 * @name Internal:openSettings
 */
function openSettings(e) {
    // console.log("eventFIred")
    Server.System( {req: "fetch_app", data: { id: "settings" }})
    document.querySelector("start-menu").dataset.active = "false"
    e.stopPropagation();
}

function openProfile(e) {
    // console.log("OPEN PROFILE")
    Server.System( {req: "fetch_app", data: { id: "profile" }})
    document.querySelector("start-menu").dataset.active = "false"
    e.stopPropagation();
}


let activeContextMenu;
document.addEventListener("click", removeContextMenus)

// closes context menu if anything except childnodes of a context menu are clicked
function removeContextMenus(e) {
    if (!activeContextMenu) return
    if (e.target.tagName == "CONTEXT-MENU") return
    activeContextMenu.hide()
}




function contextMenu(e) {
    e.preventDefault()
    if(activeContextMenu) {
        activeContextMenu.hide()
        activeContextMenu = undefined;
    }

    let target = e.target;
    while (!target.contextMenu && target.dataset.stopCtxPropagation != "true") {
        target = target.parentNode;
        if (target.tagName == "BODY") return;
    }


    // console.log("context menu", target)
    let t = target.contextMenu
    if (!t) return
    activeContextMenu = t;

    let spawnX = e.clientX;
    let spawnY = e.clientY;
    t.show(spawnX, spawnY)
}


export {openLogin, openSignup, openSettings, openProfile, loseFocus, contextMenu}
