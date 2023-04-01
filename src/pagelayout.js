import { switchEditingCode, updateScripts, getUserScripts } from "./codeeditor/editor.js";
import { drawBoard } from "./gamescripts/gameinit.js";
import { BOARD } from "./gamescripts/gamemain.js";
import { onClick } from "./gamescripts/gamemain.js";

// Create variables to store the main HTML Elements from the UI
const files = document.getElementById("files-container");
const minNavBar = document.getElementById("min-navbar")
const codeEditor = document.getElementById("editor-container");
const console = document.getElementById("console-container");
const controls = document.getElementById("cp-container");
const display = document.getElementById("display-container");
const minGrid = document.getElementById("minimized-code");
const maxDiv = document.getElementById("max");
const maxEditor = document.getElementById("max-code");
const maxNavBar = document.getElementById("max-navbar");
var rowHeights;

export default function setup() {
	/*
	* Set up the UI
	*/

	codeEditor.style.backgroundColor = '#0a0a0a';
	maxEditor.style.backgroundColor = '#0a0a0a';
	console.style.backgroundColor = '#0a0a0a';
	
	codeEditor.style.overflow = 'auto';
	maxEditor.style.overflow = 'auto';
	
	rowHeights = minNavBar.offsetHeight + "px " + display.offsetHeight + "px"
	minGrid.style.gridTemplateRows = rowHeights;
	
}

export function codeFullscreen() {
	/*
	* Hide the minimized code editor, console, gamedisplay, and controls, and show the expanded 
	* code editor and expanded navBar
	*/
	
	if (maxEditor.hidden) {
		updateScripts(codeEditor, 0);
		maxEditor.innerHTML = getUserScripts(1);
		minGrid.style.gridTemplateRows = "0px 0px 0px 0px";
	} else {
		updateScripts(maxEditor, 1);
		codeEditor.innerHTML = getUserScripts(0);
		minGrid.style.gridTemplateRows = rowHeights;
	}
	
	maxEditor.hidden = !maxEditor.hidden;
	maxNavBar.hidden = !maxNavBar.hidden;
	
	
	display.hidden = !display.hidden;
	controls.hidden = !controls.hidden;
	console.hidden = !console.hidden;
	codeEditor.hidden = !codeEditor.hidden;
	files.hidden = !files.hidden;
	
}

export function switchCodeFile() {
	/*
	* Switch between the init and main files
	*/
	
	if (maxEditor.hidden) {
		updateScripts(codeEditor, 0); 
		switchEditingCode(0);
	} else {
		updateScripts(maxEditor, 1); 
		switchEditingCode(1);
	}
	
	if (maxEditor.hidden) codeEditor.innerHTML = getUserScripts(0);
	else maxEditor.innerHTML = getUserScripts(1);
	
}

export function gameFullscreen(mode) {
	
}

// Draw the board
drawBoard(8, 8, (row, col) => {onClick(row, col)}, ['#ffffff', '#dddddd'], BOARD, 
		  new Map([['wp', '<img src="./src/gamescripts/media/wp.png"></img>'], 
				   ['wN', '<img src="./src/gamescripts/media/wN.png"></img>'], 
				   ['wB', '<img src="./src/gamescripts/media/wB.png"></img>'], 
				   ['wQ', '<img src="./src/gamescripts/media/wQ.png"></img>'], 
				   ['wR', '<img src="./src/gamescripts/media/wR.png"></img>'], 
				   ['wK', '<img src="./src/gamescripts/media/wK.png"></img>'], 
				   ['bp', '<img src="./src/gamescripts/media/bp.png"></img>'], 
				   ['bN', '<img src="./src/gamescripts/media/bN.png"></img>'], 
				   ['bB', '<img src="./src/gamescripts/media/bB.png"></img>'], 
				   ['bQ', '<img src="./src/gamescripts/media/bQ.png"></img>'], 
				   ['bR', '<img src="./src/gamescripts/media/bR.png"></img>'], 
				   ['bK', '<img src="./src/gamescripts/media/bK.png"></img>'],
				   ["--", '']
	]));

// Setup the settings modal
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
 
btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
