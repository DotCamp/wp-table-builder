<template>
	<div>
		<div class="wptb-settings-item-header-include-right">
			<div class="wptb-settings-space-between">
				<div>{{ label | cap }}</div>
				<div @click.prevent="linkValues = !linkValues">
					<div class="wptb-sides-link-icon-wrapper" v-if="!linkValues">
						<img :src="linkIcon" :title="strings.link" />
					</div>
					<div class="wptb-sides-link-icon-wrapper" v-else>
						<img :src="unlinkIcon" :title="strings.unlink" />
					</div>
				</div>
			</div>
		</div>
		<div class="wptb-settings-row wptb-settings-middle-xs wptb-sides-controls-wrapper">
			<side-input
				v-for="(v, k, i) in sideValues"
				:label="strings[k]"
				:key="k"
				v-model="sideValues[k]"
				:disabled="controlDisabled(i)"
			></side-input>
			<side-dropdown></side-dropdown>
		</div>
	</div>
</template>
<script>
import ControlBase from '../mixins/ControlBase';
import SideInput from '../components/SideInput';
import SideDropdown from '../components/SideDropdown';

export default {
	props: {
		linkIcon: {
			type: String,
			default: null,
		},
		unlinkIcon: {
			type: String,
			default: null,
		},
		strings: {
			type: Object,
			required: true,
		},
	},
	mixins: [ControlBase],
	components: { SideInput, SideDropdown },
	data() {
		return {
			linkValues: false,
			sideValues: {
				top: 0,
				right: 10,
				bottom: 0,
				left: 0,
			},
		};
	},
	methods: {
		controlDisabled(index) {
			return this.linkValues && index > 0;
		},
	},
};
</script>
