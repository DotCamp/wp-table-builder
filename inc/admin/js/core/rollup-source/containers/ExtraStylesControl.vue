<template>
	<div>
		<div class="wptb-settings-item-header wptb-text-transform-cap">{{ label }}</div>
		<div class="wptb-settings-row wptb-settings-middle-xs">
			<css-code-input v-model="code" @ready="cssInputReady"></css-code-input>
		</div>
	</div>
</template>

<script>
import ControlBase from '../mixins/ControlBase';
import CssCodeInput from '../components/CssCodeInput';

export default {
	components: { CssCodeInput },
	mixins: [ControlBase],
	data() {
		return {
			code: '/* Enter your custom CSS rules here */',
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
	methods: {
		cssInputReady(CssCodeInputInstance) {
			// because toggle group content is hidden, css code input can not execute its size calculations correctly, listening section group visible event to force calculate those values when containing section group becomes visible
			document.addEventListener('wptb:section-group:visible', ({ detail }) => {
				if (detail === 'style_pass_settings') {
					CssCodeInputInstance.refresh();
				}
			});
		},
	},
};
</script>
