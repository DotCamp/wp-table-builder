const WPTB_TableSettingsData = {
    borderColor: '',
    /**
     *
     * @param {string} name
     * @param {string} value
     */
    setTableSetting: function(name, value){
        this[name] = value;
    },
    /**
     *
     * @param {string} name
     * @returns {*}
     */
    getTableSetting: function (name) {
        return this[name];
    }
}

