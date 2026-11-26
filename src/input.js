import Player from './player.js'
import Game from './game.js'

export default {

	handleKeyEventInGame(event) {

		switch (event.key) {

			case "w":
				Player.moveForward()
				break;
			case "a":
				Player.moveLeft()
				break;
			case "s":
				Player.moveBack()
				break;
			case "d":
				Player.moveRight()
				break;
			case "r":
				Game.loadLevel(Game.currentLevel)
				break;

		}

	},

	enablePlayerMovement( ) {

		window.addEventListener   ("keydown", this.handleKeyEventInGame)

	},

	disablePlayerMovement( ) {

		window.removeEventListener("keydown", this.handleKeyEventInGame)

	},

}




