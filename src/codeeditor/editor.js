var userScripts = ["", ""];
var currentlyEditing = [0, 0];

export function switchEditingCode(state) {
	currentlyEditing[state] ++;
	currentlyEditing[state] %= 2;
}

export function updateScripts(elem, state) {userScripts[currentlyEditing[state]] = elem.innerHTML; }

export function getUserScripts(state) { return userScripts[currentlyEditing[state]]; }

document.getElementById('editor-container').addEventListener('keydown', function(e) {
	
	if (e.keyCode === 9) {
		
        e.preventDefault(); 
        var editor = e.target;
        var doc = editor.ownerDocument.defaultView;
        var sel = doc.getSelection();
        var range = sel.getRangeAt(0);

        var tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
        range.insertNode(tabNode);

        range.setStartAfter(tabNode);
        range.setEndAfter(tabNode); 
        sel.removeAllRanges();
        sel.addRange(range);
		
    }
	
});

document.getElementById('max-code').addEventListener('keydown', function(e) {
	
	if (e.keyCode === 9) {
		
        e.preventDefault(); 
        var editor = e.target;
        var doc = editor.ownerDocument.defaultView;
        var sel = doc.getSelection();
        var range = sel.getRangeAt(0);

        var tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
        range.insertNode(tabNode);

        range.setStartAfter(tabNode);
        range.setEndAfter(tabNode); 
        sel.removeAllRanges();
        sel.addRange(range);
		
    }
	
});

export function download() {
	/*
	Download the micromouseAI and header code as a .js file
	*/
	
	let code = userScripts[0];
	let downloadLink = document.createElement('a');		  //Create the hidden downloader
	
	downloadLink.href = 'data:attachment/text,' + encodeURI(code); //Encode the text
	downloadLink.target = '_blank';
	
	downloadLink.download = 'main.js'; //Accessibility for computers which block .js file downloads
	
	try {
		downloadLink.click();
	}
	catch {
		alert('File could not be downloaded.');
	}
	
	code = userScripts[1];
	downloadLink = document.createElement('a');		  //Create the hidden downloader
	
	downloadLink.href = 'data:attachment/text,' + encodeURI(code); //Encode the text
	downloadLink.target = '_blank';
	
	downloadLink.download = 'init.js'; //Accessibility for computers which block .js file downloads
	
	try {
		downloadLink.click();
	}
	catch {
		alert('File could not be downloaded.');
	}
	
}

export function upload() {
	
}

export function getScripts() {
	updateScripts(document.getElementById("editor-container"), 0);
	updateScripts(document.getElementById("editor-container"), 1);
	return [...userScripts];
}

window.scripts = getScripts;
