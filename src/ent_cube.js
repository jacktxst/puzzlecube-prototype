import World from './world.js'
import BlockTypes from './blocktypes.js'
import * as THREE from 'three';
import Game from './game.js'

const _cubeGeometry = new THREE.BoxGeometry(1, 1, 1)

export default class MovingCube {

	constructor(position, direction) {

		
		this.ANIM_LENGTH = 0.125
		this.animationProgress = 0
		this.origin = position;
		this.direction = direction;
		this.target = new THREE.Vector3()
		this.target.addVectors(this.origin,this.direction);

		this.mesh = new THREE.Mesh(
			_cubeGeometry,
			BlockTypes.PUSH.material
		)
		this.mesh.position.copy(position)
		Game.scene.add(this.mesh)

	}

	process(deltaTime) {

		if (this.needToFree) return

		this.animationProgress += deltaTime

		let anim_pos = new THREE.Vector3()
		anim_pos.copy(this.direction)
		anim_pos.multiplyScalar( this.animationProgress/this.ANIM_LENGTH );

		this.mesh.position.addVectors(this.origin, anim_pos)

		if (this.animationProgress > this.ANIM_LENGTH) {
			World.setBlockAt(this.target, BlockTypes.PUSH.numericId)
			Game.scene.remove(this.mesh)
			this.needToFree = true
		}

	}

	cleanup() {
		Game.scene.remove(this.mesh)
	}

}