var WPTB_Settings = function(){
	
	var elems = document.getElementsByClassName('wptb-element');

	for (var i = 0; i < elems.length; i++) {
		elems[i].ondragstart = function(event){
		event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData("text/plain", event.target.getAttribute('id'));
	}
	};
};
