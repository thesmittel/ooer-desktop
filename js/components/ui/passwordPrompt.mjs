import { registerPasswordCallback } from "../../modules/connect/Auth.mjs";
import { Auth } from "../../modules/Connect.mjs";
import { dragElement } from "../../modules/input/Dragging.mjs";
import { create } from "../../modules/Util.mjs";

class PasswordPrompt {
    #element;
    #passwordBox;
    #success;
    #fail;
    constructor(success, fail) {
        this.#success = success;
        this.#fail = fail;
        registerPasswordCallback(() => {this.correctPassword()}, () => {this.wrongPassword()})
        this.#passwordBox = create({
            tagname: "input",
            type: "password",
            dataset: {form: "login"},
            eventListener: {
                keydown: (e) => {
                    if (e.key == "Enter") this.#sendPassword()
                }
            }
        })

        this.#element = create({
            tagname: "password-prompt",
            childElements: [
                {
                    tagname: "password-prompt-header",
                    dataset: {dragTarget: "true"},
                    childElements: [
                        {
                            tagname: "div",
                            childElements: [{
                                classList: ["bx", "bx-key"],
                                tagname: "i"
                            }]
                        }, {
                            tagname: "span",
                            innerText: "Password required"
                        }, {
                            tagname: "a",
                            id: "windowcontrolbutton",
                            dataset: {action: "cls"},
                            childElements: [{tagname: "i", classList: ["bx", "bx-x", "bx-sm"]}],
                            eventListener: {
                                click: ({target}) => {
                                    this.#close(target);
                                }
                            }
                        }
                    ]
                },
                {
                    tagname: "password-prompt-body",
                    childElements: [{
                        tagname: "div",
                        classList: ["icon"],
                        childElements: [{
                            tagname: "i",
                            classList: ["bx", "bx-key", "bx-lg"]
                        }]
                    }, {
                        tagname: "div",
                        classList: ["message"],
                        childElements: [{
                            tagname: "span",
                            innerText: "This action requires you to confirm your password."
                        },
                        this.#passwordBox
                    ]
                    }
                    ]
                },
                {
                    tagname: "password-prompt-buttons",
                    childElements: [{
                        tagname: "div"
                    }, {
                        tagname: "input",
                        type: "button",
                        value: "Abort",
                        eventListener: {
                            click: ({target}) => {
                                this.#close(target)
                            }
                        }
                    }, {
                        tagname: "input",
                        type: "button",
                        value: "Confirm",
                        style: {background: "#224"},
                        eventListener: {
                            click: () => {
                                this.#sendPassword()
                            }
                        }
                    }
                    ]
                }
            ]
        })
        dragElement(this.element)
        document.body.append(this.#element)
        this.#passwordBox.focus()
    }

    get element() {
        return this.#element
    }

    #close(target) {

        while (target.tagName !== "PASSWORD-PROMPT") {
            target = target.parentNode;
        }
        target.remove()
    }
    #sendPassword() {

        Auth({req: "password_confirmation", password: this.#passwordBox.value})
    }

    wrongPassword() {
        this.#passwordBox.style = "border: solid 2px red !important";
        this.#fail()
    }

    correctPassword() {
        this.#element.remove();
        this.#success();
    }
}


export { PasswordPrompt }
