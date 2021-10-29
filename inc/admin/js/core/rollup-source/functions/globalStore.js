/* eslint-disable import/prefer-default-export */
import BuilderStore from '$Stores/builderStore';

/**
 * Create and assign store to global context.
 *
 * @param {string} key context key to assign store
 */
export const setupGlobalStore = (key = 'WPTB_Store') => {
	// eslint-disable-next-line no-restricted-globals
	const context = self || global;
	context[key] = BuilderStore;
};
