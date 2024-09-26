/**
 * Served to client on page load. Handles dragging of windows
 * @file Dragging.mjs
 * @author Smittel
 * @copyright 2024
 * @name UI:Dragging
 * @see <a href="./client.UI_Dragging.html">Module</a>
 */
/**
 * Served to client on page load. Handles dragging of windows
 * @file Dragging.mjs
 * @author Smittel
 * @copyright 2024
 * @name UI:Dragging
 * @see <a href="./client.UI_Dragging.html">Module</a>
 * @namespace ClientCode
 */
/**
 * @module Dragging
 * @memberof client
 * @description Technically a violation of the license.
 * In the future, there will be custom code, for now, a slightly
 * modified version of the original.
 * will handle Dragging windows and other draggable elements, for
 * now, this isnt a high priority, being in the proof of concept stage.
 * @name UI:Dragging
 * @author W3Schools, minor changes by Smittel
 * @see {@link https://www.w3schools.com/howto/howto_js_draggable.asp}
 * @todo Replace with own approach that better suits the needs of the project (and doesnt violate the License)
 */

import { getElement, clamp } from "./Util.mjs";
import { maximiseWindow } from "./App.mjs";
import { loseFocus } from "../Handlers.mjs";
import { currentDesktop } from "./System.mjs";

/**
 * Registers an element as draggable. Dragging is accomplished by listening to a mousedown event being fired
 * @listens MouseEvent
 * @param { HTMLElement } elmnt
 * @name Export:dragElement
 */
function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (elmnt.querySelector("#" + elmnt.id + "-header") ) {
    // if present, the header is where you move the DIV from:
    elmnt.querySelector("#" + elmnt.id + "-header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    // elmnt.onmousedown = dragMouseDown;
  }
  // alternative approach. will slowly be migrated towards this
  if (elmnt.querySelector("[data-drag-target='true']")) {
    elmnt.querySelector("[data-drag-target='true']").onmousedown = dragMouseDown;
  }
  /**
   * Moves element that triggered the mousedown event, if the mouse is moved while held down. mouseup stops the dragging in place.
   * @listens MouseEvent mouseup, mousemove
   * @param { MouseEvent } e
   * @name Internal:dragMouseDown
   */
  function dragMouseDown(e) {
    loseFocus(e)
    e = e || window.event;
    e.preventDefault();
    // e.stopPropagation();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  /**
   * Adjusts the Elements style property, more specifically, the top and left offset in px based on the mouse position delta
   * @param { MouseEvent } e
   * @listens MouseEvent mousemove
   * @name Internal:elementDrag
   */
  function elementDrag(e) {
    let target = e.target;


    e = e || window.event;
    e.preventDefault();
    // e.stopPropagation();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    // let viewportHeight = window.innerHeight;
    // let viewportWidth = window.innerWidth;
    // Window Snapping
    let newLeft = elmnt.offsetLeft - pos1;
    let newTop =  clamp(0, (elmnt.offsetTop - pos2), window.innerHeight - 30);
    if (elmnt.dataset.maximised == "true" && elmnt.id.match(/^window-\d{12}-\d{12}-\d{12}$/g)) {
      maximiseWindow(elmnt);
      newLeft = e.clientX - parseInt(elmnt.style.width) / 2
      newTop = 0;
    }

    elmnt.style.top = newTop + "px";
    elmnt.style.left = (newLeft) + "px";
    // Prevent from being moved off screen //(elmnt.offsetTop - pos2) + "px";//
    //clamp(0, (elmnt.offsetLeft - pos1), window.innerWidth  - parseInt(elmnt.style.width)) + "px";
    const prev = currentDesktop.snapPreview
    let bounds = elmnt.getBoundingClientRect();

    prev.style.left   = bounds.left + "px"
    prev.style.width  = bounds.width + "px"
    prev.style.top    = bounds.top + "px"
    prev.style.height = bounds. height+ "px"


    if (parseInt(elmnt.style.top) < 1 && elmnt.dataset.maximised != "true" && elmnt.id.match(/^window-\d{12}-\d{12}-\d{12}$/g)) {
      // if (!elmnt.classList.contains("about-to-be-maximised")) {
        elmnt.classList.add("about-to-be-maximised")
      // }
      prev.dataset.visible = true
    } else {
      prev.dataset.visible = false
      elmnt.classList.remove("about-to-be-maximised")
    }

    // Move staticElements according to parents


  }
  /**
   * Stops the dragging by fixing the top and left offsets and removing the mouseup and mousemove listeners
   * @listens MouseEvent mouseup
   * @param { MouseEvent } e
   * @name Internal:closeDragElement
   */
  function closeDragElement(e) {
    // e.stopPropagation();
    // stop moving when mouse button is released:
    if (parseInt(elmnt.style.top) < 1 && !elmnt.maximised && elmnt.id.match(/^window-\d{12}-\d{12}-\d{12}$/g)) {
      currentDesktop.snapPreview.dataset.visible = false
      maximiseWindow(elmnt);
    }
    elmnt.style["z-index"] = elmnt.dataset.oldz
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

export { dragElement }
