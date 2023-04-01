import {download, upload} from "./codeeditor/editor.js"
import setup, { codeFullscreen, gameFullscreen, switchCodeFile } from "./pagelayout.js";
import {undoMove, restartGame, currentPlayer} from "./gamescripts/gamemain.js";
import {resetGame} from "./gamescripts/gameinit.js";


window.resize = setup;
window.codeFullscreen = codeFullscreen;
window.switchCodeFile = switchCodeFile;
window.download = download;
window.upload = upload;

window.gameStarted = false;

window.undo = () => {
	if (currentPlayer == 0) undoMove(false);
	undoMove(false);
};

window.restartGame = (text) => {
	if (text == "Start Game") {
		document.getElementById("restart-button").innerHTML = "Restart";
		window.gameStarted = true;
	} else {
		document.getElementById("restart-button").innerHTML = "Start Game";
		window.gameStarted = false;
	}
	restartGame();
	resetGame();
};
