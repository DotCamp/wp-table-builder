// global data provided from backend
const store = { ...wptbAdminSettingsData.options };
const rawStore = { ...wptbAdminSettingsData.options };

/**
 * singleton store mixin for Vue components
 *
 * @type {Object}
 */
const withStore = {
	data() {
		return {
			store,
			rawStore,
		};
	},
	methods: {
		revertStore() {
			// eslint-disable-next-line array-callback-return
			Object.keys(this.store).map((k) => {
				if (Object.prototype.hasOwnProperty.call(this.store, k)) {
					this.store[k] = this.rawStore[k];
				}
			});
		},
	},
};

/**
 * @module withStore module
 */
export default withStore;
