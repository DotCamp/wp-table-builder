import Vue from 'vue';

const frontendData = {...wptbAdminSettingsData};
const store = {...wptbAdminSettingsData.options};
const rawStore = {...wptbAdminSettingsData.options};

// remove main data from global space
wptbAdminSettingsData = undefined;

// TODO [erdembircan] remove console logging for production
console.log(frontendData);

// store HOC
const withStore = {
    data() {
        return {
            store,
            rawStore
        }
    },
    methods: {
        revertStore() {
            Object.keys(this.store).map(k => {
                if (Object.prototype.hasOwnProperty.call(this.store, k)) {
                    this.store[k] = this.rawStore[k];
                }
            })
        }
    }
};

// setting section component
Vue.component('setting-section', {
    props: ['name']
});

// setting field component
Vue.component('setting-field', {
    props: ['fieldData'],
    mixins: [withStore],
    methods: {
        isType(type) {
            return this.fieldData.type === type;
        }
    }
});

// main wrapper component
Vue.component('settings-app', {
    props: ['fieldsData', 'settings'],
    mixins: [withStore],
    data() {
        return {
            sections: [],
            currentSection: '',
            parsedFields: {},
            resetActive: false,
            canSubmit: false,
            fetching: false,
            fetchMessage: {
                type: 'ok',
                show: false,
                message: 'OK'
            },
            showIntervalId: -1,
        }
    },
    watch: {
        store: {
            handler() {
                if (this.resetActive) {
                    this.canSubmit = false;
                    this.resetActive = false;
                } else {
                    this.canSubmit = true;
                }
            }, deep: true
        }
    },
    beforeMount() {
        Object.keys(this.fieldsData).map(key => {
            if (Object.prototype.hasOwnProperty.call(this.fieldsData, key)) {
                const section = this.fieldsData[key].section;
                if (this.parsedFields[section] === undefined) {
                    this.parsedFields[section] = [];
                }
                this.parsedFields[section].push({...this.fieldsData[key], id: key});
                this.sections.push(section);
            }
        });

        this.currentSection = Object.keys(this.parsedFields).map(key => {
            if (Object.prototype.hasOwnProperty.call(this.parsedFields, key)) {
                return key;
            }
        })[0];

        this.sections = Array.from(new Set(this.sections));
    },
    computed: {
        currentFields() {
            return this.parsedFields[this.currentSection];
        }
    },
    methods: {
        resetStore() {
            if (this.canSubmit) {
                this.revertStore();
                this.resetActive = true;
            }
        },
        submitSettings() {
            if (!this.canSubmit) {
                return;
            }

            const formData = new FormData();

            // security prep for fetch request
            formData.append('nonce', this.settings.nonce);
            formData.append('action', this.settings.action);

            formData.append('options', JSON.stringify(this.store));

            this.canSubmit = false;
            this.fetching = true;
            // fetch request to update plugin options
            fetch(this.settings.ajaxUrl,
                {
                    method: 'POST',
                    body: formData
                }
            ).then(r => {
                if (r.ok) {
                    return r.json();
                }
            }).then(resp => {
                if (resp.error) {
                    throw new Error(resp.error);
                } else {
                    this.setMessage('ok', resp.message);
                }
            }).catch(e => {
                console.error(e);
                this.setMessage('error', e);
            }).finally(() => {
                this.fetching = false;
            })
        },
        setMessage(type, message) {
            this.fetchMessage.type = type;
            this.fetchMessage.message = message;
            this.fetchMessage.show = true;

            clearInterval(this.showIntervalId);
            this.showIntervalId = setInterval(() => {
                this.fetchMessage.show = false;
            }, 5000);
        }
    },
});

// Vue instance
new Vue({
    data: {
        fieldsData: frontendData.fields,
        settings: frontendData.data
    },
}).$mount(frontendData.data.mountId);
