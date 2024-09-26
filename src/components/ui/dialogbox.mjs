
/**
 * Creates and manages an elements context menu
 * @file dialogbox.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:UIElements > DialogBox
 */
/**
 * Creates and manages an elements context menu
 * @file dialogbox.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:UIElements > DialogBox
 * @namespace ClientCode.UIElements
 */
/**
 * @module DialogBox
 * @memberof Client:UIElements
 * @description Creates and manages an elements context menu
 * @name Client:UIElements > DialogBox
 * @author Smittel
 */

import { create } from "../Util.mjs";

/**
 * 
 */
class DialogBox {
    title;
    description;
    type;
    element;
    #buttons;
    #parent;
    #blocked;
    #symbolColors = ["#28f", "#82c", "#eb3", "#e31"];
    #symbols = [
        "<box-icon color='#37f' size='lg' name='alarm-exclamation'></box-icon>", // Alarm, Clock, Timer
        "<box-icon name='info-circle' size='lg' color='#5ae'></box-icon>", // Info
        "<box-icon name='help-circle'size='lg'color='#3ae'></box-icon>", // Question
        "<box-icon name='error' size='lg' color='#ec2'></box-icon>", // Exclamation
        "<box-icon color='#ea1425' size='lg' name='x-circle'></box-icon>" // Error (Critical)
    
    ]
    /**
     * 
     * @param {String} title Header text of the dialog box
     * @param {String} description Text content of the dialog box
     * @param {(0|1|2|3|4)} type 0: Alarm/Clock/Timer, 1: Info, 2: Question, 3: Warning, 4: Critical
     * @param {Object[]} buttons The buttons
     * @param {String} buttons[].text Label of the button
     * @param {Function} buttons[].call Called on click
     * @param {Boolean} buttons[].main Highlights the button compared to the others
     * @param {HTMLElement} [parent=document.body] Parent element which receives the error box
     * @param {Boolean=} blocked Whether or not the parent element gets blocked
     */
    constructor(title, description, type, buttons, parent, blocked) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.#blocked =  blocked;
        this.#buttons = buttons;
        this.#parent = parent;
        if (!(this.#parent instanceof HTMLElement)) this.#parent = document.body
        this.element = create({
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
                            innerHTML: this.#symbols[type],
                            style: `color: ${this.#symbolColors[type]}`
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
                            childElements: buttons.map(this.#makeButton)
                        }
                    ]
                }
            ]
        })
        this.#parent.append(this.element)
    }

    #makeButton(a) {
        const b = {
            tagname: "error-button",
            innerHTML: a.text,
            eventListener: {"click": a.call},
            dataset: {main: a.main == true}
        }
        return b;
    }
    close() {
        this.element.remove();
    }
}

export { DialogBox }