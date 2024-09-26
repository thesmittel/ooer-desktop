"<import>"
import { create } from "/js/modules/Util.mjs";
import { Wheel, TextboxSlider, SliderGroup, DropDownMenu, TextDropDown } from "/js/modules/ui.mjs"
import { App, System } from "/js/modules/Connect.mjs";
import { addMessageListener } from "/js/modules/System.mjs"
import * as Client from "/js/modules/Client.mjs"
"</import>"
"<application>"

function handleMessages(data) {
    console.log(data)
}

addMessageListener(application.windowid, handleMessages)


application.body.querySelector("div.edit").addEventListener("click", () => {
    System( {req: "fetch_app", data: { id: "profile" }})
})

const usersettings = {}
const settingsTemplate = {
    home: {
        type: "HOME",
        icon: "home-alt-2",
        elements: []
    },
    profile: {
        type: "PAGE",
        icon: "user",
        elements: []
    },
    appearance: {
        type: "PAGE",
        icon: "",
        elements: [
            {id: "btn-settings-app-theme", label: "Themes", type: "OPEN", description: "", icon: ""},
            {id: "btn-settings-app-darkmode", label: "Darkmode", type: "SWCH", description: "", icon: ""},
            {id: "btn-settings-app-colors", label: "Colors", type: "OPEN"},
            {id: "spr-settings-app-images", label: "Images"},
            {id: "btn-settings-app-background", label: "Background", type: "OPEN", description: "", icon: ""},
            {id: "btn-settings-app-logo", label: "Logo", type: "FILE", description: "", icon: ""},
            {id: "spr-settings-app-ui", label: "UI"},
            {id: "btn-settings-app-taskbar", label: "Taskbar", type: "OPEN", description: "", icon: ""},
            {id: "btn-settings-app-UI", label: "UI", type: "OPEN", description: "", icon: ""},
        ]
    },
    language: {
        type: "PAGE",
        icon: "",
        elements: []
    },
    privacy: {
        type: "PAGE",
        icon: "",
        elements: []
    },
    social: {
        type: "PAGE",
        icon: "",
        elements: []
    },

}

const main = application.body.querySelector("div.right");
const test = main.querySelector("div.test");
// const wheel = new Wheel(test)
// // makeColorSelector(test)
// wheel.show()

// const tbSlide1 = new TextboxSlider({min: 0, max: 255, step: 1, val: 1, label: "R"})
// tbSlide1.setStyle({
//     width: "300px"
// })
// tbSlide1.setTextOffset("24px")

// const tbSlide2 = new TextboxSlider({min: 0, max: 255, step: 1, val: 1, label: "G"})
// tbSlide2.setStyle({
//     width: "300px",
//     "box-sizing": "border-box"
// })
// tbSlide2.setTextOffset("24px")

// const tbSlide3 = new TextboxSlider({min: 0, max: 255, step: 1, val: 1, label: "B"})
// tbSlide3.setStyle({
//     width: "300px"
// })
// tbSlide3.setTextOffset("24px")



// const slidegroup = create({
//     tagname: "slider-group",
//     childElements: [
//         tbSlide1.element, tbSlide2.element, tbSlide3.element
//     ]
// })

// tbSlide3.element.addEventListener("update", (e)=>{

// })

// const tbSlide4 = new TextboxSlider({min: 0, max: 255, step: 1, val: 1, label: "A"})
// tbSlide4.setTextOffset("24px")
// tbSlide4.setStyle({
//     width: "300px",
//     "margin-top": "6px"
// })

// const newSlideGroup = new SliderGroup([
//     {min: 0, max: 255, step: 1, val: 1, label: "A"},
//     {min: 0, max: 255, step: 1, val: 1, label: "B"},
//     {min: 0, max: 255, step: 1, val: 1, label: "C"},
//     {min: 0, max: 255, step: 1, val: 1, label: "D"},
// ], "label")

// newSlideGroup.setStyle("width: 300px; margin-top: 12px;")
// newSlideGroup.element.addEventListener("update", (e) => {
//     // console.log(e.target)
//     })
//     newSlideGroup.element.addEventListener("set", (e) => {
//         console.log("set", e.target.values)
//         })

const testDropdown = new DropDownMenu([
    {
        label: "Option 1",
        handler: (e) => {
            console.log("option 1");
        }
    },
    {
        label: "Option 2",
        handler: (e) => {
            console.log("option 2");
        }
    },
    {
        label: "Option 3",
        handler: (e) => {
            console.log("option 3");
        }
    },
    {
        label: "Option 4",
        handler: (e) => {
            console.log("option 4");
        }
    },
])
const testDropdown1 = new DropDownMenu([
    {
        label: "Option 1",
        handler: (e) => {
            console.log("option 1");
        }
    },
    {
        label: "Option 2",
        handler: (e) => {
            console.log("option 2");
        }
    }
])

const testTextDropdown = new TextDropDown([
    "aaa",
    "aab",
    "abv",
    "afgsd",
    "ets",
    "fgds"
])


function header(string) {
    return create({
        tagname: "span",
        innerText: string,
        classList: ["settings-header"]
    })
}

function subheader(string) {
    return create({
        tagname: "span",
        innerText: string,
        classList: ["settings-subcategory"]
    })
}
/**
 * 
 * @param {String} label Label for settings window
 * @param {(Boolean|("true"|"false"))} value On or off
 * @returns {HTMLElement}
 */
function makeToggle(label, value) {
    return create({
        tagname: "div",
        classList: ["settings-element", "regular"],
        childElements: [
            {
                tagname: "span",
                classList: ["text"],
                innerText: label
            },
            {
                tagname: "toggle-switch",
                dataset: {value: value},
                eventListener: {
                    click: (e) => {e.target.dataset.value = e.target.dataset.value=="false"}
                }
            }
        ]
    })
}
/**
 * 
 * @param {String} label Label for settings window
 * @param {Function=} func Click handler
 * @returns {HTMLElement}
 */
function makeButton(label, func) {
    return create({
        tagname: "div",
        classList: ["settings-element", "button"],
        childElements: [
            {
                tagname: "span",
                classList: ["text"],
                innerText: label
            },
            {
                tagname: "i",
                classList: ["bx", "bx-chevron-right", "bx-sm"]
            }
        ],
        eventListener: {
            click: func || (()=>{})
        }
    })
}
/**
 * 
 * @param {String} label 
 * @param {Object} color
 * @param {Number=} color.r Value of red color channel, defaults to 0
 * @param {Number=} color.g Value of green color channel, defaults to 0
 * @param {Number=} color.b Value of blue color channel, defaults to 0
 * @param {Number=} color.a Value of alpha channel, defaults to 0
 * @todo undefined color.a means no alpha channel at all
 * 
 * @returns {HTMLElement}
 */
function makeColorPicker(label, {r, g, b, a}) {
    return create({
        tagname: "div",
        classList: ["settings-element", "regular"],
        childElements: [
            {
                tagname: "span",
                classList: ["text"],
                innerText: label
            },
            {
                tagname: "color-picker",
                id: "test",
                dataset: {
                    r: r||0, g: g||0, b: b||0, a: a||0
                },
                eventListener: {
                    click: ({target}) => {const wheel = new Wheel(target); wheel.show()}
                }
            }
        ]
    })
}

/**
 * @typedef DropDownMenu DropDownMenu
 * @typedef TextDropDown TextDropDown
 */
/**
 * 
 * @param {String} label The label used in the settings window
 * @param {(Array|DropDownMenu)} menu The menu itself, either as an array of options or as a previously defined Object of class DropDownMenu
 * @param {Number=} defaultIndex The default index, optional, defaults to 0, only effective if menu is Array
 * @returns {HTMLElement}
 */
function makeDropDownMenu(label, menu, defaultIndex) {
    let obj = {
        tagname: "div",
        classList: ["settings-element", "regular"],
        childElements: [
            {
                tagname: "span",
                classList: ["text"],
                innerText: label
            }
        ]
    }
    if (menu instanceof DropDownMenu) {
        obj.childElements.push(menu.element)
    } else if (menu instanceof Array) {
        const dd = new DropDownMenu(menu, defaultIndex)
        obj.childElements.push(dd.element)
    } else {
        throw new Error("makeDropDownMenu(): menu expects Array or DropDownMenu, got " + menu.constuctor)
    }
    return create(obj)
}

/**
 * 
 * @param {String} label The label for the settings window
 * @param {(String[]|TextDropDown)} options The options, either as array of strings or string convertibles or as instance of TextDropDown 
 * @param {Number=} defaultIndex The default index, optional, defaults to 0, only effective if options is Array
 * @returns HTMLElement
 */
function makeTextDropDown(label, options, defaultIndex) {
    const obj = {
        tagname: "div",
        classList: ["settings-element", "regular"],
        childElements: [
            {
                tagname: "span",
                classList: ["text"],
                innerText: label
            }
        ]
    }
    if (options instanceof TextDropDown) {
        obj.childElements.push(options.element)
    } else if (options instanceof Array) {
        const tdd = new TextDropDown(options, defaultIndex)
        obj.childElements.push(tdd.element)
    } else {
        throw new Error("makeTextDropDown(): options expects Array or TextDropDown, got " + options.constuctor)
    }
    return create(obj)
}

function makeTemporaryTextbox(label, value, opens, isPassword) {
    const textbox = create({
        tagname: "input",
        type: isPassword?"password":"text",
        classList: ["text", "temporary-textbox-span"],
        innerText: value,
        value: value,
        disabled: "true",
        eventListener: {
            focusout: (e) => {
                e.target.disabled = true
            },
            keydown: (e) => {
                if (e.key == "Enter") e.target.disabled = true
            }
        }
    })
    const obj = {
        tagname: "div",
        classList: ["settings-element", "regular"],
        childElements: [
            {
                tagname: "span",
                classList: ["text"],
                innerText: label
            },
            {
                tagname: "div",
                classList: ["temporary-textbox-container"],
                childElements: [
                    textbox,
                    {
                        tagname: "div",
                        classList: ["temporary-textbox-editbutton"],
                        childElements: [
                            {
                                tagname: "i",
                                classList: ["bx", "bxs-edit-alt", "temporary-textbox-editbutton"]
                            }
                        ],
                        eventListener: {
                            click: () => {textbox.disabled = false; textbox.focus()}
                        }
                    }
                ]
            }
        ]
    }
    return create(obj)
}

const savedApps = [
    
    {name: "Notepad", id: "notepad", dateInstalled: 0, lastUsed: Date.now(), author: "System", type: "App"},
    {name: "Terminal", id: "terminal", dateInstalled: 653425640, lastUsed: Date.now(), author: "System", type: "App"},
    {name: "Settings", id: "settings", dateInstalled: 0, lastUsed: Date.now(), author: "System", type: "App"},
    {name: "Profile", id: "profile", dateInstalled: 253256443, lastUsed: Date.now(), author: "System", type: "App"},
    {name: "llama probably", id: "assistant", dateInstalled: 0, lastUsed: 6432765, author: "System", type: "App"},
    {name: "example", id: "000000000001", dateInstalled: 0, lastUsed: 6432765, author: "smittel", type: "App"},
    {name: "aaa", id: "000000000002", dateInstalled: 0, lastUsed: 6432765, author: "smittel", type: "App"},
    {name: "settings", id: "settings_app", dateInstalled: 264648744, lastUsed: 365464232, author: "smittel", type: "Widget"},
]
// selector, name, id, installed, used, sysapp

function makeSortableList(label, options) {

    function makeSortedList() {
        return savedApps.map(a => {return {
            tagname: "div",
            classList: ["installed-app-grid", "installed-app-element"],
            dataset: {
                name: a.name,
                id: a.id,
                dateInstalled: a.dateInstalled,
                lastUsed: a.lastUsed,
                author: a.author,
                type: a.type
            },
            childElements: [
                {
                    tagname: "i",
                    classList: ["bx", "bx-checkbox", "bx-sm", "installed-app-cb"],
                    dataset: {selected: false},
                    eventListener: {click: ({target})=>{
                        target.dataset.selected = target.dataset.selected == "false";
                        target.classList.toggle("bx-checkbox-square")
                        target.classList.toggle("bx-checkbox")
                        let allSelected = checkAllSelected(target.parentNode.parentNode)
                        const allBox = target.parentNode.parentNode.previousSibling.childNodes[0]
                        const list = target.parentNode.parentNode.parentNode
                        list.dataset.allselected = allSelected.all == 1;
                        allBox.dataset.selected = (allSelected.all == 1)
                        allBox.classList.add(allSelected.all?"bx-checkbox-square":"bx-checkbox")
                        allBox.classList.remove(allSelected.all?"bx-checkbox":"bx-checkbox-square")

                    }}
                },
                {
                    tagname: "span",
                    classList: ["installed-app-element-text"],
                    innerText: a.name
                },
                {
                    tagname: "span",
                    classList: ["installed-app-element-text"],
                    innerText: a.id
                },
                {
                    tagname: "span",
                    classList: ["installed-app-element-text"],
                    innerText: (new Date(a.dateInstalled)).toLocaleString()
                },
                {
                    tagname: "span",
                    classList: ["installed-app-element-text"],
                    innerText: (new Date(a.lastUsed)).toLocaleString()
                },
                {
                    tagname: "span",
                    classList: ["installed-app-element-text"],
                    innerText: a.author
                },
                {
                    tagname: "span",
                    classList: ["installed-app-element-text"],
                    innerText: a.type
                },
                a.type=="App"?{
                    tagname: "i",
                    classList: ["bx", "bx-right-arrow-circle", "bx-sm", "app-start-icon"],
                    eventListener: {
                        click: ({target}) => {
                            if (target.parentNode.dataset.id.match(/^\d{12}$/g)) {
                                App({
                                    req: "fetch_app",
                                    data: {
                                      id: target.parentNode.dataset.id
                                    }
                                  })
                            } else {
                                System({
                                    req: "fetch_app",
                                    data: {
                                    id: target.parentNode.dataset.id
                                    }
                                })
                            }
                          }
                    }
                }:{tagname: "div"}
            ]
        }})
    }

    function changeSortMode({target}) {
        // Get all other sort buttons
        const siblings = target.parentNode.querySelectorAll("span")
        // Get property by which to sort
        const property = target.dataset.prop;
        // Get the current mode of the selected property
        const oldMode = target.dataset.sort;

        siblings.forEach(a => a.dataset.sort = "none")
        // Some math magic that determines the new selected sorting mode
        // "none" can only be reached by selecting something else
        // "none" is followed by ascending
        const sorting = ["ASC", "DESC"]
        const newSort = sorting[(sorting.indexOf(oldMode) + 1) % 2]
        target.dataset.sort = newSort;
        // Grab the element containing the list
        const listDomElement = target.parentNode.nextSibling;
        // Grab the dom elements in the list
        let list = Array.from(listDomElement.childNodes)
        // Sort, if mode is descending, reverse
        list = list.sort((a, b) => a.dataset[property].toString().localeCompare(b.dataset[property].toString()))
        if (newSort == "DESC") list.reverse()
        // replace list while keeping the selection intact
        list.forEach(a => a.remove())
        listDomElement.append(...list)
    }


    return create({
        tagname: "div",
        classList: ["installed-apps"],
        dataset: {allselected: false},
        childElements: [
            {
                tagname: "div",
                classList: ["installed-app-grid", "installed-app-header"],
                childElements: [
                    {
                        tagname: "i",
                        classList: ["bx", "bx-checkbox", "bx-sm", "installed-app-cb"],
                        dataset: {selected: false},
                        eventListener: {click: ({target})=>{
                            target.dataset.selected = target.dataset.selected == "false";
                            target.classList.toggle("bx-checkbox-square")
                            target.classList.toggle("bx-checkbox")

                            const list = target.parentNode.nextSibling.childNodes;
                            list.forEach(a => {
                                a.childNodes[0].dataset.selected = target.dataset.selected;
                                a.childNodes[0].classList.add(a.childNodes[0].dataset.selected=="true"?"bx-checkbox-square":"bx-checkbox")
                                a.childNodes[0].classList.remove(a.childNodes[0].dataset.selected=="true"?"bx-checkbox":"bx-checkbox-square")
                            })
                            target.parentNode.parentNode.dataset.allselected = target.dataset.selected;
                            let allSelected = checkAllSelected(target.parentNode.parentNode)
                            
                        }}
                    },
                    {
                        tagname: "span",
                        innerText: "Name",
                        classList: ["installed-app-header-button"],
                        dataset: {sort: "none", prop: "name"},
                        eventListener: {
                            click: changeSortMode
                        }
                    },
                    {
                        tagname: "span",
                        innerText: "ID",
                        classList: ["installed-app-header-button"],
                        dataset: {sort: "none", prop: "id"},
                        eventListener: {
                            click: changeSortMode
                        }
                    },
                    {
                        tagname: "span",
                        innerText: "Installed",
                        classList: ["installed-app-header-button"],
                        dataset: {sort: "none", prop: "dateInstalled"},
                        eventListener: {
                            click: changeSortMode
                        }
                    },
                    {
                        tagname: "span",
                        innerText: "Last used",
                        classList: ["installed-app-header-button"],
                        dataset: {sort: "none", prop: "lastUsed"},
                        eventListener: {
                            click: changeSortMode
                        }
                    },
                    {
                        tagname: "span",
                        innerText: "Author",
                        classList: ["installed-app-header-button"],
                        dataset: {sort: "none", prop: "author"},
                        eventListener: {
                            click: changeSortMode
                        }
                    },
                    {
                        tagname: "span",
                        innerText: "Type",
                        classList: ["installed-app-header-button"],
                        dataset: {sort: "none", prop: "type"},
                        eventListener: {
                            click: changeSortMode
                        }
                    },
                    create({tagname:"div"})
                ]
            },
            {
                tagname: "div",
                classList: ["app-list"],
                childElements: makeSortedList()
            }
        ]
    })
}

function checkAllSelected(list) {
    list = list.childNodes;
    let ret = {
        all: true,
        data: []
    }
    list.forEach(a => {
        ret.all *= a.childNodes[0].dataset.selected == "true";
        let tmp = {}
        tmp[a.childNodes[2].innerText] = a.childNodes[0].dataset.selected == "true"
        ret.data.push(tmp)
    })
    return ret;
}



const screens = { // Array of DOM trees
    "home": [
        header("Home"),
        subheader("divider/subheader"),
        makeButton("Test button", ()=>{alert("Does a thing")}),
        makeColorPicker("Test color picker with alpha (to do: alpha slider)", {r:0, g:127, b:255, a:1}),
        subheader("dropdowns"),
        makeDropDownMenu("Testing new dropdown", testDropdown),
        makeDropDownMenu("Test dropdown 2 new", [
            {
                label: "Option 1",
                handler: (e) => {
                    console.log("option 1");
                }
            },
            {
                label: "Option 2",
                handler: (e) => {
                    console.log("option 2");
                }
            }
        ], 1),
        subheader("text box with filtering dropdown"),
        makeTextDropDown("Oman text dropdown", ["oman", "pls", "to", "help"], 2),
        makeTextDropDown("Test Text drop down", testTextDropdown),
        subheader("Toggles"),
        makeToggle("Test toggle", true),
        makeToggle("Test toggle2", false),
        // slidegroup,
        // tbSlide4.element,
        // newSlideGroup.element
    ],
    "user": [
        header("User"),
        makeButton("User Settings", () => {alert("opens user settings that require login")}),
        subheader("the stuff below will be put in a separate window because it needs login confirmation"),
        subheader("General information"),
        makeTemporaryTextbox("Username", "smittel and the rest is some long ass text"),
        makeTemporaryTextbox("E-Mail", "johndoe@example.ooo"),
        makeTemporaryTextbox("Phone", "1-555-363636"),
        subheader("Password"),
        makeTemporaryTextbox("Old Password", "password", null, true),
        makeTemporaryTextbox("New Password", "password", null, true),
        makeTemporaryTextbox("Confirm password", "password", null, true),
    ],
    "pckg": [
        header("Packages"),
        makeSortableList("Saved Apps", savedApps)
    ],
    "appr": [
        header("Appearance"),
        makeButton("Panels", ()=>{alert("opens panel settings")}),
        makeButton("Lockscreen", ()=>{alert("opens lockscreen settings")}),
        makeButton("Windows", ()=>{alert("opens window styling editor")}),
        makeButton("Desktop", ()=>{alert("opens desktop options")}),
    ],
    "lang": [
        header("Language and Time"),
        makeTextDropDown("Language", ["English (UK)", "English (US)", "German", "French"]),
        makeTextDropDown("Country", [
            "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Deps", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Rep", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Congo (Democratic Rep)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland {Republic}", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea North", "Korea South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar, {Burma}", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russian Federation", "Rwanda", "St Kitts & Nevis", "St Lucia", "Saint Vincent & the Grenadines", "Samoa", "San Marino", "Sao Tome & Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
        ], 63), // germany is default for now
        makeTextDropDown("Timezone", ["English (UK)", "English (US)", "German", "French"]),
    ],
    "prvc": [
        header("Privacy")
    ],
    "socl": [
        header("Social")
    ]
};


function getParentButton(target) {
    while(target.tagName != "DIV") target = target.parentNode;
    return target
}

sidebarButtonHandle()

const messagesButton = window.querySelector("div#messages.button");
const requestButton = window.querySelector("div#requests.button");



setInterval(() => {
    let messages = +messagesButton.dataset.amount
    if (messages > 99) {
        messagesButton.dataset.amountClean = "99+";
    } else {
        messagesButton.dataset.amountClean = messages
    }
}, 40);

function sidebarButtonHandle(e) {
    let s = ""
    if (!e) {
        s = "home"
    } else {
        s = getParentButton(e.target).dataset.target;
    }
    main.innerText = "";
    console.log(s)
    main.append(...screens[s])
    const colorPickers = Array.from(main.querySelectorAll("color-picker"));
    colorPickers.forEach(a => {
        a.style.background = `rgba(${a.dataset.r},${a.dataset.g},${a.dataset.b},${a.dataset.a })`
    });
}

const sidebarButtons = Array.from(application.body.querySelector("div#settings-sidebar-bottom").childNodes).filter(a => a.tagName === "DIV");

sidebarButtons.forEach(a => a.addEventListener("click", sidebarButtonHandle))
function listener(data) {
    switch (data.operation) {
        case "update":
            // needs to be smarter to allow partial overwrite
            usersettings = data;
            // update ui
            break;
        case "select":
            // update ui to select correct sub menu
    }

    
}

application.addListener(listener)
