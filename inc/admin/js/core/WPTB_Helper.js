var WPTB_Helper = {
    hexToRgb: function( hex ) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
        return result ? 'rgb(' + parseInt( result[1], 16 ) + ',' + parseInt( result[2], 16 ) + ',' + parseInt( result[3], 16 ) + ')' : null;
    },
    rgbToHex: function ( rgb ) {
        var rgb = rgb.match( /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i );

        return ( rgb && rgb.length === 4 ) ? "#" +
            ( "0" + parseInt( rgb[1],10 ).toString( 16 )).slice( -2 ) +
            ( "0" + parseInt( rgb[2],10 ).toString( 16 )).slice( -2 ) +
            ( "0" + parseInt( rgb[3],10 ).toString( 16 )).slice( -2 ) : '';
    },
    getDragImageCustom: function ( type ) {
        let hostName = location.protocol + '//' + location.hostname;
        let img = document.createElement( 'img' );
        img.src = hostName + '/wp-content/plugins/wp-table-builder/inc/admin/views/builder/icons/' + type + '.png';
        return img;
    },
    dragImagesArr: function() {
        return {
            text: WPTB_Helper.getDragImageCustom( 'text' ),
            image: WPTB_Helper.getDragImageCustom( 'image' ),
            button: WPTB_Helper.getDragImageCustom( 'button' ),
            list: WPTB_Helper.getDragImageCustom( 'list' )
        };
    },
    listItemsRecalculateIndex: function( ulElem ) {
        let par = ulElem.querySelectorAll( 'p' );
        if ( par.length > 0 ) {
            for ( let i = 0; i < par.length; i++ ) {
                par[i].dataset.listStyleTypeIndex = Number( i ) + 1 + '.';
            }
        }
    },
    listItemsTinyMceInit: function( listItem ) {
        tinyMCE.init({
            target: listItem,
            inline: true,
            plugins: "link, paste",
            dialog_type: "modal",
            theme: 'modern',
            menubar: false,
            fixed_toolbar_container: '#wpcd_fixed_toolbar',
            paste_as_text: true,
            toolbar: 'bold italic strikethrough link unlink | alignleft aligncenter alignright alignjustify',
            setup: function(ed) {
                ed.on('keydown', function(e) {
                    let article = e.target.parentNode;
                    if ( e.keyCode == 13 ) {
                        e.preventDefault();
                        let text = e.target.innerHTML;
                        let duplicate = new WPTB_ListItem( text, article, true );
                        
                        article.parentNode.insertBefore( duplicate.getDOMElement(), article );
                        WPTB_Helper.listItemsTinyMceInit( duplicate.getDOMElement().firstChild );
                        e.target.querySelector( 'p' ).innerText = 'New List Item';
                        //tinyMCE.execCommand('mceInsertContent', false, 'New List Item');
                        WPTB_Helper.listItemsRecalculateIndex( article.parentNode );
                        
                    } else if ( e.keyCode == '8' || e.keyCode == '46' ) {
                        let p = e.target.querySelector( 'p' );
                        let pText = p.innerHTML.replace(/<[^>]+>/g, '');
                        pText = pText.replace( /\s+/g, ' ' ).trim();
                        pText = pText.replace( /&nbsp;/g, '').trim();
                        
                        if( pText == '' ) {
                            e.preventDefault();
                            e.target.querySelector( 'p' ).innerText = '\n';
                        } else {
                            let selectedText = WPTB_Helper.getSelectionText();
                            selectedText = selectedText.replace( /\s+/g, ' ' ).trim();
                            selectedText = selectedText.replace( /&nbsp;/g, '' ).trim();
                            if( selectedText == pText ) {
                                e.preventDefault();
                                e.target.querySelector( 'p' ).innerText = '\n';
                            }
                        }
                    }
                });
                
                ed.on( 'keyup', function( e ) {
                    
                });
            },
            init_instance_callback: function (editor) {
                window.currentEditor = editor;
                editor.on('focus', function (e) {
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
                });
            }
        });
    },
    buttonsTinyMceInit: function( target ) {
        tinyMCE.init({
            target: target,
            inline: true,
            plugins: "link",
            dialog_type: "modal",
            theme: 'modern',
            menubar: false,
            fixed_toolbar_container: '#wpcd_fixed_toolbar',
            toolbar: 'bold italic strikethrough',
            setup : function(ed) {
                ed.on('keydown', function(e) {
                    if (e.keyCode == 13) {
                        e.preventDefault();
                    }
                });
            },
            init_instance_callback: function (editor) {
                window.currentEditor = editor;
                editor.on('focus', function (e) {
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
                });
            }
        });
    },
    linkHttpCheckChange: function( link ) {
        if ( link ) {
            if ( link.indexOf( 'http://' ) == -1 && link.indexOf( 'https://' ) == -1 ) {
                let linkArr = link.split( '/' ),
                    linkClean;
                if ( Array.isArray( linkArr ) && linkArr.length > 0 ) {
                    linkClean = linkArr[linkArr.length - 1];
                }
                return document.location.protocol + '//' + linkClean;
            } else { 
                return link;
            }
        } else {
            return '';
        }
    },
    dataTitleColumnSet: function( table ) {
        let rows = table.rows,
            rowHead = rows[0];
        let computedStyleRowHead = getComputedStyle(rowHead);
        
        let rowHeadChildren = rowHead.children;
        let contentsForHeader = {};
        for( let i = 0; i < rowHeadChildren.length; i++ ) {
            let tdElements = rowHeadChildren[i].children;
            for( let j = 0; j < tdElements.length; j++ ) {
                let element = tdElements[j];
                if( element.classList.contains( 'wptb-ph-element' ) ) {
                    let textContentStyle = element.getAttribute( 'style' );
                    let infArr = element.className.match( /wptb-element-(.+)-(\d+)/i );
                    if( infArr[1] == 'text' ) {
                        let p = element.querySelector( 'p' ),
                            textContent = p.textContent,
                            textAlign = p.style.textAlign;
                            contentsForHeader[rowHeadChildren[i].dataset.xIndex] = [textContent, element.style.fontSize, 
                                element.style.color, computedStyleRowHead.backgroundColor, textAlign];
                        break;
                    }
                }
            }
            if( ! contentsForHeader[rowHeadChildren[i].dataset.xIndex] ) {
                contentsForHeader[rowHeadChildren[i].dataset.xIndex] = ['', '', 
                            '', computedStyleRowHead.backgroundColor, ''];
            }
        }
        for ( let i = 1; i < rows.length; i++ ) {
            let thisRow = rows[i],
                thisRowChildren = thisRow.children;
            for( let j = 0; j < thisRowChildren.length; j++ ) {
                if ( contentsForHeader[thisRowChildren[j].dataset.xIndex] ) {
                    thisRowChildren[j].dataset.titleColumn = contentsForHeader[thisRowChildren[j].dataset.xIndex][0];
                    thisRowChildren[j].dataset.titleColumnFontSize = contentsForHeader[thisRowChildren[j].dataset.xIndex][1];
                    thisRowChildren[j].dataset.titleColumnColor = contentsForHeader[thisRowChildren[j].dataset.xIndex][2];
                    thisRowChildren[j].dataset.titleBackgroundColor = contentsForHeader[thisRowChildren[j].dataset.xIndex][3];
                    thisRowChildren[j].dataset.titleAlign = contentsForHeader[thisRowChildren[j].dataset.xIndex][4];
                } else {
                    thisRowChildren[j].dataset.titleColumn = '';
                    thisRowChildren[j].dataset.titleColumnFontSize = '';
                    thisRowChildren[j].dataset.titleColumnColor = '';
                    thisRowChildren[j].dataset.titleBackgroundColor = '';
                    thisRowChildren[j].dataset.titleAlign = '';
                }
            }
        }
    },
    findAncestor: function(el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls));
        return el;
    },
    getSelectionText: function() {
        var txt = '';
        if (txt = window.getSelection) {
            txt = window.getSelection().toString();
        } else {
            txt = document.selection.createRange().text;
        }
        return txt;
    },
    settingsPanelClear: function() {
        document.getElementById( 'wptb-top-row-as-header' ).checked = false;
        document.getElementById( 'wptb-table-border-slider' ).value = 0;
        document.getElementById( 'wptb-table-border-number' ).value = 0;
        document.getElementById( 'wptb-inner-border-check' ).checked = false;
        document.getElementById( 'wptb-apply-inner-border' ).classList.remove( 'visible' );
        document.getElementById( 'wptb-table-inner-border-slider' ).value = 1;
        document.getElementById( 'wptb-table-inner-border-number' ).value = 1;
        
        WPTB_Helper.wpColorPickerClear( 'wptb-table-border-color' );
        
        WPTB_Helper.wpColorPickerClear( 'wptb-table-header-bg' );
        
        WPTB_Helper.wpColorPickerClear( 'wptb-even-row-bg' );
        
        WPTB_Helper.wpColorPickerClear( 'wptb-odd-row-bg' );
        
        document.getElementById( 'wptb-table-cell-slider' ).value = 15;
        document.getElementById( 'wptb-table-cell-number' ).value = 15;
    },
    wpColorPickerClear: function( inputId ) {
        let input = document.getElementById( inputId );
        let wpPickerContainer = WPTB_Helper.findAncestor( input, 'wp-picker-container' );
        let parent = wpPickerContainer.parentNode;
        parent.removeChild( wpPickerContainer );
        let newInput = document.createElement( 'input' );
        newInput.setAttribute( 'id', inputId );
        newInput.value = "";
        parent.appendChild( newInput );
    },
    detectMode: function() {
        var url = window.location.href,
            regex = new RegExp('[?&]table(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return false;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
}
