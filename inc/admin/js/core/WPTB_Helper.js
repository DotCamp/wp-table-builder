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
            list: WPTB_Helper.getDragImageCustom( 'list' ),
            star_rating: WPTB_Helper.getDragImageCustom( 'half-filled-rating-star' )
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
                        
                        return;
                        
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
                    
                    let wptbListItem = e.target.parentNode;
                    let wptbActionsField = new WPTB_ActionsField();

                    wptbActionsField.addActionField( 2, wptbListItem );

                    wptbActionsField.setParameters( wptbListItem );
                });
                
                ed.on( 'keyup', function( e ) {
                    let wptbListItem = e.target.parentNode;
                    let wptbActionsField = new WPTB_ActionsField();

                    wptbActionsField.addActionField( 2, wptbListItem );

                    wptbActionsField.setParameters( wptbListItem );
                    
                    e.target.onblur = function() {
                        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                        wptbTableStateSaveManager.tableStateSet();
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
                ed.on( 'keydown', function(e) {
                    if (e.keyCode == 13) {
                        e.preventDefault();
                    }
                    let wptbButtonContainer = WPTB_Helper.findAncestor( target, 'wptb-button-container' );
                    
                    let wptbActionsField = new WPTB_ActionsField();

                    wptbActionsField.addActionField( 1, wptbButtonContainer );

                    wptbActionsField.setParameters( wptbButtonContainer );
                });
                
                ed.on( 'keyup', function(e) {
                    let wptbButtonContainer = WPTB_Helper.findAncestor( target, 'wptb-button-container' );
                    
                    let wptbActionsField = new WPTB_ActionsField();

                    wptbActionsField.addActionField( 1, wptbButtonContainer );

                    wptbActionsField.setParameters( wptbButtonContainer );
                    
                    e.target.onblur = function() {
                        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                        wptbTableStateSaveManager.tableStateSet();
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
                    thisRowChildren[j].dataset.wptbTitleColumn = contentsForHeader[thisRowChildren[j].dataset.xIndex][0];
                    thisRowChildren[j].dataset.wptbTitleColumnFontSize = contentsForHeader[thisRowChildren[j].dataset.xIndex][1];
                    thisRowChildren[j].dataset.wptbTitleColumnColor = contentsForHeader[thisRowChildren[j].dataset.xIndex][2];
                    thisRowChildren[j].dataset.wptbTitleBackgroundColor = contentsForHeader[thisRowChildren[j].dataset.xIndex][3];
                    thisRowChildren[j].dataset.wptbTitleAlign = contentsForHeader[thisRowChildren[j].dataset.xIndex][4];
                } else {
                    thisRowChildren[j].dataset.wptbTitleColumn = '';
                    thisRowChildren[j].dataset.wptbTitleColumnFontSize = '';
                    thisRowChildren[j].dataset.wptbTitleColumnColor = '';
                    thisRowChildren[j].dataset.wptbTitleBackgroundColor = '';
                    thisRowChildren[j].dataset.wptbTitleAlign = '';
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
        document.getElementById( 'wptb-adaptive-table-checkbox' ).checked = false;
        document.getElementById( 'wptb-top-row-as-header' ).checked = false;
        document.getElementById( 'wptb-table-border-slider' ).value = 0;
        document.getElementById( 'wptb-table-border-number' ).value = 0;
        document.getElementById( 'wptb-inner-border-check' ).checked = false;
        document.getElementById( 'wptb-apply-inner-border' ).classList.remove( 'visible' );
        document.getElementById( 'wptb-table-inner-border-slider' ).value = 1;
        document.getElementById( 'wptb-table-inner-border-number' ).value = 1;
        
        WPTB_Helper.wpColorPickerClear( 'wptb-table-border-color', true );
        
        WPTB_Helper.wpColorPickerClear( 'wptb-table-header-bg', true );
        
        WPTB_Helper.wpColorPickerClear( 'wptb-even-row-bg', true );
        
        WPTB_Helper.wpColorPickerClear( 'wptb-odd-row-bg', true );
        
        document.getElementById( 'wptb-table-cell-slider' ).value = 15;
        document.getElementById( 'wptb-table-cell-number' ).value = 15;
    },
    elementOptionsPanelClear: function() {
        let elementOptionsGroup = document.getElementById( 'element-options-group' );
        if( elementOptionsGroup ) {
            elementOptionsGroup.innerHTML = '';
        }
    },
    wpColorPickerCheckChangeForTableStateSaving: function( event ) {
        if( event.originalEvent.type == 'external' ) {
            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        } else {
            let wpPickerContainer = WPTB_Helper.findAncestor( event.target, 'wp-picker-container' );
            if( wpPickerContainer ) {
                if( event.originalEvent.type == 'square' ) {
                    let irisSquareHandle = wpPickerContainer.getElementsByClassName( 'iris-square-handle' );
                    if( irisSquareHandle.length > 0 ) {
                        irisSquareHandle = irisSquareHandle[0];
                        irisSquareHandle.onmouseup = function() {
                            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                            wptbTableStateSaveManager.tableStateSet();
                        }
                    }
                } else if( event.originalEvent.type == 'strip' ) {
                    let uiSliderHandle = wpPickerContainer.getElementsByClassName( 'iris-slider-offset' );
                    if( uiSliderHandle.length > 0 ) {
                        uiSliderHandle = uiSliderHandle[0];
                        uiSliderHandle.onmouseup = function() {
                            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                            wptbTableStateSaveManager.tableStateSet();
                        }
                    }
                }
            }
        }
    },
    wpColorPickerClear: function( attribute, isId ) {
        let input;
        if( isId ) {
            input = [document.getElementById( attribute )];
            input.length = 1;
        } else {
            input = document.getElementsByClassName( attribute );
        }
        for( let i = 0; i < input.length; i++ ) {
            let wpPickerContainer = WPTB_Helper.findAncestor( input[i], 'wp-picker-container' );
            if( wpPickerContainer ) {
                let parent = wpPickerContainer.parentNode;
                parent.removeChild( wpPickerContainer );
                let newInput = document.createElement( 'input' );
                if( isId ) {
                    newInput.setAttribute( 'id', attribute );
                } else {
                    newInput.classList.add( 'wptb-element-property', attribute );
                }
                newInput.value = "";
                parent.appendChild( newInput );
            }
        }
    },
    detectMode: function() {
        var url = window.location.href,
            regex = new RegExp('[?&]table(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return false;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
    getColumnWidth: function( table, cell ) {
        let xIndex = cell.dataset.xIndex;
        let xIndexes = table.querySelectorAll( '[data-x-index="' + xIndex + '"]' );
        let cellWidth = cell.getCellDimensions().width;
        for( let i = 0; i < xIndexes.length; i++ ) {
            if( cellWidth > xIndexes[i].getCellDimensions().width ) {
                cellWidth = xIndexes[i].getCellDimensions().width;
            }
        }
        return cellWidth;
    },
    getRowHeight: function( table, cell ) {
        let yIndex = cell.dataset.yIndex;
        let yIndexes = table.querySelectorAll( '[data-y-index="' + yIndex + '"]' );
        let cellHeight = cell.getCellDimensions().height;
        for( let i = 0; i < yIndexes.length; i++ ) {
            if( cellHeight > yIndexes[i].getCellDimensions().height ) {
                cellHeight = yIndexes[i].getCellDimensions().height;
            }
        }
        return cellHeight;
    },
    newElementProxy: function(el) {
        if ( el == 'list' ) {
            return new WPTB_List();
        } else if ( el == 'image' ) {
            return new WPTB_Image();
        } else if ( el == 'text' ) {
            return new WPTB_Text();
        } else if ( el == 'button' ) {
            return new WPTB_Button();
        } else if( el == 'star_rating' ) {
            return new WPTB_StarRating();
        }
    },
    wpColorPickerChange: function( event, ui ) {
        let uiColor;
        if( ui ) {
            uiColor = ui.color.toString();
        } else {
            uiColor = '';
        }
        
        let parent = WPTB_Helper.findAncestor( event.target, 'wp-picker-input-wrap' ).getElementsByClassName( 'wptb-color-picker' )[0], classe, type, ps, number;
        classe = parent.dataset.element.match(/wptb-options-(.+)-(\d+)/i);
        type = classe[1];
        number = classe[2];
        let affectedEl = document.getElementsByClassName( 'wptb-element-' + type + '-' + number )[0];
        if ( type == 'button' ) {
            if ( parent.dataset.type == 'button-text-color' ) {
                affectedEl.getElementsByClassName( 'wptb-button' )[0].style.color = uiColor;
            } else {
                affectedEl.getElementsByClassName( 'wptb-button' )[0].style.backgroundColor = uiColor;
            }
        } else if( type == 'list' ) {
            let ps = affectedEl.querySelectorAll( 'p' );
            if( ps.length > 0 ) {
                for ( let i = 0; i < ps.length; i++ ) {
                    ps[i].style.color = uiColor;
                }
            }
        } else if( type == 'star_rating' ) {
            if ( parent.dataset.type == 'star-color' ) {
                let ratingStar = affectedEl.querySelectorAll('li');
                for( let i = 0; i < ratingStar.length; i++ ) {
                    let span = ratingStar[i].getElementsByTagName( 'span' );
                    for( let j = 0; j < span.length; j++ ) {
                        span[j].style.fill = uiColor;
                    }
                }
            } else if( parent.dataset.type == 'numeral-rating-color' ) {
                let wptbTextMessageSize = affectedEl.querySelector('.wptb-text-message');
                wptbTextMessageSize.style.color = uiColor;
            }

        } else {
            affectedEl.style.color = uiColor;
        }
    },
    starRatingSelectHoverSet : function( event ) {
        let starRating;
        if( ! event.target.classList.contains( 'wptb-rating-star' ) ) {
            starRating = WPTB_Helper.findAncestor( event.target, 'wptb-rating-star' );
        } else {
            starRating = event.target;
        }
        
        let onStar = parseInt( starRating.dataset.value, 10 ); // The star currently mouse on

        // Now highlight all the stars that's not after the current hovered star
        let children = starRating.parentNode.children;
        if( event.type == "mouseover" ) {
            for( let j = 0; j < children.length; j++ ) {
                if( j < onStar ) {
                    if( j == onStar - 1 ) {
                        if ( event.target.classList.contains( 'wptb-rating-star-left-signal-part' ) ) {
                            children[j].classList.add( 'wptb-rating-star-hover-half' );
                            children[j].classList.remove( 'wptb-rating-star-hover-full' );
                        } else if( event.target.classList.contains( 'wptb-rating-star-right-signal-part' ) ) {
                            children[j].classList.add( 'wptb-rating-star-hover-full' );
                            children[j].classList.remove( 'wptb-rating-star-hover-half' );
                        }
                    } else {
                        children[j].classList.add( 'wptb-rating-star-hover-full' );
                        children[j].classList.remove( 'wptb-rating-star-hover-half' );
                    }
                } else {
                    children[j].classList.remove( 'wptb-rating-star-hover-full' );
                    children[j].classList.remove( 'wptb-rating-star-hover-half' );
                }
            }
        } else if ( event.type == "click" ) {
            for( let j = 0; j < children.length; j++ ) {
                if( j < onStar ) {
                    if( j == onStar - 1 ) {
                        if ( event.target.classList.contains( 'wptb-rating-star-left-signal-part' ) ) {
                            children[j].classList.add( 'wptb-rating-star-selected-half' );
                            children[j].classList.remove( 'wptb-rating-star-selected-full' );
                        } else if( event.target.classList.contains( 'wptb-rating-star-right-signal-part' ) ) {
                            children[j].classList.add( 'wptb-rating-star-selected-full' );
                            children[j].classList.remove( 'wptb-rating-star-selected-half' );
                        }
                    } else {
                        children[j].classList.add( 'wptb-rating-star-selected-full' );
                        children[j].classList.remove( 'wptb-rating-star-selected-half' );
                    }
                } else {
                    children[j].classList.remove( 'wptb-rating-star-selected-full' );
                    children[j].classList.remove( 'wptb-rating-star-selected-half' );
                }
            }
        }
        
    },
    starRatingEventHandlersAdd: function( ratingStar ) {
        ratingStar.onmouseover = function( event ) {
            event.stopPropagation();
            WPTB_Helper.starRatingSelectHoverSet( event );
        }
        ratingStar.onmouseout = function() {
            let children = this.parentNode.children;
            for( let j = 0; j < children.length; j++ ) {
                children[j].classList.remove( 'wptb-rating-star-hover-half' );
                children[j].classList.remove( 'wptb-rating-star-hover-full' );
            }
        }

        /* 2. Action to perform on click */
        ratingStar.onclick = function( event ) {
            WPTB_Helper.starRatingSelectHoverSet( event );
            
            /* Rating number message */
            let wptbStarRatingContainer = WPTB_Helper.findAncestor( event.target, 'wptb-star_rating-container' );

            WPTB_Helper.starRatingTextMessageChenge( wptbStarRatingContainer );

            let wptbActionsField = new WPTB_ActionsField( 1, wptbStarRatingContainer );

            wptbActionsField.setParameters( wptbStarRatingContainer );

            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        }
    },
    numberImputSize: function ( wptbNumberInputs, maxCount, maxValue ) {
        wptbNumberInputs.onkeydown = function() {
            let thisValue = this.value;
            thisValue = String( thisValue );
            if ( thisValue[0] == 0 ) {
                this.value = "";
            } else {
                thisValue = thisValue.substring( 0, maxCount );
                this.value = thisValue;
            }
        }
        wptbNumberInputs.onkeyup = function() {
            let thisValue = this.value;
            thisValue = String( thisValue );
            if ( thisValue > maxValue ) {
                this.value = maxValue;
            }
        }
    },
    starRatingTextMessageChenge: function( starRatingContainer ) {
        let ratingNumber = starRatingContainer.getElementsByClassName( 'wptb-rating-star-selected-full' ).length;
        if( starRatingContainer.getElementsByClassName( 'wptb-rating-star-selected-half' ).length > 0 ) {
            ratingNumber = parseInt( ratingNumber ) + 0.5;
        }
        
        let wptbTextMessageCommon = starRatingContainer.querySelectorAll( 'li' ),
            wptbTextMessageCommonVal = wptbTextMessageCommon.length,
            wptbTextMessage = starRatingContainer.querySelector( '.wptb-text-message' );
        if( wptbTextMessageCommonVal == 1 && wptbTextMessageCommon[0].style.display == 'none' ) {
            wptbTextMessage.innerHTML = '';
            return;
        }
        
        wptbTextMessage.innerHTML = ratingNumber + '/' + wptbTextMessageCommonVal;
    }
}
