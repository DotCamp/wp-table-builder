<template>
	<div class="wptb-responsive-clone-wrapper">
		<div class="wptb-responsive-clone-inner-wrapper">
			<div :style="tableStyle">
				<div ref="tableClone"></div>
			</div>
		</div>
	</div>
</template>
<script>
import DeBouncer from '$Functions/DeBouncer';

export default {
	props: {
		clone: {
			type: Boolean,
			default: false,
			required: false,
		},
		cloneQuery: {
			type: String,
			required: true,
		},
		tableDirectives: {
			type: String,
			default: '',
		},
		tableStyle: {
			type: Object,
			default: () => {
				// eslint-disable-next-line no-empty,no-lone-blocks
				{
				}
			},
		},
	},
	inheritAttrs: false,
	data() {
		return {
			// in order to not mutate the prop sent from the parent component, will be modifying the data prop instead
			cloneInner: false,
			clonedTable: null,
			mainTable: null,
			tableDirectiveDatasetId: 'wptbResponsiveDirectives',
			tableHaveDirectives: false,
			startupOperation: true,
		};
	},
	mounted() {
		this.cloneInner = this.clone;
	},
	watch: {
		/**
		 * Watch clone prop.
		 *
		 * In order to prevent the mutation of the prop sent by parent element, will be directing any value change coming from parent to data property.
		 *
		 * @param {boolean} n new value
		 */
		clone(n) {
			this.cloneInner = n;
		},
		// switch to decide whether to clone the main table into responsive area or not
		cloneInner(n) {
			if (n) {
				this.startClone();
				this.cloneInner = false;
			}
		},
		tableDirectives(n, o) {
			if (n) {
				this.addDirectivesToTable(n, o);
			}
		},
		'appOptions.identifyCells': {
			handler(n) {
				if (n) {
					this.showCellIdentification();
					this.appOptions.identifyCells = false;
				}
			},
		},
		'directives.responsiveEnabled': {
			handler(n) {
				if (n) {
					this.mainTable.dataset.wptbAdaptiveTable = 0;
				}
			},
		},
	},
	methods: {
		/**
		 * Start clone operation.
		 *
		 * Basic logic of this clone operation is to clone the main table from table builder and mount it to referenced element at template. This way, we will have the exact same copy of the element from table builder, and will only focus on responsive functionality of it.
		 */
		startClone() {
			this.mainTable = document.querySelector(this.cloneQuery);

			if (!this.mainTable) {
				throw new Error(`no clone target is found with a query value of ${this.cloneQuery}`);
			}

			// check for legacy responsive functionality on main table
			this.appOptions.hasLegacyResponsive = this.mainTable.dataset.wptbAdaptiveTable === '1';

			this.clonedTable = this.mainTable.cloneNode(true);
			this.clonedTable.classList.add('wptb-plugin-box-shadow-xl');
			this.$refs.tableClone.appendChild(this.clonedTable);

			// directives that are already present in the main table
			// this directives may be saved from on another session of table builder or added there in the current session, what matters is, always use the main table directives as the base of source and update the other directives currently available according to them
			const mainTableDirectives = this.mainTable.dataset[this.tableDirectiveDatasetId];

			// since this component will be re-cloning the table at every visibility change of responsive menu, we should add necessary table directives to cloned table without waiting for them to be automatically added on change
			if (this.tableDirectives) {
				this.addDirectivesToTable(this.tableDirectives);
			}

			// switch for determining if we will merge already present directives at main table
			this.tableHaveDirectives = mainTableDirectives !== undefined;

			if (!this.tableHaveDirectives) {
				this.startupOperation = false;
			} else {
				const responsiveStatus = JSON.parse(atob(mainTableDirectives)).responsiveEnabled;

				if (!responsiveStatus) {
					this.startupOperation = false;
				}
			}

			this.setupCellIdentification(this.clonedTable);

			// emit an event signalling cloning main table is completed
			this.$emit('tableCloned', mainTableDirectives, this.mainTable, this.clonedTable);
		},
		/**
		 * Add directives to dataset of cloned table and main table.
		 *
		 * @param {string} n new directives
		 * @param {string} o old directives
		 */
		addDirectivesToTable(n, o) {
			if (this.clonedTable && this.mainTable) {
				// add directives to clone
				this.clonedTable.dataset[this.tableDirectiveDatasetId] = n;

				// add directives to main table
				this.mainTable.dataset[this.tableDirectiveDatasetId] = n;

				let isChanged = null;

				if (o === null && !this.startupOperation) {
					const responsiveStatus = JSON.parse(atob(n)).responsiveEnabled;
					if (responsiveStatus) {
						isChanged = true;
					}
				} else {
					isChanged = o ? n !== o : false;
				}

				// emit an event signalling end of directive copy operation
				this.$emit('directivesCopied', isChanged);

				this.tableHaveDirectives = false;

				this.startupOperation = false;
			}
		},
		/**
		 * Setup cell identification elements.
		 *
		 * @param {HTMLElement} tableElement parent table element
		 */
		setupCellIdentification(tableElement) {
			const cells = Array.from(tableElement.querySelectorAll('td'));

			// eslint-disable-next-line array-callback-return
			cells.map((c, i) => {
				if (getComputedStyle(c).position !== 'relative') {
					// eslint-disable-next-line no-param-reassign
					c.style.position = 'relative';
				}

				const range = document.createRange();
				range.setStart(c, 0);

				const lightnessPercent = i % 2 === 0 ? 70 : 90;
				const style = `background-color: hsla(211, 25%, ${lightnessPercent}%, 80%)`;

				const identifierStringRepresentation = `<div class="wptb-responsive-cell-identifier" style="${style}">${
					i + 1
				}</div>`;

				const cellIdentifier = range.createContextualFragment(identifierStringRepresentation);

				c.appendChild(cellIdentifier.childNodes[0]);
			});
		},
		/**
		 * Show cell identifications for table cells
		 */
		showCellIdentification() {
			const visibilityClass = 'wptb-responsive-show-cell-identifier';

			this.clonedTable.classList.add(visibilityClass);

			DeBouncer(
				'cellIdentification',
				() => {
					this.clonedTable.classList.remove(visibilityClass);
				},
				2000
			);
		},
	},
};
</script>
