import { mapGetters } from 'vuex';

/**
 * Mixin for using store connected busy state to component.
 *
 * @type {Object}
 */
const withStoreBusy = {
	computed: {
		...mapGetters(['busyStatus']),
		isBusy() {
			return this.busyStatus;
		},
	},
};

export default withStoreBusy;
