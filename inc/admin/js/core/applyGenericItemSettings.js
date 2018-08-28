var applyGenericItemSettings = function(element){
	var node = element.getDOMElement(),
		index = document.counter.nextIndex(element.kind),
		listItems;

	node.onmouseenter = function(event){
        this.classList.add('wptb-directlyhovered');
        var btnDelete = document.createElement('span'),
            btnCopy = document.createElement('span'),
            btnMove = document.createElement('span'),
            actions = document.createElement('span'),
            previous, i;
        actions.classList.add('wptb-actions');
        btnDelete.classList.add('dashicons', 'dashicons-trash', 'delete-action');
        btnCopy.classList.add('dashicons', 'dashicons-admin-page', 'duplicate-action');
        btnMove.classList.add("dashicons","dashicons-move", 'move-action');
        btnMove.draggable = true;
        btnDelete.onclick = function (event) {
	        var act = this.parentNode.parentNode,
	            el = act.parentNode;
	        el.removeChild(act); 
	    };
        //btnCopy.onclick = window.copyButton;
        btnMove.ondragstart = function(event){
        	var parent = this,infArr,type;

        	while(parent.className == '' || 
        		! parent.classList.contains('wptb-ph-element') ){
        		parent = parent.parentNode;
        	}


        	infArr = parent.className.match(/wptb-element-(.+)-(\d+)/i);
			type = infArr[1];

        	var img = document.createElement("img");
        	img.src = "http://localhost/sandbox/wp-content/plugins/wp-table-builder/inc/admin/views/builder/icons/"+type+".png";
        	console.log(img.src);
		    event.dataTransfer.setDragImage(img, 0, 0);
		    event.dataTransfer.setData('node','wptb-element-'+infArr[1]+'-'+infArr[2]);
        	};


        if(element.kind === 'button'){
        	tinyMCE.init({
	            target: node.childNodes[0].childNodes[0],
	            inline: true,
	            plugins: "link",
	            dialog_type: "modal",
	            theme: 'modern',
	            menubar: false,
	            fixed_toolbar_container: '#wpcd_fixed_toolbar',
	            toolbar: 'bold italic strikethrough',
	            setup: function (ed) {
	                ed.on("init",
	                    function (ed) {
	                        tinyMCE.execCommand('mceRepaint');
	                    }
	                );
	            },
	            init_instance_callback: function (editor) {
	                editor.on('change', function (e) {
	                    // check if it becomes empty because if there's no value it's hard to edit the editor in button element
	                    if (editor.getContent() == "") {
	                        editor.setContent("<p class='wptb-button'>Button Text</p>");
	                    }
	                });
	                editor.on('KeyDown', function (e) {
	                    var range = editor.selection.getRng();
	                    var KeyID = e.keyCode;
	                    if (range.startOffset == 0 && (KeyID == 8 || KeyID == 46)) {
	                        e.preventDefault();
	                        editor.setContent("<p class='wptb-button'></p>");
	                    }
	                });

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
        }
        else if(element.kind === 'text'){
        	tinyMCE.init({
	            target: node.childNodes[0],
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

        }
        else{
        	listItems = node.getElementsByClassName('wptb-list-item-content');
        	for (var i = 0; i < listItems.length; i++) {
        		tinyMCE.init({
		            target: listItems[i],
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
        	}
        }

        actions.appendChild(btnMove);
        actions.appendChild(btnCopy);
        actions.appendChild(btnDelete);
        this.appendChild(actions);
	};

	node.onmouseleave = function(event){
		var formerActions = this.getElementsByClassName('wptb-actions');
        if (formerActions && formerActions[0]) {
            let par = formerActions[0].parentNode;
            par.removeChild(formerActions[0]);
        }
        this.classList.remove('wptb-directlyhovered');
	};

	node.classList.add('wptb-ph-element', 'wptb-element-'+element.kind+'-' +
           index);

	new WPTB_ElementOptions(element,index);

	document.counter.increment(element.kind);
     
};