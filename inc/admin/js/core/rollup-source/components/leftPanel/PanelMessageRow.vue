<template>
	<div class="wptb-element-option wptb-settings-items wptb-plugin-width-full">
		<div class="wptb-settings-row wptb-settings-middle-xs">
			<div class="wptb-control-row wptb-flex wptb-flex-row wptb-flex-align-center wptb-panel-message">
				<div
					class="wptb-panel-message-icon wptb-flex-row wptb-flex-align-center wptb-flex-justify-center"
					v-html="getIcon('info')"
				></div>
				<div v-html="message"></div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		message: {
			type: String,
			default: 'default message',
		},
	},
	data() {
		return {
			icons: {
				info:
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"/></svg>',
			},
		};
	},
	methods: {
		getIcon(type) {
			return this.icons[type] ?? this.icons.info;
		},
	},
};
</script>
