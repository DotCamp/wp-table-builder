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
			<side-dropdown v-model="type"></side-dropdown>
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
		defaultValue: {
			type: String,
			default: '0 0 0 0',
		},
	},
	mixins: [ControlBase],
	components: { SideInput, SideDropdown },
	data() {
		return {
			linkValues: false,
			sideValues: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
			},
			type: 'px',
		};
	},
	mounted() {
		this.assignDefaultValue();
		this.parseElementValue();
	},
	watch: {
		sideValues: {
			handler() {
				this.calculateElementValue();
			},
			deep: true,
		},
		'sideValues.top': {
			handler() {
				this.assignLinkedValues();
			},
		},
		linkValues() {
			this.assignLinkedValues();
		},
		elementMainValue(n) {
			this.setAllValues(n);
			this.generateChangeEvent(n);
			this.setTableDirty(true);
		},
		type() {
			this.calculateElementValue();
		},
	},
	methods: {
		controlDisabled(index) {
			return this.linkValues && index > 0;
		},
		calculateElementValue() {
			this.elementMainValue = Object.keys(this.sideValues)
				// eslint-disable-next-line array-callback-return,consistent-return
				.map((k) => {
					if (Object.prototype.hasOwnProperty.call(this.sideValues, k)) {
						return this.sideValues[k] + this.type;
					}
				})
				.join(' ');
		},
		assignLinkedValues() {
			if (this.linkValues) {
				Object.keys(this.sideValues)
					.filter((f) => f !== 'top')
					// eslint-disable-next-line array-callback-return
					.map((k) => {
						if (Object.prototype.hasOwnProperty.call(this.sideValues, k)) {
							this.sideValues[k] = this.sideValues.top;
						}
					});
			}
		},
		parseElementValue() {
			let parsedType = 'px';

			// find out value type from element main value or use the default type
			// eslint-disable-next-line array-callback-return
			this.elementMainValue.split(' ').map((s) => {
				const match = s.match(/([a-z%?]+)/);
				if (match && match[1]) {
					[, parsedType] = match;
				}
			});

			this.type = parsedType;

			const values = [...this.elementMainValue.matchAll(/[\d]+/g)].flatMap((s) => {
				return Number.parseInt(s[0], 10);
			});

			if (values) {
				if (values.length === 1) {
					[this.sideValues.top] = values;
					[this.sideValues.bottom] = values;
					[this.sideValues.left] = values;
					[this.sideValues.right] = values;

					// link values if all of the parsed values are the same
					this.linkValues = true;
				} else if (values.length === 2) {
					[this.sideValues.bottom, this.sideValues.left] = values;
					[this.sideValues.top, this.sideValues.right] = values;
				} else if (values.length === 3) {
					[this.sideValues.top, this.sideValues.right, this.sideValues.bottom] = values;
					this.sideValues.left = 0;
				} else {
					[this.sideValues.top, this.sideValues.right, this.sideValues.bottom, this.sideValues.left] = values;
				}
			}
		},
	},
};
</script>
