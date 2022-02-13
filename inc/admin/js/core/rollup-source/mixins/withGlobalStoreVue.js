/**
 * Create a vue instance object with global store attached.
 *
 * @param {Object} vueInstanceObject vue instance object
 * @return {Object} vue instance object
 */
const withGlobalStoreVue = (vueInstanceObject) => {
	return { ...vueInstanceObject, store: WPTB_Store };
};

/**
 * @module withGlobalStoreVue;
 */
export default withGlobalStoreVue;
