/**
 * Controls manager for builder element's control options
 *
 * It is a singleton class that will always be sending the referenced object to all callers.
 *
 * @returns {{setControlData: setControlData, getControlData: (function(*): *), addControlScript: addControlScript, callControlScript: callControlScript}}
 * @constructor
 */
function ControlsManager() {
	const controlScripts = {};
	const controlData = {};

	/**
	 * Add a control element script to ControlsManager
	 *
	 * This is the register function for control items. Without registering the control items, you can not mount them from their inline underscore.js template. Keep the underscore.js template as clean as possible since all the work should be handled by the view element and not the business logic of the backend.
	 *
	 * @param {string} key control type key
	 * @param {function} script function to mount the control to view
	 */
	function addControlScript(key, script) {
		controlScripts[key] = script;
	}

	/**
	 * Call a control element and mount it to view
	 *
	 * This is the place where items are mounted on to the view. In the background already defined control logic will be called and mounted to the unique id html element.
	 *
	 * @param {string} key control type key that was registered with addControlScript
	 * @param {any} args  arguments to call the script with
	 */
	function callControlScript(key, args) {
		if (!controlScripts[key]) {
			throw new Error(`Called control element not found: [${key}]`);
		}
		controlScripts[key](args);
	}

	/**
	 * Register data for a control item
	 *
	 * Currently, when control items are defined in background, a data object with a needed data items are mounted with this function.
	 *
	 * @param {string} id control item unique id
	 * @param {object} data control item data
	 */
	function setControlData(id, data) {
		controlData[id] = data;
	}

	/**
	 * Retrieve data for a control item
	 *
	 * Data objects that are registered for specific control items can be fetched with the  correct id. With this way, components can reach their data with the correct unique keys.
	 *
	 * @param {string} id control item unique key
	 * @returns {object} data associated with control item
	 */
	function getControlData(id) {
		if (!controlData[id]) {
			throw new Error(`Control data for [${id}] not found.`);
		}
		return controlData[id];
	}
	return { addControlScript, callControlScript, setControlData, getControlData };
}

/**
 * @module ControlsManager module
 */
export default ControlsManager();
