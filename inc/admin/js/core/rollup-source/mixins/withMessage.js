const messageData = {
	withMessageData: {
		busy: false,
		show: false,
		message: '',
		type: 'ok',
		intervalId: -1,
		intervalTime: 5000,
	},
};

const defaults = { ...messageData.withMessageData };

const withMessage = {
	data() {
		return messageData;
	},
	methods: {
		isBusy() {
			return this.withMessageData.busy;
		},
		setMessage(options) {
			const mergedOptions = { ...defaults, ...options };
			this.withMessageData.message = mergedOptions.message;
			this.withMessageData.type = mergedOptions.type;
			this.withMessageData.show = true;

			clearInterval(this.withMessageData.intervalId);

			this.withMessageData.intervalId = setInterval(() => {
				this.withMessageData.show = false;
			}, mergedOptions.intervalTime);
		},
		setBusy(state = true) {
			this.withMessageData.busy = state;
		},
	},
};

export default withMessage;
