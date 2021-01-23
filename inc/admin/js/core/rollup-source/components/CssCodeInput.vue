<template>
	<div ref="mainWrapper" class="wptb-css-code-input"></div>
</template>

<script>
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/css/css';

export default {
	props: {
		options: {
			type: Object,
			default: () => {
				return {};
			},
		},
		value: {
			type: String,
			default: '/* Enter your custom CSS rules here */',
		},
	},
	model: {
		prop: 'value',
		event: 'valueChanged',
	},
	data() {
		return {
			defaultOptions: {
				mode: 'text/css',
				tabSize: 4,
				styleActiveLine: true,
				lineNumbers: true,
				line: true,
				showCursorWhenSelecting: true,
				lineWrapping: true,
			},
			instance: null,
		};
	},
	mounted() {
		this.$nextTick(() => {
			// merge options and create a codemirror instance
			this.instance = CodeMirror(this.$refs.mainWrapper, {
				...this.defaultOptions,
				...this.options,
				value: this.value,
			});

			// fire a value changed event to signal a change occurred on code input
			this.instance.on('change', (instance) => {
				this.$emit('valueChanged', instance.getValue());
			});

			// fire a ready event to signal code input instance is ready to be used
			this.$emit('ready', this.instance);
		});
	},
};
</script>
