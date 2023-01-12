import { mutationWatchFunction } from "../general";
import { getMainBuilderTable } from "../../functions";

/**
 * Mutation watch list.
 *
 * @type {Object}
 */
const mutationWatchList = {
    setGeneralOption: ({ payload }) => {
        const table = getMainBuilderTable();

        if (table) {
            switch (payload.subKey) {
                case "headerBg":
                    table.dataset.wptbHeaderBackgroundColor = payload.value;
                    break;
                case "evenBg":
                    table.dataset.wptbEvenRowBackgroundColor = payload.value;
                    break;
                case "oddBg":
                    table.dataset.wptbOddRowBackgroundColor = payload.value;
                    break;
                case "headerHoverBg":
                    table.dataset.wptbHeaderHoverBackgroundColor =
                        payload.value;
                    break;
                case "evenHoverBg":
                    table.dataset.wptbEvenRowHoverBackgroundColor =
                        payload.value;
                    break;
                case "oddHoverBg":
                    table.dataset.wptbOddRowHoverBackgroundColor =
                        payload.value;
                    break;
                default:
                    break;
            }
        }
    },
};

/**
 * Subscriptions for background menu.
 *
 * @param {Object} store store object
 */
// eslint-disable-next-line import/prefer-default-export
const subscriptions = (store) => {
    store.watch(
        () => {
            return store.state.options;
        },
        () => {
            WPTB_BackgroundMenu.applyOptions();
            // make table dirty after each state change in store
            new WPTB_TableStateSaveManager().tableStateSet();
        },
        { deep: true }
    );

    // watch store mutations
    store.subscribe(mutationWatchFunction(mutationWatchList, store));
};

/** @module subscriptions */
export default subscriptions;
