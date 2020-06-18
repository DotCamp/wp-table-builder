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
		};
	},
	mounted() {
		this.cloneInner = this.clone;
	},
	watch: {
		/**
		 * Watch clone prop.
		 *
		 * In order to prevent the mutation of the prop sent by parent element, will be directing any value change coming from parent to data property
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
		 * Start clone operation
		 *
		 * Basic logic of this clone operation is to clone the main table from table builder and mount it to referenced element at template. This way, we will have the exact same copy of the element from table builder, and will only focus on responsive functionality of it.
		 */
		startClone() {
			const mainTable = document.querySelector(this.cloneQuery);

			if (!mainTable) {
				throw new Error(`no clone target is found with a query value of ${this.cloneQuery}`);
			}

			this.clonedTable = mainTable.cloneNode(true);
			this.$refs.tableClone.appendChild(this.clonedTable);

			// emit an event signalling cloning main table is completed
			this.$emit('tableCloned');
		},
		addDirectivesToTable(n) {
			if (this.clonedTable) {
				this.clonedTable.dataset.wptbResponsiveDirectives = n;

				// emit an event signalling end of directive copy operation
				this.$emit('directivesCopied');
			}
		},
	},
};
</script>
