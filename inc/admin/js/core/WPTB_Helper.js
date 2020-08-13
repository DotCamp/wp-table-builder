var WPTB_Helper = {
    hexToRgb: function( hex ) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
        return result ? 'rgb(' + parseInt( result[1], 16 ) + ',' + parseInt( result[2], 16 ) + ',' + parseInt( result[3], 16 ) + ')' : null;
    },
    rgbToHex: function ( rgb ) {
        if( rgb ) {
            if( WPTB_Helper.isHex( rgb ) ) return rgb;

            let rgbm = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?((?:[0-9]*[.])?[0-9]+)[\s+]?\)/i);
            if ( rgbm && rgbm.length === 5) {
                return "#" +
                    ('0' + Math.round(parseFloat(rgbm[4], 10) * 255).toString(16).toUpperCase()).slice(-2) +
                    ("0" + parseInt(rgbm[1], 10).toString(16).toUpperCase()).slice(-2) +
                    ("0" + parseInt(rgbm[2], 10).toString(16).toUpperCase()).slice(-2) +
                    ("0" + parseInt(rgbm[3], 10).toString(16).toUpperCase()).slice(-2);
            } else {
                rgbm = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
                if (rgbm && rgbm.length === 4) {
                    return "#" +
                        ("0" + parseInt(rgbm[1], 10).toString(16).toUpperCase()).slice(-2) +
                        ("0" + parseInt(rgbm[2], 10).toString(16).toUpperCase()).slice(-2) +
                        ("0" + parseInt(rgbm[3], 10).toString(16).toUpperCase()).slice(-2);
                } else {
                    return '';
                }
            }
        } else {
            return '';
        }

    },
    isHex: function( hex ) {
        let regex = new RegExp('^#(?:[A-Fa-f0-9]{3}){1,2}$');
        return regex.test( hex );
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
    linkHttpCheckChange: function( link, convertToAbs = false ) {
        if ( link ) {
            // even though it is not a best practice and a huge security risk, sometimes our users use javascript tag at href attributes, this check will make sure those tags will not be modified and returned as they are
            if(link.match(/^(javascript:)(.+)$/)){
                return link;
            }
            // relative link checking
            // if link starts with '/', assume it is a relative link to the origin of the current site
            else if( link.match(/^\/([\S]+)$/) ){
                if (convertToAbs) {
                    const currentLocation = document.location;
                    let {origin} = currentLocation;


                    // strip out the '/' at the end of the origin name if there is any
                    if (origin.match(/^(.+)\/$/)) {
                        origin = origin.slice(-1);
                    }

                    return `${origin}${link}`;
                }else{
                    return link;
                }
            }
            else if ( link.indexOf( 'http://' ) == -1 && link.indexOf( 'https://' ) == -1 ) {
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
        // TODO dataTitleColumnSet
        // let rows = table.rows,
        //     rowHead = rows[0];
        // let computedStyleRowHead = getComputedStyle( rowHead );
        //
        // let rowHeadChildren = rowHead.children;
        // let contentsForHeader = {};
        // for( let i = 0; i < rowHeadChildren.length; i++ ) {
        //     let tdElements = rowHeadChildren[i].children;
        //
        //     for( let j = 0; j < tdElements.length; j++ ) {
        //         let element = tdElements[j];
        //         if( element.classList.contains( 'wptb-ph-element' ) ) {
        //             let infArr = element.className.match( /wptb-element-(.+)-(\d+)/i );
        //             if( infArr[1] == 'text' ) {
        //                 let p = element.querySelector( 'p' ),
        //                     textContent = p.textContent,
        //                     textAlign = p.style.textAlign;
        //                     contentsForHeader[rowHeadChildren[i].dataset.xIndex] = [textContent, element.style.fontSize,
        //                         element.style.color, computedStyleRowHead.backgroundColor, textAlign];
        //                 break;
        //             }
        //         }
        //     }
        //     if( ! contentsForHeader[rowHeadChildren[i].dataset.xIndex] ) {
        //         contentsForHeader[rowHeadChildren[i].dataset.xIndex] = ['', '',
        //                     '', computedStyleRowHead.backgroundColor, ''];
        //     }
        // }
        // for ( let i = 1; i < rows.length; i++ ) {
        //     let thisRow = rows[i],
        //         thisRowChildren = thisRow.children;
        //     for( let j = 0; j < thisRowChildren.length; j++ ) {
        //         if ( contentsForHeader[thisRowChildren[j].dataset.xIndex] ) {
        //             thisRowChildren[j].dataset.wptbTitleColumn = contentsForHeader[thisRowChildren[j].dataset.xIndex][0];
        //             thisRowChildren[j].dataset.wptbTitleColumnFontSize = contentsForHeader[thisRowChildren[j].dataset.xIndex][1];
        //             thisRowChildren[j].dataset.wptbTitleColumnColor = contentsForHeader[thisRowChildren[j].dataset.xIndex][2];
        //             thisRowChildren[j].dataset.wptbTitleBackgroundColor = contentsForHeader[thisRowChildren[j].dataset.xIndex][3];
        //             thisRowChildren[j].dataset.wptbTitleAlign = contentsForHeader[thisRowChildren[j].dataset.xIndex][4];
        //         } else {
        //             thisRowChildren[j].dataset.wptbTitleColumn = null;
        //             thisRowChildren[j].dataset.wptbTitleColumnFontSize = null;
        //             thisRowChildren[j].dataset.wptbTitleColumnColor = null;
        //             thisRowChildren[j].dataset.wptbTitleBackgroundColor = null;
        //             thisRowChildren[j].dataset.wptbTitleAlign = null;
        //         }
        //     }
        // }
    },
    findAncestor: function( el, cls ) {
        while ( ( el = el.parentElement ) && !el.classList.contains( cls ) );
        return el;
    },
    rowIsTop: function( row ) {
        var parent = row.parentNode;
        if( parent.children[0] == row ) {
            return true;
        } else {
            return false;
        }
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
        if ( ! results ) return false;
        if ( ! results[2] ) return '';
        return decodeURIComponent( results[2].replace(/\+/g, ' ') );
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
    elementStartScript: function( element, kind ) {
        //let script = element.getElementsByTagName( 'script' );
        if(!kind) {
            let infArr = element.className.match(/wptb-element-(.+)-(\d+)/i);
            if( infArr && Array.isArray( infArr ) ) {
                kind = infArr[1];
            }
        }

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
    controlsInclude: function( element, functionHandler, acceptEventValues = false ) {
        if( element && typeof element === 'object' && typeof functionHandler === 'function' ) {
            element.addEventListener( 'element:controls:active', function() {
                if(!element.hasOwnProperty('controlConnectFunctionsName') ||
                    !Array.isArray(element.controlConnectFunctionsName) ||
                    element.controlConnectFunctionsName.indexOf(functionHandler.name) == -1) {
                    let infArr = element.className.match( /wptb-element-(.+)-(\d+)/i ),
                        elementKind;

                    if( infArr && Array.isArray( infArr ) ) {
                        elementKind = infArr[1];
                    }

//                if( ! element.hasOwnProperty( 'сontrolsConnectIndic' ) || element.сontrolsConnectIndic !== true && elementKind  ) {
//                    let elementsSettingsTemplateJs = document.getElementsByClassName( 'wptb-element-datas' );
//                    if( elementsSettingsTemplateJs.length > 0 ) {
//                        elementsSettingsTemplateJs = elementsSettingsTemplateJs[0];
//
//                        let elementsSettings = elementsSettingsTemplateJs.innerHTML;
//                        let controlClassesNames = [];
//                        if( elementsSettings ) {
//                            elementsSettings = elementsSettings.trim();
//                            elementsSettings = JSON.parse( elementsSettings );
//                            if( elementsSettings && typeof elementsSettings === 'object' ) {
//                                if( 'tmpl-wptb-el-datas-' + infArr[1] + '-' + infArr[2] in elementsSettings ) {
//                                    let elementSettings = elementsSettings['tmpl-wptb-el-datas-' + infArr[1] + '-' + infArr[2]];
//                                    if( elementSettings && typeof elementSettings === 'object' ) {
//                                        Object.keys( elementSettings ).forEach( function( key ) {
//                                            let regularText = new RegExp( 'data-wptb-el-' + elementKind + '-(\\d+)-([a-zA-Z0-9_-]+)', "i" );
//                                            let keyInfArr = key.match( regularText );
//                                            if( keyInfArr && Array.isArray( keyInfArr ) ) {
//                                                let controlClass = key.replace( 'data-', '' );
//                                                controlClassesNames.push( [controlClass, keyInfArr[2]] );
//                                            }
//                                        });
//                                    }
//                                }
//                            }
//                        }
//                    }
//                }
                    if( elementKind ){
                        let elementOptionsGroupIds = element.optionsGroupIds;
                        if(elementOptionsGroupIds && Array.isArray(elementOptionsGroupIds)) {
                            for(let i = 0; i < elementOptionsGroupIds.length; i++) {
                                let elementOptionsGroupId = elementOptionsGroupIds[i];

                                let elementOptionsGroup = document.getElementById(elementOptionsGroupId);

                                let controlActiveElements = elementOptionsGroup.querySelectorAll('.wptb-element-property');
                                controlActiveElements = [...controlActiveElements];

                                controlActiveElements.map(controlActiveElement => {
                                    let regularText = new RegExp( 'wptb-el-' + elementKind + '-(\\d+)-([a-zA-Z0-9_-]+)', "i" );
                                    let controlInfArr = controlActiveElement.className.match( regularText );
                                    if( controlInfArr && Array.isArray( controlInfArr ) ) {
                                        let controlUnicClassName = controlInfArr[0];

                                        element.addEventListener( 'wptb-control:' + controlUnicClassName, function(e) {
                                            let controls = {};
                                            let controlName = controlInfArr[2];
                                            let control = document.getElementsByClassName( controlUnicClassName );
                                            if( control.length > 0 && controlName ) {
                                                let targetControlValue = WPTB_Helper.targetControlValueGet( control );

                                                if(acceptEventValues) {
                                                    controls[controlName] = {
                                                        targetValue: targetControlValue,
                                                        eventValue: e.detail.value
                                                    }
                                                }else {
                                                    controls[controlName] = targetControlValue;
                                                }
                                            }
                                            functionHandler( controls, element );
                                        }, false );
                                    }
                                });
                            }
                        }
                        //let elementOptionsContainer = document.querySelector( '.wptb-element-options.wptb-options-' + infArr[1] + '-' + infArr[2] );

                        // from time to time depend on table cells hierarchy, cell td items may catch mouse clicks which are intended for elements. since the active section is not cell management, this will gives and unharmfull error of not found element, simple check for null equality will be sufficient for now.
                        // if(!elementOptionsContainer){
                        //     return;
                        // }

                        // let elementOptions = elementOptionsContainer.querySelectorAll( '.wptb-element-option' );
                        // let controlActiveElements = elementOptions[i].querySelector( '.wptb-element-property' );
                        //
                        //
                        // for( let i = 0; i < elementOptions.length; i++ ) {
                        //     let controlActiveElement = elementOptions[i].querySelector( '.wptb-element-property' );
                        //     if( controlActiveElement ) {
                        //
                        //     }
                        // }

                        if(!element.controlConnectFunctionsName && !Array.isArray(element.controlConnectFunctionsName)) {
                            element.controlConnectFunctionsName = [];
                        }

                        element.controlConnectFunctionsName.push( functionHandler.name );
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
    /**
     * Sets the control elements when changing which to will restart this control
     * @param {array} dependOnControlName
     * @param {string} targetControlElementClass
     * @param {array} valueDependOnControlCorrect
     * @param {string} kind
     * @param {HTMLElement} element
     */
    valueDependOnControl: function(dependOnControlName, targetControlElementClass, valueDependOnControlCorrect, kind, element) {
        function dependOnControlDataGet(dependOnControlName, targetControlElementClass, valueDependOnControlCorrect) {
            if(typeof dependOnControlName === 'string') {
                dependOnControlName = [dependOnControlName];
            }
            let infArr = targetControlElementClass.match(/wptb-el-((.+-)\d+)-(.+)/i);
            let valueDependOnControl = {};
            let dependOnControlElementsArr = [];
            if (infArr && Array.isArray(infArr)) {
                let controlName = infArr[3];
                let dependOnControlElements;
                let valueDependOnControlCorrectObj = {};
                if(Array.isArray(valueDependOnControlCorrect)) {
                    if(Array.isArray(valueDependOnControlCorrect[0])) {
                        valueDependOnControlCorrect.map(s => {
                            valueDependOnControlCorrectObj[s[0]] = [s[1], s[2]];
                        });
                    } else {
                        valueDependOnControlCorrectObj[valueDependOnControlCorrect[0]] = [valueDependOnControlCorrect[1], valueDependOnControlCorrect[2]];
                    }
                }
                dependOnControlName.map(s => {
                    let dependOnControlElementClass = targetControlElementClass.replace(controlName, s);
                    if(dependOnControlElementClass) {
                        dependOnControlElements = document.getElementsByClassName(dependOnControlElementClass);
                        if(dependOnControlElements.length > 0 && dependOnControlElements[0].type) {
                            valueDependOnControl[s] = dependOnControlElements[0].value;
                            if(s in valueDependOnControlCorrectObj) {
                                if(valueDependOnControlCorrectObj[s][1] === 'integer') {
                                    valueDependOnControl[s] = parseInt(valueDependOnControl[s]) + parseInt(valueDependOnControlCorrectObj[s][0]);
                                } else if(valueDependOnControlCorrectObj[s][1] === 'string') {
                                    valueDependOnControl[s] = valueDependOnControl[s] + valueDependOnControlCorrectObj[s][0];
                                }
                            }
                            dependOnControlElementsArr.push(dependOnControlElements[0]);
                        }
                    }
                });
            }

            return [valueDependOnControl, dependOnControlElementsArr];
        }

        let dependOnControlData = dependOnControlDataGet(dependOnControlName, targetControlElementClass, valueDependOnControlCorrect);
        WPTB_Helper.elementOptionsSet(kind, element, dependOnControlData[0], targetControlElementClass);

        Object.keys(dependOnControlData[0]).forEach(function (key) {
            let infArr = element.className.match( /wptb-element-((.+-)\d+)/i );
            let unicClass = 'wptb-el-' + infArr[1] + '-' + [key];
            element.addEventListener(`wptb-control:${unicClass}`, function(event){
                let dependOnControlData = dependOnControlDataGet(dependOnControlName, targetControlElementClass, valueDependOnControlCorrect);
                WPTB_Helper.elementOptionsSet(kind, element, dependOnControlData[0], targetControlElementClass);
            }, false);
        });
    },
    /**
     * Sets the visibility of one control to depend on the state of other controls
     * @param dependOnMain
     * @param targetControlElementClass
     */
    appearDependOnControl: function( dependOnMain, targetControlElementClass ) {
        if( Array.isArray( dependOnMain ) ) {
            if(typeof dependOnMain[0] === 'string') {
                dependOnMain = [dependOnMain];
            } else if(!Array.isArray(dependOnMain[0])) {
                return;
            }
            let dependOnControlElementsValue = {};
            for(let i = 0; i < dependOnMain.length; i++) {
                let dependOn = dependOnMain[i];
                let dependOnControlName = dependOn[0];
                let infArr = targetControlElementClass.match(/wptb-el-((.+-)\d+)-(.+)/i);

                if (infArr && Array.isArray(infArr)) {
                    let controlName = infArr[3];

                    let dependOnControlElementClass = targetControlElementClass.replace(controlName, dependOnControlName);
                    if(dependOnControlElementClass) {
                        let dependOnControlElements = document.getElementsByClassName(dependOnControlElementClass);
                        if(dependOnControlElements.length > 0) {
                            dependOnControlElementsValue[dependOn[0]] = [dependOnControlElementValue(dependOnControlElements, dependOn), dependOnControlElements, dependOn];
                        }
                    }
                }
            }

            let targetControlElement = document.getElementsByClassName( targetControlElementClass );
            if( targetControlElement.length > 0 ) {
                targetControlElement = targetControlElement[0];
                let controlContainerElem = WPTB_Helper.findAncestor( targetControlElement, 'wptb-element-option' );

                if( controlContainerElem ) {
                    showHideTargetControlElement(controlContainerElem, dependOnControlElementsValue);

                    Object.keys(dependOnControlElementsValue).map(k => {
                        if (Object.prototype.hasOwnProperty.call(dependOnControlElementsValue, k)) {
                            let dependOnControlElements = dependOnControlElementsValue[k][1];
                            let dependOnControlElement = dependOnControlElements[0];
                            dependOnControlElement.addEventListener( 'change', dependOnControlElementChangeHandler.bind(null, controlContainerElem, dependOnControlElementsValue, k), false );
                        }
                    });
                }
            }

            function dependOnControlElementChangeHandler(controlContainerElem, dependOnControlElementsValue, k) {
                let dependOn = dependOnControlElementsValue[k][2];
                let dependOnControlElements = dependOnControlElementsValue[k][1];
                dependOnControlElementsValue[dependOn[0]] = [dependOnControlElementValue(dependOnControlElements, dependOn), dependOnControlElements, dependOn];
                showHideTargetControlElement(controlContainerElem, dependOnControlElementsValue)
            }

            function showHideTargetControlElement(controlContainerElem, dependOnControlElementsValue) {
                let display = 'block';
                Object.keys(dependOnControlElementsValue).map(k => {
                    if (Object.prototype.hasOwnProperty.call(dependOnControlElementsValue, k)) {
                        if(dependOnControlElementsValue[k][0] === false){
                            display = 'none';
                        }
                    }
                })

                controlContainerElem.style.display = display;
            }

            function dependOnControlElementValue(dependOnControlElements, dependOn) {
                let targetControlValue = WPTB_Helper.targetControlValueGet(dependOnControlElements);

                if(dependOn[1] && Array.isArray(dependOn[1]) &&
                    (dependOn[1].indexOf(targetControlValue) !== -1 )) {
                    return true;
                    // let childCheck = controlContainerElem.querySelector('input[type="checkbox"]')
                    // if (childCheck) {
                    //     childCheck.checked = true;
                    // }
                } else if(dependOn[2] && Array.isArray(dependOn[2]) &&
                    (dependOn[2].indexOf(targetControlValue) !== -1)) {
                    return false;
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
                let selectorElement;
                selectorElement = document.querySelector( '.wptb-element-' + infArr[1] );

                if( selectorElement  ) {
                    let elementsSettingsTemplatesJs;
                    let elementSettings = {};
                    let elementsSettings;
                    elementsSettingsTemplatesJs = document.getElementsByClassName( 'wptb-element-datas' );
                    if( elementsSettingsTemplatesJs.length == 0 || elementsSettingsTemplatesJs[0].innerHTML == '' ) {
                        let targetControlValue = WPTB_Helper.targetControlValueGet( targetControls );
                        elementSettings['data-' + targetControlClass] = targetControlValue;

                        elementsSettings = {};
                        elementsSettings['tmpl-wptb-el-datas-' + infArr[1]] = elementSettings;
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
                            elementsSettings = elementsSettings.trim();
                            elementsSettings = JSON.parse( elementsSettings );

                            if( elementsSettings && typeof elementsSettings === 'object' ) {


                                if( controlChangeIndic ) {
                                    let targetControlValue = WPTB_Helper.targetControlValueGet( targetControls );
                                    if( ! ( ( 'tmpl-wptb-el-datas-' + infArr[1] ) in elementsSettings ) ||
                                            typeof elementsSettings['tmpl-wptb-el-datas-' + infArr[1]] !== 'object') {
                                        elementsSettings['tmpl-wptb-el-datas-' + infArr[1]] = {};
                                    }
                                    elementsSettings['tmpl-wptb-el-datas-' + infArr[1]]['data-' + targetControlClass] = targetControlValue;
                                    elementsSettingsTemplatesJs.innerHTML = JSON.stringify( elementsSettings );
                                } else if( ! ( ( ( 'tmpl-wptb-el-datas-' + infArr[1] ) in elementsSettings ) &&
                                        typeof elementsSettings['tmpl-wptb-el-datas-' + infArr[1]] === 'object' &&
                                         ( 'data-' + targetControlClass ) in elementsSettings['tmpl-wptb-el-datas-' + infArr[1]] ) ) {
                                    let targetControlValue = WPTB_Helper.targetControlValueGet( targetControls );
                                    if( ! ( ( 'tmpl-wptb-el-datas-' + infArr[1] ) in elementsSettings ) ||
                                            typeof elementsSettings['tmpl-wptb-el-datas-' + infArr[1]] !== 'object') {
                                        elementsSettings['tmpl-wptb-el-datas-' + infArr[1]] = {};
                                    }
                                    elementsSettings['tmpl-wptb-el-datas-' + infArr[1]]['data-' + targetControlClass] = targetControlValue;
                                    elementsSettingsTemplatesJs.innerHTML = JSON.stringify( elementsSettings );
                                } else if( ( ( 'tmpl-wptb-el-datas-' + infArr[1] ) in elementsSettings ) &&
                                        typeof elementsSettings['tmpl-wptb-el-datas-' + infArr[1]] === 'object' &&
                                        ( 'data-' + targetControlClass ) in elementsSettings['tmpl-wptb-el-datas-' + infArr[1]] ) {
                                    for( let i = 0; i < targetControls.length; i++ ) {
                                        if( targetControls[i].type == 'checkbox' ) {
                                            let targetControlValue;
                                            if( targetControls[i].name ) {
                                                targetControlValue = elementsSettings['tmpl-wptb-el-datas-' + infArr[1]]['data-' + targetControlClass][targetControls[i].name];
                                            } else {
                                                targetControlValue = elementsSettings['tmpl-wptb-el-datas-' + infArr[1]]['data-' + targetControlClass];
                                            }

                                            if( targetControlValue == 'checked' ) {
                                                targetControls[i].checked = true;
                                            } else if( targetControlValue == 'unchecked' ) {
                                                targetControls[i].checked = false;
                                            }
                                        } else {
                                            targetControls[i].value = elementsSettings['tmpl-wptb-el-datas-' + infArr[1]]['data-' + targetControlClass];
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
            } else if( targetControls[i].type ) {
                targetControlValue = targetControls[i].value;
            } else if( targetControls[i].dataset.alignmentValue && targetControls[i].classList.contains( 'selected' ) ){
                targetControlValue = targetControls[i].dataset.alignmentValue;
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
                        elementsSettings = elementsSettings.trim();
                        elementsSettings = JSON.parse( elementsSettings );

                        if( elementsSettings && typeof elementsSettings === 'object' ) {
                            let elementSettingsProt = elementsSettings['tmpl-wptb-el-datas-' + elemProtKind];
                            if( elementSettingsProt && typeof elementSettingsProt === 'object' ) {
                                let elementSettingsCopy = {};

                                Object.keys( elementSettingsProt ).forEach( function( key ) {
                                    let elementSettingValue = elementSettingsProt[key];
                                    let elementSettingKeyCopy = key.replace( elemProtKind, elemCopyKind );
                                    elementSettingsCopy[elementSettingKeyCopy] = elementSettingValue;
                                });

                                if( Object.keys( elementSettingsCopy ).length > 0 ) {
                                    elementsSettings['tmpl-wptb-el-datas-' + elemCopyKind] = elementSettingsCopy;

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
    elementControlsStateDelete: function( element, nameControl ) {
        let infArr = element.className.match( /wptb-element-(.+)-(\d+)/i );
        let body = document.getElementsByTagName( 'body' )[0];
        let wptbElementDatas = body.getElementsByClassName( 'wptb-element-datas' );
        if( infArr && Array.isArray( infArr ) && wptbElementDatas.length > 0 ) {
            wptbElementDatas = wptbElementDatas[0];
            let elementsSettings = wptbElementDatas.innerHTML;
            if( elementsSettings ) {
                elementsSettings = elementsSettings.trim();
                elementsSettings = JSON.parse( elementsSettings );
                if( elementsSettings && typeof elementsSettings === 'object' &&
                        ( ( 'tmpl-wptb-el-datas-' + infArr[1] + '-' + infArr[2] ) in elementsSettings ) ) {
                    if( ! nameControl ) {
                        delete elementsSettings['tmpl-wptb-el-datas-' + infArr[1] + '-' + infArr[2]];
                    } else {
                        if( elementsSettings['tmpl-wptb-el-datas-' + infArr[1] + '-' + infArr[2]] &&
                                typeof elementsSettings['tmpl-wptb-el-datas-' + infArr[1] + '-' + infArr[2]] === 'object' &&
                            ( 'data-wptb-el-' + infArr[1] + '-' + infArr[2] + '-' + nameControl ) in elementsSettings['tmpl-wptb-el-datas-' + infArr[1] + '-' + infArr[2]] ) {
                           delete elementsSettings['tmpl-wptb-el-datas-' + infArr[1] + '-' + infArr[2]]['data-wptb-el-' + infArr[1] + '-' + infArr[2] + '-' + nameControl];
                        }
                    }

                    if( Object.keys( elementsSettings ).length == 0 ) {
                        body.removeChild( wptbElementDatas );
                    } else {
                        elementsSettings = JSON.stringify( elementsSettings );
                        wptbElementDatas.innerHTML = elementsSettings;
                    }
                }
            }
        }
    },
    //
    elementOptionsSet: function( kind, element, valueDependOnControl, targetControlElementClass ) {
        // get controls config for this element
        let wptbContrlStacksConfigId = 'wptb-' + kind + '-control-stack';
        let tmplControlsConfig = wp.template( wptbContrlStacksConfigId );
        let data;
        let elementContainerClass;
        let elementOptionClassIndic;
        let elementOptionsGroup;

        let controlElementParent;
        let elementOptionsScriptsContainer;

        let infArr = element.className.match( /wptb-element-((.+-)\d+)/i );
        if( ! infArr ) {
            let table_id = WPTB_Helper.detectMode();
            if (!table_id) {
                table_id = 'startedid-0';
            }
            if( element.classList.contains( 'wptb-preview-table' ) ) {
                element.classList.add( 'wptb-element-main-table_setting-' + table_id );
            } else if( element.classList.contains( 'wptb-cell' ) ) {
                let cellEditActiveClass = document.querySelector('.wptb-element-table_cell_setting-' + element.dataset.xIndex + '-' + element.dataset.yIndex);
                if( ! cellEditActiveClass ) element.classList.add('wptb-element-table_cell_setting-' + element.dataset.xIndex + '-' + element.dataset.yIndex);
            }else if (element.classList.contains('wptb-responsive')){
                element.classList.add('wptb-element-table_responsive_setting-' + table_id);
            }

            infArr = element.className.match( /wptb-element-((.+-)\d+)/i );
        }

        data = {
            container: '.' + infArr[0]
        };
        let controlName;
        data.valueDependOnControl = {};
        if(valueDependOnControl) {
            Object.keys(valueDependOnControl).forEach(function (key) {
                data.valueDependOnControl[key] = valueDependOnControl[key];
            });
        }
        if(targetControlElementClass) {
            let infArr = targetControlElementClass.match(/wptb-el-((.+-)\d+)-(.+)/i);

            if (infArr && Array.isArray(infArr)) {
                controlName = infArr[3];
            }
        }

        elementContainerClass = infArr[0];
        elementOptionClassIndic = infArr[1];

        if( element.classList.contains( 'wptb-preview-table' ) ) {

        } else if( element.classList.contains( 'wptb-cell' ) ) {
            this.activateSection('cell_settings');
        }else if (element.classList.contains('wptb-responsive')){
            elementOptionsGroupId = 'table-responsive-group';
            wptbelementOptionClass = 'wptb-element-option';
        }
        else {
            let children = document.getElementById( 'element-options-group' ).childNodes;
            for ( let i = 0; i < children.length; i++) {
                if ( children[i].style )
                    children[i].style.display = 'none';
            }
            this.activateSection('options_group');
        }

        let controlsConfigJson = tmplControlsConfig( data );
        let controlsConfig = JSON.parse( controlsConfigJson );

        let elementOptionsGroupIdsInvolved = [],
            elementOptionsGroupInvolved = {},
            elementOptionsContainerInvolved = {};

        // object for save all scrips for each controls
        let controlScriptsObj = {};

        // array for keep "appear depend on" params
        let controlappearDependOnControl = [];

        // array for keep "value depend on" params
        let controlValueDependOnControl = [];

        // create controls
        let elementOptionsScriptsContainerIndic = false;
        if(controlName) {
            let controlsConfigNew = {};
            controlsConfigNew[controlName] = controlsConfig[controlName];
            controlsConfig = controlsConfigNew;
        }
        let i = 0;
        Object.keys( controlsConfig ).forEach( function( key ) {
            let data = controlsConfig[key];
            data.controlKey = key;

            // get necessary wp js template
            let tmplControlTemplate = wp.template( 'wptb-' + data.type + '-control' );

            data.elemContainer = elementContainerClass;
            data.elementControlTargetUnicClass = 'wptb-el-' + elementOptionClassIndic + '-' + data.controlKey;
            Object.keys(data).map(k => {
                if (Object.prototype.hasOwnProperty.call(data, k) && data[k] === 'control_param_calculate_value') {
                    data[k] = WPTB_Helper.controlParamCalculateValue(data.elementControlTargetUnicClass, k);
                }
            });
            let controlTemplate = tmplControlTemplate( data );
            if( 'appearDependOnControl' in data ) {
                if( Array.isArray( data.appearDependOnControl ) ) {
                    controlappearDependOnControl.push( [data.appearDependOnControl, data.elementControlTargetUnicClass] );
                }
            }

            if('valueDependOnControl' in data && !valueDependOnControl && !targetControlElementClass) {
                let valueDependOnControlCorrect = '';
                if(data.valueDependOnControlCorrect) valueDependOnControlCorrect = data.valueDependOnControlCorrect;
                controlValueDependOnControl.push([data.valueDependOnControl, data.elementControlTargetUnicClass, valueDependOnControlCorrect]);
            }

            function elementOptionsContainerInvolvedGet(elementOptionsGroupId, elementOptionsContainerInvolved) {
                if(!elementOptionsContainerInvolved[elementOptionsGroupId]){
                    let elementOptionsContainer = document.createElement( 'div' );
                    elementOptionsContainer.classList.add( 'wptb-element-options', 'wptb-options-' + infArr[1] );
                    document.getElementById( elementOptionsGroupId ).appendChild(elementOptionsContainer);
                    elementOptionsContainerInvolved[elementOptionsGroupId] = elementOptionsContainer;
                }

                return elementOptionsContainerInvolved[elementOptionsGroupId];
            }

            if(elementOptionsGroupIdsInvolved.indexOf(data.elementOptionsGroupId) == -1 && !controlName) {
                elementOptionsGroupIdsInvolved.push(data.elementOptionsGroupId);
                // clear elements from options group
                //document.getElementById( 'element-options-group' ).innerHTML = '';
                elementOptionsGroup = document.getElementById(data.elementOptionsGroupId);
                let elementOptionsGroupChildren = [...elementOptionsGroup.children];
                for( let i = 0; i < elementOptionsGroupChildren.length; i++ ) {
                    elementOptionsGroup.removeChild( elementOptionsGroupChildren[i] );
                }
                elementOptionsGroupInvolved[data.elementOptionsGroupId] = elementOptionsGroup;
            }

            controlElementParent = elementOptionsGroupInvolved[data.elementOptionsGroupId];

            if(data.elementOptionsContainerOn === 'true' && !controlName) {
                controlElementParent = elementOptionsContainerInvolvedGet(data.elementOptionsGroupId, elementOptionsContainerInvolved);
            }


            if(data.elementOptionContainerOn === 'true') {
                let elementOptionContainer = document.createElement( 'div' );
                elementOptionContainer.classList.add( data.elementOptionClass, 'wptb-settings-items' );

                if( data.customClassForContainer ) {
                    elementOptionContainer.classList.add( data.customClassForContainer );
                }

                if( data.containerAdditionalStyles ) {
                    elementOptionContainer.setAttribute( 'style', data.containerAdditionalStyles );
                }

                if(targetControlElementClass) {
                    let targetControlElement = document.getElementsByClassName( targetControlElementClass );
                    if( targetControlElement.length > 0 ) {
                        targetControlElement = targetControlElement[0];
                        let controlContainerElem = WPTB_Helper.findAncestor(targetControlElement, 'wptb-element-option');

                        if (controlContainerElem) {
                            let controlContainerElemParent = controlContainerElem.parentNode;
                            controlContainerElemParent.insertBefore(elementOptionContainer, controlContainerElem);
                            controlContainerElemParent.removeChild(controlContainerElem);
                        }
                    }
                } else {
                    controlElementParent.appendChild( elementOptionContainer );
                }
                controlElementParent = elementOptionContainer;
            }
            controlElementParent.innerHTML = controlElementParent.innerHTML + controlTemplate;

            let helperJavascriptElem = controlElementParent.getElementsByTagName( 'wptb-template-script' );
            if( helperJavascriptElem.length > 0 ) {
                helperJavascriptElem = helperJavascriptElem[0];
                let helperJavascriptCode = helperJavascriptElem.innerText;
                controlElementParent.removeChild( helperJavascriptElem );
                let script = document.createElement( 'script' );
                script.setAttribute( 'type', 'text/javascript' );
                script.setAttribute('id', kind + '-' + data.controlKey);
                script.innerHTML = helperJavascriptCode.replace(/\r|\n|\t/g, '').trim();
                if(!controlScriptsObj[data.elementOptionsGroupId] || !Array.isArray(controlScriptsObj[data.elementOptionsGroupId])) {
                    controlScriptsObj[data.elementOptionsGroupId] = [];
                }
                controlScriptsObj[data.elementOptionsGroupId].push( script );
            }

            i++;
        });

        element.optionsGroupIds = elementOptionsGroupIdsInvolved;

        Object.keys( controlScriptsObj ).forEach( function( elementOptionsGroupId ) {
            if(!targetControlElementClass) {
                elementOptionsScriptsContainer = document.createElement( 'div' );
                elementOptionsScriptsContainer.classList.add( 'wptb-element-options-scripts', 'wptb-options-' + infArr[1] );
                elementOptionsGroupInvolved[elementOptionsGroupId].appendChild(elementOptionsScriptsContainer);
            }

            let controlScriptsArr = controlScriptsObj[elementOptionsGroupId];
            if( controlScriptsArr.length > 0 ) {
                for( let i = 0; i < controlScriptsArr.length; i++ ) {
                    if(targetControlElementClass) {
                        let id = kind + '-' + controlName;
                        let script = document.getElementById(id);
                        elementOptionsScriptsContainer = script.parentNode;
                        elementOptionsScriptsContainer.insertBefore(controlScriptsArr[i], script);
                        elementOptionsScriptsContainer.removeChild(script);
                    } else {
                        elementOptionsScriptsContainer.appendChild(controlScriptsArr[i]);
                    }
                }
            }
        });

        // run the scripts of controls
        
        // run appearDependOnControl function
        for ( let i = 0; i < controlappearDependOnControl.length; i++ ) {
            WPTB_Helper.appearDependOnControl( controlappearDependOnControl[i][0], controlappearDependOnControl[i][1] );
        }

        WPTB_Helper.wptbDocumentEventGenerate( 'element:controls:active', element );
        // run valueDependOnControl function
        for (let i = 0; i < controlValueDependOnControl.length; i++) {
            WPTB_Helper.valueDependOnControl(controlValueDependOnControl[i][0], controlValueDependOnControl[i][1], controlValueDependOnControl[i][2], kind, element);
        }

    },

    /**
     *
     * @param unicClass
     * @param controlKey
     * @param key
     * @returns {*}
     */
    controlParamCalculateValue: function(unicClass, key) {
        let unicClassP = WPTB_Helper.replaceAll(unicClass, '-', '_');
        if (window['paramCalculateValue_' + unicClassP + '_' + key] && typeof (window['paramCalculateValue_' + unicClassP + '_' + key]) === "function") {
            return window['paramCalculateValue_' + unicClassP + '_' + key]();
        }
    },

    controlParamCalculateValueCreateFunction: function(element, controlKey, key, handlerFunction) {
        const infArr = element.className.match( /wptb-element-((.+-)\d+)/i );
        const unicClass = 'wptb-el-' + infArr[1] + '-' + controlKey;
        let unicClassP = WPTB_Helper.replaceAll(unicClass, '-', '_');
        window['paramCalculateValue_' + unicClassP + '_' + key] = function () {
            return handlerFunction(element);
        };
    },

    /**
     * function for create, update css for element
     *
     * @param elementContainer
     * @param selector
     * @param cssName
     * @param cssValue
     */
    managerExternalCssStyles: function( elementContainer, selector, cssName, cssValue ) {
        let infArr = elementContainer.match( /wptb-element-main(.+)-(\d+)/i );
        if( ! infArr || ! Array.isArray( infArr ) ) {
            let table = document.getElementsByClassName( 'wptb-preview-table' );

            if( table.length > 0 ) {
                table = table[0];

                let infArr = table.className.match( /wptb-element-main(.+)-(\d+)/i );
                if( infArr && Array.isArray( infArr ) ) {
                    selector = '.' + infArr[0] + ' ' + selector;
                }
            }
        }

        let head = document.head;
        if( head ) {
            let cssForThisElement = head.querySelector( '#styles-' + elementContainer );
            if( cssForThisElement ) {
                let cssText = cssForThisElement.innerHTML;
                if( cssText ) {
                    let cssTextArrFirst = cssText.split( '}' );
                    cssTextArrFirst.pop();
                    let selectorExists = false;
                    for( let i = 0; i < cssTextArrFirst.length; i++ ) {
                        let cssTextArrSecond = cssTextArrFirst[i].split( '{' );
                        if( cssTextArrSecond[0] === selector ) {
                            let cssTextArrThird = cssTextArrSecond[1].split( ';' );
                            cssTextArrThird.pop();
                            let cssNameExists = false;
                            for( let j = 0; j < cssTextArrThird.length; j++ ) {
                                let cssTextArrFourth = cssTextArrThird[j].split( ':' );
                                if( cssTextArrFourth[0] === cssName ) {
                                    if( cssValue ) {
                                        cssTextArrThird[j] = cssName + ':' + cssValue;
                                    } else {
                                        cssTextArrThird.splice( j, 1 );
                                    }

                                    cssTextArrSecond[1] = cssTextArrThird.join( ';' ) ? cssTextArrThird.join( ';' ) + ';' : '';
                                    cssNameExists = true;
                                    break;
                                }
                            }
                            if( ! cssNameExists ) {
                                if( cssValue ) {
                                    cssTextArrSecond[1] += cssName + ':' + cssValue + ';';
                                }
                            }
                            if( cssTextArrSecond[1] ) {
                                cssTextArrFirst[i] = cssTextArrSecond[0] + '{' + cssTextArrSecond[1]
                            } else {
                                cssTextArrFirst.splice( i, 1 );
                            }
                            if( cssTextArrFirst.join( '}' ) ) {
                                cssForThisElement.innerHTML = cssTextArrFirst.join( '}' ) + '}';
                            } else {
                                head.removeChild( cssForThisElement );
                            }

                            selectorExists = true;
                            break;
                        }
                    }

                    if( ! selectorExists ) {
                        if( cssValue ) {
                            cssForThisElement.innerHTML = cssText + selector + '{' + cssName + ':' + cssValue + ';}';
                        } else {
                            cssForThisElement.innerHTML = cssText;
                        }
                    }
                } else {
                    if( cssValue ) {
                        cssForThisElement.innerHTML = selector + '{' + cssName + ':' + cssValue + ';}';
                    } else {
                        head.removeChild( cssForThisElement );
                    }
                }
            } else {
                if( cssValue ) {
                    let cssForThisElement = document.createElement( 'style' );
                    cssForThisElement.setAttribute( 'id', 'styles-' + elementContainer );
                    cssForThisElement.classList.add( 'styles-wptb-elements' );
                    cssForThisElement.innerHTML = selector + '{' + cssName + ':' + cssValue + ';}';
                    head.appendChild( cssForThisElement );
                }
            }
        }
    },
    /**
     *
     * Register section parts for sidebar
     *
     * @param {array} sections an array of section names
     */
    registerSections(sections) {
        this.sections = {};
        this.currentSection = '';
        if (!Array.isArray(sections)) {
            sections = [sections];
        }

        sections.map(s => {
            const sectionElement = document.querySelector(`[data-wptb-section=${s}]`);
            if (sectionElement) {
                this.sections[s] = sectionElement;
            }
        })
    },
    /**
     * Activate a registered section and deactivates others
     *
     * @param {string} sectionDataId section name to be activated
     * @param {string} displayType display type override for section to be used in its display style property
     */
    activateSection(sectionDataId, displayType = 'block') {
        this.currentSection=sectionDataId;
        this.triggerSectionEvent(sectionDataId);
        Object.keys(this.sections).map(k => {
            if (Object.prototype.hasOwnProperty.call(this.sections, k)) {
                const visibility = sectionDataId === k ? displayType : 'none';
                this.sections[k].style = `display: ${visibility} !important`;
            }
        })
    },
    /**
     * Get id of current active section
     *
     * @returns {string} active section i
     */
    getCurrentSection(){
        return this.currentSection;
    },
    /**
     * Get current section from search parameter 'wptb-builder-section' of window location
     */
    getSectionFromUrl(){
        const parsedUrl = new URL(window.location.href);
        const urlSection = parsedUrl.searchParams.get('wptb-builder-section');
        if(urlSection){
            if(Object.keys(this.sections).some(key => key===urlSection)){
                this.activateSection(urlSection);
            }
        }
    },
    /**
     * Set up related buttons and links to trigger certain elements
     */
    setupSectionButtons() {
        const sectionButtons = Array.from( document.querySelectorAll('[data-wptb-section-button'));
        const vm = this;

        sectionButtons.map(s => {
            const sectionName = s.dataset.wptbSectionButton;
            s.addEventListener('click', function() {
                const displayType = s.dataset.wptbSectionDisplayType;
                vm.activateSection(sectionName, displayType);
            })

            document.addEventListener('wptbSectionChanged', (e)=> {
                if(e.detail === sectionName){
                    s.classList.remove('disabled');
                    s.classList.add('active');
                }else{
                    s.classList.remove('active');
                    s.classList.add('disabled');
                }
            })
        })
    },
    setupPanelToggleButtons(){
        const $ = jQuery;

        $('.wptb-panel-toggle-group').each(function(){
            const vm = $(this);
            $(this).find('.toggle-icon').click(() => {
                vm.find('.wptb-panel-toggle-target').slideToggle();
                vm.toggleClass('wptb-panel-toggle-content');
            })
        })
    },
    /**
     * Trigger a section change event
     *
     * @param {string} sectionName section name
     */
    triggerSectionEvent(sectionName){
        const sectionEvent = new CustomEvent('wptbSectionChanged', {detail: sectionName});

        document.dispatchEvent(sectionEvent);
    },
    /**
     * Setup sidebar toggle element
     *
     * @param {string} toggleSelector query selector for drawer toggle element
     */
    setupSidebarToggle(toggleSelector){
        const toggleButton = document.querySelector(toggleSelector);
        if(toggleButton){
            toggleButton.addEventListener('click', (e)=>{
                e.preventDefault();
                document.body.classList.toggle('collapsed');
            })
        }
    },
    // function for deleting all external CSS for the element
    externalCssStylesDelete: function( elementContainerClass ) {
        let head = document.head;
        if( head ) {
            let cssForThisElement = head.querySelector( '#styles-' + elementContainerClass );

            if( cssForThisElement ) {
                head.removeChild( cssForThisElement );
            }
        }
    },
    // function for copy all external CSS for the element
    externalCssStylesCopy: function( activeElement, copyElement ) {
        if( activeElement ) {
            let infArr = activeElement.className.match( /wptb-element-(.+)-(\d+)/i );
            if( infArr && Array.isArray( infArr ) ) {
                let activeElemClass = infArr[0];

                    let head = document.head;
                    if( head ) {
                        let cssForActiveElement = head.querySelector( '#styles-' + activeElemClass );

                        if( cssForActiveElement ) {
                            let cssForNewElement = cssForActiveElement.cloneNode( true );

                            cssForNewElement.removeAttribute( 'id', 'styles-' + activeElemClass );

                            let infArrCopyEl = copyElement.className.match( /wptb-element-(.+)-(\d+)/i );
                            if( infArrCopyEl && Array.isArray( infArrCopyEl ) ) {
                                cssForNewElement.setAttribute( 'id', 'styles-' + infArrCopyEl[0] );
                                let cssForActiveElementInnerHTML = cssForActiveElement.innerHTML;
                                let cssForNewElementInnerHTML = WPTB_Helper.replaceAll( cssForActiveElementInnerHTML, activeElemClass, infArrCopyEl[0] );
                                cssForNewElement.innerHTML = cssForNewElementInnerHTML;
                                head.appendChild( cssForNewElement );
                            }
                        }
                    }
            }
        }
    },
    // function for convertation elements stiles in json
    elementsStylesConvertToObject: function() {
        let head = document.head;
        let stylesElements = head.querySelectorAll( '.styles-wptb-elements' );
        let stylesObj = {};
        for( let i = 0; i < stylesElements.length; i++ ) {
            let styleElemId = stylesElements[i].getAttribute( 'id' );
            if( styleElemId && stylesElements[i].innerHTML ) {
                stylesObj[styleElemId] = stylesElements[i].innerHTML;
            }
        }

        if( Object.keys( stylesObj ).length != 0 ) {
            return JSON.stringify( stylesObj );
        }
        return '';
    },
    // function for set scc styles tags to head
    elementsStylesSetFromObject: function( jsonObject ) {
        let head = document.head;
        if( head ) {
            let stylesElements = head.querySelectorAll( '.styles-wptb-elements' );
            if( stylesElements.length > 0 ) {
                stylesElements = [...stylesElements];
                for( let i = 0; i < stylesElements.length; i++ ) {
                    head.removeChild( stylesElements[i] );
                }
            }
            if( jsonObject ) {
                let stylesObj = JSON.parse( jsonObject );
                if( Object.keys( stylesObj ).length != 0 ) {
                    Object.keys( stylesObj ).forEach( function( key ) {
                        let cssText = stylesObj[key];
                        let styleCss = document.createElement( 'style' );
                        styleCss.setAttribute( 'id', key );
                        styleCss.classList.add( 'styles-wptb-elements' );
                        styleCss.innerHTML = cssText;
                        head.appendChild( styleCss );
                    });
                }
            }
        }
    },
    // function for table saving
    saveTable: function( event, startSaving, previewSaving ) {
        if( ! previewSaving && ! startSaving ) {
            if( ( ! event.target.dataset.wptbTableStateNumberSave && window.wptbTableStateNumberShow == 0 ) ||
                    window.wptbTableStateNumberShow == event.target.dataset.wptbTableStateNumberSave ) {
                //return;
            }
        }

        if( ! previewSaving ) {
            let bar = document.querySelector( '.wptb-edit-bar' );
            if ( bar && bar.classList.contains( 'visible' ) ) {
                let table = document.getElementsByClassName( 'wptb-preview-table' )[0];
                WPTB_Helper.toggleTableEditMode();
            }
        }

        let http = new XMLHttpRequest(),
            url = ( wptb_admin_object ? wptb_admin_object.ajaxurl : ajaxurl ) + "?action=save_table",
            t = document.getElementById( 'wptb-setup-name' ).value.trim(),
            messagingArea,
            code,
            datas;

        code = document.getElementsByClassName( 'wptb-preview-table' );

        let postId;
        if (( rs = WPTB_Helper.detectMode() ) || ( rs = document.wptbId )) {
            postId = rs;
        }
        let paramIdsNecessaryChange = false;
        if( code.length > 0 ) {
            code = code[0];
            let codeClone = code.cloneNode( true );
            if( postId ) {
                if( codeClone.classList.contains( 'wptb-element-main-table_setting-startedid-0' ) ) {
                    codeClone.classList.remove( 'wptb-element-main-table_setting-startedid-0' );
                    codeClone.classList.add( 'wptb-element-main-table_setting-' + postId );
                    let wptbTableSetup = document.querySelector('.wptb-table-setup');
                    if(wptbTableSetup) {
                        wptbTableSetup.innerHTML = '';
                        wptbTableSetup.appendChild(codeClone);
                        WPTB_Table();
                    }
                    paramIdsNecessaryChange = true;
                }
            }
            codeClone.columns = code.columns;
            code = WPTB_Stringifier( codeClone );
            code = code.outerHTML;
        } else {
            code = '';
        }

        if( ! previewSaving ) {
            datas = '';
            let datas_containers = document.getElementsByClassName( 'wptb-element-datas' );

            if( datas_containers.length > 0 ) {
                if( datas_containers[0].innerHTML ) {
                    datas = datas_containers[0].innerHTML;

                    if( paramIdsNecessaryChange ) {
                        datas = WPTB_Helper.replaceAll( datas, 'tmpl-wptb-el-datas-main-table_setting-startedid-0',
                        'tmpl-wptb-el-datas-main-table_setting-' + postId );

                        datas = WPTB_Helper.replaceAll( datas, 'data-wptb-el-main-table_setting-startedid-0',
                        'data-wptb-el-main-table_setting-' + postId );
                    }
                }
            }
        }

        let styleObjJson = WPTB_Helper.elementsStylesConvertToObject();
        if( paramIdsNecessaryChange ) {
            styleObjJson = WPTB_Helper.replaceAll( styleObjJson, '.wptb-element-main-table_setting-startedid-0',
                    '.wptb-element-main-table_setting-' + postId );
        }

        if ( t === '' && code === '' ) {
            let messagingAreaText = '';
            if( t === '' ) messagingAreaText += 'You must assign a name to the table before saving it.</br>';
            if( code === '' ) messagingAreaText += 'Table wasn\'t created';
            messagingArea = document.getElementById( 'wptb-messaging-area' );
            messagingArea.innerHTML = '<div class="wptb-error wptb-message">Error: ' + messagingAreaText + '</div>';
            messagingArea.classList.add( 'wptb-warning' );
            setTimeout(function () {
                messagingArea.removeChild( messagingArea.firstChild );
            }, 4000 );
            return;
        }

        let params = {
            title: t,
            content: code,
            elements_datas: datas,
            elements_styles: styleObjJson,
            security_code: wptb_admin_object.security_code
        };


        if( previewSaving ) {
            params.preview_saving = previewSaving;
        }

        if ( postId ) {
            params.id = postId;
        }
        params = JSON.stringify( params );

        http.open('POST', url, true);
        http.setRequestHeader( 'Content-type', 'application/json; charset=utf-8' );

        http.onreadystatechange = function ( action ) {
            if ( this.readyState == 4 && this.status == 200 ) {
                var data = JSON.parse( http.responseText );
                messagingArea = document.getElementById( 'wptb-messaging-area' );

                if ( data[0] == 'saved' ) {
                    let builderPageUrl = document.location.href.replace( '#', '' );
                    let regex = new RegExp( '&table=(.+)', "i" );
                    builderPageUrl = builderPageUrl.replace( regex, '' );
                    window.history.pushState( null, null, builderPageUrl + '&table=' + data[1] );

                    WPTB_Helper.saveTable( event, true );
                    return;
                } else if( data[0] == 'edited' && startSaving ) {
                    document.wptbId = data[1];
                    messagingArea.innerHTML = '<div class="wptb-success wptb-message">Table "' + t + '" was successfully saved.</div>';
                    document.getElementsByClassName( 'wptb-embed-btn' )[0].classList.remove( 'wptb-button-disable' );
                    document.getElementById( 'wptb-embed-shortcode' ).value = '[wptb id=' + data[1] + ']';
                    let wptbPreviewTable = document.querySelector( '.wptb-preview-table' );
                    let wptbPreviewBtn = document.getElementsByClassName( 'wptb-preview-btn' );
                    if( wptbPreviewBtn.length > 0 ) {
                        wptbPreviewBtn = wptbPreviewBtn[0];
                        wptbPreviewBtn.classList.remove( 'wptb-button-disable' );
                        let wptbPreviewBtnHref = wptbPreviewBtn.dataset.previewHref;
                        wptbPreviewBtnHref = wptbPreviewBtnHref.replace( 'empty', data[1] );
                        wptbPreviewBtn.setAttribute( 'href', wptbPreviewBtnHref );
                    }

                    event.target.dataset.wptbTableStateNumberSave = window.wptbTableStateNumberShow;
                    let wptbSaveBtn = document.getElementsByClassName( 'wptb-save-btn' );
                    if( wptbSaveBtn.length > 0 ) {
                        wptbSaveBtn = wptbSaveBtn[0];
                        wptbSaveBtn.classList.add( 'wptb-save-disabled' );
                        wptbSaveBtn.classList.remove('active');
                    }
                } else if( data[0] == 'edited' ) {
                    messagingArea.innerHTML = '<div class="wptb-success wptb-message">Table "' + t + '" was successfully updated.</div>';
                    event.target.dataset.wptbTableStateNumberSave = window.wptbTableStateNumberShow;

                    let wptbSaveBtn = document.getElementsByClassName( 'wptb-save-btn' );
                    if( wptbSaveBtn.length > 0 ) {
                        wptbSaveBtn = wptbSaveBtn[0];
                        wptbSaveBtn.classList.add( 'wptb-save-disabled' );
                        wptbSaveBtn.classList.remove('active');
                    }
                } else if( data[0] == 'preview_edited' ) {
                    return;
                } else {
                    messagingArea.innerHTML = '<div class="wptb-error wptb-message">Safety problems</div>';
                }
                messagingArea.classList.add( 'wptb-success' );
                setTimeout( function () {
                    messagingArea.removeChild( messagingArea.firstChild );
                }, 4000 );
            }
        }
        http.send( params );
    },
    //
    clickOnFreeSpace: function() {
        // if current active section is responsive menu, ignore this functionality
        if(this.getCurrentSection() === 'table_responsive_menu'){
            return;
        }

        let cellModeBackground = document.querySelector( '#wptb-cell_mode_background' );
        if( cellModeBackground && cellModeBackground.classList.contains( 'visible' ) ) {
            return;
        }
        // document.getElementsByClassName( 'wptb-elements-container' )[0].style.display = 'table';
        // document.getElementsByClassName( 'wptb-settings-section' )[0].style.display = 'block';
        // document.getElementById( 'element-options-group' ).style.display = 'none';
        this.activateSection('elements');

        let wpcdFixedToolbar = document.getElementById( 'wpcd_fixed_toolbar' );
        if( wpcdFixedToolbar.hasAttribute( 'data-toolbar-active-id' ) ) {
            document.getElementById( wpcdFixedToolbar.getAttribute( 'data-toolbar-active-id' ) ).classList.remove( 'toolbar-active' );
        }
        let element = document.querySelector( '.wptb-preview-table' );
        if( element ) {
            WPTB_Helper.elementOptionsSet( 'table_setting', element );
        }
    },

    /*
     * function for sending of element ajax request
     */
    elementAjax: function( dataAjaxData, element ) {
        let http = new XMLHttpRequest(),
            url = ( wptb_admin_object ? wptb_admin_object.ajaxurl : ajaxurl ) + "?action=wptb_element_ajax";
        let element_name;
        let infArr = element.className.match( /wptb-element-(.+)-(\d+)/i );
        if( infArr && Array.isArray( infArr ) ) {
            element_name = infArr[1];
        }

        let params = {
            element_ajax_data: dataAjaxData,
            element_name: element_name,
            security_code: wptb_admin_object.security_code
        };
        params = JSON.stringify( params );

        http.open( 'POST', url, true );
        http.setRequestHeader( 'Content-type', 'application/json; charset=utf-8' );

        http.onreadystatechange = function ( action ) {
            if ( this.readyState == 4 && this.status == 200 ) {
                var data = JSON.parse( http.responseText );
                let detail;
                if ( data && Array.isArray( data ) && data[0] == 'element_ajax_responce' ) {
                    detail = {value: data[1]};
                } else {
                    detail = '';
                }
                WPTB_Helper.wptbDocumentEventGenerate( 'wptb-element:ajax-response', element, detail );
            }
        }
        http.send( params );
    },

    /*
     * This just toggles visibility of cell edit bar, and toggles
     * cell selecting mode.
     */
    toggleTableEditMode: function ( close = false ) {
        let bar = document.getElementsByClassName('wptb-edit-bar'),
            cellModeBackground = document.getElementById('wptb-cell_mode_background'),
            leftScrollPanelCurtain = document.getElementById('wptb-left-scroll-panel-curtain'),
            leftScrollPanelCellSettings = document.getElementById( 'wptb-left-scroll-panel-cell-settings' ),
            wptbPreviewTable = document.getElementsByClassName('wptb-preview-table');
        if (wptbPreviewTable.length > 0) {
            wptbPreviewTable = wptbPreviewTable[0];
        }

        if ( bar.length > 0 ) {
            let toggleEditMode = '';
            for ( let i = 0; i < bar.length; i++ ) {
                if ( bar[i].classList.contains( 'visible' ) ) {
                    document.select.deactivateMultipleSelectMode();
                    bar[i].classList.remove( 'visible' );
                    cellModeBackground.classList.remove( 'visible' );
                    leftScrollPanelCurtain.classList.remove( 'visible' );
                    leftScrollPanelCellSettings.classList.remove( 'visible' );
                    wptbPreviewTable.parentNode.classList.remove( 'wptb-preview-table-manage-cells' );
                    let wptbPreviewTableTds = wptbPreviewTable.getElementsByTagName( 'td' );
                    if ( wptbPreviewTableTds.length > 0 ) {
                        for ( let i = 0; i < wptbPreviewTableTds.length; i++ ) {
                            wptbPreviewTableTds[i].classList.remove( 'wptb-highlighted' );
                        }
                    }
                    toggleEditMode = 'closed';

                } else if( ! close ) {
                    document.select.activateMultipleSelectMode();
                    bar[i].classList.add( 'visible' );
                    cellModeBackground.classList.add( 'visible' );
                    leftScrollPanelCurtain.classList.add( 'visible' );
                    wptbPreviewTable.parentNode.classList.add( 'wptb-preview-table-manage-cells' );

                    toggleEditMode = 'opened';
                }
            }

            WPTB_Helper.wptbDocumentEventGenerate('wp-table-builder/table-edit-mode/' + toggleEditMode, wptbPreviewTable)
        }
    },

    /*
     * checking of dimension of value
     */
    checkingDimensionValue: function ( value, dimension ) {
        value = String( value );
        dimension = String( dimension );
        if( value && dimension ) {
            let searchIndex = value.indexOf( dimension );
            if ( searchIndex != -1 && searchIndex == ( value.length - dimension.length ) ) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    /*
     * if dimension is included - checking and if it necessary setting value
     * without dimension - return value
     */
    checkSetGetStyleSizeValue: function( element, styleName, computedStyleName, dimension ) {
        let elemStyleValue = element.style[styleName];
        elemStyleValue = String( elemStyleValue );

        if( ! elemStyleValue || dimension ? ! ( WPTB_Helper.checkingDimensionValue( elemStyleValue, dimension ) ) : false ){
            let elementStyles = window.getComputedStyle( element );
            if( computedStyleName && elementStyles.getPropertyValue( computedStyleName ) && dimension ? WPTB_Helper.checkingDimensionValue( elementStyles.getPropertyValue( computedStyleName ), dimension ) : true ) {
                if( ! dimension ) {
                    return elementStyles.getPropertyValue( computedStyleName );
                } else {
                    element.style[styleName] = elementStyles.getPropertyValue( computedStyleName );
                }
            } else {
                if( ! dimension ) {
                    return false;
                } else {
                    element.style[styleName] = null;
                }
            }
        } else if( ! dimension ) {
            return elemStyleValue;
        }

        return element.style[styleName];
    },

    /*
     * function checking that element has the style
     * if this style is present - checking the format color
     * if param set is true - setting style for element (consider hex format of color)
     * if param set is false - getting style from element
     */
    checkSetGetStyleColorValue: function ( element, styleName, computedStyleName, set = false ) {
        let elemStyleColorValue = element.style[styleName];

        if( ! elemStyleColorValue ) {
            let elementStyles = window.getComputedStyle( element, null );

            if( elementStyles && elementStyles.getPropertyValue( computedStyleName ) ) {

                if( set ) {
                    elemStyleColorValue = WPTB_Helper.rgbToHex( elementStyles.getPropertyValue( computedStyleName ) );
                    if( WPTB_Helper.isHex( elemStyleColorValue ) ) {
                        element.style[styleName] = elemStyleColorValue;
                    } else {
                        element.style[styleName] = '';
                    }
                } else {
                    return elementStyles.getPropertyValue( computedStyleName );
                }

            } else {
                if( set ) {
                    element.style[styleName] = '';
                } else {
                    return '';
                }
            }
        } else if( ! set ) {
            return elemStyleColorValue;
        }
    },

    /*
     * function checking that element has the style
     * if this style is present - checking the format color
     * if param set is true - setting style for element (consider hex format of color)
     * if param set is false - getting style from element
     */
    checkSetGetStyleValue: function ( element, styleName, computedStyleName, set = false ) {
        let elemStyleColorValue = element.style[styleName];

        if( ! elemStyleColorValue ) {
            let elementStyles = window.getComputedStyle( element, null );

            if( elementStyles && elementStyles.getPropertyValue( computedStyleName ) ) {

                if( set ) {
                    element.style[styleName] = elementStyles.getPropertyValue( computedStyleName );
                } else {
                    return elementStyles.getPropertyValue( computedStyleName );
                }

            } else if( ! set ) {
                return '';
            }
        } else if( ! set ) {
            return elemStyleColorValue;
        }
    },

    /*
     * get the value of the same elements that have the most count
     */
    getValueMaxCountSameElementsInArray: function ( arr ) {
        if( arr && Array.isArray( arr ) ) {
            let check = {};
            let countEmpty = 0;
            for( let i = 0; i < arr.length; i++ ) {
                if(arr[i]) {
                    if( check[arr[i]] ) {
                        check[arr[i]]++;
                    } else {
                        check[arr[i]] = 1;
                    }
                } else {
                    countEmpty++;
                }
            }

            let maxPropName;
            for ( let key in check ) {
                if( ! maxPropName ) {
                    maxPropName = key;
                    continue;
                } else {
                    if( check[maxPropName] < check[key] ) {
                        maxPropName = key;
                    }
                }
            }

            return check[maxPropName] >= countEmpty ? maxPropName : '';
        }
    },

    /*
     * For assigning to each cell xIndex and y Index attributes,
     * these are the column number and row number of cell in table.
     */
    recalculateIndexes: function ( table ) {
        let trs = table.getElementsByTagName( 'tr' ),
            tds, maxCols = 0, maxColsFull = 0, tdsArr = [];

        for ( let i = 0; i < trs.length; i++ ) {
            tds = trs[i].getElementsByTagName( 'td' );

            if ( tdsArr[i] == undefined ) {
                tdsArr[i] = [];
            }

            let jMainIter = 0;
            for ( let j = 0; j < tds.length; j++ ) {
                if ( tdsArr[i][j] != undefined ) {
                    for ( let y = 0; y < 100; y++ ) {
                        if ( tdsArr[i][jMainIter] != undefined ) {
                            jMainIter++;
                            continue;
                        }
                        tdsArr[i][jMainIter] = tds[j];
                        tds[j].dataset.xIndex = jMainIter;
                        break;
                    }
                } else {
                    tdsArr[i][j] = tds[j];
                    tds[j].dataset.xIndex = jMainIter;
                }
                tds[j].dataset.yIndex = i;

                if ( tds[j].colSpan > 1 ) {
                    for ( let k = 1; k < tds[j].colSpan; k++ ) {
                        jMainIter++;
                        tdsArr[i][jMainIter] = 'tdDummy';
                    }
                }

                if ( tds[j].rowSpan > 1 ) {
                    for ( let x = 1; x < tds[j].rowSpan; x++ ) {
                        if ( tdsArr[i + x] == undefined ) {
                            tdsArr[i + x] = [];
                        }
                        for ( let z = 0; z < tds[j].colSpan; z++ ) {
                            tdsArr[i + x][jMainIter - tds[j].colSpan + 1 + z ] = 'tdDummy';
                        }
                    }
                }
                jMainIter++;
            }

            if ( tds.length > maxCols ) {
                maxCols = tds.length;
            }

            if( i == 0 ) {
                maxColsFull = jMainIter;
            }
        }
        table.columns = maxCols;
        table.maxCols = maxColsFull;
    },

    /**
     * Table Rows colors reinstall
     */
    tableRowsColorsReinstall: function ( table ) {
        let infArr = table.className.match( /wptb-element-main(.+)-(\d+)/i );
        if( infArr && Array.isArray( infArr ) ) {
            let tableIndex = '';
            if( infArr[infArr.length -1] == '0' ) {
                tableIndex = 'startedid-0';
            } else {
                tableIndex = infArr[infArr.length -1];
            }

            let tableHeaderBackground = document.querySelector('.wptb-el-main-table_setting-' + tableIndex + '-tableHeaderBackground' );
            if(  tableHeaderBackground ) {
                let details = {value: tableHeaderBackground.value};
                WPTB_Helper.wptbDocumentEventGenerate( 'controlColor:change', tableHeaderBackground, details );
            }

            let tableEvenRowBackground = document.querySelector('.wptb-el-main-table_setting-' + tableIndex + '-tableEvenRowBackground' );
            if(  tableEvenRowBackground ) {
                let details = {value: tableEvenRowBackground.value};
                WPTB_Helper.wptbDocumentEventGenerate( 'controlColor:change', tableEvenRowBackground, details );
            }

            let tableOddRowBackground = document.querySelector('.wptb-el-main-table_setting-' + tableIndex + '-tableOddRowBackground' );
            if(  tableOddRowBackground ) {
                let details = {value: tableOddRowBackground.value};
                WPTB_Helper.wptbDocumentEventGenerate( 'controlColor:change', tableOddRowBackground, details );
            }
        }
    },
    /**
     * Get parent html element of given type
     *
     * @param {string} parentType type of parent element
     * @param {HTMLElement} el current element
     * @returns {*} html element of type
     */
    getParentOfType: (parentType, el) => {
       if(el.nodeName === parentType.toUpperCase()) {
           return el;
       }

       return WPTB_Helper.getParentOfType(parentType , el.parentElement);
    },
    // current relative type of drag element
    // this type is used on differentiating certain elements based on their positioning on table
    dragRelativeType : '',
    /**
     *
     * @param {string} val drag relative type
     */
    setDragRelativeType: function (val){
        this.dragRelativeType = val;
    },
    // get drag relative type
    getDragRelativeType : function(){
        return this.dragRelativeType;
    },
    /**
     *
     * @param {HTMLElement} element
     * @param {string} styleName
     */
    getElementColorStylesHex: function (element, styleName) {
        let color = element.style[styleName];
        color = WPTB_Helper.rgbToHex( color );
        if( ! WPTB_Helper.isHex( color ) ) {
            color = '';
        }
        return color;
    },
    /**
     * Show element controls on adding them to table.
     */
    showControlsOnElementMount(){
        document.addEventListener('element:mounted:dom', function(e){
            e.target.click();
        });
    },
    /**
     * Show elements list menu on left panel on removing element from table
     */
    showElementsListOnRemove(){
        document.addEventListener('element:removed:dom', function(){
            WPTB_Helper.activateSection('elements');
        })
    }
}
