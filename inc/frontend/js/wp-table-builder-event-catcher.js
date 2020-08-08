/**
 * Event catcher for table element clone operations
 * @deprecated
 *
 * cloneNode function of HTMLElement can not copy event listeners attached to said elements. In order to reflect those event listeners to element clones, we have to intercept events and keep a list of them for any future table element clone operations. Only events belonging to table elements will be intercepted while all other events will be send to their original targets.
 */

// assign event catcher object to global space
(function assignToGlobal(global, factory) {
    global.WptbEventCatcher = factory();
})(self ? self : global, () => {

    /**
     * Event catcher singleton factory.
     *
     * @param {string} mainTableQuery query selector for the main table
     * @param {string} cloneTableQuery query selector for the clone table
     * @returns {{getInstance: (function(): EventCatcherSingle)}}
     * @constructor
     */
    function WptbEventCatcher(mainTableQuery, cloneTableQuery) {
        /**
         * Check current element for relation with wptb
         *
         * @param {string} identifierType target type
         * @param {string} identifierClass target class
         * @param {HTMLElement} el current element to check
         * @returns {boolean} is part of wptb or not
         */
        function isPartOfTable(identifierType, identifierClass, el) {

            const elementType = el.nodeName;

            // hit document base, element is not part of wptb
            if (elementType === 'HTML') {
                return false;
            }

            // element is part of wptb
            if (elementType === identifierType.toUpperCase() && el.classList.contains(identifierClass)) {
                return true;
            } else {
                // current element doesn't meet the requirements, check parents
                const nextParent = el.parentElement;
                return isPartOfTable(identifierType, identifierClass, nextParent);
            }
        }

        /**
         * Generate unique id.
         *
         * @param {number} idLength id length
         * @returns {string} generated unique id
         */
        function generateUniqueId(idLength) {
            const keys = ['1', '2', '3', '4', '5', '6', '7', 'a', 'b', 'c', 'd', 'e', 'f'];
            const keysLength = keys.length;
            let generatedId = '';

            for (let i = 0; i < idLength; i++) {
                const index = Math.floor(Math.random() * (keysLength - 1));
                generatedId += keys[index];
            }

            return generatedId;
        }

        /**
         * Event catcher object.
         *
         * @param {string} cloneParentQuery query for clone parent
         * @constructor
         */
        function EventCatcherSingle(cloneParentQuery) {
            // assign the current context to use its properties at other contexts
            const vm = this;

            const captureClassTemplate = 'wptb-capture-id-';

            // private captured events object
            const capturedEvents = {};

            /**
             * Add the event listener to event object.
             *
             * @param {string} key unique key for element
             * @param {string} eventName event name
             * @param {function} eventCallback callback function
             */
            this.addToCaptured = (key, eventName, eventCallback) => {
                if (!capturedEvents[key]) {
                    capturedEvents[key] = {};
                }

                if (!capturedEvents[key][eventName]) {
                    capturedEvents[key][eventName] = [];
                }

                capturedEvents[key][eventName].push(eventCallback);
            }

            /**
             * Get all captured events.
             *
             * @returns object captured events object
             */
            this.getCapturedEvents = () => {
                return capturedEvents;
            }

            // backup original addEventListener function for future use
            HTMLElement.prototype._addEventListener = HTMLElement.prototype.addEventListener;

            // override addEventListener with event catcher
            HTMLElement.prototype.addEventListener = function eventListener(eventName, callback) {
                const isWptbRelated = isPartOfTable('tr', 'wptb-row', this);

                // regexp for identifying already registered elements
                const captureRegex = new RegExp(`^${captureClassTemplate}(.+)$`, 'g');

                if (isWptbRelated) {
                    let captureId = null;
                    let fullCaptureClass = null;

                    // find if current element has registered any events
                    this.classList.forEach(c => {
                        const testResult = captureRegex.exec(c);
                        if (testResult) {
                            captureId = testResult[1];
                            fullCaptureClass = testResult[0];
                        }
                    });

                    // check if main element is already cloned or not
                    const elementClone = document.querySelector(`${cloneParentQuery} .${fullCaptureClass}`);

                    if (elementClone) {
                        // if there is already a clone of element, then redirect the event to that clone instead of capturing and storing it
                        elementClone._addEventListener(eventName, callback);
                    } else {
                        // if this element don't have an entry for captured elements, assign unique class
                        if (captureId === null) {
                            captureId = generateUniqueId(5);
                            this.classList.add(`${captureClassTemplate}${captureId}`);
                        }

                        // capture the event for the current element
                        vm.addToCaptured(captureId, eventName, callback);
                    }
                }

                // call default event listener to attach it to the element
                this._addEventListener(eventName, callback);
            }

            /**
             * Restore events to element clones.
             *
             * @param {string} parentTableQuery query string for table clone
             */
            this.restoreEvents = (parentTableQuery) => {
                const clonedTable = document.querySelector(parentTableQuery);
                const allEvents = this.getCapturedEvents();

                // iterate element ids
                Object.keys(allEvents).map(k => {
                    if (Object.prototype.hasOwnProperty.call(allEvents, k)) {
                        const classSelector = `.${captureClassTemplate}${k}`;
                        const registeredCloneElement = clonedTable.querySelector(classSelector);

                        if (registeredCloneElement === null) {
                            throw new Error('element not found: ' + classSelector);
                        }

                        // iterate event names of registered element
                        Object.keys(allEvents[k]).map(e => {
                            if (Object.prototype.hasOwnProperty.call(allEvents[k], e)) {
                                const callBacks = allEvents[k][e];

                                // iterate callbacks of event name of registered element
                                callBacks.map(c => {
                                    registeredCloneElement._addEventListener(e, c);
                                })
                            }
                        })
                    }
                })
            }
        }

        const instance = new EventCatcherSingle(cloneTableQuery);

        /**
         * Get event catcher instance
         *
         * @returns {EventCatcherSingle} singleton event catcher instance
         */
        function getInstance() {
            return instance;
        }

        return {getInstance}
    }


    return WptbEventCatcher('.wptb-preview-table', '.wptb-preview-table-mobile');
})
