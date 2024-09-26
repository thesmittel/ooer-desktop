import { isElement, deleteElement, create } from "/js/modules/Util.mjs";


class DropDownMenu {

    element;
    #listcontainer;
    #listelements = [];
    #valueChangeEvent;
    #selectedId;
    /* elements:
    [
        {
            label: "str",
            handler: func,

        }
    ]
    */
    constructor(elements, defaultIndex) {
        defaultIndex = defaultIndex == undefined ? 0 : defaultIndex
        this.#selectedId = defaultIndex;
        for (let el in elements) {
            this.#listelements.push(create({
                tagname: "dropdown-element",
                innerText: elements[el].label,
                dataset: {
                    id: el, 
                    label: elements[el].label,
                    selected: this.#selectedId == el
                },
                eventListener: {click: (e) => {
                    this.element.dataset.value = e.target.dataset.label;
                    this.element.dataset.selectedIndex = e.target.dataset.id
                    this.element.dataset.open = "false";
                    this.#selectedId = e.target.dataset.id
                    for (let e of this.#listelements) {
                        e.dataset.selected = "false"
                    }
                    e.target.dataset.selected = "true"
                    elements[el].handler(e);
                }}
            }))
        }
        
        this.#listcontainer = create({
            tagname: "dropdown-list",
            childElements: this.#listelements,
            eventListener: {click: (e) => {
                e.stopPropagation();
                this.#listcontainer.remove()
                this.element.dataset.open = "false"
            }},
            style: `grid-template-rows: repeat(${elements.length}, 36px);`
        })

        
        function bodyClick(e) {
            const openDropDown = document.querySelector("dropdown-menu[data-open='true']")
            if (openDropDown != e.target && openDropDown != null) {
                openDropDown.querySelector("dropdown-list").remove()
                openDropDown.dataset.open = "false"
            }
            
            
        }
        document.body.addEventListener("click", bodyClick)
        
        this.element = create({
            tagname: "dropdown-menu",
            dataset: {
                open: false,
                value: elements[this.#selectedId].label,
                selectedIndex: this.#selectedId || 0
            },
            eventListener: {
                click: (a) => {
                    if (a.target.dataset.open == "true") {
                        this.#listcontainer.remove();
                    } else {
                        a.target.append(this.#listcontainer)
                        bodyClick(a)
                        const currEl = this.#listelements[this.#selectedId];
                        const {height} = currEl.getBoundingClientRect();
                        this.#listcontainer.scrollTop = (0, 
                            currEl.offsetTop 
                            - height 
                            - parseInt(getComputedStyle(this.#listcontainer, null)["grid-row-gap"])
                        )
                    }
                    a.target.dataset.open = a.target.dataset.open == "false"
                    
                }
            }
        })
    }

    addElement(e, pos) {
        this.#listelements.splice(pos, 0, e) // need to have "constructor" logic (create())
        // update UI
    }

    deleteElement(e) {
        if (isElement(e)) {
            if (this.#listelements.indexOf(e) == -1) throw new ReferenceError("Provided element is not part of the listelements")
            this.#listelements = deleteElement(this.#listelements, this.#listelements.indexOf(e))
        } else {
            this.#listelements = deleteElement(this.#listelements, e)
        }
        // update UI
    }

    #updateUI() {
        this.#listcontainer.innerHTML = ""
    }
}

export {DropDownMenu}