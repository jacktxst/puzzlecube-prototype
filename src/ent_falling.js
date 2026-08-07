import World from './world.js'
import BlockTypes from './blocktypes.js'
import * as THREE from 'three';
import Game from './game.js'

const _cubeGeometry = new THREE.BoxGeometry(1, 1, 1)

export default class FallingTileEntity {

	constructor(position) {

		this.animationProgress = 0
		this.origin = position;

		this.mesh = new THREE.Mesh(
			_cubeGeometry,
			BlockTypes.FALLING.material
		)
		this.mesh.position.copy(position)
		Game.scene.add(this.mesh)

	}

	process(deltaTime) {

		if (this.needToFree) return

		this.animationProgress += deltaTime

		let anim_pos = new THREE.Vector3(0,-1,0);

		anim_pos.multiplyScalar( this.animationProgress );

		this.mesh.position.addVectors(this.origin, anim_pos)

		if (this.mesh.position.y < -5) {
			Game.scene.remove(this.mesh)
			this.needToFree = true
		}

	}

	cleanup() {
		Game.scene.remove(this.mesh)
	}

}