/**
 * Basic implementation of control base for simple use cases.
 *
 * @type {Object}
 */
const ControlBaseBasicImplementation = {
	mounted() {
		this.assignDefaultValue();
	},
	watch: {
		elementMainValue(n) {
			this.basicValueUpdate(n, true);
		},
	},
};

/**
 * @module ControlBaseBasicImplementation
 */
export default ControlBaseBasicImplementation;
