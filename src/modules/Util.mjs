/**
 * Served to client on page load. Contains utility functions.
 * @file Util.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:Util
 * @see <a href="./client.Client_Util.html">Module</a>
 */
/**
 * Served to client on page load. Contains utility functions.
 * @file Util.mjs
 * @author Smittel
 * @copyright 2024
 * @name Client:Util
 * @see <a href="./client.Client_Util.html">Module</a>
 * @namespace ClientCode
 */
/**
 * @module Util
 * @memberof client
 * @description Various utility functions
 * @name Client:Util
 * @author Smittel
 */

import {sanitise, unsanitise, formattingParser} from "./util/text.mjs"
import {deleteElement} from "./util/array.mjs"
import {create, isElement, getElement, getParentWindow, nthParent} from "./util/dom.mjs"
import {randomInt, randomId, clamp, cartesianToPolar, polarToCartesian, radianToDegree, degreeToRadian, map, round, snap} from "./util/math.mjs"

/*
impending structure change to:

import * as text from "/js/modules/util/text.mjs"
import * as dom from "/js/modules/util/dom.mjs"
import * as math from "/js/modules/util/math.mjs"
import * as array from "/js/modules/util/array.mjs"
*/




export {map, snap, deleteElement, nthParent, round, isElement, cartesianToPolar, polarToCartesian, radianToDegree, degreeToRadian, create, getElement, clamp, getParentWindow, randomInt, randomId, sanitise, unsanitise,formattingParser}