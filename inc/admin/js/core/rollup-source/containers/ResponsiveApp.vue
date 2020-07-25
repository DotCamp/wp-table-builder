<template>
	<transition name="wptb-fade">
		<div ref="builderResponsive" v-if="isVisible" class="wptb-builder-responsive">
			<div class="wptb-responsive-menu-tools">
				<screen-size-slider
					:end-padding="sliderPadding"
					:stops="directives.breakpoints"
					@slide="handleSizeSlideChange"
					:model-val="appOptions.currentSize"
					:enable-breakpoint-customization="false"
				></screen-size-slider>
			</div>
			<div class="wptb-responsive-builder-main wptb-checkerboard-pattern wptb-plugin-inset-shadow-md">
				<div class="wptb-responsive-builder-toolbox-float">
					<number-postfix-input
						class="wptb-size-input wptb-plugin-box-shadow-xl"
						v-model="appOptions.currentSize"
						post-fix="px"
						:only-enter="true"
					></number-postfix-input>
					<material-button
						size="fit-content"
						class="wptb-plugin-box-shadow-xl"
						:click="showCellIdentifications"
						>{{ strings.identifyCells | cap }}
					</material-button>
				</div>
				<table-clone
					:clone="isVisible"
					:clone-query="cloneQuery"
					:table-directives="currentDirectives"
					@tableCloned="tableCloned"
					@directivesCopied="directivesCopied"
					:table-style="tableStyle"
					ref="tableClone"
				></table-clone>
				<transition name="wptb-fade">
					<div v-if="!directives.responsiveEnabled" class="wptb-responsive-disabled-table-overlay"></div>
				</transition>
				<transition name="wptb-fade">
					<div v-show="rebuilding" class="wptb-responsive-wait-overlay">{{ strings.rebuilding }}</div>
				</transition>
				<modal-window
					:visible="appOptions.hasLegacyResponsive"
					:message="strings.legacyResponsiveWarning"
					:relative-ref="modalRelative"
					:callback="
						() => {
							appOptions.hasLegacyResponsive = false;
						}
					"
				></modal-window>
			</div>
		</div>
	</transition>
</template>
<script>
import TableClone from '../components/TableClone';
import ScreenSizeSlider from '../components/ScreenSizeSlider';
/* eslint-disable camelcase */
import WPTB_ResponsiveFrontend from '../../../WPTB_ResponsiveFrontend';
import DeBouncer from '../functions/DeBouncer';
import ModalWindow from '../components/ModalWindow';
import MaterialButton from '../components/MaterialButton';
import NumberPostfixInput from '../components/NumberPostfixInput';

export default {
	props: {
		cloneQuery: {
			type: String,
			required: true,
		},
		screenSizes: Object,
		compareSizes: Object,
	},
	components: {
		TableClone,
		ScreenSizeSlider,
		ModalWindow,
		MaterialButton,
		NumberPostfixInput,
	},
	data() {
		return {
			isVisible: true,
			currentSize: 0,
			currentDirectives: null,
			currentSizeRangeName: 'desktop',
			sliderPadding: 20,
			sizeStops: {},
			responsiveFrontend: null,
			rebuilding: false,
			debounceTime: 1000,
			sizeLimitMin: 100,
			sizeLimitMax: 0,
		};
	},
	watch: {
		currentSizeRangeName(n) {
			this.appOptions.currentBreakpoint = n;
		},
		directives: {
			handler() {
				this.currentDirectives = this.encodeResponsiveDirectives();
			},
			deep: true,
		},
		'appOptions.currentSize': {
			handler(n) {
				const previousRangeName = this.currentSizeRangeName;
				this.currentSizeRangeName = this.calculateSizeRangeName(n);

				if (previousRangeName !== this.currentSizeRangeName && this.directives.responsiveEnabled) {
					this.rebuilding = true;
					DeBouncer(
						'currentSize',
						() => {
							// rebuilt table according to its responsive directives
							this.responsiveFrontend.rebuildTables(this.appOptions.currentSize);
							this.rebuilding = false;
						},
						this.debounceTime
					);
				}
			},
		},
	},
	beforeMount() {
		// calculate slider size stops before mounting the component
		// this.sizeStops = this.sliderSizeStops();
	},
	mounted() {
		// add a listener to section change event to hide/show component
		document.addEventListener('wptbSectionChanged', (e) => {
			this.isVisible = e.detail === 'table_responsive_menu';
		});

		this.sizeLimitMax = this.$refs.builderResponsive.getBoundingClientRect().width;
	},
	computed: {
		/**
		 * Calculate certain properties of responsive table element's style
		 */
		tableStyle() {
			if (!this.directives.responsiveEnabled) {
				return {};
			}
			// don't make any style changes to table in desktop breakpoint to reflect the table builder styles intact since currently the breakpoint users are creating their table, by default, is desktop
			// if (this.currentSizeRangeName === 'desktop') {
			// 	return {};
			// }

			const width = this.limitToRange(
				this.appOptions.currentSize,
				Math.min(this.sizeLimitMin, this.sizeLimitMax),
				Math.max(this.sizeLimitMin, this.sizeLimitMax)
			);

			return {
				width: `${width}px`,
			};
		},
		modalRelative() {
			return document.querySelector('.wptb-builder-panel');
		},
	},
	methods: {
		/**
		 * Limit a number between a min/max range.
		 *
		 * @param {number} val value to be limited
		 * @param {number} min minimum value of range
		 * @param {number} max maximum value of range
		 * @return {number} limited value
		 */
		limitToRange(val, min, max) {
			if (val > max) {
				return max;
			}
			if (val < min) {
				return min;
			}
			return val;
		},
		// handler for `tableCloned` event of `TableClone` component. Mainly will be used to set up `WPTB_ResponsiveFrontend` class and update directives with the ones found on main table
		tableCloned(mainDirectives) {
			this.responsiveFrontend = new WPTB_ResponsiveFrontend({ query: '.wptb-builder-responsive table' });
			// there is already a directive at main table, decode and assign it to current ones
			if (mainDirectives) {
				const decodedMainDirectives = this.decodeResponsiveDirectives(mainDirectives);

				try {
					const mainDirectiveObj = JSON.parse(decodedMainDirectives);

					this.deepMergeObject(this.directives, mainDirectiveObj);
				} catch (e) {
					// eslint-disable-next-line no-console
					console.warn('[WPTB]: invalid directive found at main table');
				}
			}
		},
		/**
		 * Deep merge two objects.
		 *
		 * In order to not break the object reference between store patterned objects, this function will be used to add every key of target object to base object, so instead of equalizing the store object to a new value, key values of the store will be updated, this way, object reference link will not be broken and reactive abilities of the store will continue to function.
		 *
		 * @param {object} baseObj base object
		 * @param {object} targetObj target object
		 */
		deepMergeObject(baseObj, targetObj) {
			// eslint-disable-next-line array-callback-return
			Object.keys(targetObj).map((key) => {
				if (Object.prototype.hasOwnProperty.call(targetObj, key)) {
					if (baseObj[key] !== undefined) {
						if (typeof baseObj[key] === 'object') {
							// eslint-disable-next-line no-param-reassign
							this.deepMergeObject(baseObj[key], targetObj[key]);
						} else {
							// eslint-disable-next-line no-param-reassign
							baseObj[key] = targetObj[key];
						}
					}
				}
			});
		},
		// handler for event that signals end of directive copy operation to table on DOM
		directivesCopied(mainTableHaveDirectives) {
			// rebuilt table according to its responsive directives
			this.responsiveFrontend.rebuildTables(this.appOptions.currentSize);

			// if main table have directives, it means that we are using them, so it is unnecessary to fire up save event for the table
			if (!mainTableHaveDirectives) {
				new WPTB_TableStateSaveManager().tableStateSet();
			}

			this.rebuilding = false;
		},
		/**
		 * @deprecated
		 * Recreate an object compatible with screen-size-slider component.
		 *
		 * This function will reduce the screen sizes object sent from backend to be compatible with screen-size-slider component.
		 *
		 * @returns {object} reformatted slider size object
		 */
		sliderSizeStops() {
			const normalizedStops = Object.keys(this.screenSizes).reduce((p, c) => {
				if (Object.prototype.hasOwnProperty.call(this.screenSizes, c)) {
					// eslint-disable-next-line no-param-reassign
					p[this.screenSizes[c].name] = this.screenSizes[c].width;
				}
				return p;
			}, {});

			// add stops to directives
			// eslint-disable-next-line vue/no-side-effects-in-computed-properties
			this.directives.stops = normalizedStops;

			return normalizedStops;
		},
		/**
		 * Find out the range key name for the size value.
		 *
		 * @param {number} val size value
		 * @return {string} range key name
		 */
		calculateSizeRangeName(val) {
			const mainObject = this.directives.breakpoints;

			const ranges = Object.keys(mainObject)
				.filter((s) => {
					if (Object.prototype.hasOwnProperty.call(mainObject, s)) {
						return mainObject[s].width <= val;
					}
					return false;
				})
				.sort((a, b) => {
					return mainObject[a].width - mainObject[b].width;
				});

			if (ranges.length === 0) {
				return 'mobile';
			}

			return ranges[ranges.length - 1];
		},
		handleSizeSlideChange(e) {
			this.appOptions.currentSize = e;
		},
		/**
		 * Encode responsive directives.
		 *
		 * @returns {String} base64 string representation of directives
		 */
		encodeResponsiveDirectives() {
			const stringifiedDirectives = JSON.stringify(this.directives);

			return btoa(stringifiedDirectives);
		},
		/**
		 * Decode responsive directives.
		 *
		 * @param {String} val
		 * @returns {String} decoded value
		 */
		decodeResponsiveDirectives(val) {
			return atob(val);
		},
		showCellIdentifications() {
			this.appOptions.identifyCells = true;
		},
	},
};
</script>
