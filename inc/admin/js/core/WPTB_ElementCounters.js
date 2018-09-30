var ElementCounters = function () {

	var priv = [];
	priv['text'] = 0;
	priv['image'] = 0;
	priv['list'] = 0;
	priv['button'] = 0;

	this.increment = function (key) {
		if (!(key in priv)) {
			return;
		}
		priv[key]++;
	}

	this.nextIndex = function (key) {
		if (!(key in priv)) {
			return undefined;
		}
		return priv[key] + 1;
	}

	return this;

};