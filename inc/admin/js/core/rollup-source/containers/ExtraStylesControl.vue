<template>
	<div>
		<div class="wptb-settings-item-header wptb-text-transform-cap">{{ label }}</div>
		<div class="wptb-settings-row wptb-settings-middle-xs">
			<codemirror v-model="code" :options="cmOptions"></codemirror>
		</div>
	</div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import ControlBase from '../mixins/ControlBase';

export default {
	components: { codemirror },
	mixins: [ControlBase],
	data() {
		return {
			code: 'css value',
			cmOptions: {
				tabSize: 4,
				lineNumbers: true,
				line: true,
				matchBrackets: true,
			},
		};
	},
};
</script>
