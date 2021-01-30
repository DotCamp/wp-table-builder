<template>
	<div ref="mainWrapper" class="wptb-css-code-input">
		<empty-cover v-if="disabled">
			<slot name="disabled"></slot>
		</empty-cover>
	</div>
</template>

<script>
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/css/css';
import EmptyCover from './EmptyCover';

export default {
	components: { EmptyCover },
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
		disabled: {
			type: Boolean,
			default: false,
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
	watch: {
		value(n) {
			// only update css code value if supplied value is different than the one on the input, this way we don't need to recalculate current cursor position after every update
			if (this.instance && this.instance.getValue() !== n) {
				this.instance.setValue(n);
			}
		},
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
