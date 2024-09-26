



/**
 * Takes an object of a specific format and can recursively create a DOM subtree, which is then returned.
 * It is not appended to anything, it only exists in memory, until manually appended.
 * Note that since it works by reference, it is not possible to append it to multiple different DOM Elements without making a deep copy.<br>
 * The list of child elements can contain both Objects that match the required format or actual DOM Elements. <br>
 * eventListener takes any number of event names as you would use with <code>addEventListener</code> as key, with the function to be executed being the value.<br>
 * Besides the explicitly mentioned properties, any property can also be set simply by taking the name of the property as the key and the value being the value.
 * @param { Object } args
 * @method create
 * @name Export:create
 * @returns {HTMLElement}
 * @example {
 * 	tagname: "HTML tag name",
 *	dataset: {
        attributeName: "attributeValue",
        howeverMany: "youNeed"
      },
    classList: ["css-class-name", "supports-multiple"],
    style: "direct css styling either as string or object",
    eventListener: {
        "EventType": function
    },
    childElements: [
        {another object of the same format},
        aDomElementCreatedEarlier
    ]
 * }
 */
function create(args, debug) {
    if (debug) console.log(args)
    let e = document.createElement(args.tagname);
    delete args.tagname;
    if (args) {
        for (let a in args) {
            switch (a) {
                case "dataset":
                    for (let d in args.dataset) {
                        e.dataset[d] = args.dataset[d];
                    }
                    break
                case "classList":
                    e.classList.add(...args.classList.filter(a=>a && a.length != 0));
                    break;
                case "eventListener":
                    for (let d in args.eventListener) {
                        e.addEventListener(d, args.eventListener[d])
                    }
                    break;
                case "childElements":
                    for (let c of args.childElements) {
                        if (c instanceof HTMLElement) {
                            e.append(c)
                        } else {
                            e.append(create(c))
                        }
                    }
                    break;
                case "style":
                    if (typeof (args[a]) == "object") {
                        for (let s in args[a]) {
                            e.style[s] = args[a][s];
                        }
                    } else {
                        e[a] = args[a];
                    }
                    break;
                default:
                    e.setAttribute(a, args[a])
                    e[a] = args[a];
            }
        }
    }
    return e;
}

/**
 * Returns true if it is a DOM element
 * @param { Object } o Object to check
 * @method isElement
 * @name Export:isElement
 * @returns Boolean
 */
function isElement(obj) {
    try {
        //Using W3 DOM2 (works for FF, Opera and Chrome)
        return obj instanceof HTMLElement;
    }
    catch (e) {
        //Browsers not supporting W3 DOM2 don't have HTMLElement and
        //an exception is thrown and we end up here. Testing some
        //properties that all elements have (works on IE7)
        return (typeof obj === "object") &&
            (obj.nodeType === 1) && (typeof obj.style === "object") &&
            (typeof obj.ownerDocument === "object");
    }
}

/**
 * Shorthand for document.getElementById()
 * @param { String } str ID of DOM Element
 * @method getElement
 * @name Export:getElement
 * @returns DOM Element
 */
function getElement(str) {
	return document.getElementById(str)
}

/**
 * Finds the parent window of an element by walking up the DOM Tree until it finds an ID that matches the format used by windows.<br>
 * @param { DOMElement } el
 * @returns DOMElement, if window was found, <code>null</code> if given element was not part of a window
 * @method getParentWindow
 * @name Export:getParentWindow
 */
function getParentWindow(el) {
	while (!el.id.match(/^window-\d{12}-\d{12}-\d{12}$/g)) {
		if (el.tagName == "BODY") return null;
		el = el.parentNode;
	}
	return el;
}

function nthParent(el, n) {
	let i = 0;
	if (typeof n != "number") throw new Error("n must be a number")
	while (el.tagName != "BODY" && i < n) {
		el = el.parentNode
		i++;
	}
	return el
}

export {create, isElement, getElement, getParentWindow, nthParent}
