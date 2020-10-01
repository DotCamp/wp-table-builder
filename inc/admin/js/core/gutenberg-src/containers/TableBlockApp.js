import React from 'react';
import { TableContext } from '../functions/withContext';
import TableBlock from '../components/TableBlock';

export default class TableBlockApp extends React.Component {
	constructor(props) {
		super(props);

		const { attributes, setAttributes, blockData } = props;

		this.setSavedTable = this.setSavedTable.bind(this);

		this.state = {
			attributes,
			setAttributes,
			savedTable: null,
			setSavedTable: this.setSavedTable,
			blockData,
		};
	}

	setSavedTable(id) {
		this.setState({
			savedTable: this.state.blockData.tables.filter((t) => {
				return t.id === id;
			})[0],
		});
	}

	componentDidMount() {
		this.setSavedTable(this.state.attributes.id);
	}

	render() {
		return (
			<TableContext.Provider value={this.state}>
				<TableBlock />
			</TableContext.Provider>
		);
	}
}
