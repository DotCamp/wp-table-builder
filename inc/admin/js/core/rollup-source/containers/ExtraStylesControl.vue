<template>
	<div>
		<div class="wptb-settings-item-header wptb-text-transform-cap">{{ label }}</div>
		<div class="wptb-settings-row wptb-settings-middle-xs">
			<codemirror @ready="codeMirrorReady" ref="codeMirrorBase" v-model="code" :options="cmOptions"></codemirror>
		</div>
	</div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/css/css';
import ControlBase from '../mixins/ControlBase';

export default {
	components: { codemirror },
	mixins: [ControlBase],
	data() {
		return {
			code: '/* Enter your custom CSS properties here */',
			cmOptions: {
				tabSize: 4,
				styleActiveLine: true,
				lineNumbers: true,
				line: true,
				mode: 'text/css',
				showCursorWhenSelecting: true,
				lineWrapping: true,
			},
		};
	},
	mounted() {
		this.$nextTick(() => {});
	},
	methods: {
		codeMirrorReady(CodeMirror) {
			// because toggle group content is hidden, codemirror can not execute its size calculations correctly, listening section group visible event to force calculate those values when containing section group becomes visible
			document.addEventListener('wptb:section-group:visible', ({ detail }) => {
				if (detail === 'style_pass_settings') {
					CodeMirror.refresh();
				}
			});
		},
	},
};
</script>
