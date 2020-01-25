tinyMCE.init({
    target: element.childNodes[0],
    inline: true,
    plugins: "code",
    dialog_type: "modal",
    theme: 'modern',
    menubar: false,
    toolbar: false,
    extended_valid_elements: "svg[*],defs[*],pattern[*],desc[*],metadata[*],g[*],\n\
                            mask[*],path[*],line[*],marker[*],rect[*],circle[*],\n\
                            ellipse[*],polygon[*],polyline[*],linearGradient[*],\n\
                            radialGradient[*],stop[*],image[*],view[*],text[*],\n\
                            textPath[*],title[*],tspan[*],glyph[*],symbol[*],switch[*],use[*]",
    setup: function ( ed ) {
        function creatingElementStartTiny( i ) {
            if( i > 5)  return;
            if( ! ed.targetElm || ! ed.windowManager ) {
                setTimeout( function() {
                    creatingElementStartTiny( i + 1 );
                }, 100 );
            } else {
                if( ed.targetElm && ed.targetElm.hasAttribute( 'data-wptb-new-element' ) ) {
                    if( ed.windowManager.windows && 
                        Array.isArray( ed.windowManager.windows ) && 
                        ed.windowManager.windows.length == 0 ) {
                        ed.execCommand( 'mceCodeEditor' );
                        ed.targetElm.removeAttribute( 'data-wptb-new-element' );
                    }
                }
            }
        }
        
        creatingElementStartTiny( 1 );
        
        ed.on( 'click', function( e ) {
            if( ed.windowManager.windows && 
                    Array.isArray( ed.windowManager.windows ) && 
                    ed.windowManager.windows.length == 0 ) {
                ed.execCommand( 'mceCodeEditor' );
            }
        });
        
        ed.on( 'blur', function(  ) {
            ed.windowManager.close();
        });
        
        ed.on( 'change', function( e ) {
            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        });
    }
});
