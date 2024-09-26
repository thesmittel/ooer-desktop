/**
 * @typedef ContextMenu
 */
/**
 * Contains references to UI elements
 * @file ui.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:UIElements
 * @see <a href="./Client.Client_UIElements.html">Module</a>
 */
/**
 * Creates and manages an elements context menu
 * @file ui.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:UIElements
 * @see <a href="./Client.Client_UIElements.html">Module</a>
 * @namespace ClientCode.UIElements
 */
/**
 * @module ContextMenu
 * @memberof Client
 * @description Creates and manages an elements context menu
 * @name Client:UIElements
 * @author Smittel
 */
/**
 *
 */


import { create, round, map, clamp, cartesianToPolar, polarToCartesian, radianToDegree, degreeToRadian } from "./Util.mjs";
import { Color } from "./colors.mjs";
import { Wheel } from "./ui/colorwheel.mjs";
import { TextboxSlider, SliderGroup } from "./ui/textslider.mjs";
import { DropDownMenu } from "./ui/dropdown.mjs";
import { TextDropDown } from "./ui/textdropdown.mjs";
import { ContextMenu } from "./ui/contextmenu.mjs";
import { DialogBox } from "./ui/dialogbox.mjs";
import { Button } from "./ui/button.mjs";
let closable = true;
let activeSelector;

/**
 * only keeping this for future reference
 * @deprecated
 * @param {HTMLDivElement} parentElement
 */
function makeColorSelector(parentElement) {
    // If provided element is not dom element, throw up in a tantrum bc what else is there to do
    if (!parentElement.tagName) {
        throw new TypeError("parentElement must be DOM Element, got " + typeof parentElement)
    }

    // just grabbing a bunch of parameters
    const {x, y, width, height} = parentElement.getBoundingClientRect();
    const {r,g,b,a} = parentElement.dataset;
    const {h,s,v} = Color.rgb.toHsv({r:r,g:g,b:b})



    // Initialises the sliders to the current value
    let sliderValues = [
        Math.round(r / 2.55),
        Math.round(g / 2.55),
        Math.round(b / 2.55),
        Math.round(a)
    ]

    // carbon copy (no ref)
    let visualSlider = [...sliderValues]
    /**
     * @typedef {Object} Parameters
     * @deprecated
     * @property { Number } padding CSS Padding property of selector
     * @property { Number } width CSS width of selector
     * @property { Number } height CSS height of selector
     * @property { Number } dX Mouse X position relative to origin of selector
     * @property { Number } dY Mouse Y position relative tp origin of selector
     */
    /**
     * Shorthand to avoid duplication. Grabs a number of necessary parameters from different Objects
     * and serves them neatly to be deconstructed later.
     * dX, dY are mouse position relative to selector (0, 0), meaning hue wheel requires extra adjustment
     * @param { HTMLDivElement } activeSelector
     * @param { MouseEvent } e
     * @local
     * @returns
     * }
     */
    function valueChangeParamGrab(activeSelector, e) {
        const {x,y,width,height} = activeSelector.getBoundingClientRect();
        const {clientX, clientY } = e;

        return {
            padding: parseInt(window.getComputedStyle(activeSelector, null).getPropertyValue('padding')),
            width: width,
            height: height,
            dX: clientX - x,
            dY: clientY - y
        }
    }

    // maybe brightnessChange and hueSatChange can be refactored
    function brightnessChange(e) {
        if (!activeSelector) return;
        e.stopPropagation(); // dont know if this is needed tbh


        const { height, padding, dY } = valueChangeParamGrab(activeSelector, e)

        const relY = clamp(7 + padding, dY + 2 * padding, height + 2); // coordinates are top-to-bottom; relY is used as is for UI update

        const indicator = activeSelector.childNodes[0];
        indicator.style.top = relY + "px";

        const brightnessmask = activeSelector.parentNode.querySelector("colorpicker-huewheelbright")
        // const brightness = 1 - Math.round((relY - padding - 6) / (selector.height - padding - 6) * 10000) / 10000;     // This is what "normalises" relY to 0..1
        const brightness = map(relY, 7 + padding, height + 2, 100, 0)
        console.log(brightness, brightnessmask)
        brightnessmask.style["backdrop-filter"] = `brightness(${brightness / 100})`
        activeSelector.parentNode.dataset.v = brightness
        changeSliders(activeSelector.parentNode);
    }

    function hueSatChange(e) {
        if (!activeSelector) return;
        e.stopPropagation(); // dont know if this is needed tbh
        // necessary to calculate positions and colors
        // dX, dY are mouse positions relative to center of wheel
        const { width, height, dX, dY} = valueChangeParamGrab(activeSelector, e)

        const polar = cartesianToPolar({x: dX - width / 2, y: dY - height / 2});
        polar.r = clamp(0, polar.r, height / 2)

        const newCoords = polarToCartesian(polar)
        newCoords.x += width / 2;
        newCoords.y += height / 2;
        const indicator = activeSelector.parentNode.childNodes[2];

        indicator.style["background-color"] = `hsl(${Math.round(radianToDegree(polar.a))} 100% ${100 - Math.round(polar.r / height * 100)}%)`
        indicator.style.top = newCoords.y + "px";
        indicator.style.left = newCoords.x + "px";

        activeSelector.parentNode.parentNode.dataset.h = round(radianToDegree(polar.a), 2)
        activeSelector.parentNode.parentNode.dataset.s = Math.round(polar.r / height * 10000) / 50
        changeSliders(activeSelector.parentNode.parentNode);
    }



    function changeSliders(el) {
        const sliderContainer = el.querySelector("colorpicker-slidercontainer")
        const sliders = sliderContainer.querySelectorAll("color-slidetextbox")


        const hueWheelSelector = el.querySelector("colorpicker-wheel").childNodes[2]
        const newRgb = Color.hsv.toRgb(el.dataset)
        hueWheelSelector.style["background-color"] = `rgba(${newRgb.r},${newRgb.g},${newRgb.b},${sliderValues[3] / 100})`
        parentElement.dataset.r = newRgb.r;
        parentElement.dataset.g = newRgb.g;
        parentElement.dataset.b = newRgb.b;
        parentElement.style.background = `rgba(${newRgb.r},${newRgb.g},${newRgb.b},${sliderValues[3] / 100})`
        parentElement.dataset.a = sliderValues[3];

        switch(sliderContainer.dataset.colormode) {
            case "RGB": // fallthrough
            default:
                console.log("NEW", newRgb, sliderValues[3])
                sliderValues = [ round(newRgb.r / 255, 4), round(newRgb.g / 255, 4), round(newRgb.b / 255, 4), sliderValues[3] ]
                visualSlider = [...sliderValues.map(a => a*100)];
                break;
            case "HSV":
                sliderValues = [ round(el.dataset.h, 2), round(el.dataset.s, 2), round(el.dataset.v, 2), sliderValues[3] ]
                visualSlider = [ map(sliderValues[0], 0, 360, 0, 100), sliderValues[1], sliderValues[2], sliderValues[3] ]

                break
            case "HEX":
                const hexColor = Color.hsv.toHex(el.dataset)
                sliders[0].dataset.value = hexColor;
                sliders[0].innerText = hexColor;
                return;
        }

        for (let i = 0; i < 3; i++) {
            sliders[i].dataset.value = sliderValues[i];
            sliders[i].innerText = sliderValues[i];
            sliders[i].style = `background: var(--colorPickerSliderColor);
            background: -moz-linear-gradient(90deg, var(--colorPickerSliderColor) ${visualSlider[i]}%, var(--colorPickerSliderShadowColor) ${visualSlider[i]}%, var(--colorPickerSliderBackdrop) ${visualSlider[i] + 1}%);
            background: -webkit-gradient(90deg, var(--colorPickerSliderColor) ${visualSlider[i]}%, var(--colorPickerSliderShadowColor) ${visualSlider[i]}%, var(--colorPickerSliderBackdrop) ${visualSlider[i] + 1}%);
            background: linear-gradient(90deg, var(--colorPickerSliderColor) ${visualSlider[i]}%, var(--colorPickerSliderShadowColor) ${visualSlider[i]}%, var(--colorPickerSliderBackdrop) ${visualSlider[i] + 1}%);
            filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#8b0000",endColorstr="#6d6d6d",GradientType=1);`
        }
    }
    function resetClosable() {
        setTimeout(() => {
            closable = true;
            document.removeEventListener("mouseup", resetClosable)
        }, 1)
    }

    function switchColorMode({target}) {
        const buttons = Array.from(target.parentNode.querySelectorAll("colormode-button"))
        const sliders = Array.from(target.parentNode.querySelectorAll("color-slidetextbox"))
        const newColorMode = target.dataset.mode;
        target.parentNode.dataset.colormode = target.dataset.mode;
        if (newColorMode == "HEX") {
            for (let i = 1; i < 4; i++) {
                sliders[i].style.visibility = "hidden"
            }
            sliders[0].dataset.current = "HEX #";
            sliders[0].style.background = "none"
            sliders[0].style["background-color"] = "var(--colorPickerSliderBackdrop)";
            const {h,s,v} = target.parentNode.parentNode.dataset;
            const newHex = Color.hsv.toHex({h:h,s:s,v:v});
            sliders[0].innerText = newHex;
            // Change active
        } else if (newColorMode == "RGB" || newColorMode == "HSV") {
            for (let i = 0; i < 3; i++) {
                sliders[i].dataset.current = newColorMode.charAt(i); // i dont like this
                sliders[i].style.visibility = "visible"
            }
            sliders[3].style.visibility = "visible";

            changeSliders(target.parentNode.parentNode)
        }
        buttons.forEach(a => a.dataset.selected = false);
        target.dataset.selected = true;
        target.parentNode.dataset.colormode = target.dataset.mode;
    }

    // Shorthand to avoid code duplication
    /**
     * Avoids code duplication.
     * Prevents color wheel from being accidentally closed, calls the necessary UI updates.
     * Needs to be passed all arguments since the exact process is slightly different
     * @param { MouseEvent } e
     * @param { Function } func Handles the UI update itself
     * @param { HTMLDivElement } el The element to act upon instead of the colorpicker-indicator
     */
    function pickerUpdate(e, func, el) {
        closable = false;
        activeSelector = e.target;
        if (activeSelector.tagName == "COLORPICKER-INDICATOR") activeSelector = el;
        func(e);
        document.addEventListener("mousemove", func);
        document.addEventListener("mouseup", (e) => {
            resetClosable(e);
            document.removeEventListener("mousemove", func),
            activeSelector = null
        })
    }

    const colorpickerBright = create({
        tagname: "colorpicker-brightness",
        eventListener: {
            mousedown: (e) => {
                pickerUpdate(e, brightnessChange, e.target.parentNode)
            }
        },
        childElements: [
            {
                tagname: "colorpicker-indicator"
            }
        ]
    })

    const colorpickerWheel = create({
        tagname: "colorpicker-wheel",
        childElements: [
            {
                tagname: "colorpicker-saturation"
            },
            {
                tagname: "colorpicker-huewheelbright"
            },
            {
                tagname: "colorpicker-indicator"
            },
            {
                tagname: "colorpicker-huewheelmouse",
                eventListener: {
                    mousedown: (e) => {
                        pickerUpdate(e, hueSatChange, e.target.parentNode.childNodes[0])
                    }
                }
            }
        ]
    })

    function makeColorModeButtonObjects() {
        return ([{m: "RGB", s: true},{m: "HSV", s: false},{m: "HEX", s: false}]).map(a => {
            return {
                tagname: "colormode-button",
                innerText: a.m,
                dataset: {selected: a.s, mode: a.m},
                eventListener: {click: switchColorMode}
            }
        })
    }

    function makeColorTextBoxSliders(r,g,b,a) {
        const c = [r,g,b,a];
        const cn = ["R","G","B","A"]
        const ret = []
        for (let i in c) {
            ret.push({
                tagname: "color-slidetextbox",
                dataset: {value: c[i], index: i, current: cn[i]},
                contenteditable: true,
                innerText: round(c[i] / 255, 4),
                style: `background: var(--colorPickerSliderColor);
                background: -moz-linear-gradient(90deg, var(--colorPickerSliderColor) ${sliderValues[i]}%, var(--colorPickerSliderShadowColor) ${sliderValues[i]}%, var(--colorPickerSliderBackdrop) ${sliderValues[i] + 1}%);
                background: -webkit-gradient(90deg, var(--colorPickerSliderColor) ${sliderValues[i]}%, var(--colorPickerSliderShadowColor) ${sliderValues[i]}%, var(--colorPickerSliderBackdrop) ${sliderValues[i] + 1}%);
                background: linear-gradient(90deg, var(--colorPickerSliderColor) ${sliderValues[i]}%, var(--colorPickerSliderShadowColor) ${sliderValues[i]}%, var(--colorPickerSliderBackdrop) ${sliderValues[i] + 1}%);
                filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#8b0000",endColorstr="#6d6d6d",GradientType=1);`,

            })
        }
        return ret
    }
    const colorpickerSlideCont = create( {
        tagname: "colorpicker-slidercontainer",
        dataset: {
            colormode: "RGB"
        },
        childElements: [
            ...makeColorModeButtonObjects(),
            ...makeColorTextBoxSliders(r,g,b,a)
        ]
    })

    const colorpicker = create({
        tagname: "colorpicker-container",
        eventListener: {
            click: (e) => {e.stopPropagation()}
        },
        style: `top: ${y + height / 2}px; left: ${x + width}px; transform: translateY(-50%);`,
        eventListener: {
            mousedown: () => {
                closable = false;
                document.addEventListener("mouseup", resetClosable)
             }
        },
        childElements: [
            colorpickerBright,
            colorpickerWheel,
            colorpickerSlideCont
        ],
        dataset: {r:r,g:g,b:b,a:a,h:h,s:s,v:v}
    })

    const backdrop = create({
        tagname: "div",
        classList: ["colorwheel-backdrop"],
        eventListener: {
            click: (e) => {
                // only removes the color picker if a color isnt actively being selected
                // in other words: only clicking outside the selector removes it
                e.stopPropagation()
                if (closable && e.target.tagName == "DIV") e.target.remove()
            }
        },
        childElements: [colorpicker]
    })
    document.body.append(backdrop)

    const brightCompStyle = window.getComputedStyle(colorpickerBright, null);
    const brightPad = parseInt(brightCompStyle.getPropertyValue("padding"))
    const brightHeight = parseInt(brightCompStyle["height"])
    const brightTop = Math.min(135, Math.round(brightHeight - (v / 100 * brightHeight)) + brightPad  + 7) + "px";

    const hueCompStyle = window.getComputedStyle(colorpickerWheel, null);
    const hueHeight = parseInt(hueCompStyle["height"])
    const hueSat = polarToCartesian({a: degreeToRadian(h), r: s / 200 * hueHeight});
    const hueStyle = `top: ${Math.round(hueSat.y + 64)}px; left: ${Math.round(hueSat.x + 64)}px; background-color: rgba(${r}, ${g}, ${b}, 1)`

    colorpickerWheel.childNodes[1].style["backdrop-filter"] = `brightness(${v / 100})`

    colorpickerBright.childNodes[0].style.top = brightTop;
    colorpickerWheel.childNodes[2].style = hueStyle;

}



/**
 * Right-click triggered options menu, attachable to any element
 * @member ContextMenu
 * @name Client:UIElements > ContextMenu
 * @see <a href="./client.Client_UIElements%2520_%2520ContextMenu.html">Client:UIElements > ContextMenu</a>
 */
/**
 * Right-click triggered options menu, attachable to any element
 * @member Wheel
 * @name Client:UIElements > ColorWheel
 * @see <a href="./Client_UIElements.Client_UIElements%2520_%2520ColorWheel.html">Client:UIElements > ColorWheel</a>
 */


export {Wheel, Button, TextboxSlider, SliderGroup, DropDownMenu, TextDropDown, ContextMenu, DialogBox}
