import React, { Fragment } from "react";
import { __ } from "@wordpress/i18n";
import TableSelect from "./TableSelect";
import SelectedTableView from "./SelectedTableView";
import TablePreview from "./TablePreview";
import Builder from "./Builder";
import { withContext } from "../functions/withContext";
import BusyOverlay from "./BusyOverlay";
import TableBlockInspector from "./TableInspectorControls";
import PortalTarget from "./PortalTarget";

/**
 * TableBlock component.
 *
 * This component handle UI part of the gutenberg block.
 */
class TableBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: Number.parseInt(this.props.attributes.id, 10),
      savedId: Number.parseInt(this.props.attributes.id, 10),
      searchTerm: "",
      footerRightPortal: null,
      fullPreview: false,
      showBuilder: false,
      builderUrl: props.builderUrl,
    };

    this.state.selectScreen = this.state.savedId === -1;
    this.state.expanded = this.state.savedId === -1;

    this.toggleBlock = this.toggleBlock.bind(this);
    this.slideMain = this.slideMain.bind(this);
    this.rowSelected = this.rowSelected.bind(this);
    this.selectedTable = this.selectedTable.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.filteredTables = this.filteredTables.bind(this);
    this.saveTable = this.saveTable.bind(this);
    this.changeToSelect = this.changeToSelect.bind(this);
    this.setSelectScreen = this.setSelectScreen.bind(this);
    this.openNewTableBuilder = this.openNewTableBuilder.bind(this);
    this.openTableEditBuilder = this.openTableEditBuilder.bind(this);
    this.setBuilderVisibility = this.setBuilderVisibility.bind(this);
    this.updateSelection = this.updateSelection.bind(this);

    this.mainRef = React.createRef();
    this.footerRightPortal = React.createRef();

    this.portalTargetEditor = document.body.appendChild(
      document.createElement("div")
    );
  }

  /**
   * Component mounted lifecycle hook.
   */
  componentDidMount() {
    this.slideMain();
    this.setState({ footerRightPortal: this.footerRightPortal });

    // decide whether to show full table preview or not
    this.setState({ fullPreview: this.state.savedId > 0 });
  }

  // Update selection depending on builder sent id.
  updateSelection(id) {
    return this.props.getTables().then(() => {
      this.setState({ selectedId: Number.parseInt(id, 10) });
      this.saveTable();
    });
  }

  /**
   * Toggle visibility status of block main area.
   *
   * @param {Event} e html event
   */
  toggleBlock(e) {
    e.preventDefault();
    this.setState((state) => {
      return { expanded: !state.expanded };
    });
  }

  /**
   * Slide up/down main area of toggle depending on block toggle status.
   */
  slideMain() {
    const direction = this.state.expanded ? "slideDown" : "slideUp";
    jQuery(this.mainRef.current)[direction]();
  }

  /**
   * Filter tables according to search term.
   *
   * @return {Array} filtered tables
   */
  filteredTables() {
    if (this.state.searchTerm === "") {
      return this.props.tables;
    }

    return this.props.tables.filter((t) => {
      const regexp = new RegExp(`(${this.state.searchTerm})`, "gi");

      return regexp.test(t.title) || regexp.test(`${t.id}`);
    });
  }

  /**
   * Component updated lifecycle hook.
   *
   * @param {Object} _ previous props
   * @param {Object} prevState previous state
   */
  componentDidUpdate(_, prevState) {
    this.slideMain();
    this.props.setAttributes({ id: this.state.savedId });

    // enable full preview if saved table is changed
    if (prevState.savedId !== this.state.savedId) {
      this.setState({ fullPreview: true });
    }
  }

  /**
   * Row selected callback function.
   *
   * @param {number} id selected table id
   * @return {function(*): void} click callback function
   */
  rowSelected(id) {
    return (e) => {
      e.preventDefault();
      this.setState({ selectedId: id });
    };
  }

  /**
   * Get selected table.
   *
   * @return {Object} selected table object
   */
  selectedTable() {
    return this.props.tables.filter((t) => {
      return this.state.selectedId === t.id;
    })[0];
  }

  /**
   * Get saved table for the block.
   *
   * @return {Object|undefined} saved table
   */
  savedTable() {
    return this.props.tables.filter((t) => {
      return this.state.savedId === t.id;
    })[0];
  }

  /**
   * Set selected table as saved table to bind to block and its shortcode.
   */
  saveTable() {
    this.props.setSavedTable(this.state.selectedId);
    this.setState({ savedId: this.state.selectedId, selectScreen: false });
  }

  /**
   * Update search term.
   *
   * @param {Event} e element event
   */
  updateSearch(e) {
    this.setState({ searchTerm: e });
  }

  /**
   * Change current screen to table select.
   */
  changeToSelect() {
    this.setState({ selectScreen: true });
  }

  /**
   * Change visibility of select screen.
   *
   * @param {boolean} val status
   */
  setSelectScreen(val) {
    this.setState({ selectScreen: val });
  }

  /**
   * Set visibility of builder page.
   *
   * @param {boolean} val show/hide
   */
  setBuilderVisibility(val) {
    this.setState({ showBuilder: val });
  }

  /**
   * Open builder page for new table.
   */
  openNewTableBuilder() {
    this.setState({
      builderUrl: this.props.blockData.builderUrl,
      showBuilder: true,
    });
  }

  /**
   * Open builder page for table edit.
   */
  openTableEditBuilder() {
    if (this.state.savedId > 0) {
      const url = new URL(this.props.blockData.builderUrl);
      url.searchParams.append(
        "table",
        this.state.selectScreen ? this.state.selectedId : this.state.savedId
      );

      this.setState({ builderUrl: url.toString(), showBuilder: true });
    }
  }

  /**
   * Render component to DOM.
   *
   * @return {JSX.Element} rendered component
   */
  render() {
    return (
      <Fragment>
        <TableBlockInspector
          header={__("Info", "wp-table-builder")}
          table={
            this.state.selectScreen
              ? this.selectedTable()
              : this.props.savedTable
          }
        />
        <div
          style={{ display: this.state.fullPreview ? "none" : "grid" }}
          className={"wptb-block-wrapper wptb-basic-appear-anim"}
        >
          <BusyOverlay show={this.props.isFetching()} />
          <div className={"wptb-block-header"}>
            <div className={"wptb-plugin-left-toolbox"}>
              <div className={"wptb-plugin-brand"}>WP Table Builder</div>
              <div className={"wptb-plugin-selected-header-info"}>
                {this.props.savedTable
                  ? this.props.savedTable.title
                  : __("No table selected", "wp-table-builder")}
              </div>
            </div>
            <div className={"wptb-header-toolbox"}>
              <div
                className={"wptb-block-tool dashicons dashicons-insert"}
                title={__("new table", "wp-table-builder")}
                onClick={this.openNewTableBuilder}
              />
              {this.filteredTables().length > 0 ? (
                <div
                  className={"wptb-block-tool dashicons dashicons-edit-large"}
                  title={__("edit table", "wp-table-builder")}
                  onClick={this.openTableEditBuilder}
                  data-disabled={!(Number.parseInt(this.state.savedId, 10) > 0)}
                />
              ) : (
                ""
              )}
              {this.state.savedId >= 0 ? (
                <Fragment>
                  <div
                    className={
                      "wptb-block-tool dashicons dashicons-fullscreen-alt"
                    }
                    onClick={() => this.setState({ fullPreview: true })}
                    title={__("maximize preview", "wp-table-builder")}
                  />
                </Fragment>
              ) : (
                ""
              )}
              <div
                className={"wptb-block-toggle dashicons wptb-block-tool"}
                aria-expanded={this.state.expanded}
                onClick={this.toggleBlock}
              />
            </div>
          </div>
          <div ref={this.mainRef}>
            <div className={"wptb-block-main"}>
              {this.state.selectScreen ? (
                <TableSelect
                  searchTerm={this.state.searchTerm}
                  updateSearch={this.updateSearch}
                  selectedId={this.state.selectedId}
                  rowSelected={this.rowSelected}
                  filteredTables={this.filteredTables}
                  selectedTable={this.selectedTable()}
                  saveTable={this.saveTable}
                  footerRightPortal={this.state.footerRightPortal}
                  savedId={this.state.savedId}
                  setSelectScreen={this.setSelectScreen}
                />
              ) : (
                <SelectedTableView
                  footerRightPortal={this.state.footerRightPortal}
                  selectedTable={this.props.savedTable}
                  changeToSelect={this.changeToSelect}
                />
              )}
            </div>
            <div className={"wptb-block-footer"}>
              <div className={"wptb-block-footer-left"} />
              <div
                ref={this.footerRightPortal}
                className={"wptb-block-footer-right"}
              />
            </div>
          </div>
        </div>
        <div
          style={{ display: this.state.fullPreview ? "flex" : "none" }}
          className={"wptb-block-full-preview wptb-basic-appear-anim"}
        >
          <div
            className={
              "dashicons dashicons-fullscreen-exit-alt wptb-block-minimize-button wptb-block-tool wptb-block-shadow"
            }
            onClick={() => this.setState({ fullPreview: false })}
            title={__("minimize preview", "wp-table-builder")}
          />
          <TablePreview
            content={
              this.props.savedTable ? this.props.savedTable.content : null
            }
          />
        </div>
        <PortalTarget
          id={"wptbEditorPortal"}
          targetEl={this.portalTargetEditor}
        >
          <Builder
            builderVisibility={this.setBuilderVisibility}
            show={this.state.showBuilder}
            builderUrl={this.state.builderUrl}
            updateSelection={this.updateSelection}
          />
        </PortalTarget>
      </Fragment>
    );
  }
}

/* @module TableBlock module */
export default withContext(TableBlock);
