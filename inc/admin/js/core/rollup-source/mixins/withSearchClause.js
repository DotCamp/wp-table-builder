/**
 * Search clause mixin.
 *
 * @param {string} dataId data key that will search clause will be tested against
 * @return {Object} search clause mixin
 */
const withSearchClause = (dataId) => {
	return {
		props: {
			searchClause: {
				type: String,
				default: '',
			},
		},
		computed: {
			searchClauseFilteredValue() {
				const originalData = this[dataId];
				if (this.searchClause === '') {
					return originalData;
				}

				const regexp = new RegExp(`(${this.searchClause})`, 'gi');
				return `<span class="wptb-data-listing-row-search-clause-wrap">${originalData.replaceAll(
					regexp,
					'<span class="wptb-data-listing-row-search-clause">$&</span>'
				)}</span>`;
			},
		},
	};
};

export default withSearchClause;
