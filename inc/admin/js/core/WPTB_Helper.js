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
    getElementIcon: function ( icon_directory ) {
        let hostName = location.protocol + '//' + location.hostname;
        let img = document.createElement( 'img' );
        img.src = icon_directory;
        return img;
    },
    elementDragEndClear: function() {
        let wptbMovingMode = document.getElementsByClassName( 'wptb-moving-mode' );
        if ( wptbMovingMode.length > 0 ) {
            for( let i = 0; i < wptbMovingMode.length; i++ ) {
                wptbMovingMode[i].classList.remove( 'wptb-moving-mode' );
            }
        }

        let wptbDropHandles = document.getElementsByClassName( 'wptb-drop-handle' );
        if ( wptbDropHandles.length > 0 ) {
            for( let i = 0; i < wptbDropHandles.length; i++ ) {
                wptbDropHandles[i].style.display = 'none';
            }
        }

        let wptbDropBorderMarkers = document.getElementsByClassName( 'wptb-drop-border-marker' );
        if ( wptbDropBorderMarkers.length > 0 ) {
            for( let i = 0; i < wptbDropBorderMarkers.length; i++ ) {
                wptbDropBorderMarkers[i].style.display = 'none';
            }
        }
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
                if( event.originalEvent.type == 'square' || event.originalEvent.type == 'strip' ) {
                    let body = document.getElementsByTagName( 'body' )[0];
                    body.removeEventListener( 'mouseup', WPTB_Helper.irisStripMouseUpStateSaveManager, false );
                    body.addEventListener( 'mouseup', WPTB_Helper.irisStripMouseUpStateSaveManager, false );
                }
            }
        }
    },
    irisStripMouseUpStateSaveManager: function() {
        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
        
        let body = document.getElementsByTagName( 'body' )[0];
        body.removeEventListener( 'mouseup', WPTB_Helper.irisStripMouseUpStateSaveManager, false );
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
    newElementProxy: function( el ) {
        if( el ) {
            let data = {kind: el};
            return new WPTB_ElementObject( data );
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
                let wptbTextMessageSize = affectedEl.querySelector('.wptb-number-rating');
                wptbTextMessageSize.style.color = uiColor;
            }

        } else {
            affectedEl.style.color = uiColor;
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
        wptbNumberInputs.onkeyup = function(  ) {
            let thisValue = this.value;
            if ( parseInt( thisValue, 10 ) > parseInt( maxValue, 10 ) ) {
                this.value = maxValue;
            }
            
            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        }
    },
    ucfirst: function( str ) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    wptbDocumentEventGenerate: function( eventName, element, details ) {
        if( eventName && element ) {
            if( ! details ) {
                details = true;
            }
            let event = new CustomEvent( eventName, { detail: details, bubbles: true } );
            element.dispatchEvent( event );
        }
    },
    // run script for the pointed element
    elementStartScript: function( element ) {
        //let script = element.getElementsByTagName( 'script' );
        let infArr = element.className.match(/wptb-element-(.+)-(\d+)/i);
        if( infArr && Array.isArray( infArr ) ) {
            let kind = infArr[1];
            if( kind ) {
//                let wpTemplateId = 'wptb-' + kind + '-script';
//                let template = wp.template( wpTemplateId );
//                let data  = {elemClass: infArr[0]};
//                let elementScriptText = template( data );
//                elementScriptText = elementScriptText.replace(/\r|\n|\t/g, '').trim();
//
//                let scriptNew = document.createElement( 'script' );
//                scriptNew.setAttribute( 'type', 'text/javascript' );
//                scriptNew.innerHTML = elementScriptText;
//                element.parentNode.appendChild( scriptNew );
                
//                element.parentNode.removeChild( scriptNew );
                if( kind in WPTB_ElementsScriptsLauncher ) {
                    WPTB_ElementsScriptsLauncher[kind]( element );
                }
            }
        }
    },
    // deletes event handlers from the pointed option element and from all his daughter elements
    deleteEventHandlers: function( element ) {
        if( element ) {
            jQuery( element ).off();
            let elementChildren = element.children;
            if( elementChildren ) {
                for ( let i = 0; i < elementChildren.length; i++ ) {
                    WPTB_Helper.deleteEventHandlers( elementChildren[i] );
                }
            }
        } else {
            return;
        }
    },
    // replace all occurrences in a string
    replaceAll: function( string, search, replace ){
        return string.split( search ).join( replace );
    },
    // clears code from TinyMCE attributes
    elementClearFromTinyMce: function( element ) {
        let mceContentBodys = element.querySelectorAll( '.mce-content-body' );
        if( mceContentBodys.length > 0 ) {
            for ( let k = 0; k < mceContentBodys.length; k++ ) {
                mceContentBodys[k].classList.remove( 'mce-content-body' );
            }
        }

        let dataMceStyle = element.querySelectorAll( '[data-mce-style]' );
        if ( dataMceStyle.length > 0 ) {
            for ( let k = 0; k < dataMceStyle.length; k++ ) {
                dataMceStyle[k].removeAttribute( 'data-mce-style' );
            }
        }
        
        let mceEditFocus = element.querySelectorAll( '.mce-edit-focus' );
        if( mceEditFocus.length > 0 ) {
            for ( let k = 0; k < mceEditFocus.length; k++ ) {
                mceEditFocus[k].classList.remove( 'mce-edit-focus' );
            }
        }

        let contentEditable = element.querySelectorAll( '[contenteditable]' );
        if ( contentEditable.length > 0 ) {
            for ( let k = 0; k < contentEditable.length; k++ ) {
                contentEditable[k].removeAttribute( 'contenteditable' );
            }
        }

        let spellCheck = element.querySelectorAll( '[spellcheck]' );
        if ( spellCheck.length > 0 ) {
            for ( let k = 0; k < spellCheck.length; k++ ) {
                spellCheck[k].removeAttribute( 'spellcheck' );
            }
        }

        let mceIds = element.querySelectorAll( '[id^=mce_]' );
        if ( mceIds.length > 0 ) {
            for ( let k = 0; k < mceIds.length; k++ ) {
                mceIds[k].removeAttribute( 'id' );
            }
        }
        
        return element;
    },
    elementOptionContainerCustomClassSet: function( targetInput, customClassForContainer ) {
        if( targetInput && customClassForContainer ) {
            let containerElement = WPTB_Helper.findAncestor( targetInput, 'wptb-element-option' );
            if( containerElement ) {
                containerElement.classList.add( customClassForContainer );
            }
        }
    },
    elementOptionContainerAdditionalStyles: function( targetInput, containerAdditionalStyles ) {
        if( targetInput && containerAdditionalStyles ) {
            let containerElement = WPTB_Helper.findAncestor( targetInput, 'wptb-element-option' );
            let containerStylesArrOne = containerAdditionalStyles.split( ';' );

            if( containerElement && containerStylesArrOne ) {
                function containerStylesSet( containerStyleStr, containerElement ) {
                    if( containerStyleStr ) {
                        containerStyleStrArr = containerStyleStr.split( ':' );

                        if( containerStyleStrArr && Array.isArray( containerStyleStrArr ) ) {
                            containerElement.style[containerStyleStrArr[0]] = containerStyleStrArr[1];
                        }
                    }
                }
                if( containerStylesArrOne && Array.isArray( containerStylesArrOne ) ) {
                    for( let i = 0; i < containerStylesArrOne.length; i++ ) {
                        console.log( containerStylesArrOne );
                        if( containerStylesArrOne[i] ) {
                            containerStylesSet( containerStylesArrOne[i], containerElement );
                        }
                    }
                } else {
                    containerStylesSet( containerStylesArrOne, containerElement );
                }
            }
        }
    },
    // function which set handler for event of changes of control
    controlsInclude: function( element, functionHandler ) {
        if( element && typeof element === 'object' && typeof functionHandler === 'function' ) {
            element.addEventListener( 'click', function() {
                let infArr = element.className.match( /wptb-element-(.+)-(\d+)/i ),
                    elementKind;

                if( infArr && Array.isArray( infArr ) ) {
                    elementKind = infArr[1];
                }

                if( ! element.hasOwnProperty( 'сontrolsConnectIndic' ) || element.сontrolsConnectIndic !== true && elementKind  ) {
                    let elementsSettingsTemplateJs = document.getElementsByClassName( 'wptb-element-datas' );
                    if( elementsSettingsTemplateJs.length > 0 ) {
                        elementsSettingsTemplateJs = elementsSettingsTemplateJs[0];

                        let elementsSettings = elementsSettingsTemplateJs.innerHTML;
                        let controlClassesNames = [];
                        if( elementsSettings ) {
                            elementsSettings = JSON.parse( elementsSettings );
                            if( elementsSettings && typeof elementsSettings === 'object' ) {
                                if( 'tmpl-wptb-element-datas-' + infArr[1] + '-' + infArr[2] in elementsSettings ) {
                                    let elementSettings = elementsSettings['tmpl-wptb-element-datas-' + infArr[1] + '-' + infArr[2]];
                                    if( elementSettings && typeof elementSettings === 'object' ) {
                                        Object.keys( elementSettings ).forEach( function( key ) {
                                            let regularText = new RegExp( 'data-wptb-el-' + elementKind + '-(\\d+)-(.+)', "i" );
                                            let keyInfArr = key.match( regularText );
                                            if( keyInfArr && Array.isArray( keyInfArr ) ) {
                                                let controlClass = key.replace( 'data-', '' );
                                                controlClassesNames.push( [controlClass, keyInfArr[2]] );
                                            }
                                        });
                                    }
                                }
                            }
                        }

                        for( let i = 0; i < controlClassesNames.length; i++ ) {
                            element.addEventListener( 'wptb-control:' + controlClassesNames[i][0], function() {
                                let controls = {};
                                let controlName = controlClassesNames[i][1];
                                let control = document.getElementsByClassName( controlClassesNames[i][0] );
                                if( control.length > 0 && controlName ) {
                                    let targetControlValue = WPTB_Helper.targetControlValueGet( control );

                                    controls[controlName] = targetControlValue;
                                }

                                functionHandler( controls, element );
                            }, false );

                            element.сontrolsConnectIndic = true;
                        }
                    }
                }
            }, false );
        }
    },
    oneControlInclude: function( element, functionHandler, controlName ) {
        if( element && typeof element === 'object' && typeof functionHandler === 'function' && typeof controlName === 'string' ) {
            let infArr = element.className.match( /wptb-element-((.+-)\d+)/i ),
            elementKind;
            
            if( infArr && Array.isArray( infArr ) ) {
                elementKind = infArr[1].split( '-' )[0];
                
                let wptbContrlStacksConfigId = 'wptb-' + elementKind + '-control-stack';
                let tmplControlsConfig = wp.template( wptbContrlStacksConfigId );
                let data = {
                    container: '.' + infArr[0]
                };
                let jsonControlsConfigJson = tmplControlsConfig( data );
                let jsonControlsConfig = JSON.parse( jsonControlsConfigJson );
                
                if( jsonControlsConfig && typeof jsonControlsConfig === 'object' && jsonControlsConfig.hasOwnProperty( controlName ) ) {
                    let controlClassName = 'wptb-el-' + infArr[1] + '-' + controlName;
                    
                    element.addEventListener( 'wptb-control:' + controlClassName, function( event ) {
                        let control = document.getElementsByClassName( controlClassName );
                        if( control.length > 0 ) {
                            let targetControlValue = WPTB_Helper.targetControlValueGet( control );

                            functionHandler( targetControlValue, element );
                        }
                    }, false );
                }
            }
        } else {
            return false;
        }
    },
    //
    innerElementCopyIncludeHandler: function( element, functionHandler ) {
        if( element && typeof element === 'object' && typeof functionHandler === 'function' ) {
            element.addEventListener( 'wptb-inner-element:copy', function( event ) {
                let innerElement = event.detail;
                if( innerElement ) {
                    WPTB_Helper.elementClearFromTinyMce( innerElement );
                    functionHandler( innerElement, element );
                }
            }, false );
        }
    },
    //
    appearDependOn: function( dependOn, targetControlElementClass ) {
        if( Array.isArray( dependOn ) ) {
            let dependOnControlName = dependOn[0];
            let infArr = targetControlElementClass.match( /wptb-el-((.+-)\d+)-(.+)/i );
            
            if( infArr && Array.isArray( infArr ) ) {
                let controlName = infArr[3];

                let dependOnControlElementClass = targetControlElementClass.replace( controlName, dependOnControlName );

                let dependOnControlElement = document.getElementsByClassName( dependOnControlElementClass );

                if( dependOnControlElement.length > 0 ) {
                    dependOnControlElement = dependOnControlElement[0];
                    let targetControlElement = document.getElementsByClassName( targetControlElementClass );
                    if( targetControlElement.length > 0 ) {
                        targetControlElement = targetControlElement[0];
                        let controlContainerElem = WPTB_Helper.findAncestor( targetControlElement, 'wptb-element-option' );

                        if( controlContainerElem ) {
                            function showHideDependOnControlElement( dependOnControlElementKind ) {
                                
                                let elementsSettingsTemplateJs = document.getElementsByClassName( 'wptb-element-datas' );
                                if( elementsSettingsTemplateJs.length > 0 ) {
                                    elementsSettingsTemplateJs = elementsSettingsTemplateJs[0];

                                    let elementsSettings = elementsSettingsTemplateJs.innerHTML;
                                    if( elementsSettings ) {
                                        elementsSettings = JSON.parse( elementsSettings );
                                        if( elementsSettings && typeof elementsSettings === 'object' && 
                                            ( 'tmpl-wptb-element-datas-' + dependOnControlElementKind ) in elementsSettings ) {
                                            let elementSettings = elementsSettings['tmpl-wptb-element-datas-' + dependOnControlElementKind];
                                            if( elementSettings && typeof elementSettings === 'object' && 
                                                    ( 'data-wptb-el-' + dependOnControlElementKind + '-' + dependOnControlName ) in elementSettings ) {
                                                let elementSettingValue = elementSettings['data-wptb-el-' + dependOnControlElementKind + '-' + dependOnControlName];
                                                
                                                if( elementSettingValue ) {
                                                    if( dependOn[1] && Array.isArray( dependOn[1] ) && 
                                                        ( dependOn[1].indexOf( elementSettingValue ) !== -1 ) ) {
                                                        controlContainerElem.style.display = 'block';
                                                    } else if( dependOn[2] && Array.isArray( dependOn[2] ) && 
                                                        ( dependOn[2].indexOf( elementSettingValue ) !== -1 ) ) {
                                                        controlContainerElem.style.display = 'none';
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            showHideDependOnControlElement( infArr[1] );

                            dependOnControlElement.addEventListener( 'change', function() {
                                showHideDependOnControlElement( infArr[1] );
                            }, false );
                        }
                    }
                }
            }
        }
    },
    //
    controlsStateManager: function ( targetControlClass, controlChangeIndic ) {
        let targetControls = document.getElementsByClassName( targetControlClass );
        if( targetControls.length > 0 ) {
            //targetControls = targetControls[0];
            
            let infArr = targetControlClass.match( /wptb-el-((.+-)\d+)-(.+)/i );
            
            if( infArr && Array.isArray( infArr ) ) {
                let selectorElement = document.querySelector( '.wptb-element-' + infArr[1] );
                if( selectorElement ) {
                    let elementsSettingsTemplatesJs;
                    let elementSettings = {};
                    let elementsSettings;
                    elementsSettingsTemplatesJs = document.getElementsByClassName( 'wptb-element-datas' );
                    if( elementsSettingsTemplatesJs.length == 0 || elementsSettingsTemplatesJs[0].innerHTML == '' ) {
                        let targetControlValue = WPTB_Helper.targetControlValueGet( targetControls );
                        elementSettings['data-' + targetControlClass] = targetControlValue;

                        elementsSettings = {};
                        elementsSettings['tmpl-wptb-element-datas-' + infArr[1]] = elementSettings;
                        elementsSettings = JSON.stringify( elementsSettings );

                        if( elementsSettingsTemplatesJs.length == 0 ) {
                            elementsSettingsTemplatesJs = document.createElement( 'script' );
                            elementsSettingsTemplatesJs.setAttribute( 'type', 'text/html' );
                            elementsSettingsTemplatesJs.setAttribute( 'class', 'wptb-element-datas' );
                        } else {
                            elementsSettingsTemplatesJs = elementsSettingsTemplatesJs[0];
                        }

                        elementsSettingsTemplatesJs.innerHTML = elementsSettings;

                        let body = document.getElementsByTagName('body')[0];
                        body.appendChild( elementsSettingsTemplatesJs );
                    } else {
                        elementsSettingsTemplatesJs = elementsSettingsTemplatesJs[0];
                        elementsSettings = elementsSettingsTemplatesJs.innerHTML;
                        if( elementsSettings ) {
                            elementsSettings = JSON.parse( elementsSettings );

                            if( elementsSettings && typeof elementsSettings === 'object' ) {
                                
                                
                                if( controlChangeIndic ) {
                                    let targetControlValue = WPTB_Helper.targetControlValueGet( targetControls );
                                    if( ! ( ( 'tmpl-wptb-element-datas-' + infArr[1] ) in elementsSettings ) || 
                                            typeof elementsSettings['tmpl-wptb-element-datas-' + infArr[1]] !== 'object') {
                                        elementsSettings['tmpl-wptb-element-datas-' + infArr[1]] = {};
                                    }
                                    elementsSettings['tmpl-wptb-element-datas-' + infArr[1]]['data-' + targetControlClass] = targetControlValue;
                                    elementsSettingsTemplatesJs.innerHTML = JSON.stringify( elementsSettings );
                                } else if( ! ( ( ( 'tmpl-wptb-element-datas-' + infArr[1] ) in elementsSettings ) && 
                                        typeof elementsSettings['tmpl-wptb-element-datas-' + infArr[1]] === 'object' && 
                                         ( 'data-' + targetControlClass ) in elementsSettings['tmpl-wptb-element-datas-' + infArr[1]] ) ) {
                                    let targetControlValue = WPTB_Helper.targetControlValueGet( targetControls );
                                    if( ! ( ( 'tmpl-wptb-element-datas-' + infArr[1] ) in elementsSettings ) || 
                                            typeof elementsSettings['tmpl-wptb-element-datas-' + infArr[1]] !== 'object') {
                                        elementsSettings['tmpl-wptb-element-datas-' + infArr[1]] = {};
                                    }
                                    elementsSettings['tmpl-wptb-element-datas-' + infArr[1]]['data-' + targetControlClass] = targetControlValue;
                                    elementsSettingsTemplatesJs.innerHTML = JSON.stringify( elementsSettings );
                                } else if( ( ( 'tmpl-wptb-element-datas-' + infArr[1] ) in elementsSettings ) && 
                                        typeof elementsSettings['tmpl-wptb-element-datas-' + infArr[1]] === 'object' && 
                                        ( 'data-' + targetControlClass ) in elementsSettings['tmpl-wptb-element-datas-' + infArr[1]] ) {
                                    for( let i = 0; i < targetControls.length; i++ ) {
                                        if( targetControls[i].type == 'checkbox' ) {
                                            let targetControlValue;
                                            if( targetControls[i].name ) {
                                                targetControlValue = elementsSettings['tmpl-wptb-element-datas-' + infArr[1]]['data-' + targetControlClass][targetControls[i].name];
                                            } else {
                                                targetControlValue = elementsSettings['tmpl-wptb-element-datas-' + infArr[1]]['data-' + targetControlClass];
                                            }
                                            
                                            if( targetControlValue == 'checked' ) {
                                                targetControls[i].checked = true;
                                            } else if( targetControlValue == 'unchecked' ) {
                                                targetControls[i].checked = false;
                                            }
                                        } else {
                                            targetControls[i].value = elementsSettings['tmpl-wptb-element-datas-' + infArr[1]]['data-' + targetControlClass];
                                        }
                                    }
                                    
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    //
    targetControlValueGet: function( targetControls ) {
        let targetControlValue;
        for( let i = 0; i < targetControls.length; i++ ) {
            if( targetControls[i].type == 'checkbox' && targetControls[i].name ) {
                if( ! targetControlValue ) targetControlValue = {};
                if( targetControls[i].checked == true ) {
                    targetControlValue[targetControls[i].name] = 'checked';
                } else {
                    targetControlValue[targetControls[i].name] = 'unchecked';
                }
            } else if( targetControls[i].type == 'checkbox' ) {
                    if( targetControls[i].checked == true ) {
                        targetControlValue = 'checked';
                    } else {
                        targetControlValue = 'unchecked';
                    }
            } else {
                targetControlValue = targetControls[i].value;
            }
        }
        return targetControlValue;
    },
    //
    elementControlsStateCopy: function( elementProt, copyElem ) {
        if( elementProt && copyElem ) {
            let infArrProt = elementProt.className.match( /wptb-element-((.+-)\d+)/i );
            let infArrCopy = copyElem.className.match( /wptb-element-((.+-)\d+)/i );
            if( infArrProt && Array.isArray( infArrProt ) &&
                    infArrCopy && Array.isArray( infArrCopy )) {
                let elemProtKind = infArrProt[1];
                let elemCopyKind = infArrCopy[1];
                let elementsSettingsTemplateJs = document.getElementsByClassName( 'wptb-element-datas' );
                if( elementsSettingsTemplateJs.length > 0 ) {
                    elementsSettingsTemplateJs = elementsSettingsTemplateJs[0];
                    
                    let elementsSettings = elementsSettingsTemplateJs.innerHTML;
                    if( elementsSettings ) {
                        elementsSettings = JSON.parse( elementsSettings );
                        
                        if( elementsSettings && typeof elementsSettings === 'object' ) {
                            let elementSettingsProt = elementsSettings['tmpl-wptb-element-datas-' + elemProtKind];
                            if( elementSettingsProt && typeof elementSettingsProt === 'object' ) {
                                let elementSettingsCopy = {};
                                
                                Object.keys( elementSettingsProt ).forEach( function( key ) {
                                    let elementSettingValue = elementSettingsProt[key];
                                    let elementSettingKeyCopy = key.replace( elemProtKind, elemCopyKind );
                                    elementSettingsCopy[elementSettingKeyCopy] = elementSettingValue;
                                });
                                
                                if( Object.keys( elementSettingsCopy ).length > 0 ) {
                                    elementsSettings['tmpl-wptb-element-datas-' + elemCopyKind] = elementSettingsCopy;
                                    
                                    elementsSettings = JSON.stringify( elementsSettings );
                                    elementsSettingsTemplateJs.innerHTML = elementsSettings;
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    //
    elementControlsStateDelete: function( element ) {
        let infArr = element.className.match( /wptb-element-(.+)-(\d+)/i );
        let body = document.getElementsByTagName( 'body' )[0];
        let wptbElementDatas = body.getElementsByClassName( 'wptb-element-datas' );
        if( infArr && Array.isArray( infArr ) && wptbElementDatas.length > 0 ) {
            wptbElementDatas = wptbElementDatas[0];
            let elementsSettings = wptbElementDatas.innerHTML;
            if( elementsSettings ) {
                elementsSettings = JSON.parse( elementsSettings );
                if( elementsSettings && typeof elementsSettings === 'object' &&
                        ( ( 'tmpl-wptb-element-datas-' + infArr[1] + '-' + infArr[2] ) in elementsSettings ) ) {
                    delete elementsSettings['tmpl-wptb-element-datas-' + infArr[1] + '-' + infArr[2]];

                    if( Object.keys( elementsSettings ).length == 0 ) {
                        body.removeChild( wptbElementDatas );
                    } else {
                        elementsSettings = JSON.stringify( elementsSettings );
                        wptbElementDatas.innerHTML = elementsSettings;
                    }
                }
            }
        }
    }
}
