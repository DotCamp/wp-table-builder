<template>
	<span></span>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import withMessage from '../../mixins/withMessage';

export default {
	mixins: [withMessage],
	watch: {
		getBusyState(status) {
			this.setBusy(status);
		},
		getMessageObject: {
			handler({ type, content }) {
				if (content !== '') {
					this.setMessage({ message: content, type });
				}
			},
			deep: true,
		},
		withMessageData: {
			handler({ show }) {
				if (!show) {
					this.setOkMessage('');
				}
			},
			deep: true,
		},
	},
	computed: {
		...mapGetters(['getBusyState', 'getMessageObject']),
	},
	methods: {
		...mapMutations(['setOkMessage']),
	},
};
</script>
