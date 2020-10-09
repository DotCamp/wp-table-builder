import React from 'react';

/**
 * React context for table data.
 *
 * @type {React.Context<{attributes: {}, savedTable: null, setAttributes: setAttributes, setSavedTable: setSavedTable, blockData: {}}>}
 */
export const TableContext = React.createContext({
	attributes: {},
	setAttributes: () => {},
	savedTable: null,
	setSavedTable: () => {},
	blockData: {},
});

/**
 * HOC for table context.
 *
 * @param {Function | Class} Component react component to be wrapped
 * @return {function(*): *}
 */
export function withContext(Component) {
	return function WithTableContextComponent(props) {
		return <TableContext.Consumer>{(context) => <Component {...context} {...props} />}</TableContext.Consumer>;
	};
}
