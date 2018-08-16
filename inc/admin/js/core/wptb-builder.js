var wptbElement;

//numbers of elements that have been added
window.wptb_num = new Array();
window.wptb_num["text"] = 0;
window.wptb_num["image"] = 0;
window.wptb_num["list"] = 0;
window.wptb_num["button"] = 0;

jQuery(document).ready(function ($) {

    //Column and Row number Selector.
    inputNumber(document.getElementById('wptb-columns-number'));
    inputNumber(document.getElementById('wptb-rows-number'));

    //document.getElementById('wptb_builder').onscroll = tryToChangeMCEWidth;

    //Generate table and bind associated functions.
    document.onready = function () {
        document.getElementById("wptb-generate-table").onclick = function () {
 
            //Runs when an element is dropped on a cell.
            initTable();
           
 
            /**
             * this function will be called 
             * when a property of any elemnet is changed
             * to determine which element that we should edit
             * and then call edititng_property Function
             * @returns {void}
             */
            function detect_element_for_property() {
                var option = this,
                    parent = option;
                while(!parent.classList.contains('wptb-element-options')){
                    parent = parent.parentNode;
                } 
                var classes = parent.className;

                /**
                 * will carry the extracted infotrmation from the class
                 * @example class =>wptb-options-text-0
                 *          result => [
                 *              0 => wptb-options-text-0
                 *              1 => text
                 *              2 => 0
                 *          ]
                 * @type array
                 */
                var infArr = classes.match(/wptb-options-(.+)-(\d+)/i);

                var type = infArr[1];
                var num = infArr[2];
                var element = document.querySelector('.wptb-ph-element.wptb-element-' + type + '-' + num);
                editing_property(element, option);
            }

            /**
             * will change the element according to the value of option
             * 
             * @param {object} element that will change according to the value of option
             * @param {object} option input element
             * @returns {void}
             */
            function editing_property(element, option) {
                // type of property @Ex: font-size,color ....
                var type = option.dataset.type;
                var val = option.value;
                switch (type) {
                    case 'font-size':
                        var ps = element.getElementsByTagName("p");
                        for (var i = 0; i < ps.length; i++) {
                            ps[i].style.fontSize =  val + 'px';
                        }
                        
                        break;
                    case 'color':
                        var ps = element.getElementsByTagName("p");
                        for (var i = 0; i < ps.length; i++) {
                            ps[i].style.color =  val;
                        } 
                        break;
                    case 'list-class':
                        if (val == 'unordered') {
                            element.querySelector('[data-type=list-style-type]').parentNode.style.display= 'flex';
                            var bullets = element.querySelectorAll('article .wptb-list-item-style-dot li');
                            for (var i = 0; i < bullets.length; i++) {
                                bullets[i].style.listStyleType= 'disc';
                            }
                            document.querySelector('[data-type=list-style-type]').value = 'disc';
                        } else {
                            element.querySelector('[data-type=list-style-type]').parentNode.style.display= 'none'; 
                            var bullets = element.querySelectorAll('article .wptb-list-item-style-dot li');
                            for (var i = 0; i < bullets.length; i++) {
                                bullets[i].style.listStyleType= 'decimal';
                            } 
                        }
                        break;
                    case 'numbering-list-style-type':
                    case 'list-style-type':
                            var bullets = element.querySelectorAll('article .wptb-list-item-style-dot li');
                            for (var i = 0; i < bullets.length; i++) {
                                bullets[i].style.listStyleType= val.toLowerCase();
                            } 
                        break;
                }
            }
            $(document.body).on('change input, change select', '.wptb-element-property', detect_element_for_property);

            //Triggers when table border setting changes.
            function addBorder(value) {
                document.getElementsByClassName('wptb-preview-table')[0].style.border = value + 'px solid';
            }

            //Binds the range slider and input, also triggers table border change.
            document.getElementById('wptb-table-border-slider').onchange = function () {
                document.getElementById('wptb-table-border-number').value = this.value;
                addBorder(this.value);
            };

            //Binds the range slider and input, also triggers table border change.
            document.getElementById('wptb-table-border-number').onchange = function () {
                document.getElementById('wptb-table-border-slider').value = this.value;
                addBorder(this.value);
            };





            //Triggers when cell padding setting changes.
            function addCellPadding(value) {
                var tableCells = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
                for (var i = 0; i < tableCells.length; i++) {
                    tableCells[i].style.padding = value + 'px';
                }
            }

            //Binds the range slider and input, also triggers cell padding change.
            document.getElementById('wptb-table-cell-slider').onchange = function () {
                document.getElementById('wptb-table-cell-number').value = this.value;
                addCellPadding(this.value);
            };

            //Binds the range slider and input, also triggers cell padding change.
            document.getElementById('wptb-table-cell-number').onchange = function () {
                document.getElementById('wptb-table-cell-slider').value = this.value;
                addCellPadding(this.value);
            };

            document.getElementById('wptb-activate-cell-management-mode').onclick = function(){
                if(this.value=="Manage Cells"){
                    document.getElementsByClassName('wptb-cell-management')[0].classList.add('visible');
                    this.value= "Close Cell Management Mode";
                }
                else{
                    document.getElementsByClassName('wptb-cell-management')[0].classList.remove('visible');
                    this.value = "Manage Cells";
                }
                
                
            }

            //Triggers when apply inner border setting changes.
            function addInnerBorder(checked) {
                var styles;

                if (checked == 'checked') {
                    document.getElementById('wptb-apply-inner-border').style.marginBottom = '0px';
                    var tableCells = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
                    for (var i = 0; i < tableCells.length; i++) {
                        tableCells[i].style.border = '1px solid';
                    }

                    document.getElementById('wptb-inner-border-settings').classList.add('visible');
                } else {
                    document.getElementById('wptb-inner-border-settings').classList.remove('visible');
                    var tableCells = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
                    for (var i = 0; i < tableCells.length; i++) {
                        tableCells[i].style.border = '';
                    }
                }
            }

            //Binding Checkbox Change, triggers inner border add.
            document.getElementById('wptb-inner-border-check').onchange = function () {
                var _val = this.checked ? 'checked' : 'unchecked';
                addInnerBorder(_val);
            };

            //Triggers when cell padding setting changes.
            function addInnerBorderSize(value) {
                var tableCells = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
                for (var i = 0; i < tableCells.length; i++) {
                    tableCells[i].style.border = value + 'px solid';
                }
            }

            //Binds the range slider and input, also triggers cell padding change.
            document.getElementById('wptb-table-inner-border-slider').onchange = function () {
                document.getElementById('wptb-table-inner-border-number').value = this.value;
                addInnerBorderSize(this.value);
            };

            //Binds the range slider and input, also triggers cell padding change.
            document.getElementById('wptb-table-inner-border-number').onchange = function () {
                document.getElementById('wptb-table-inner-border-slider').value = this.value;
                addInnerBorderSize(this.value);
            };

        };

        document.getElementById('wptb-add-row-before').onclick = window.addRowBefore;
        document.getElementById('wptb-add-row-after').onclick = window.addRowAfter; 
        document.getElementById('wptb-add-column-before').onclick = window.addColumnBefore;
        document.getElementById('wptb-add-column-after').onclick = window.addColumnAfter; 
    }; // Of document.onready


});