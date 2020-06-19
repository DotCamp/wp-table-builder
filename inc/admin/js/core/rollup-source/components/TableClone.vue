<template>
	<div ref="tableClone" class="wptb-responsive-clone-wrapper"></div>
</template>
<script>
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
	},
	data() {
		return {
			// in order to not mutate the prop sent from the parent component, will be modifying the data prop instead
			cloneInner: false,
			clonedTable: null,
			mainTable: null,
			tableDirectiveDatasetId: 'wptbResponsiveDirectives',
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
		tableDirectives(n) {
			if (n) {
				this.addDirectivesToTable(n);
			}
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

			this.clonedTable = this.mainTable.cloneNode(true);
			this.$refs.tableClone.appendChild(this.clonedTable);


			// directives that are already present in the main table
			// this directives may be saved from on another session of table builder or added there in the current session, what matters is, always use the main table directives as the base of source and update the other directives currently available according to them
			const mainTableDirectives = this.mainTable.dataset[this.tableDirectiveDatasetId];

			// since this component will be re-cloning the table at every visibility change of responsive menu, we should add necessary table directives to cloned table without waiting for them to be automatically added on change
			if (this.tableDirectives) {
				this.addDirectivesToTable(this.tableDirectives);
			}

			// emit an event signalling cloning main table is completed
			this.$emit('tableCloned', mainTableDirectives);
		},
		/**
		 * Add directives to dataset of cloned table and main table.
		 *
		 * @param {string} n new directives
		 */
		addDirectivesToTable(n) {
			if (this.clonedTable && this.mainTable) {
				// add directives to clone
				this.clonedTable.dataset[this.tableDirectiveDatasetId] = n;

				// add directives to main table
				this.mainTable.dataset[this.tableDirectiveDatasetId] = n;

				// emit an event signalling end of directive copy operation
				this.$emit('directivesCopied');
			}
		},
	},
};
</script>
