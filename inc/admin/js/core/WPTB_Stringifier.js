var WPTB_Stringifier = function(node){

	if(node == undefined || node.tagName == undefined){
		return '';
	}

	var code='', children = node.childNodes,
	padding, margin, bg1, bg2, bg3, border;

	switch(node.tagName.toLowerCase()){
		case 'table':  
						margin = node.style.margin;
						padding = node.style.padding;
						padding = node.style.padding;
						if(node.rows.length > 1){

						}
						if(node.rows.length > 2){

						}
						code += '[table border="'
								+margin
								+'" padding="'
								+padding
								+'" enable-border="'
								+border
								+'" data-bg1="'
								+bg1
								+'" data-bg2="'
								+bg2
								+'" data-bg3="'
								+bg3
								+'"]';

						for (var i = 0; i < children.length; i++) {
							code += WPTB_Stringifier(children[i]);
						}

					code +='[/table]';
					break;
		case 'tbody': 
					for (var i = 0; i < children.length; i++) {
							code += WPTB_Stringifier(children[i]);
						}
						break;
		case 'tr': 
					code += '[tr]';

						for (var i = 0; i < children.length; i++) {
							code += WPTB_Stringifier(children[i]);
						}
						
					code +='[/tr]';
						break;
		case 'td': 
					code += '[td]';

						for (var i = 0; i < children.length; i++) {
							code += WPTB_Stringifier(children[i]);
						}
						
					code +='[/td]';
						break;
		case 'div': 
					if(node.classList.contains('wptb-ph-element')){
						console.log('We reached div code!');
						
			        var infArr = node.className.match(/wptb-element-(.+)-(\d+)/i),
			        	optionsClass, trueNode,
			        	nodeContent;
			        	if(infArr == undefined){
			        		return;
			        	} 
						switch(infArr[1]){
							case 'list': 
										code += '[list type=""';
										trueNode = node.getElementsByTagName('ul')[0];
										if(!trueNode){
											return ''; //We ignore the node in case of error
										}
										code +=']';
										listitems = trueNode.getElementsByTagName('article');
										for (var i = 0; i < listitems.length; i++) {
											code+='[item]';
											code += listitems[i]
													.getElementsByClassName('wptb-list-item-content')[0]
													.innerHTML;
											code+='[/item]';
										}
										code += '[/list]';
										break;
							case 'image': 
										trueNode = node.getElementsByTagName('img')[0];
										if(!trueNode){
											return ''; //We ignore the node in case of error
										}
										code += '[img src="'+
										trueNode.src+' width="'+
										trueNode.width+' height="'+
										trueNode.height+' alternative="'+
										+'"]';
										break;
							case 'text': 
										code += '[text]';
										trueNode = node.getElementsByClassName('editable')[0];
										if(!trueNode){
											return ''; //We ignore the node in case of error
										}
										code+= trueNode.innerHTML;
										code += '[/text]';
										break;
							case 'button': 
										trueNode = node.getElementsByClassName('editable')[0];
										if(!trueNode){
											return ''; //We ignore the node in case of error
										}
										code += '[button]';
										code += trueNode.innerHTML;
										code += '[/button]';
										break;
						}
					}
					else{ 
						return '';
					}
					break;
		default: 
				code+= '';
				break;
	}

	if(node.nextSibling != undefined){
		WPTB_Stringifier(node.nextSibling);
	}

	return code;
};