<template>
	<transition name="wptb-fade">
		<div
			ref="builderResponsive"
			v-if="isVisible"
			class="wptb-builder-responsive"
			:data-wptb-responsive-status="!directives.responsiveEnabled"
		>
			<div class="wptb-responsive-menu-tools">
				<screen-size-slider
					:end-padding="sliderPadding"
					:stops="directives.breakpoints"
					@slide="handleSizeSlideChange"
					:model-val="appOptions.currentSize"
					:enable-breakpoint-customization="appOptions.breakpointCustomization"
				></screen-size-slider>
			</div>
			<div
				ref="builderMainResponsive"
				class="wptb-responsive-builder-main wptb-checkerboard-pattern wptb-plugin-inset-shadow-md"
			>
				<div class="wptb-responsive-builder-toolbox-float">
					<div class="wptb-responsive-builder-toolbox-left-float">
						<number-postfix-input
							class="wptb-size-input wptb-plugin-box-shadow-xl"
							v-model="appOptions.currentSize"
							post-fix="px"
							:only-enter="true"
						></number-postfix-input>
						<number-postfix-buttons
							:input-class="['wptb-size-input', 'wptb-plugin-box-shadow-xl']"
							v-model="resizePercent"
							post-fix="%"
							:only-enter="true"
							:min="10"
							:max="100"
							:enableLimit="true"
						></number-postfix-buttons>
					</div>
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
import TableClone from '$Components/TableClone';
import ScreenSizeSlider from '$Components/ScreenSizeSlider';
/* eslint-disable camelcase */
import WPTB_ResponsiveFrontend from '$Js/WPTB_ResponsiveFrontend';
import WPTB_SortableTable from '$Core/WPTB_SortableTable';
import DeBouncer from '$Functions/DeBouncer';
import ModalWindow from '$Components/ModalWindow';
import MaterialButton from '$Components/MaterialButton';
import NumberPostfixInput from '$Components/NumberPostfixInput';
import NumberPostfixButtons from '$Components/NumberPostfixButtons';

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
		NumberPostfixButtons,
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
			resizePercent: 100,
			firstMountStyle: true,
		};
	},
	watch: {
		currentSizeRangeName(n) {
			this.appOptions.currentBreakpoint = n;
		},
		'directives.responsiveEnabled': {
			handler(n) {
				if (!n) {
					// scroll responsive preview to its start position if it is disabled
					this.$refs.builderMainResponsive.scroll(0, 0);
				}
			},
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
	mounted() {
		// add a listener to section change event to hide/show component
		document.addEventListener('wptbSectionChanged', (e) => {
			this.isVisible = e.detail === 'table_responsive_menu';
		});

		this.calculateSizeLimitMax();
	},
	computed: {
		/**
		 * Calculate certain properties of responsive table element's style
		 */
		tableStyle() {
			const width = this.limitToRange(
				this.appOptions.currentSize,
				Math.min(this.sizeLimitMin, this.sizeLimitMax),
				Math.max(this.sizeLimitMin, this.sizeLimitMax)
			);

			return {
				width: `${width}px`,
				transform: `scale(${this.resizePercent / 100})`,
				transformOrigin: 'center top',
				transition: 'all 0.2s ease-out',
			};
		},
		modalRelative() {
			return document.querySelector('.wptb-builder-panel');
		},
	},
	methods: {
		headerFullyMerged(table) {
			const isHeaderFullyMerged =
				Array.from(Array.from(table.querySelectorAll('tr'))[0].querySelectorAll('td')).length === 1;

			this.appOptions.headerFullyMerged = isHeaderFullyMerged;
		},
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
		tableCloned(mainDirectives, mainTable, clonedTable) {
			// calculate new max size limit at every table clone to reflect changes if there is any
			this.calculateSizeLimitMax();

			this.headerFullyMerged(clonedTable);

			this.responsiveFrontend = new WPTB_ResponsiveFrontend({ query: '.wptb-builder-responsive table' });
			const sortableTable = new WPTB_SortableTable({ table: clonedTable });
			sortableTable.sortableTableInitialization(this.responsiveFrontend);
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
			const tabEvent = new CustomEvent('table:cloned', {
				detail: {
					WPTB_ResponsiveFrontend,
					mainTable,
					clonedTable,
				},
			});
			mainTable.dispatchEvent(tabEvent);
		},
		/**
		 * Deep merge two objects.
		 *
		 * In order to not break the object reference between store patterned objects, this function will be used to add every key of target object to base object, so instead of equalizing the store object to a new value, key values of the store will be updated, this way, object reference link will not be broken and reactive abilities of the store will continue to function.
		 *
		 * @param {Object} baseObj base object
		 * @param {Object} targetObj target object
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
		directivesCopied(directivesChanged) {
			// rebuilt table according to its responsive directives
			this.responsiveFrontend.rebuildTables(this.appOptions.currentSize);

			// if main table have directives, it means that we are using them, so it is unnecessary to fire up save event for the table
			if (directivesChanged) {
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
		 * @return {Object} reformatted slider size object
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
		 * @return {string} base64 string representation of directives
		 */
		encodeResponsiveDirectives() {
			const stringifiedDirectives = JSON.stringify(this.directives);

			return btoa(stringifiedDirectives);
		},
		/**
		 * Decode responsive directives.
		 *
		 * @param {string} val
		 * @return {string} decoded value
		 */
		decodeResponsiveDirectives(val) {
			return atob(val);
		},
		showCellIdentifications() {
			this.appOptions.identifyCells = true;
		},
		calculateSizeLimitMax() {
			const maxWidth = Number.parseInt(
				document.querySelector(this.cloneQuery).dataset.wptbTableContainerMaxWidth,
				10
			);
			const builderWidth = this.$refs.builderResponsive.getBoundingClientRect().width;

			// take maximum width of table to consideration while calculating size limit max
			this.sizeLimitMax = Math.min(maxWidth, builderWidth);
		},
	},
};
</script>
