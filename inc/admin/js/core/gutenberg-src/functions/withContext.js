import React from 'react';

/**
 * React context for table data.
 *
 * @type {Object}
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
 * @param {Function} Component react component to be wrapped
 * @return {function(*): *} with context function
 */
export function withContext(Component) {
	return function WithTableContextComponent(props) {
		return <TableContext.Consumer>{(context) => <Component {...context} {...props} />}</TableContext.Consumer>;
	};
}
