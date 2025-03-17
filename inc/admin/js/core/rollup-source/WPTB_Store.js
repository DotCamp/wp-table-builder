// @deprecated
// import BuilderStore from '$Stores/builderStore';
//
// /**
//  * Wptb store UMD module.
//  */
(function umd(key, context, factory) {
	// eslint-disable-next-line no-param-reassign
	context[key] = factory();
	// eslint-disable-next-line no-restricted-globals
})('WPTB_Store', self || global, () => {
	return BuilderStore;
});
