var WPTB_ElementOptions = function ( element, index, kindIndexProt ) {

    var node = element.getDOMElement(), elemIdClass;

    node.onclick = function () {
        var children = document.getElementById("element-options-group").childNodes;
        for ( let i = 0; i < children.length; i++) {
            if (children[i].style)
                children[i].style.display = 'none';
        }
        
        var infArr = this.className.match( /wptb-element-((.+-)\d+)/i );
        // get controls config for this item
        let wptbContrlStacksConfigId = 'wptb-' + element.kind + '-control-stack';
        let tmplControlsConfig = wp.template( wptbContrlStacksConfigId );
        let data = {
            container: '.' + infArr[0]
        };
        let jsonControlsConfigJson = tmplControlsConfig( data );
        let jsonControlsConfig = JSON.parse( jsonControlsConfigJson );

        // create a container for inserting controls of this item
        let wptbElementOptionsContainer = document.createElement( 'div' );
        wptbElementOptionsContainer.classList.add( 'wptb-element-options', 'wptb-options-' + infArr[1] );

        // clear elements from options group
        //document.getElementById( 'element-options-group' ).innerHTML = '';
        let elementOptionsGroup = document.getElementById( 'element-options-group' );
        let elementOptionsGroupChildren = elementOptionsGroup.children;
        for( let i = 0; i < elementOptionsGroupChildren.length; i++ ) {
            let regularText = new RegExp( 'wptb-options-' + element.kind + '-(\\d+)', "i" );
            let elem = elementOptionsGroupChildren[i].className.match( regularText );
            if( elem ) {
                elementOptionsGroup.removeChild( elementOptionsGroupChildren[i] );
            }
        }

        // hide wptb-elements-container and wptb-settings-section
        document.getElementsByClassName('wptb-elements-container')[0].style.display = 'none';
        document.getElementsByClassName('wptb-settings-section')[0].style.display = 'none';

        // show element-options-group 
        document.getElementById("element-options-group").style.display = 'block';

        // insert created container into element-option-group tag
        document.getElementById( 'element-options-group' ).appendChild( wptbElementOptionsContainer );

        // show created container
        wptbElementOptionsContainer.style.display = 'block';

        // array for save all scrips for each controls
        let controlScriptsArr = [];

        // array for keep "appear depend on" parametrs
        let controlAppearDependOn = [];

        // create controls
        let i = 0;
        Object.keys( jsonControlsConfig ).forEach( function( key ) {
            let data = jsonControlsConfig[key];
            data.controlKey = key;

            // get necessary wp js template
            let tmplControlTemplate = wp.template( 'wptb-' + data.type + '-control' );

            data.elemContainer = infArr[0];
            data.elementControlTargetUnicClass = 'wptb-el-' + infArr[1] + '-' + data.controlKey;
            let controlTemplate = tmplControlTemplate( data );

            if( 'appearDependOn' in data ) {
                if( Array.isArray( data.appearDependOn ) ) {
                    controlAppearDependOn.push( [data.appearDependOn, data.elementControlTargetUnicClass] );
                }
            }

            //console.log( controlTemplate );

            let wptbElementOptionContainer = document.createElement( 'div' );
            wptbElementOptionContainer.classList.add( 'wptb-element-option', 'wptb-settings-items' );

            if( data.customClassForContainer ) {
                wptbElementOptionContainer.classList.add( data.customClassForContainer );
            }

            if( data.containerAdditionalStyles ) {
                wptbElementOptionContainer.setAttribute( 'style', data.containerAdditionalStyles );
            }

            wptbElementOptionContainer.innerHTML = controlTemplate;

            wptbElementOptionsContainer.appendChild( wptbElementOptionContainer );

            let helperJavascriptElem = wptbElementOptionContainer.getElementsByTagName( 'wptb-template-script' );
            if( helperJavascriptElem.length > 0 ) {
                helperJavascriptElem = helperJavascriptElem[0];
                let helperJavascriptCode = helperJavascriptElem.innerText;
                wptbElementOptionContainer.removeChild( helperJavascriptElem );
                let script = document.createElement( 'script' );
                script.setAttribute( 'type', 'text/javascript' );
                script.innerHTML = helperJavascriptCode.replace(/\r|\n|\t/g, '').trim();
                controlScriptsArr.push( script );
            }

            i++;
        });

        // run the scripts of controls
        if( controlScriptsArr.length > 0 ) {
            for( let i = 0; i < controlScriptsArr.length; i++ ) {
                wptbElementOptionsContainer.appendChild( controlScriptsArr[i] );
            }
        }

        // run appearDependOn function
        for ( let i = 0; i < controlAppearDependOn.length; i++ ) {
            WPTB_Helper.appearDependOn( controlAppearDependOn[i][0], controlAppearDependOn[i][1] );
        }

        WPTB_Helper.wptbDocumentEventGenerate( 'controlPanel:added:leftPanel' );
    };
};