/**
 * Panels are desktop widgets that themselves can contain small applets similar to a taskbar
 * @file panels.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:UIElements > Panel
 */
/**
 * Panels are desktop widgets that themselves can contain small applets similar to a taskbar
 * @file panels.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:UIElements > Panel
 * @namespace ClientCode.UIElements
 */
/**
 * @module ColorWheel
 * @memberof Client:UIElements
 * @description Panels are desktop widgets that themselves can contain small applets similar to a taskbar
 * @name Client:UIElements > Panel
 * @author Smittel
 */

import { create } from "../Util.mjs"
/*
WIP:
Panels are taskbar-like, similar to panels in modern linux DEs.
they can act like a task bar, contain the system tray, menu button, options, quick access, applets etc in any arrangement

They can be individually styled positioned and their behavior defined in the settings app.

Panels are drawn on top of everything else with position: fixed;

Panel behavior includes:
always visible: does not moves
unfloat: attaches itself to edge of screen if active window is maximised
hide: panel is hidden when active window is maximised

hide modes: slide, fade, pop
slide animates position, fade animates opacity, pop simply sets the visibility property

floating panels do not influence the maximised window size

both attached and floating panels can have either fixed or dynamic width

Additional info: 
floating panels cannot be full width/height.
full-width/height panels occupy 3 positions with top-bottom priority:
NW  N  NE
W       E
SW  S  SE
A full width south attached panel occupies SW, S and SE.
A full height west attached panel with the former also present then only occupies the NW and W positions, but scaling such that there is no gap between unless a gap is specified.
if a north attached full width panel is added, the west attached panel will shrink to make room.
(Maybe it would also be great to allow the user to specify this, maybe with a setting for each "end" of the panel setting the priority)

two floating panels cannot occupy the same position
a floating and an attached panel can, the floating panel will be shifted accordingly.
Attached panels have drawing priority over floating panels, meaning if a floating panel is set to "hide", it will slide under the attached panel.
If the floating panel isnt set to hide but an attached panel in the same position is set to hide, the position of the floating panel will be shifted when the attached panel is hidden, the position of the float panel is thus relative to the inside edge of the attached panel.
*/

class Panel {
    #position; // (Left/Top)|Center|(Right/Bottom) 
    #attach; #offset; // Edge the panel is attached to, offset XY relative to default
    // Default for edge 
    #floating; #width;
    #applets = []; // list of applets (the respective class object). For simplicity, the taskbar is also an applet 

    #style; // Object, contains additional styling such as offset if floating, background color, corner rounding etc
    #behavior; // additional behavior such as "unfloating" when a window is maximised

    element;
    /**
     * Terminology: <br>
     * <ul>
     * <li>Attached refers to the edge of the screen a panels position is defined relative to.</li>
     * <li>Floating means an offset from the screen edge it is attached to.</li>
     * <li>The axis of a panel follows the edge of the screen it is attached to, regardless of actual dimensions. Unattached panels have a horizontal axis.</li>
     * @todo Implement behaviors
     * @param {Object} options 
     * @param {("north"|"east"|"south"|"west"|"none")=} [options.attach="none"] Defines the edge of the display a panel is attached to. "none" invalidates position, offset will be relative to top left of screen.
     * @param {("left"|"top"|"center"|"right"|"bottom")} [options.position="center"] Defines the position of the panel along the edge. "left" and "top" are interchangeable, as are right and bottom, they only serve as a more descriptive option for horizontal and vertical panels. 
     * @param {Number[]} [options.offset=[0,0]] position offset relative to default position, [x: Number, y: Number], do NOT include "px"
     * @param {Object=} options.style Defines additional styling
     * @param {String} [options.style.[property]] [property] refers to any CSS property.
     * @param {(0.0-1.0)} [options.opacity=1.0] Defines opacity of panel including panel elements. Use background-color in options.style to make the background transparent.
     * @param {Object=} [options.behavior="none"] Defines behavior of panel depending on state of desktop and user interaction. Panels can shrink, hide, fade and dodge windows
     * @param {Object} [options.behavior.hide] Whether the panel will automatically hide
     * @param {Number} [options.behavior.hide.time] Animation time in ms
     * @param {Number} [options.behavior.hide.offset] Animation offset in ms
     * @param {String} [options.behavior.hide.anim] CSS animations (e.g. "ease-in-out", "cubic-bezier(0.1, 0.7, 1.0, 0.1)" etc)
     * @param {Object} [options.behavior.dodge] Panel will dodge windows
     * @param {Number} [options.behavior.dodge.time] Animation time in ms
     * @param {Number} [options.behavior.dodge.offset] Animation offset in ms
     * @param {String} [options.behavior.dodge.anim] CSS animations (e.g. "ease-in-out", "cubic-bezier(0.1, 0.7, 1.0, 0.1)" etc)
     * @param {Object} [options.behavior.fade] Panel will reduce opacity if not in active use
     * @param {Number} [options.behavior.fade.time] Animation time in ms
     * @param {Number} [options.behavior.fade.offset] Animation offset in ms
     * @param {String} [options.behavior.fade.anim] CSS animations (e.g. "ease-in-out", "cubic-bezier(0.1, 0.7, 1.0, 0.1)" etc)
     * @param {(0.0-1.0)} [options.behavior.fade.opacity] Opacity of panel if not in use
     *  @param {Object} [options.behavior.shrink] Panel will shrink if not in active use
     * @param {Number} [options.behavior.shrink.time] Animation time in ms
     * @param {Number} [options.behavior.shrink.offset] Animation offset in ms
     * @param {String} [options.behavior.shrink.anim] CSS animations (e.g. "ease-in-out", "cubic-bezier(0.1, 0.7, 1.0, 0.1)" etc)
     * @param {Number=} [options.behavior.shrink.perp] Size of panel if not in active use perpendicular to main axis of panel
     * @param {Number=} [options.behavior.shrink.axis] Size of panel along axis, if not in use
     * @param {Boolean} [options.floating=false] false: offset perpendicular to screen edge gets ignored. 
     * @param {("fit"|"full"|Number)} [options.fullwidth="fit"] whether or not the panel takes up the entire space along its axis
     * @example new Panel({
     *   position: "center",
     *   attach: "south",
     *   offset: [0, 20],
     *   floating: true,
     *   fullwidth: false
     * })
     */
    constructor(options) {
        console.log("options", options)
        this.element = create({
            tagname: "desktop-panel",
            childElements: [

            ]
        })
        this.setOffset(options.offset)
        this.setAttach(options.attach)
        this.setFloating(options.floating)
        this.setWidth(options.fullwidth)
        this.setPosition(options.position)
        this.setStyle(options.style)

    }

    setStyle(style) {
        try {
            const s = Object.keys(a);
            for (let i = 0; i < s.length; i++) {
                this.element.style.setProperty(s[i], style[s[i]])
            }
        } catch (e) {
            // Nothing because invalid
        }


    }

    setPosition(position) {
        const valid = ["left", "top", "center", "right", "bottom"];
        if (!valid.includes(position)) position = "center";
        this.#position = position;
        this.element.setAttribute("position", position)
    }

    setWidth(width) {
        
        this.#width = width;
        this.element.setAttribute("fullwidth", this.#width)
        if (typeof width == "number") {
            if (this.element.attach == "east" || this.element.attach == "west") {
                this.element.style.height = `${width}px`
            } else {
                this.element.style.width = `${width}px`
            }

            this.element.setAttribute("panelwidth", "fixed")
            this.#width = "fixed"
        } else if (width == "full") {
            if (this.element.attach == "east" || this.element.attach == "west") {
                this.element.style.height = `100%`
            } else {
                this.element.style.width = `100%`
            }
        } else { // "fit" or invalid
            if (this.element.attach == "east" || this.element.attach == "west") {
                this.element.style.height = `fit-content`
            } else {
                this.element.style.width = `fit-content`
            }
        }

    }

    setFloating(floating) {
        if (floating !== true) floating = false;
        this.#floating = floating;
        this.element.setAttribute("floating", floating)
    }

    setAttach(attach) {
        const valid = ["north", "east", "south", "west", "none"]
        if (!valid.includes(attach)) attach = "none";
        this.#attach = attach;
        this.element.setAttribute("attach", attach)
    }

    setOffset(offset) {
        if (!(offset instanceof Array)) offset = [0, 0];
        let c = "X"
        offset = offset.map(a => {
            a = isNaN(a) ? 0 : parseFloat(a);
            this.element.style.setProperty(`--offset${c}`, a)
            this.element.setAttribute(`offset${c}`, a)
            c = "Y"
            return
        })
        this.offset = offset
    }
}


export { Panel }