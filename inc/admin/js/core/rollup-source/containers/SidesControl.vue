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
		<div
			class="wptb-settings-row wptb-settings-middle-xs wptb-sides-controls-wrapper"
			:class="{ 'wptb-side-values-linked': linkValues }"
		>
			<side-input
				v-for="(v, k) in sideValues"
				:label="strings[k]"
				:key="k"
				v-model="sideValues[k]"
				@changedFromFront="inputChanged"
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
		allowNegative: {
			type: Boolean,
			default: true,
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
			lastEdited: 'top',
			type: 'px',
			suppressDirty: true,
			forceUpdate: 1,
		};
	},
	mounted() {
		this.assignDefaultValue();
		this.parseElementValue();
	},
	updated() {
		this.suppressDirty = false;
	},
	watch: {
		sideValues: {
			handler() {
				this.forceUpdate += 1;
				this.calculateElementValue();
			},
			deep: true,
		},
		elementMainValue: {
			handler(n) {
				this.setAllValues(n);
				this.generateChangeEvent(n);
				if (this.suppressDirty) {
					this.resetMountedState();
				}
				this.setTableDirty(true);
			},
		},
		linkValues() {
			this.calculateElementValue();
		},
		type() {
			this.calculateElementValue();
		},
	},
	methods: {
		inputChanged(key) {
			this.lastEdited = key;
		},
		calculateElementValue() {
			this.assignLinkedValues();
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
					// eslint-disable-next-line array-callback-return
					.map((k) => {
						if (Object.prototype.hasOwnProperty.call(this.sideValues, k)) {
							let val = this.sideValues[this.lastEdited];
							if (!this.allowNegative) {
								// eslint-disable-next-line operator-assignment
								val = Math.sign(val) * val;
							}
							this.$set(this.sideValues, k, val);
							// this.sideValues[k] = val;
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

			// assign startup value type
			this.type = parsedType;

			// fetch style syntaxed values and split them into array elements
			const values = [...this.elementMainValue.matchAll(/[-?\d]+/g)].flatMap((s) => {
				return Number.parseInt(s[0], 10);
			});

			if (values) {
				// assign values to their respective properties
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
					this.sideValues.left = this.sideValues.right;
				} else {
					[this.sideValues.top, this.sideValues.right, this.sideValues.bottom, this.sideValues.left] = values;
				}
			}
		},
	},
};
</script>
