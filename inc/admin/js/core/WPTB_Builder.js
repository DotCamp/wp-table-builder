(function(){  
	
	var WPTB_Builder = function(){ 
		document.counter = new ElementCounters();

		var initializer = WPTB_Initializer();
			settings = WPTB_Settings();
	};

	document.addEventListener('DOMContentLoaded', WPTB_Builder); 
})();