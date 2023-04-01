import {compileInit} from "/ConnectFourChallenge/src/codeeditor/compiler.js";

export function drawBoard(rows, cols, onCellClick, colors, initValue, symMap, rowHeight) {
	/*
	* Draw the game board as a table
	*/
	
	const colWidth = (document.getElementById("display-container").offsetWidth - 30) / cols + "px";
	const table = document.getElementById("gametable");
	if (rowHeight == undefined) rowHeight = colWidth;
	
	for (let r = 0; r < rows; r++) {
		let row = table.insertRow(-1);
		
		for (let c = 0; c < cols; c++) {
			let cell = row.insertCell(-1);
			
			cell.id = r.toString() + c.toString();
			cell.onclick = () => {onCellClick(r, c)};
			
			cell.style.width = colWidth;
			cell.style.height = rowHeight;
			cell.style.textAlign = "center";
			cell.style.backgroundColor = colors[(r + c) % 2];
			
			if (symMap != undefined) cell.innerHTML = symMap.get(initValue[r][c]);
			else cell.innerHTML = initValue[r][c];
			
			window.SymMap = symMap;
			
		}	
	}
}

export function resetGame() {
	compileInit();
}
