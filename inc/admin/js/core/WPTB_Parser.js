var WPTB_Parser = function(code){
	var node, pos=0;

	function getChar(){
		if(pos>=code.length){
			return -1;
		}
		return code[pos++];
	}

	function getToken(){
		var char = getChar(),
			token=char;

		if(char !== '['){
			return;
		}

		do{
			char = getChar();
			if(char === -1){
				return -1;
			}
			token+=char;
		}while(char != ']');
		
		return true;
	}

	function getCurrentToken(){
		return ctoken;
	}

	function checkAndPass(expected){
		if(ctoken !== expected){
			console.error('There was an error with the file and therefore the table could not be rendere');
			exit();
		}
		
		ctoken = getToken();
	}

	function getWordFromToken(token){
		var pos = token.indexOf(' '),
		word = token.substring(1,pos);
		return '['+word+']';
	}

	function analizeHeader(){
		getExpectedToken('[tr]');
		analizeTds();
		getExpectedToken('[/tr]');
	}

	function analizeRows(){
		getExpectedToken('[tr]');
		analizeTds();
		getExpectedToken('[/tr]');
	}

	function analizeRoot(){
		var n = document.createElement('table');
		getExpectedToken('[table]');
		analizeHeader();
		analizeRows();
		getExpectedToken('[/table]');
		return n;
	}

	node = analizeRoot();

	return node;
};