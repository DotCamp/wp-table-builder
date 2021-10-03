/**
 * Value update que handler.
 *
 * @param {ProxyArray} controlBases control bases array. Always make sure this array is supplied as a reference.
 * @class
 */
function ValueUpdateQue(controlBases) {
	/**
	 * Add value update operation to que.
	 *
	 * @param {string} elementId element control id
	 * @param {string} controlId element control id
	 * @param {any} value control value
	 */
	this.addToUpdateQue = (elementId, controlId, value) => {};
}

/**
 * @module ValueUpdateQue
 */
export default ValueUpdateQue;
