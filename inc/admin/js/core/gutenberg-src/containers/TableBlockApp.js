import React from "react";
import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";
import { TableContext } from "../functions/withContext";
import TableBlock from "../components/TableBlock";

export default class TableBlockApp extends React.Component {
  constructor(props) {
    super(props);

    const { attributes, setAttributes, blockData } = props;

    this.setSavedTable = this.setSavedTable.bind(this);

    this.state = {
      tables: [],
      attributes,
      setAttributes,
      savedTable: null,
      setSavedTable: this.setSavedTable,
      blockData,
      fetching: false,
      isFetching: () => {
        return this.state.fetching;
      },
      setFetch: (status) => {
        this.setState({ fetching: status });
      },
      getTables: () => {
        this.state.setFetch(true);
        return apiFetch({
          path: "/wp/v2/wptb-tables?status=draft&per_page=-1",
        }).then((tables) => {
          this.setState({
            tables: tables
              .filter((t) => {
                // filter out prebuilt tables from list
                // eslint-disable-next-line no-underscore-dangle
                const [prebuiltStatus] = t.meta._wptb_prebuilt_;
                return !prebuiltStatus;
              })
              .map((t) => {
                return {
                  ...t,
                  ...{
                    id: t.id,
                    // eslint-disable-next-line no-underscore-dangle
                    content: t.meta._wptb_content_,
                    title:
                      t.title.rendered === "" || t.title.rendered === "Untitled"
                        ? `${__("Table", "wp-table-builder")} #${t.id}`
                        : t.title.rendered,
                  },
                };
              }),
          });

          this.state.setFetch(false);
        });
      },
    };
  }

  setSavedTable(id) {
    this.setState({
      savedTable: this.state.tables.filter((t) => {
        return t.id === id;
      })[0],
    });
  }

  componentDidMount() {
    this.state.getTables().then(() => {
      this.setSavedTable(this.state.attributes.id);
    });
  }

  render() {
    return (
      <TableContext.Provider value={this.state}>
        <TableBlock />
      </TableContext.Provider>
    );
	}
}
