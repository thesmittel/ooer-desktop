/**
 * Generates a random number. Actual distribution is based on the implementation of Math.random()
 * @param { Number } min Lower bound
 * @param { Number } max Upper Bound
 * @method randomInt
 * @name Export:randomInt
 * @returns Random number between min and max inclusive
 * @todo change to a modulo based approach to somewhat mitigate any issues regarding homogeneity of Math.random()
 */
function randomInt(min, max) {
	return (Math.random() * (max - min) + min)
}

/**
 * Generates a string of digits with a given length
 * @param { Number } length
 * @method randomId
 * @name Export:randomId
 * @returns {String} A string of decimal digits with the specified length
 */
function randomId(length) {
	let id = "";
	for (let i = 0; i < length; i++) {
		id += String.fromCharCode(randomInt(0x30, 0x39))
	}
	return id;
}

/**
 * Clamps a variable between fixed bounds
 * @param { Number } lower Minimum value
 * @param { Number } value Variable value
 * @param { Number } upper Maximum value
 * @method clamp
 * @name Export:clamp
 * @returns Clamped number
 */
function clamp(lower, value, upper) {
	return Math.max(lower, Math.min(value, upper))
}

function cartesianToPolar({x, y}) {
	const r = Math.sqrt(x*x + y*y);
	const a = Math.atan2(y, x)
	return {r: r, a: a}
}

function polarToCartesian({r, a}) {
	const x = r * Math.cos(a);
	const y = r * Math.sin(a)
	return {x: x, y: y}
}

function radianToDegree(a) {
	return (a / Math.PI * 180) + 180;
}

function degreeToRadian(a) {
	return (a - 180) / 180 * Math.PI
}

/**
 *
 * @param {Number} v Value to be mapped
 * @param {Number} fromMin Original minimum
 * @param {Number} fromMax Original maxi
 * @param {Number} toMin Mapped minimum
 * @param {Number} toMax Mapped maximum
 * @returns Number
 */
function map(v, fromMin, fromMax, toMin, toMax) {
	let dFrom = fromMax - fromMin;
	let dTo = toMax - toMin;
	let dFMinV = v - fromMin;
	let vecFac = dFMinV / dFrom;
	return toMin + vecFac * dTo;
}


function round(v, d) {
	return Math.round(v * Math.pow(10, d)) / Math.pow(10, d);
}

/**
 * Takes a number and snaps it to the nearest step
 * @param {Number} val
 * @param {Number} min
 * @param {Number} step
 * @returns Number
 */
function snap(val, min, step) {
	if (step == 0) return val;

	let c = Math.round((val - min) / step) * step + min
	let truncate = Math.ceil(-Math.log10(step))
	if (truncate > 0) {
		c = round(c, truncate)
	}
	return c
}

export {randomInt, randomId, clamp, cartesianToPolar, polarToCartesian, radianToDegree, degreeToRadian, map, round, snap}
