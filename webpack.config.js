const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const fs = require('fs');
const path = require('path');

const entryDir = path.resolve(__dirname, 'inc', 'admin', 'js', 'core');
const outputDir = path.resolve(__dirname, 'inc', 'admin', 'js');

const entryFiles = fs.readdirSync(entryDir);

const entry = entryFiles.reduce((carry, item) => {
	const parsedFile = path.parse(item);

	if (parsedFile.ext === '.js') {
		// eslint-disable-next-line no-param-reassign
		carry[parsedFile.name] = path.resolve(entryDir, item);
	}

	return carry;
}, {});

const output = {
	filename: '[name].js',
	path: outputDir,
};

module.exports = {
	...defaultConfig,
	entry,
	output,
};
