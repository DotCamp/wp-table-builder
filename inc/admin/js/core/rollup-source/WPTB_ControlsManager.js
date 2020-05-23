(function ControlsManager(global, factory) {
	global.WPTB_ControlsManager = factory();
})(self || this, () => {
	const controlScripts = {};
	const controlData = {};

	function addControlScript(key, script) {
		controlScripts[key] = script;
	}

	function callControlScript(key, args) {
		if (!controlScripts[key]) {
			throw new Error('provided control key not found');
		}
		controlScripts[key](args);
	}

	function setControlData(id, data) {
		controlData[id] = data;
	}

	function getControlData(id) {
		return controlData[id];
	}
	return { addControlScript, callControlScript, setControlData , getControlData };
});
