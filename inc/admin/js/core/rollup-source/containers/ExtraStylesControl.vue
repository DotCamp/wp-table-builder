<template>
	<div>
		<div class="wptb-settings-item-header wptb-text-transform-cap">{{ label }}</div>
		<div class="wptb-settings-row wptb-settings-middle-xs">
			<css-code-input v-model="code" @ready="cssInputReady"></css-code-input>
			<input style="display: none" class="wptb-element-property" :class="uniqueId" :value="elementMainValue" />
		</div>
		<panel-message-row
			message="<b>!important</b> directive will be added automatically to your style rules."
		></panel-message-row>
	</div>
</template>

<script>
import ControlBase from '../mixins/ControlBase';
import CssCodeInput from '../components/CssCodeInput';
import PanelMessageRow from '../components/leftPanel/PanelMessageRow';

export default {
	components: { PanelMessageRow, CssCodeInput },
	mixins: [ControlBase],
	data() {
		return {
			code: '',
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
	watch: {
		elementMainValue(n) {
			this.basicValueUpdate(n, true);
		},
		code(n) {
			// base64 encode value to write to table data attribute
			this.elementMainValue = btoa(n);
		},
	},
	mounted() {
		this.assignDefaultValue();

		// base64 decode default/saved value to use at code input component
		this.code = atob(this.elementMainValue);
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
