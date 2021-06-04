<template>
	<div>
		<panel-dropdown-control :label="translation('relativeLabel') | cap"></panel-dropdown-control>
	</div>
</template>

<script>
import ControlBase from '../mixins/ControlBase';
import PanelDropdownControl from '../components/PanelDropdownControl';
import withTranslation from '../mixins/withTranslation';
import { cap } from '../plugins/filters';

export default {
	name: 'ImageSizeControl',
	components: { PanelDropdownControl },
	mixins: [ControlBase, withTranslation],
	filters: {
		cap,
	},
};
</script>
