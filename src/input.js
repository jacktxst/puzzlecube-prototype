import Player from './player.js'
import Editor from './editor.js'
import Game from './game.js'
import * as THREE from 'three';
import World from './world.js'
import BlockTypes from './blocktypes.js'
import Levels from './levels.js'


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

	handleKeyEventEditor(event) {

		if (Number(event.key)) {
			Editor.selectedBlockTypeId = Number(event.key)
			Editor.hologram.material.color = BlockTypes[Object.keys(BlockTypes)[Editor.selectedBlockTypeId]].material.color
		}

		switch (event.key) {

			case "e":
				Editor.deleteMode = !Editor.deleteMode
				Editor.hologram.visible = Editor.isVisible && !Editor.deleteMode
				break;

			case "v":
				Editor.toggleVisibility()
				break;

			case "q":
				Levels[Game.currentLevel].spawnpoint = {x: Player.position.x, y: Player.position.y, z: Player.position.z }
				Levels[Game.currentLevel].data = World.data.toHex()
				//cleaned = str.replace(/0+$/, '');
				break;

			case "c":
				/* first: cutoff trailing 0s from the string */

				let str_i=0;
				let last_nonzero = 0;
				while(str_i<Levels[Game.currentLevel].data.length){
					if( Levels[Game.currentLevel].data[str_i] != '0' || Levels[Game.currentLevel].data[str_i+1] != '0'){
						last_nonzero = str_i;
					}
					str_i += 2;
				}

				Levels[Game.currentLevel].data = Levels[Game.currentLevel].data.slice(0,last_nonzero+2);

				let string = JSON.stringify(Levels[Game.currentLevel])
				navigator.clipboard.writeText(string)
				break;

			case "-":
				Editor.selectedBlockTypeId--
				if (Editor.selectedBlockTypeId < 0 ) Editor.selectedBlockTypeId = Object.keys(BlockTypes).length - 1
				Editor.hologram.material.color = BlockTypes[Object.keys(BlockTypes)[Editor.selectedBlockTypeId]].material.color
				break;

			case "+":
				Editor.selectedBlockTypeId++
				if (Editor.selectedBlockTypeId >= Object.keys(BlockTypes).length ) Editor.selectedBlockTypeId = 0
				Editor.hologram.material.color = BlockTypes[Object.keys(BlockTypes)[Editor.selectedBlockTypeId]].material.color
				break;

		}


	},

	handleMouseMoveEditor(event) {
		if (!Editor.isVisible) return
		let mouse = new THREE.Vector2(2 * event.clientX/window.innerWidth - 1, 2 - (2 * event.clientY/window.innerHeight) - 1)

		Game.raycaster.setFromCamera(mouse, Game.camera)

		let hits = Game.raycaster.intersectObjects([Editor.groundPlane, ...World.meshGroup.children])
		if (hits.length > 0) {
			
			hits[0].point.x = Math.round(hits[0].point.x)
			hits[0].point.y = Math.round(hits[0].point.y)
			hits[0].point.z = Math.round(hits[0].point.z)

			Editor.hologram.position.copy(hits[0].point) 

		}

	},

	handleMouseDownEditor(event) {
		if (!Editor.isVisible) return
		if (Editor.deleteMode) {
			// no need to call raycaster.setFromCamera 
			let hits = Game.raycaster.intersectObjects(World.meshGroup.children)
			if (hits.length > 0) {
				World.setBlockAt(hits[0].object.position, BlockTypes.EMPTY.numericId )
			}
		}
		else {
			World.setBlockAt(Editor.hologram.position, Editor.selectedBlockTypeId )
		}
	},

	enablePlayerMovement( ) {

		window.addEventListener   ("keydown", this.handleKeyEventInGame)

	},

	disablePlayerMovement( ) {

		window.removeEventListener("keydown", this.handleKeyEventInGame)

	},

	enableEditorControls() {

		window.addEventListener   ("mousemove", this.handleMouseMoveEditor)
		Game.renderer.domElement.addEventListener   ("mousedown", this.handleMouseDownEditor)
		window.addEventListener   ("keydown"  , this.handleKeyEventEditor)

	},

	disableEditorControls() {

		window.removeEventListener("mousemove", this.handleMouseMoveEditor)
		Game.renderer.domElement.removeEventListener("mousedown", this.handleMouseDownEditor)
		window.removeEventListener("keydown"  , this.handleKeyEventEditor)

	}

}




