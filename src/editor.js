import * as THREE from 'three';
import BlockTypes from './blocktypes.js'
import Game from './game.js'
import Input from './input.js'

export default {

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

	deleteMode: false,
	isVisible: true,
	selectedBlockTypeId: BlockTypes.SOLID.numericId,
	init() {

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

		this.toggleVisibility()
	},

	disable() {
		if (this.isVisible) {
			this.toggleVisibility()
		}
		Input.disableEditorControls()
	},

	enable() {
		Input.enableEditorControls()
	},

	toggleVisibility() {

		this.isVisible = !this.isVisible
		this.hologram.visible = this.isVisible && !this.deleteMode
		this.grid.visible = this.isVisible
		this.groundPlane.visible = this.isVisible 

	}
}