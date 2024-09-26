/**
 * 
 * @param {Array} arr 
 * @param {Number} index 
 * @returns Array
 */
function deleteElement(arr, index) {
	if (typeof e != "number") throw new TypeError("Util:deleteElement(arr, e): argument e must be a number")
	if (e < 0 || e >= arr.length) throw new RangeError("Util:deleteElement(arr, e): argument e must be a valid index.")
	if (!(arr instanceof Array)) throw new TypeError("Util:deleteElement(arr, e): argument arr must be an Array")
	const fp = arr.splice(index)
	fp.shift();
	return [...arr, ...fp]
}

export { deleteElement }