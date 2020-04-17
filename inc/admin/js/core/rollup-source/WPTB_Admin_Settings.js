import Vue from 'vue';

const frontendData = {...wptbAdminSettingsData};
const store = {...wptbAdminSettingsData.options};

// remove main data from global space
wptbAdminSettingsData = undefined;

// TODO [erdembircan] remove console logging for production
console.log(frontendData);

// store HOC
const withStore = {
    data() {
        return {
            store
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
});

// main wrapper component
Vue.component('settings-app', {
    props: ['fieldsData', 'settings'],
    mixins: [withStore],
    data() {
        return {
            sections: [],
            currentSection: '',
            parsedFields: {}
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
        submitSettings() {
            const formData = new FormData();

            // security prep for fetch request
            formData.append('nonce', this.settings.nonce);
            formData.append('action', this.settings.action);

            formData.append('options', JSON.stringify(this.store));

            // fetch request to update plugin options
            fetch(this.settings.ajaxUrl,
                {
                    method: 'POST',
                    body: formData
                }
            ).then(r => {
                console.log(r);
                    if (r.ok) {
                        return r.json();
                    }
            }).then(resp => {
                console.log(resp);
            }).catch(e => {
                console.error(e);
            });
        }
    }
});

// Vue instance
new Vue({
    data: {
        fieldsData: frontendData.fields,
        settings: frontendData.data
    },
}).$mount(frontendData.data.mountId);
