import {compileMain, terminal, getSelectedMove} from "/ConnectFourChallenge/src/codeeditor/compiler.js";

export var BOARD = [
	["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
	["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
	["--", "--", "--", "--", "--", "--", "--", "--"],
	["--", "--", "--", "--", "--", "--", "--", "--"],
	["--", "--", "--", "--", "--", "--", "--", "--"],
	["--", "--", "--", "--", "--", "--", "--", "--"],
	["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
	["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"]
];
export var getBoard = () => { return BOARD };

export var MOVE_LOG = [];
var castlingRightsLog = [];

var castlingRights = [[true, true], [true, true]];
var whiteKingSquare = [7, 4];
var blackKingSquare = [0, 4];

export var currentPlayer = 0;
export var winner = null;

var squareSelected = [null, null, null];


export var onClick = (row, col) => {
	
	
	if (squareSelected[0] == null) {

		let square = document.getElementById(row.toString() + col.toString());
		squareSelected = [row, col, square.style.backgroundColor];
		square.style.backgroundColor = "#fff985";
		
	} else {
		
		let square = document.getElementById(squareSelected[0].toString() + squareSelected[1].toString());
		let move = new Move(BOARD, squareSelected.slice(0, 2), [row, col]);
		
		square.style.backgroundColor = squareSelected[2];
		
		let moves = getAllValidMoves();
		
		if (containsMove(move, moves)) {
			
			makeMove(move, square);
			squareSelected = [null, null, null];
			
			try{
			
				compileMain();
				let userAIMove = getSelectedMove();

				if (userAIMove != null && window.gameStarted) {

					move = new Move(BOARD, userAIMove.startSquare, userAIMove.endSquare);
					square = document.getElementById(userAIMove.startSquare[0].toString() + userAIMove.startSquare[1].toString());

					moves = getAllValidMoves();

					if (containsMove(move, moves)) {
						makeMove(move, square);	
					} else {
						terminal.raise("INVALID MOVE");
					}

					userAIMove = null;

				} else {
					if (window.gameStarted) terminal.warn("NO MOVE PLAYED BY COMPUTER");
					window.gameStarted = false;
				}
				
			}
			
			catch (err) {
				terminal.raise(err);
			}

		} else {
			squareSelected = [null, null, null];
		}
		
	}
}

export function makeMove(move, square) {
	
	let sRow = move.startSquare[0];
	let sCol = move.startSquare[1];
	let eRow = move.endSquare[0];
	let eCol = move.endSquare[1];
	
	move.board[eRow][eCol] = move.board[sRow][sCol];
	move.board[sRow][sCol] = "--";

	if (move.type == "king-castle") {

		move.board[eRow][5] = move.board[eRow][7];
		move.board[eRow][7] = "--";
		
		if (square != undefined) {
			document.getElementById(eRow + "5").innerHTML = document.getElementById(eRow + "7").innerHTML;
			document.getElementById(eRow + "7").innerHTML = "";
		}

	} else if (move.type == "queen-castle") {

		move.board[eRow][3] = move.board[eRow][0];
		move.board[eRow][0] = "--";
		
		if (square != undefined) {
			document.getElementById(eRow + "3").innerHTML = document.getElementById(eRow + "0").innerHTML;
			document.getElementById(eRow + "0").innerHTML = "";
		}

	} else if (move.type == "promotion") { 
	
		
	
	}
	
	if (square != undefined) {
		square.innerHTML = SymMap.get(move.board[sRow][sCol]);
		document.getElementById(eRow.toString() + eCol.toString()).innerHTML = SymMap.get(move.board[eRow][eCol]);
	}
	
	updateCastlingRights(move);

	MOVE_LOG.push(move);
	castlingRightsLog.push([...castlingRights]);
	
	if (checkEndGame()) {
			
	}	
	
	switchCurrentPlayer();
	
}

function updateCastlingRights(move) {
	
	if (move.team == "w") {
		
		if (move.piece == "K") {
			
			whiteKingSquare = [...move.endSquare];
			castlingRights[0] = [false, false];
			
		} else if (move.piece == "R") {
			
			if (move.startSquare[1] == 7) castlingRights[0][0] = false;
			else if (move.startSquare[1] == 0) castlingRights[0][1] = false;
			
		}
	} 
	
	else if (move.team == "b" && (move.piece == "K" || move.piece == "R")) {
		
		if (move.piece == "K") {
			
			blackKingSquare = [...move.endSquare];
			castlingRights[1] = [false, false];
			
		} else if (move.piece == "R") {
			
			if (move.startSquare[1] == 7) castlingRights[1][0] = false;
			else if (move.startSquare[1] == 0) castlingRights[1][1] = false;
			
		}
	}
	
}

export function undoMove(sim) {
	
	if (MOVE_LOG.length != 0) {
		
		let move = MOVE_LOG.pop();
		castlingRights = [...castlingRightsLog.pop()];

		move.board[move.endSquare[0]][move.endSquare[1]] = move.teamCaptured + move.pieceCaptured;
		move.board[move.startSquare[0]][move.startSquare[1]] = move.team + move.piece;

		if (move.team + move.piece == "wK") whiteKingSquare = [...move.startSquare];
		else if (move.team + move.piece == "bK") blackKingSquare = [...move.startSquare];

		if (move.type == "king-castle") {

			move.board[move.startSquare[0]][7] = move.board[move.startSquare[0]][5];
			move.board[move.startSquare[0]][5] = "--";

			if (!sim) {
				document.getElementById(move.startSquare[0] + "7").innerHTML = document.getElementById(move.startSquare[0] + "5").innerHTML;
				document.getElementById(move.startSquare[0] + "5").innerHTML = "";
			}

		} else if (move.type == "queen-castle") {

			move.board[move.startSquare[0]][0] = move.board[move.startSquare[0]][3];
			move.board[move.startSquare[0]][3] = "--";

			if (!sim) {
				document.getElementById(move.startSquare[0] + "0").innerHTML = document.getElementById(move.startSquare[0] + "3").innerHTML;
				document.getElementById(move.startSquare[0] + "3").innerHTML = "";
			}
		}

		if (!sim) {
			document.getElementById(move.startSquare[0].toString() + move.startSquare[1].toString()).innerHTML = SymMap.get(at(move.board, move.startSquare));
			document.getElementById(move.endSquare[0].toString() + move.endSquare[1].toString()).innerHTML = SymMap.get(at(move.board, move.endSquare));
		}

		switchCurrentPlayer();

	}
}

export function restartGame() {
	for (let i = MOVE_LOG.length; i > -1; i --) {
		undoMove();
	}
}

function at(array, pos) {
	return array[pos[0]][pos[1]];
}

function containsMove(move, array) {
	
	for (let e in array) {
		if ((array[e].startSquare.join('') == move.startSquare.join('')) && (array[e].endSquare.join('') == move.endSquare.join(''))) {
			return true;
		}
	}
	
	return false;
	
}

function getBlindValidMoves(board) {
	
	let moves = [];
	
	for (let row in board) {
		for (let col in board) {
			
			let _move = new Move(board, [parseInt(row), parseInt(col)]);
			let _moves = _move.blindValids();
			
			for (let i in _moves) {
				moves.push(new Move(board, [parseInt(row), parseInt(col)], _moves[i]));
			}		
		}
	}
	
	return moves;
	
}

function squareControlled(pos) {
	
	let r, c;
	[r, c] = pos;
	
	switchCurrentPlayer();
	let moves = getBlindValidMoves(BOARD);
	
	for (let i in moves) {
		let move = moves[i];
		
		if (move.endSquare[0] == r && move.endSquare[1] == c) {
			switchCurrentPlayer();
			return true;
		}
	}
	
	switchCurrentPlayer();
	return false;
	
}

function inCheck() {
	
	if (currentPlayer == 0) {
		return squareControlled(whiteKingSquare);
	} else {
		return squareControlled(blackKingSquare);
	}
	
}

function checkEndGame() {
	
}

function getAllValidMoves() {
	
	let moves = getBlindValidMoves(BOARD);
	let tempCastleRights = [...castlingRights];
	
	let validMoves = [];
	
	for (let i in moves) {
		let move = moves[i];
		
		makeMove(move);
		switchCurrentPlayer();
		
		if (inCheck() == false) {
			validMoves.push(move);
		}
		
		switchCurrentPlayer();
		undoMove(true);
		
	}
	
	castlingRights = [...tempCastleRights];
	return validMoves;
	
}

function switchCurrentPlayer() {
	currentPlayer ++;
	currentPlayer %= 2;
}


class Move {
	
	constructor(board, startSquare, endSquare) {
		
		this.board = board;
		
		this.startSquare = startSquare;
		this.endSquare = endSquare;
		
		this.team = at(board, this.startSquare)[0];
		this.piece = at(board, this.startSquare)[1];
		
		if (endSquare != undefined) {
	
			this.teamCaptured = at(board, this.endSquare)[0];
			this.pieceCaptured = at(board, this.endSquare)[1];
			
			if (at(this.board, endSquare)[0] != at(this.board, startSquare)[0] && at(this.board, endSquare)[0] != "-") { //A piece was captured
				this.type = 'cap';
			}

			if ((this.piece == "K") && (this.endSquare[1] - this.startSquare[1] == 2)) {  // King-Side Castle
				this.type = "king-castle";
			}
			
			if ((this.piece == "K") && (this.endSquare[1] - this.startSquare[1] == -2)) { // Queen-Side Castle
				this.type = "queen-castle";
			}

			if (false) { // Pawn Promotion
				this.type = "promotion";
			}
			
		}
		
	}
	
	getMoveNotation() {
		return 
	}
	
	inRange(square) {
		return (-1 < square[0]) && (square[0] < 8) && (-1 < square[1]) && (square[1] < 8)
	}
	
	blindValids() {
		
		if ((currentPlayer == 1 && this.team == "w") || (currentPlayer == 0 && this.team == "b")) return [];
		
		switch (this.piece) {
				
			case "p":
				return this.getPawnMoves();
				break;
				
			case "B":
				return this.getBishopMoves();
				break;
				
			case "R":
				return this.getRookMoves();
				break;
			
			case "Q":
				return this.getQueenMoves();
				break;
				
			case "N":
				return this.getKnightMoves();
				break;
				
			case "K":
				return this.getKingMoves();
				break;
				
			default:
				return [];
				break;
				
		}
		
	}
	
	getPawnMoves() {
		
		let moves = [];
		
		if (this.team == "w") {
			
			if (this.board[this.startSquare[0] - 1][this.startSquare[1]] == "--") {
				
				moves.push([this.startSquare[0] - 1, this.startSquare[1]]);
				
				if (this.board[this.startSquare[0] - 2][this.startSquare[1]] == "--" && this.startSquare[0] == 6) {
					moves.push([this.startSquare[0] - 2, this.startSquare[1]]);
				}
				
			}
			
			if (this.startSquare[1] != 0 && this.board[this.startSquare[0] - 1][this.startSquare[1] - 1][0] == "b") {
				moves.push([this.startSquare[0] - 1, this.startSquare[1] - 1]);
			}
			
			if (this.startSquare[1] != 7 && this.board[this.startSquare[0] - 1][this.startSquare[1] + 1][0] == "b") {
				moves.push([this.startSquare[0] - 1, this.startSquare[1] + 1]);
			}
			
		} else {
			
			if (this.board[this.startSquare[0] + 1][this.startSquare[1]] == "--") {
				
				moves.push([this.startSquare[0] + 1, this.startSquare[1]]);
				
				if (this.board[this.startSquare[0] + 2][this.startSquare[1]] == "--" && this.startSquare[0] == 1) {
					moves.push([this.startSquare[0] + 2, this.startSquare[1]]);
				}
				
			}
			
			if (this.startSquare[1] != 0 && this.board[this.startSquare[0] + 1][this.startSquare[1] - 1][0] == "w") {
				moves.push([this.startSquare[0] + 1, this.startSquare[1] - 1]);
			}
			
			if (this.startSquare[1] != 7 && this.board[this.startSquare[0] + 1][this.startSquare[1] + 1][0] == "w") {
				moves.push([this.startSquare[0] + 1, this.startSquare[1] + 1]);
			}
			
		}
		
		return moves;
		
	}
	
	getBishopMoves() {
		
		let directions = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
		let moves = [];
		
		let dir_c, dir_r, currentPos;
		
		for (let i = 0; i < 4; i++) {
			
			dir_r = directions[i][0];
			dir_c = directions[i][1];
			
			currentPos = [this.startSquare[0], this.startSquare[1]];
			
			while ( this.inRange(currentPos) && ( (at(this.board, currentPos) == '--') || ( currentPos.toString() == this.startSquare.toString() ) )) {
				if (currentPos.toString() != this.startSquare.toString()) moves.push([currentPos[0], currentPos[1]]);
				currentPos[0] += dir_r;
				currentPos[1] += dir_c;
			}
			
			if (this.inRange(currentPos) && at(this.board, currentPos)[0] != this.team) {
				moves.push([currentPos[0], currentPos[1]]);
			}
			
		}
		
		return moves;
		
	}
	
	getKnightMoves() {
		
		let directions = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [-1, 2], [1, -2], [-1, -2]];
		let moves = []
		
		for (let i in directions) {
			let position = [this.startSquare[0] + directions[i][0], this.startSquare[1] + directions[i][1]];
			
			if (this.inRange(position) && (at(this.board, position)[0] != this.team)) {
				moves.push(position);
			}
			
		}
		
		return moves
		
	}
	
	getRookMoves() {
		
		let directions = [[0, 1], [-1, 0], [0, -1], [1, 0]];
		let moves = [];
		
		let dir_c, dir_r, currentPos;
		
		for (let i = 0; i < 4; i++) {
			
			dir_r = directions[i][0];
			dir_c = directions[i][1];
			
			currentPos = [this.startSquare[0], this.startSquare[1]];
			
			while ( this.inRange(currentPos) && ( (at(this.board, currentPos) == '--') || ( currentPos.toString() == this.startSquare.toString() ) )) {
				if (currentPos.toString() != this.startSquare.toString()) moves.push([currentPos[0], currentPos[1]]);
				currentPos[0] += dir_r;
				currentPos[1] += dir_c;
			}
			
			if (this.inRange(currentPos) && at(this.board, currentPos)[0] != this.team) {
				moves.push([currentPos[0], currentPos[1]]);
			}
			
		}
		
		return moves;
		
	}
	
	getQueenMoves() {
		
		let directions = [[0, 1], [-1, 0], [0, -1], [1, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]];
		let moves = [];
		
		let dir_c, dir_r, currentPos;
		
		for (let i = 0; i < 8; i++) {
			
			dir_r = directions[i][0];
			dir_c = directions[i][1];
			
			currentPos = [this.startSquare[0], this.startSquare[1]];
			
			while ( this.inRange(currentPos) && ( (at(this.board, currentPos) == '--') || ( currentPos.toString() == this.startSquare.toString() ) )) {
				if (currentPos.toString() != this.startSquare.toString()) moves.push([currentPos[0], currentPos[1]]);
				currentPos[0] += dir_r;
				currentPos[1] += dir_c;
			}
			
			if (this.inRange(currentPos) && at(this.board, currentPos)[0] != this.team) {
				moves.push([currentPos[0], currentPos[1]]);
			}
			
		}
		
		return moves;
		
	}
	
	getKingMoves() {
		
		let directions = [[0, 1], [-1, 0], [0, -1], [1, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]];
		let moves = []
		
		for (let i in directions) {
			let position = [this.startSquare[0] + directions[i][0], this.startSquare[1] + directions[i][1]];
			
			if (this.inRange(position) && (at(this.board, position)[0] != this.team)) {
				moves.push(position);
			}
			
		}
		
		if (this.team == "w") {
			
			if ((this.board[7][1] == this.board[7][2]) && (this.board[7][2] == this.board[7][3]) && (this.board[7][3] == "--") && castlingRights[0][1]) {
				moves.push([7, 2]);
			}
			
			if ((this.board[7][5] == this.board[7][6]) && (this.board[7][6] == "--") && castlingRights[0][0]) {
				moves.push([7, 6]);
			}
			
		} else if (this.team == "b") {
			
			if ((this.board[0][1] == this.board[0][2]) && (this.board[0][2] == this.board[0][3]) && (this.board[0][3] == "--") && castlingRights[1][1]) {
				moves.push([0, 2]);
			}
			
			if ((this.board[0][5] == this.board[0][6]) && (this.board[0][6] == "--") && castlingRights[1][0]) {
				moves.push([0, 6]);
			}
			
		}
		
		return moves
		
	}
	
}
