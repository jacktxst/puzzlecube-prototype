import * as THREE from 'three';
import BlockTypes from './blocktypes.js'
import Game from './game.js'
import Input from './input.js'
import World from "./world.js";
import Levels from "./levels.js";
import Player from "./player.js";

export default {

	/* cuboid selection */
	selection : {
		corners : [
			new THREE.Vector3(),
			new THREE.Vector3()
		],
		valid : false,
		getSize() {
			return this.getMost().sub(this.getLeast()).add(new THREE.Vector3(1,1,1))
		},
		getLeast() {
			return new THREE.Vector3(
				Math.min(this.corners[0].x,this.corners[1].x),
				Math.min(this.corners[0].y,this.corners[1].y),
				Math.min(this.corners[0].z,this.corners[1].z)
			);
		},
		getMost() {
			return new THREE.Vector3(
				Math.max(this.corners[0].x,this.corners[1].x),
				Math.max(this.corners[0].y,this.corners[1].y),
				Math.max(this.corners[0].z,this.corners[1].z)
			);
		},
		getCenter() {
			return new THREE.Vector3(
				(this.corners[0].x + this.corners[1].x) / 2,
				(this.corners[0].y + this.corners[1].y) / 2,
				(this.corners[0].z + this.corners[1].z) / 2
			);
		}
	},

	hologram: 
		new THREE.Mesh( 
			new THREE.BoxGeometry( 1, 1, 1 ), 
			new THREE.MeshLambertMaterial({ 
				color: 0xffffff,
				transparent: true,
    			opacity: 0.5,       
    			depthWrite: false
			})
		),

	resizeHologram(){
		this.hologram.scale.copy(this.selection.getSize());
		this.hologram.position.copy(this.selection.getCenter());
	},

	deleteMode: false,
	isVisible: true,
	selectedBlockTypeId: BlockTypes.SOLID.numericId,

	init() {

		/* setup 3D helper objects */

		this.grid = new THREE.GridHelper()
		this.grid.position.set(-0.5,-0.5,-0.5)
		Game.gameScene.add(this.grid)

		this.groundPlane = new THREE.Mesh(  
			new THREE.PlaneGeometry(10,10),
			new THREE.MeshBasicMaterial( { color: 0x0000ff, transparent: true, opacity: 0.2 } )
		)
		this.groundPlane.rotation.set(-Math.PI/2,0,0)
		this.groundPlane.position.set(-0.5,-0.51,-0.5)
		Game.gameScene.add(this.groundPlane)
		Game.gameScene.add( this.hologram )

		/* set up editor DOM content */

		this.editorMenuDiv = document.createElement("div");
		this.editorMenuDiv.style.position = "absolute";
		this.editorMenuDiv.style.bottom = "0"
		for (let blockType of Object.keys(BlockTypes)){
			let blockTypeDiv = document.createElement("button")
			blockTypeDiv.innerHTML = blockType;
			blockTypeDiv.addEventListener("click",(e)=>{
				this.selectedBlockTypeId = BlockTypes[blockType].numericId
				this.hologram.material.color = BlockTypes[Object.keys(BlockTypes)[this.selectedBlockTypeId]].material.color
			})
			this.editorMenuDiv.appendChild(blockTypeDiv)
		}
		document.body.appendChild(this.editorMenuDiv);

		this.enableControls()

		this.toggleVisibility()
	},

	toggleVisibility() {

		this.isVisible = !this.isVisible

		this.hologram.visible = this.isVisible ? this.hologram.valid : false
		this.grid.visible = this.isVisible
		this.groundPlane.visible = this.isVisible 
		this.editorMenuDiv.style.display = this.isVisible ? 'block' : 'none'

	},

	/*
		EDITOR INPUT HANDLERS
	*/

	enableControls() {

		Game.renderer.domElement.addEventListener   ("mousemove", this.onMouseMove.bind(this))
		Game.renderer.domElement.addEventListener   ("mousedown", this.onMouseDown.bind(this))
		Game.renderer.domElement.addEventListener   ("mouseup", this.onMouseUp.bind(this))
		window.addEventListener   ("keydown"  , this.onKeyEvent.bind(this))

	},

	disableControls() {

		Game.renderer.domElement.removeEventListener("mousemove", this.onMouseMove.bind(this))
		Game.renderer.domElement.removeEventListener("mousedown", this.onMouseDown.bind(this))
		Game.renderer.domElement.removeEventListener("mouseup ", this.onMouseUp.bind(this))
		window.removeEventListener("keydown"  , this.onKeyEvent.bind(this))

	},

	onMouseDown(event) {

		this.dragging = true

	},

	onMouseMove(event) {

		let mouse = new THREE.Vector2(2 * event.clientX/window.innerWidth - 1, 2 - (2 * event.clientY/window.innerHeight) - 1)
		Game.raycaster.setFromCamera(mouse, Game.camera)
		let hits = Game.raycaster.intersectObjects([this.groundPlane, ...World.meshGroup.children])

		let point = new THREE.Vector3()

		if (hits.length > 0) {

			this.hologram.visible = this.isVisible
			this.selection.valid = true

			if (this.deleteMode) {
				point.set(
					hits[0].object.position.x,
					hits[0].object.position.y,
					hits[0].object.position.z
				)
			} else {
				point.set(
					Math.round(hits[0].point.x),
					Math.round(hits[0].point.y),
					Math.round(hits[0].point.z),
				)
			}

		} else {
			this.hologram.visible = false
			this.selection.valid = false
		}

		if (this.dragging) {

			this.selection.corners[1].copy(point)

		} else {

			this.selection.corners[0].copy(point)
			this.selection.corners[1].copy(point)

		}

		this.resizeHologram()

	},

	onMouseUp(){

		if (!this.dragging) return;
		this.dragging = false;

		const corners = this.selection.corners

		const x1 = Math.min(corners[0].x, corners[1].x)
		const x2 = Math.max(corners[0].x, corners[1].x)
		const y2 = Math.max(corners[0].y, corners[1].y)
		const y1 = Math.min(corners[0].y, corners[1].y)
		const z1 = Math.min(corners[0].z, corners[1].z)
		const z2 = Math.max(corners[0].z, corners[1].z)

		for (let x = x1; x <= x2; x++) {
			for (let y = y1; y <= y2; y++) {
				for (let z = z1; z <= z2; z++) {
					if (this.deleteMode) {
						World.setBlockAt(new THREE.Vector3(x,y,z), BlockTypes.EMPTY.numericId )
					} else {
						World.setBlockAt(new THREE.Vector3(x,y,z), this.selectedBlockTypeId )
					}
				}
			}
		}

	},

	onKeyEvent(event) {

		if (Number(event.key)) {
			this.selectedBlockTypeId = Number(event.key)
		}

		switch (event.key) {

			case "v":
				this.toggleVisibility()
				break;

			case "e":
				this.deleteMode = !this.deleteMode
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
				this.selectedBlockTypeId--;
				if (this.selectedBlockTypeId < 0 ) this.selectedBlockTypeId = Object.keys(BlockTypes).length - 1;
				break;

			case "+":
				this.selectedBlockTypeId++;
				if (this.selectedBlockTypeId >= Object.keys(BlockTypes).length ) this.selectedBlockTypeId = 0;
				break;

		}

	}

}