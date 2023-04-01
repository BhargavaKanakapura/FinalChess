import { getScripts } from "./editor.js";
import { getBoard } from "/ConnectFourChallenge/src/gamescripts/gamemain.js";


function standardizeCode(codeAsText) {
	/*
	Remove all HTML tags and format as js code
	*/
	
	//Remove comments
	let singleLineComment = /\/\/.*?\n/g;  //RegExp for // ... \n
	let multiLineComment = /\/\*.*?\*\//g; //RegExp for /* ... */
	
	//Remove HTML tags
	let htmlTag = /(<([^>]+)>)/ig;
	
	//Replace HTML entities
	let gt = '&gt;';
	let lt = '&lt;';
	let and = '&amp;';
	
	//Replace new lines
	let newLine = '&nbsp;'
	
	codeAsText = codeAsText
		.replaceAll(singleLineComment, ' ') //Replace single line comments sourrounded by // and \n
		.replaceAll(multiLineComment, ' ')  //Replace multi line comments sourrounded by /* and */
		.replaceAll(newLine, ' ')			//Replace new lines marked by \n
		.replaceAll(lt, '<')				//Replace the < HTML entity
		.replaceAll(gt, '>')				//Replace the > HTML entity
		.replaceAll(and, '&')				//Replace the & HTML entity
		.replaceAll(htmlTag, ''); 			//Remove HTML tags
	
	return codeAsText;
	
}

export function compileInit() {
	eval(standardizeCode(getScripts()[1])); 
}

export function compileMain() {
	eval(standardizeCode(getScripts()[0])); 
}


var selectedMove = null;

class userAIMove {

	constructor(startRow, startCol, endRow, endCol) {
		this.startSquare = [startRow, startCol];
		this.endSquare = [endRow, endCol];
	}
	
}

function makeMove(startRow, startCol, endRow, endCol) {
	selectedMove = new userAIMove(startRow, startCol, endRow, endCol);
}

export function getSelectedMove() {
	return selectedMove;
}


class Console {
	
	constructor(elementID) {
		
		this.consoleElement = document.getElementById(elementID);
		this.consoleMessages = [];
		
	}
	
	print(message) {
		
		this.consoleElement.innerHTML += "<div class='msg'>" + message + "</div>";
		this.consoleMessages.push(message);
		
	}
	
	raise(message) {
		
		this.consoleElement.innerHTML += "<div class='err'>" + message + "</div>";
		this.consoleMessages.push(message);
		
	}
	
	warn(message) {
		
		this.consoleElement.innerHTML += "<div class='warning'>" + message + "</div>";
		this.consoleMessages.push(message);
		
	}
	
	clear() {
		
		this.consoleMessages = [];
		this.consoleElement.innerHTML = "";
		
	}
	
}

export var terminal = new Console('console-container');


function defineGlobal(name, value) {
	window["j8&*(ufh97*(yf67d87fy7^))" + name + "kldfkjj(*jf78(*&rn87cy*&^9f987))"] = value
}

function getGlobal(name) {
	let val = window["j8&*(ufh97*(yf67d87fy7^))" + name + "kldfkjj(*jf78(*&rn87cy*&^9f987))"];
	if (val != undefined) return val;
	else return new Error("Global variable " + name + " has not been defined");
}
