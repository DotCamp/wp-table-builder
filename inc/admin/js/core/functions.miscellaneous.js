(function ($) {

    window.add_Elements_tab = function () {
        document.getElementById('element-options').getElementsByTagName('a')[0].classList.remove('active');
        document.getElementById('add-elements').getElementsByTagName('a')[0].classList.add('active');
        document.getElementsByClassName('wptb-elements-container')[0].style.display = 'table';
        document.getElementsByClassName('wptb-settings-section')[0].style.display = 'block';
        document.getElementById("element-options-group").style.display = 'none';
    };

    window.Element_options_tab = function(){
                document.getElementById('add-elements').getElementsByTagName('a')[0].classList.remove('active');
                document.getElementById('element-options').getElementsByTagName('a')[0].classList.add('active');

                document.getElementsByClassName('wptb-elements-container')[0].style.display = 'none';
                document.getElementsByClassName('wptb-settings-section')[0].style.display = 'none';
                document.getElementById("element-options-group").style.display = 'block';
                var children = document.getElementById("element-options-group").childNodes;
                for (var i = 0; i < children.length; i++) {
                    if (children[i].style)
                        children[i].style.display = 'none';
                }
            }

    window.addElementOptions = function (wptbElement, el) {
        var prop = $(".wptb-" + wptbElement + "-options-prototype").clone();
        prop.removeClass("wptb-" + wptbElement + "-options-prototype"); // remove prototype from the class
        prop.addClass('wptb-options-' + wptbElement + "-" + wptb_num[wptbElement]);
        document.getElementById("element-options-group").appendChild(prop[0]);
        //special cases to elements if needed
        switch (wptbElement) {
            case 'text':
                listener_to_element(prop.find('.wptb-color-picker'));
                prop.find('.wptb-color-picker').wpColorPicker();
                break;
        }
        wptb_num[wptbElement]++;
    };

    /**
     * to listen to the elements that will change dynamically
     * change by other javascript code then will trigger the change event to them
     * 
     * @param {string} element
     * @returns {void}
     */
    window.listener_to_element = function (element) {
        element.data('old_value', element.val());
        window.setInterval(function () {
            var value = element.val();
            var old_value = element.data('old_value');
            if (value != old_value) {
                old_value = value;
                element.trigger('change');
            }
        }, 300);
    };

    window.tryToChangeMCEWidth = function (e) {
        var totalWidth = document.getElementsByClassName('wptb-builder-panel')[0].offsetWidth;

        if (window.currentEditor &&
            document.getElementById('wptb_builder').scrollTop >= 55 &&
            window.currentEditor.bodyElement.style.display != 'none') {
            document.getElementById('wpcd_fixed_toolbar').style.position = 'fixed';
            document.getElementById('wpcd_fixed_toolbar').style.right = (totalWidth / 2 - document.getElementById('wpcd_fixed_toolbar').offsetWidth / 2) + 'px';
            document.getElementById('wpcd_fixed_toolbar').style.top = '100px';
        } else {
            document.getElementById('wpcd_fixed_toolbar').style.position = 'static';
            delete document.getElementById('wpcd_fixed_toolbar').style.right;
            delete document.getElementById('wpcd_fixed_toolbar').style.top;
        }
        //if(this.scrollTop > && )
        //                document.getElementById('wpcd_fixed_toolbar').style.left = 'calc(50% - '+width+')';  
    };

    window.tinyFastCall = function (obj) {
        tinyMCE.init({
            target: obj,
            inline: true,
            plugins: "link, paste",
            dialog_type: "modal",
            theme: 'modern',
            menubar: false,
            fixed_toolbar_container: '#wpcd_fixed_toolbar',
            paste_as_text: true,
            toolbar: 'bold italic strikethrough link unlink | alignleft aligncenter alignright alignjustify',
            init_instance_callback: function (editor) {
                window.currentEditor = editor;
                editor.on('focus', function (e) {
                    window.tryToChangeMCEWidth();
                });
            }
        });
    }

    window.inputNumber = function (el) {

        var min = el.min || false;
        var max = el.max || false;

        var els = {};

        els.dec = el.previousSibling;
        els.inc = el.nextSibling;

        init(el);

        function init(el) {

            els.dec.onclick = decrement;
            els.inc.onclick = increment;

            els.dec.onmousedown = function (e) {
                e.preventDefault();
            };

            els.inc.onmousedown = function (e) {
                e.preventDefault();
            };

            function decrement() {
                var value = el.value;
                value--;
                if (!min || value >= min) {
                    el.value = value;
                }
            }

            function increment() {
                var value = el.value;
                value++;
                if (!max || value <= max) {
                    el.value = value++;
                }
            }
        }
    }
})(jQuery);